import { MongoClient } from 'mongodb';

const URI = 'mongodb+srv://duotechcompanyhr_db_user:0sZCDf4iHser5J1g@cluster1708.n0yltgw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1708';

async function run() {
  const client = new MongoClient(URI);
  await client.connect();
  const db = client.db('dananghomesliving');
  const props = await db.collection('properties').find({}).toArray();
  
  let fixed = 0;
  for (const p of props) {
    const updates = {};
    
    // Fix title if it's a nested object like {vi:{vi:'...', en:'...'}, en:{...}}
    if (typeof p.title === 'object' && p.title !== null) {
      const vi = typeof p.title.vi === 'object' ? (p.title.vi?.vi || p.title.vi?.en || p.code) : (p.title.vi || p.code);
      const en = typeof p.title.en === 'object' ? (p.title.en?.en || p.title.en?.vi || p.code) : (p.title.en || p.code);
      updates.title = { vi, en };
      console.log(`  title fixed: ${p.code} -> "${vi.substring(0, 50)}"`);
    }
    
    if (Object.keys(updates).length > 0) {
      await db.collection('properties').updateOne({ _id: p._id }, { $set: updates });
      fixed++;
    }
  }
  
  console.log(`\nFixed ${fixed} properties.`);
  await client.close();
}

run().catch(console.error);
