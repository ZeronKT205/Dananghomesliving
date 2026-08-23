import fs from 'fs';
import path from 'path';
import { MongoClient, ObjectId } from 'mongodb';

const URI = 'mongodb+srv://duotechcompanyhr_db_user:0sZCDf4iHser5J1g@cluster1708.n0yltgw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1708';
const DB = 'dananghomesliving';

const sourceBaseDir = path.join(process.cwd(), 'public', 'images', 'tin', 'Home');
const uploadBaseDir = path.join(process.cwd(), 'public', 'uploads');

const properties = [
  {
    code: 'HO-01',
    transaction: 'thuê',
    title: 'căn hộ sang trọng',
    categoryId: '6a82ff6930647ba01244cede', // House category ID
    project: 'Hải Phòng street',
    bed: 3, bath: 3, area: 100, price: 845, currency: 'USD',
    frequency: '/Tháng', location: 'Đà Nẵng', view: 'New furniture',
    folderName: 'căn hộ ở thanh lương 18',
    floors: 3
  }
];

function generateSlug(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
}

async function run() {
  const client = new MongoClient(URI);
  await client.connect();
  const db = client.db(DB);

  for (const item of properties) {
    const slug = generateSlug(`${item.title} ${item.code}`);
    
    // Check if property exists
    let prop = await db.collection('properties').findOne({ code: item.code });
    let propertyId;
    if (prop) {
      console.log(`Found existing ${item.code}, updating...`);
      propertyId = prop._id;
    } else {
      propertyId = new ObjectId();
    }

    const doc = {
      code: item.code,
      title: { vi: item.title, en: item.title },
      slug: slug,
      summary: { vi: `Mã căn: ${item.code}`, en: `Code: ${item.code}` },
      description: {
        vi: [ `Mã căn: ${item.code}`, item.view, `Dự án: ${item.project}`, `Số tầng: ${item.floors}` ],
        en: [ `Code: ${item.code}`, item.view, `Project: ${item.project}`, `Floors: ${item.floors}` ]
      },
      deal: item.transaction === 'thuê' ? 'rent' : 'sale',
      categoryId: new ObjectId(item.categoryId),
      status: 'available',
      price: {
        usd: item.price,
        vnd: null,
        period: item.frequency.toLowerCase().includes('tháng') ? 'month' : 'total',
        negotiable: false
      },
      specs: {
        bedrooms: item.bed,
        bathrooms: item.bath,
        internalArea: item.area,
        landArea: null,
        buildingArea: null,
        floors: item.floors,
        yearBuilt: null,
        parking: null,
        furnishing: 'full',
        ownership: 'freehold'
      },
      location: {
        address: { vi: item.location, en: item.location },
        ward: '',
        district: '',
        city: item.location,
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

    if (prop) {
      await db.collection('properties').updateOne({ _id: propertyId }, { $set: doc });
    } else {
      await db.collection('properties').insertOne({ 
        _id: propertyId, 
        createdAt: new Date(), 
        publishedAt: new Date(),
        deletedAt: null,
        createdBy: null,
        updatedBy: null,
        ...doc 
      });
    }

    prop = await db.collection('properties').findOne({ _id: propertyId });

    // Handle images
    const dirs = fs.readdirSync(sourceBaseDir);
    const targetFolder = dirs.find(d => d.includes('thanh'));
    
    if (!targetFolder) {
      console.log(`Could not find folder for ${item.code} in ${sourceBaseDir}`);
      continue;
    }

    const sourceDir = path.join(sourceBaseDir, targetFolder);
    const targetDir = path.join(uploadBaseDir, slug);
    
    if (fs.existsSync(sourceDir)) {
      if (fs.existsSync(targetDir)) {
        fs.rmSync(targetDir, { recursive: true, force: true });
      }
      fs.mkdirSync(targetDir, { recursive: true });
      
      if (prop.mediaIds && prop.mediaIds.length > 0) {
        await db.collection('media').deleteMany({ _id: { $in: prop.mediaIds } });
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
          key: `img_${item.code}_${i}`,
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
      
      console.log(`Synced ${files.length} images for ${item.code}`);
    } else {
      console.log(`Source folder not found for ${item.code}: ${sourceDir}`);
    }
  }

  console.log(`Done!`);
  await client.close();
}

run().catch(console.error);
