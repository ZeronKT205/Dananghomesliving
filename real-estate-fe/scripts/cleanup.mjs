import { MongoClient } from 'mongodb';

const URI = 'mongodb+srv://duotechcompanyhr_db_user:0sZCDf4iHser5J1g@cluster1708.n0yltgw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1708';
const DB = 'dananghomesliving';

async function run() {
  const client = new MongoClient(URI);
  await client.connect();
  const db = client.db(DB);

  const result = await db.collection('properties').deleteMany({
    slug: { $in: ['villa-one-regal-victoria-fpt', 'villa-phan-ba-vanh-da-nang'] }
  });

  console.log(`Deleted ${result.deletedCount} old mock villas.`);
  await client.close();
}

run().catch(console.error);
