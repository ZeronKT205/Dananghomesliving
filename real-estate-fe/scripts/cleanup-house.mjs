import { MongoClient, ObjectId } from 'mongodb';

const URI = 'mongodb+srv://duotechcompanyhr_db_user:0sZCDf4iHser5J1g@cluster1708.n0yltgw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1708';
const DB = 'dananghomesliving';

async function run() {
  const client = new MongoClient(URI);
  await client.connect();
  const db = client.db(DB);

  const deletedApts = await db.collection('properties').deleteMany({
    categoryId: new ObjectId('6a82ff6930647ba01244cedc'),
    code: { $not: { $regex: '^RE-' } }
  });
  console.log(`Deleted ${deletedApts.deletedCount} old mock apartments.`);

  await client.close();
}

run().catch(console.error);
