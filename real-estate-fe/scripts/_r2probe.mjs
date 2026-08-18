import { S3Client, ListObjectsV2Command, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
const s3 = new S3Client({
  region: 'auto',
  endpoint: process.env.R2_ENDPOINT,
  credentials: { accessKeyId: process.env.R2_ACCESS_KEY_ID, secretAccessKey: process.env.R2_SECRET_ACCESS_KEY },
});
const B = process.env.R2_BUCKET;
try {
  const r = await s3.send(new ListObjectsV2Command({ Bucket: B, MaxKeys: 5 }));
  console.log('LIST OK - so object:', r.KeyCount ?? 0);
} catch (e) { console.log('LIST LOI:', e.name, e.message); }
try {
  await s3.send(new PutObjectCommand({ Bucket: B, Key: '_probe/test.txt', Body: 'hello', ContentType: 'text/plain' }));
  console.log('PUT OK');
  const g = await s3.send(new GetObjectCommand({ Bucket: B, Key: '_probe/test.txt' }));
  console.log('GET OK, doc duoc:', await g.Body.transformToString());
} catch (e) { console.log('PUT/GET LOI:', e.name, e.message); }
