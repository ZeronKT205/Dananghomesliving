import fs from 'fs';
import path from 'path';
import { MongoClient, ObjectId } from 'mongodb';

const URI = 'mongodb+srv://duotechcompanyhr_db_user:0sZCDf4iHser5J1g@cluster1708.n0yltgw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1708';
const DB = 'dananghomesliving';

const sourceBaseDir = path.join(process.cwd(), 'public', 'images', 'tin', 'Apartment');
const uploadBaseDir = path.join(process.cwd(), 'public', 'uploads');

async function run() {
  const client = new MongoClient(URI);
  await client.connect();
  const db = client.db(DB);

  // Fetch all apartments seeded previously (they have codes starting with RE-)
  const apartments = await db.collection('properties').find({ code: { $regex: '^RE-' } }).toArray();
  
  console.log(`Found ${apartments.length} apartments to fix.`);

  for (const item of apartments) {
    const propertyId = item._id;
    const code = item.code;
    const slug = item.slug;

    // Transform schema
    const doc = {
      code: code,
      title: { vi: item.title, en: item.title },
      slug: slug,
      summary: { vi: `Mã căn: ${code}`, en: `Code: ${code}` },
      description: {
        vi: [ `Mã căn: ${code}`, (item.features || []).join(', '), `Dự án: ${item.project}` ],
        en: [ `Code: ${code}`, (item.features || []).join(', '), `Project: ${item.project}` ]
      },
      deal: (item.transactionType === 'RENT') ? 'rent' : 'sale',
      categoryId: new ObjectId('6a82ff6930647ba01244cedc'), // Apartment category ID
      status: 'available',
      price: {
        usd: item.price?.amount || 0,
        vnd: null,
        period: (item.price?.unit && item.price.unit.toLowerCase().includes('tháng')) ? 'month' : 'total',
        negotiable: false
      },
      specs: {
        bedrooms: item.specifications?.bedrooms || 0,
        bathrooms: item.specifications?.bathrooms || 0,
        internalArea: item.specifications?.area || 0,
        landArea: null,
        buildingArea: null,
        floors: null,
        yearBuilt: null,
        parking: null,
        furnishing: 'full',
        ownership: 'freehold'
      },
      location: {
        address: { vi: item.location?.city || 'Đà Nẵng', en: item.location?.city || 'Đà Nẵng' },
        ward: '',
        district: '',
        city: item.location?.city || 'Đà Nẵng',
        geo: null
      },
      amenityIds: [],
      keyInfo: [],
      nearby: [],
      isFeatured: true,
      isVerified: true,
      badges: [],
      seo: {
        title: { vi: item.title, en: item.title },
        description: { vi: '', en: '' },
        focusKeyword: { vi: '', en: '' },
        ogImageId: null
      },
      publishState: 'published',
      isPublic: true,
      viewCount: 0,
      inquiryCount: 0,
      updatedAt: new Date()
    };

    await db.collection('properties').updateOne(
      { _id: propertyId }, 
      { 
        // We overwrite fields using $set, and remove old wrong fields using $unset
        $set: doc,
        $unset: {
          category: "",
          transactionType: "",
          specifications: "",
          features: "",
          translations: "",
          project: ""
        }
      }
    );

    // Handle images
    const sourceDir = path.join(sourceBaseDir, code); // e.g. RE-001
    const targetDir = path.join(uploadBaseDir, slug);
    
    if (fs.existsSync(sourceDir)) {
      if (fs.existsSync(targetDir)) {
        fs.rmSync(targetDir, { recursive: true, force: true });
      }
      fs.mkdirSync(targetDir, { recursive: true });
      
      if (item.mediaIds && item.mediaIds.length > 0) {
        await db.collection('media').deleteMany({ _id: { $in: item.mediaIds } });
      }
      
      const files = fs.readdirSync(sourceDir).filter(f => f.match(/\.(jpg|jpeg|png)$/i));
      files.sort();
      
      const newMediaIds = [];
      let coverId = null;
      
      for (let i = 0; i < files.length; i++) {
        const ext = path.extname(files[i]);
        const newName = `img_${i}${ext}`;
        const sourcePath = path.join(sourceDir, files[i]);
        const targetPath = path.join(targetDir, newName);
        
        fs.copyFileSync(sourcePath, targetPath);
        
        const mediaId = new ObjectId();
        const mediaDoc = {
          _id: mediaId,
          url: `/uploads/${slug}/${newName}`,
          key: `img_${code}_${i}`,
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: null,
          createdBy: null,
          updatedBy: null,
          mimeType: 'image/jpeg',
          size: fs.statSync(targetPath).size,
          width: null,
          height: null,
          alt: { vi: item.title, en: item.title },
          blurDataUrl: null,
          ownerType: 'property',
          ownerId: propertyId
        };
        
        await db.collection('media').insertOne(mediaDoc);
        newMediaIds.push(mediaId);
        
        if (i === 0) coverId = mediaId;
      }
      
      await db.collection('properties').updateOne(
        { _id: propertyId },
        { $set: { mediaIds: newMediaIds, coverId } }
      );
      
      console.log(`Synced ${files.length} images for ${code}`);
    } else {
      console.log(`Source folder not found for ${code}: ${sourceDir}`);
    }
  }

  console.log(`Done!`);
  await client.close();
}

run().catch(console.error);
