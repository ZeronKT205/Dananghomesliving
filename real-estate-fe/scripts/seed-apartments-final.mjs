import fs from 'fs';
import path from 'path';
import { MongoClient, ObjectId } from 'mongodb';

const URI = 'mongodb+srv://duotechcompanyhr_db_user:0sZCDf4iHser5J1g@cluster1708.n0yltgw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1708';
const DB = 'dananghomesliving';

const sourceBaseDir = path.join(process.cwd(), 'public', 'images', 'tin', 'Apartment');
const uploadBaseDir = path.join(process.cwd(), 'public', 'uploads');

const properties = [
  { code: 'RE-001', transaction: 'thuê', title: 'A refined 2-bedroom residence', categoryId: '6a82ff6930647ba01244cedc', project: 'Vista Apartment Building', bed: 2, bath: 2, area: 74, price: 958, currency: 'USD', frequency: '/Tháng', location: 'Đà Nẵng', view: 'city view' },
  { code: 'RE-002', transaction: 'thuê', title: '2BR apartment – Han River views and sun-filled, warm interiors.', categoryId: '6a82ff6930647ba01244cedc', project: 'Lux Ponte Building', bed: 2, bath: 2, area: 70, price: 1385, currency: 'USD', frequency: '/Tháng', location: 'Đà Nẵng', view: 'Han river view, high-floor' },
  { code: 'RE-003', transaction: 'thuê', title: 'A charming 1BR unit at Panoma 2 with lovely Han River views.', categoryId: '6a82ff6930647ba01244cedc', project: 'Lux Panoma 2 Building', bed: 1, bath: 1, area: 50, price: 1050, currency: 'USD', frequency: '/Tháng', location: 'Đà Nẵng', view: 'Han River View' },
  { code: 'RE-004', transaction: 'thuê', title: 'Beach-close, high-floor, ultra-chic.', categoryId: '6a82ff6930647ba01244cedc', project: 'Lux Time Square building', bed: 1, bath: 1, area: 50, price: 1534, currency: 'USD', frequency: '/Tháng', location: 'Đà Nẵng', view: 'beach View' },
  { code: 'RE-005', transaction: 'thuê', title: 'Penthouse – panoramic views, pure luxury', categoryId: '6a82ff6930647ba01244cedc', project: 'Lux Panoma 2 Building', bed: 2, bath: 2, area: 100, price: 1920, currency: 'USD', frequency: '/Tháng', location: 'Đà Nẵng', view: 'Han river view' },
  { code: 'RE-006', transaction: 'thuê', title: 'Brand new 3BR, Panoma 2, high floor, nice view.', categoryId: '6a82ff6930647ba01244cedc', project: 'Lux Panoma 2 Building', bed: 3, bath: 2, area: 101, price: 1920, currency: 'USD', frequency: '/Tháng', location: 'Đà Nẵng', view: 'han river view, cityview' },
  { code: 'RE-007', transaction: 'thuê', title: 'View of the Dragon Bridge breathing fire.', categoryId: '6a82ff6930647ba01244cedc', project: 'Hyori', bed: 2, bath: 2, area: 66, price: 1050, currency: 'USD', frequency: '/Tháng', location: 'Đà Nẵng', view: 'sơn tra mountain view' },
  { code: 'RE-008', transaction: 'thuê', title: 'beach view', categoryId: '6a82ff6930647ba01244cedc', project: 'Lux Panoma 1', bed: 1, bath: 1, area: 50, price: 1000, currency: 'USD', frequency: '/Tháng', location: 'Đà Nẵng', view: 'beach view' },
  { code: 'RE-009', transaction: 'thuê', title: 'Garden apartment with Han River view, large area of 135 m².', categoryId: '6a82ff6930647ba01244cedc', project: 'monarchy A', bed: 3, bath: 2, area: 135, price: 1265, currency: 'USD', frequency: '/Tháng', location: 'Đà Nẵng', view: 'hàn river view' },
  { code: 'RE-010', transaction: 'thuê', title: 'city view', categoryId: '6a82ff6930647ba01244cedc', project: 'lux panoma 2 Building', bed: 2, bath: 2, area: 70, price: 1200, currency: 'USD', frequency: '/Tháng', location: 'Đà Nẵng', view: 'city view' },
  { code: 'RE-011', transaction: 'thuê', title: 'Ultra-luxury apartment – right by the Han River walking street!', categoryId: '6a82ff6930647ba01244cedc', project: 'fillmore', bed: 2, bath: 2, area: 71, price: 1533, currency: 'USD', frequency: '/Tháng', location: 'Đà Nẵng', view: 'han river view' },
  { code: 'RE-012', transaction: 'thuê', title: 'Awesome 2BR apartment in Panoma 2', categoryId: '6a82ff6930647ba01244cedc', project: 'lux panoma 2 Building', bed: 2, bath: 2, area: 70, price: 1380, currency: 'USD', frequency: '/Tháng', location: 'Đà Nẵng', view: '' },
  { code: 'RE-013', transaction: 'thuê', title: 'Beautiful 1BR in Panoma 2', categoryId: '6a82ff6930647ba01244cedc', project: 'lux panoma 2 building', bed: 1, bath: 1, area: 50, price: 1073, currency: 'USD', frequency: '/Tháng', location: 'Đà Nẵng', view: '' },
  { code: 'RE-014', transaction: 'thuê', title: 'Ultra Luxury apartment', categoryId: '6a82ff6930647ba01244cedc', project: 'Futa Resident', bed: 1, bath: 1, area: 50, price: 1534, currency: 'USD', frequency: '/Tháng', location: 'Đà Nẵng', view: 'beach river, city river' },
  { code: 'RE-015', transaction: 'thuê', title: 'cozy atmosphere', categoryId: '6a82ff6930647ba01244cedc', project: 'Lux Panoma 1', bed: 1, bath: 1, area: 50, price: 1035, currency: 'USD', frequency: '/Tháng', location: 'Đà Nẵng', view: 'high floor, sea view' },
  { code: 'RE-016', transaction: 'thuê', title: 'Ultra Luxury apartment', categoryId: '6a82ff6930647ba01244cedc', project: 'lux panoma 2 building', bed: 1, bath: 1, area: 50, price: 1150, currency: 'USD', frequency: '/Tháng', location: 'Đà Nẵng', view: 'han river, DN downtow' },
  { code: 'RE-017', transaction: 'thuê', title: 'beach view', categoryId: '6a82ff6930647ba01244cedc', project: 'lux panoma 2 building', bed: 1, bath: 1, area: 50, price: 884, currency: 'USD', frequency: '/Tháng', location: 'Đà Nẵng', view: 'high floor, sea view' }
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
        vi: [ `Mã căn: ${item.code}`, item.view, `Dự án: ${item.project}` ],
        en: [ `Code: ${item.code}`, item.view, `Project: ${item.project}` ]
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
        floors: null,
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
    const targetFolder = item.code; // Because I renamed the folders to RE-001, RE-002, etc.
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
