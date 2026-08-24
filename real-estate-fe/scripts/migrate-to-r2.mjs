import fsSync from 'fs';
import fs from 'fs/promises';
import path from 'path';

import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { MongoClient } from 'mongodb';

// Load env directly since we are a standalone script
const envStr = fsSync.readFileSync('.env', 'utf-8');
function getEnv(key) {
  const match = envStr.match(new RegExp(`^${key}=["']?([^"'\n]+)`, 'm'));
  return match ? match[1].trim() : null;
}

const MONGODB_URI = getEnv('MONGODB_URI');
const MONGODB_DB = getEnv('MONGODB_DB');
const R2_ENDPOINT = getEnv('R2_ENDPOINT');
const R2_ACCESS_KEY_ID = getEnv('R2_ACCESS_KEY_ID');
const R2_SECRET_ACCESS_KEY = getEnv('R2_SECRET_ACCESS_KEY');
const R2_BUCKET = getEnv('R2_BUCKET');
const NEXT_PUBLIC_R2_PUBLIC_URL = getEnv('NEXT_PUBLIC_R2_PUBLIC_URL');

if (!MONGODB_URI || !R2_ENDPOINT || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY) {
  console.error("Missing required env vars");
  process.exit(1);
}

const s3Client = new S3Client({
  region: 'auto',
  endpoint: R2_ENDPOINT,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
});

async function run() {
  console.log('Connecting to MongoDB...');
  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  const db = client.db(MONGODB_DB);
  const mediaCol = db.collection('media');

  const docs = await mediaCol.find({ url: { $regex: '^/uploads' } }).toArray();
  console.log(`Found ${docs.length} local media files to migrate.`);

  let successCount = 0;
  let failCount = 0;

  for (let i = 0; i < docs.length; i++) {
    const doc = docs[i];
    const localPath = path.join(process.cwd(), 'public', doc.url);
    
    try {
      const fileBuffer = await fs.readFile(localPath);
      
      // Upload to R2
      await s3Client.send(
        new PutObjectCommand({
          Bucket: R2_BUCKET,
          Key: doc.key,
          Body: fileBuffer,
          ContentType: doc.mimeType,
          CacheControl: 'public, max-age=31536000, immutable',
        })
      );

      const host = NEXT_PUBLIC_R2_PUBLIC_URL?.replace(/\/+$/, '');
      const isPlaceholder = !host || /pub-x{2,}|<|example\.com/i.test(host);
      const newUrl = isPlaceholder ? `/api/media/${doc.key}` : `${host}/${doc.key}`;

      await mediaCol.updateOne(
        { _id: doc._id },
        { $set: { url: newUrl } }
      );

      successCount++;
      if (successCount % 50 === 0) {
        console.log(`Uploaded ${successCount}/${docs.length}...`);
      }
    } catch (err) {
      console.error(`Failed to upload ${doc.url}: ${err.message}`);
      failCount++;
    }
  }

  console.log(`Migration complete. Success: ${successCount}, Failed: ${failCount}`);
  await client.close();
}

run().catch(console.error);
