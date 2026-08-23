import { MongoClient, ObjectId } from 'mongodb';
import fs from 'fs';
import path from 'path';

const URI = 'mongodb+srv://duotechcompanyhr_db_user:0sZCDf4iHser5J1g@cluster1708.n0yltgw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1708';
const DB = 'dananghomesliving';

const properties = [
  {
    code: 'RE-001',
    transaction: 'thuê',
    title: 'A refined 2-bedroom residence',
    category: 'Căn hộ (Apartment)',
    project: 'Vista Apartment Building',
    bed: 2, bath: 2, area: 74, price: 958, currency: 'USD',
    frequency: '/Tháng', location: 'Đà Nẵng', view: 'city view',
    link: 'https://drive.google.com/drive/folders/1Gcx4xAHz_dSv4etwWqtKuiaSD5fRVmzy?usp=drive_link',
    folderMatch: 'căn hộ Vista 2 ngủ và 2 vs'
  },
  {
    code: 'RE-002',
    transaction: 'thuê',
    title: '2BR apartment – Han River views and sun-filled, warm interiors.',
    category: 'Căn hộ (Apartment)',
    project: 'Lux Ponte Building',
    bed: 2, bath: 2, area: 70, price: 1385, currency: 'USD',
    frequency: '/Tháng', location: 'Đà Nẵng', view: 'Han river view, high-floor',
    link: 'https://drive.google.com/drive/folders/13GrEtm0BFHCsrlwm57-ElzUayyBZ9BxC?usp=drive_link',
    folderMatch: 'căn hộ 2 ngủ ponte'
  },
  {
    code: 'RE-003',
    transaction: 'thuê',
    title: 'A charming 1BR unit at Panoma 2 with lovely Han River views.',
    category: 'Căn hộ (Apartment)',
    project: 'Lux Panoma 2 Building',
    bed: 1, bath: 1, area: 50, price: 1050, currency: 'USD',
    frequency: '/Tháng', location: 'Đà Nẵng', view: 'Han River View',
    link: 'https://drive.google.com/drive/folders/1WFnBUPIbN_LbWDkEsaoMiw5m8_zH_1Ql?usp=drive_link',
    folderMatch: 'Căn 1 br P2 view sông hàn'
  },
  {
    code: 'RE-004',
    transaction: 'thuê',
    title: 'Beach-close, high-floor, ultra-chic.',
    category: 'Căn hộ (Apartment)',
    project: 'Lux Time Square building',
    bed: 1, bath: 1, area: 50, price: 1534, currency: 'USD',
    frequency: '/Tháng', location: 'Đà Nẵng', view: 'beach View',
    link: 'https://drive.google.com/drive/folders/1TI4KHFNGq2_wBG1YsCMnPgp9TNMcWPK5?usp=drive_link',
    folderMatch: '1br tang cao time square'
  },
  {
    code: 'RE-005',
    transaction: 'thuê',
    title: 'Penthouse – panoramic views, pure luxury',
    category: 'Căn hộ (Apartment)',
    project: 'Lux Panoma 2 Building',
    bed: 2, bath: 2, area: 100, price: 1920, currency: 'USD',
    frequency: '/Tháng', location: 'Đà Nẵng', view: 'Han river view',
    link: 'https://drive.google.com/drive/folders/1X6Bs7OXMK1idn-8gw85xpOge0smP-r81?usp=drive_link',
    folderMatch: 'penhouse Panoma 2 -- 2br'
  },
  {
    code: 'RE-006',
    transaction: 'thuê',
    title: 'Brand new 3BR, Panoma 2, high floor, nice view.',
    category: 'Căn hộ (Apartment)',
    project: 'Lux Panoma 2 Building',
    bed: 3, bath: 2, area: 101, price: 1920, currency: 'USD',
    frequency: '/Tháng', location: 'Đà Nẵng', view: 'han river view, cityview',
    link: 'https://drive.google.com/drive/folders/1ONKn6npcj9QmmWmWjIaZlX4Rqyv8PEgO?usp=drive_link',
    folderMatch: 'căn 3br tầng cao P2'
  },
  {
    code: 'RE-007',
    transaction: 'thuê',
    title: 'View of the Dragon Bridge breathing fire.',
    category: 'Căn hộ (Apartment)',
    project: 'Hyori',
    bed: 2, bath: 2, area: 66, price: 1050, currency: 'USD',
    frequency: '/Tháng', location: 'Đà Nẵng', view: 'sơn tra mountain view',
    link: 'https://drive.google.com/drive/folders/1LBWidUalOvsAMbvKbco0-Lksh5bWjHwF?usp=drive_link',
    folderMatch: 'căn hộ hyori tầng cao view núi sơn trà'
  },
  {
    code: 'RE-008',
    transaction: 'thuê',
    title: 'beach view',
    category: 'Căn hộ (Apartment)',
    project: 'Lux Panoma 1',
    bed: 1, bath: 1, area: 50, price: 1000, currency: 'USD',
    frequency: '/Tháng', location: 'Đà Nẵng', view: 'beach view',
    link: 'https://drive.google.com/drive/folders/1ndQm4_EWJGp7I4rQpCoZCmzc4YMX-66a?usp=drive_link',
    folderMatch: 'căn hộ 23-07 P1 view biển a Hoà TP' // Will verify this later
  },
  {
    code: 'RE-009',
    transaction: 'thuê',
    title: 'Garden apartment with Han River view, large area of 135 m².',
    category: 'Căn hộ (Apartment)',
    project: 'monarchy A',
    bed: 3, bath: 2, area: 135, price: 1265, currency: 'USD',
    frequency: '/Tháng', location: 'Đà Nẵng', view: 'hàn river view',
    link: 'https://drive.google.com/drive/folders/1Go2A_mqxmbHxoB6ra7x-rWZfVQ2V6vmo?usp=drive_link',
    folderMatch: 'căn hộ monarchy sân vườn tầng 4 3 gủ'
  },
  {
    code: 'RE-010',
    transaction: 'thuê',
    title: 'city view',
    category: 'Căn hộ (Apartment)',
    project: 'lux panoma 2 Building',
    bed: 2, bath: 2, area: 70, price: 1200, currency: 'USD',
    frequency: '/Tháng', location: 'Đà Nẵng', view: 'city view',
    link: 'https://drive.google.com/drive/folders/1gL8V11y8HFTDJ1yvv93Rxgc1s9hUIznA?usp=drive_link',
    folderMatch: '2br tầng trung P2'
  },
  {
    code: 'RE-011',
    transaction: 'thuê',
    title: 'Ultra-luxury apartment – right by the Han River walking street!',
    category: 'Căn hộ (Apartment)',
    project: 'fillmore',
    bed: 2, bath: 2, area: 71, price: 1533, currency: 'USD',
    frequency: '/Tháng', location: 'Đà Nẵng', view: 'han river view',
    link: 'https://drive.google.com/drive/folders/1Ax5Ds7TWuc9kBasYRJmrq2r-wyA_PU7B?usp=drive_link',
    folderMatch: 'căn hộ fillmore 2 ngủ đẹp'
  },
  {
    code: 'RE-012',
    transaction: 'thuê',
    title: 'Awesome 2BR apartment in Panoma 2',
    category: 'Căn hộ (Apartment)',
    project: 'lux panoma 2 Building',
    bed: 2, bath: 2, area: 70, price: 1380, currency: 'USD',
    frequency: '/Tháng', location: 'Đà Nẵng', view: '',
    link: 'https://drive.google.com/drive/folders/10ukBzkPk7R3WnBMiWBFTB0pUpXYyyhzt?usp=drive_link',
    folderMatch: '15-07 P2 c Huyền'
  },
  {
    code: 'RE-013',
    transaction: 'thuê',
    title: 'Beautiful 1BR in Panoma 2',
    category: 'Căn hộ (Apartment)',
    project: 'lux panoma 2 building',
    bed: 1, bath: 1, area: 50, price: 1073, currency: 'USD',
    frequency: '/Tháng', location: 'Đà Nẵng', view: '',
    link: 'https://drive.google.com/drive/folders/1CZMRmu-3jCHJdUrFyKpOKOToNUUzsKD4?usp=drive_link',
    folderMatch: 'Panoma2'
  },
  {
    code: 'RE-014',
    transaction: 'thuê',
    title: 'Ultra Luxury apartment',
    category: 'Căn hộ (Apartment)',
    project: 'Futa Resident',
    bed: 1, bath: 1, area: 50, price: 1534, currency: 'USD',
    frequency: '/Tháng', location: 'Đà Nẵng', view: 'beach river, city river',
    link: 'https://drive.google.com/drive/folders/11fcYOwVsj2XlDbuufOgcEItwC7QZs_v4?usp=drive_link',
    folderMatch: 'Futa resident 1 br'
  },
  {
    code: 'RE-015',
    transaction: 'thuê',
    title: 'cozy atmosphere',
    category: 'Căn hộ (Apartment)',
    project: 'Lux Panoma 1',
    bed: 1, bath: 1, area: 50, price: 1035, currency: 'USD',
    frequency: '/Tháng', location: 'Đà Nẵng', view: 'high floor, sea view',
    link: 'https://drive.google.com/drive/folders/1X6Bs7OXMK1idn-8gw85xpOge0smP-r81?usp=sharing',
    folderMatch: 'Hỏi Gemini 1br panoma 1 nội thất xinh ã chọn 1 mục'
  },
  {
    code: 'RE-016',
    transaction: 'thuê',
    title: 'Ultra Luxury apartment',
    category: 'Căn hộ (Apartment)',
    project: 'lux panoma 2 building',
    bed: 1, bath: 1, area: 50, price: 1150, currency: 'USD',
    frequency: '/Tháng', location: 'Đà Nẵng', view: 'han river, DN downtow',
    link: 'https://drive.google.com/drive/folders/158Jhqj5oH8qcdbf1Z1i1HhjH4QVfEggN?usp=sharing',
    folderMatch: 'căn hộ P1 1 br đẹp'
  },
  {
    code: 'RE-017',
    transaction: 'thuê',
    title: 'beach view',
    category: 'Căn hộ (Apartment)',
    project: 'lux panoma 2 building',
    bed: 1, bath: 1, area: 50, price: 884, currency: 'USD',
    frequency: '/Tháng', location: 'Đà Nẵng', view: 'high floor, sea view',
    link: 'https://drive.google.com/drive/folders/1rxP6VeIhC4NNuTdO-3VIvV9aQS1pCEYB?usp=sharing',
    folderMatch: '2 br tầng thấp panoma 2'
  }
];

