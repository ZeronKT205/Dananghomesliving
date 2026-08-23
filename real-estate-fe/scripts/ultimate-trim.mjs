import { MongoClient } from 'mongodb';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const URI = 'mongodb+srv://duotechcompanyhr_db_user:0sZCDf4iHser5J1g@cluster1708.n0yltgw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1708';
const DB = 'dananghomesliving';

async function run() {
  const client = new MongoClient(URI);
  await client.connect();
  const db = client.db(DB);
  
  const slug = 'stunning-beachfront-luxury-apartment-lux-panoma-1-modern-elegant-design-9320';
  const prop = await db.collection('properties').findOne({ slug });
  
  if (!prop) {
    console.log('Property not found');
    return;
  }
  
  const mediaIds = [...new Set([prop.coverId, ...prop.mediaIds])];

  for (const mId of mediaIds) {
    const media = await db.collection('media').findOne({ _id: mId });
    if (!media || !media.url) continue;
    
    const filePath = path.join(process.cwd(), 'public', media.url);
    if (!fs.existsSync(filePath)) continue;
    
    const tempPath = filePath + '.tmp.jpg';
    
    try {
      const meta = await sharp(filePath).metadata();
      const crop1 = 20; // Cut off the outermost noise/shadow/black line
      
      if (meta.width <= crop1 * 2 || meta.height <= crop1 * 2) continue;
      
      const innerBuf = await sharp(filePath)
        .extract({ left: crop1, top: crop1, width: meta.width - crop1*2, height: meta.height - crop1*2 })
        .toBuffer();
        
      // Check if top-left pixel of the inner buffer is white (to confirm it's a white border)
      const { data } = await sharp(innerBuf)
        .extract({ left: 0, top: 0, width: 1, height: 1 })
        .raw()
        .toBuffer({ resolveWithObject: true });
        
      const r = data[0], g = data[1], b = data[2];
      const isWhite = r > 240 && g > 240 && b > 240;
      
      if (isWhite) {
        // It's a white border, let's trim it!
        const trimmedInfo = await sharp(innerBuf)
          .trim({ threshold: 50 })
          .toFile(tempPath);
          
        fs.renameSync(tempPath, filePath);
        console.log(`Trimmed ${filePath}: ${meta.width}x${meta.height} -> ${trimmedInfo.width}x${trimmedInfo.height}`);
      } else {
        // Not a white border (maybe already trimmed or normal photo). Don't do anything to avoid losing content.
        console.log(`Skipped ${filePath} (Top-left pixel not white: ${r},${g},${b})`);
      }
    } catch (err) {
      console.log(`Error processing ${filePath}:`, err.message);
      if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
    }
  }
  
  console.log(`Finished processing.`);
  await client.close();
}

run().catch(console.error);