// Helper to generate a slug
function generateSlug(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
}

async function run() {
  const client = new MongoClient(URI);
  await client.connect();
  const db = client.db(DB);

  for (const item of properties) {
    const propertyId = new ObjectId();
    const slug = generateSlug(`${item.title} ${item.code}`);
    
    // Check if property exists
    const exists = await db.collection('properties').findOne({ code: item.code });
    if (exists) {
      console.log(`Skipping ${item.code} - already exists`);
      continue;
    }

    const doc = {
      _id: propertyId,
      code: item.code,
      title: item.title,
      slug: slug,
      category: item.category,
      project: item.project,
      status: 'AVAILABLE',
      transactionType: item.transaction === 'thuê' ? 'RENT' : 'SALE',
      price: {
        amount: item.price,
        currency: item.currency,
        unit: item.frequency.replace('/', '')
      },
      specifications: {
        bedrooms: item.bed,
        bathrooms: item.bath,
        area: item.area
      },
      location: {
        city: item.location
      },
      features: item.view.split(',').map(f => f.trim()).filter(Boolean),
      published: true,
      featured: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      translations: {
        vi: {
          title: item.title,
          description: `Mã căn: ${item.code}\n${item.view}\nDự án: ${item.project}`
        },
        en: {
          title: item.title,
          description: `Code: ${item.code}\n${item.view}\nProject: ${item.project}`
        }
      }
    };

    await db.collection('properties').insertOne(doc);
    console.log(`Inserted ${item.code} (${item.title})`);
  }

  await client.close();
}

run().catch(console.error);
