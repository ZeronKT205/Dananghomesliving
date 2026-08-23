import { MongoClient, ObjectId } from 'mongodb';

const URI = 'mongodb+srv://duotechcompanyhr_db_user:0sZCDf4iHser5J1g@cluster1708.n0yltgw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1708';
const DB = 'dananghomesliving';

// Category IDs
const CAT_VILLA = '6a82ff6930647ba01244cedd';
const CAT_APARTMENT = '6a82ff6930647ba01244cedc';
const CAT_HOUSE = '6a82ff6930647ba01244cede';

// Amenity IDs
const AMENITIES = {
  seaView: new ObjectId('6a82ff6930647ba01244cee0'),
  pool: new ObjectId('6a82ff6930647ba01244cee1'),
  garden: new ObjectId('6a82ff6930647ba01244cee2'),
  balcony: new ObjectId('6a82ff6930647ba01244cee3'),
  furnished: new ObjectId('6a82ff6930647ba01244cee5'),
  kitchen: new ObjectId('6a82ff6930647ba01244cee6'),
  smartHome: new ObjectId('6a82ff6a30647ba01244cee7'),
  elevator: new ObjectId('6a82ff6a30647ba01244cee8'),
  gym: new ObjectId('6a82ff6a30647ba01244cee9'),
  parking: new ObjectId('6a82ff6a30647ba01244ceea'),
  security: new ObjectId('6a82ff6a30647ba01244ceed')
};

const VILLA_AMENITIES = [AMENITIES.pool, AMENITIES.garden, AMENITIES.furnished, AMENITIES.kitchen, AMENITIES.smartHome, AMENITIES.security, AMENITIES.parking];
const APT_AMENITIES = [AMENITIES.balcony, AMENITIES.furnished, AMENITIES.elevator, AMENITIES.gym, AMENITIES.parking, AMENITIES.security];
const HOUSE_AMENITIES = [AMENITIES.garden, AMENITIES.furnished, AMENITIES.smartHome, AMENITIES.parking, AMENITIES.security];

function getHtmlDescription(prop, type) {
  const code = prop.code;
  const project = prop.description?.vi?.[2]?.replace('Dự án: ', '') || 'Da Nang Premium';
  const view = prop.description?.vi?.[1] || '';
  
  const viHtml = `
    <p class="lead">Chào mừng bạn đến với không gian sống đẳng cấp mang mã <strong>${code}</strong>. ${view ? `Tầm nhìn tuyệt đẹp: ${view}.` : ''}</p>
    <p>Thuộc dự án <strong>${project}</strong>, bất động sản này mang đến trải nghiệm sống vượt trội, nơi kết hợp hoàn hảo giữa thiết kế tinh tế và sự tiện nghi tối đa dành cho chủ nhân xứng tầm.</p>
    <ul>
      <li><strong>Vị trí đắc địa:</strong> Dễ dàng kết nối các khu vực trung tâm và thừa hưởng trọn vẹn các tiện ích ngoại khu cao cấp.</li>
      <li><strong>Thiết kế sang trọng:</strong> Tối ưu hóa ánh sáng tự nhiên và luồng gió trời, mang lại cảm giác rộng rãi, thoáng đãng nhưng vẫn đảm bảo sự riêng tư tuyệt đối.</li>
      <li><strong>Đẳng cấp sống:</strong> Cộng đồng dân cư văn minh, an ninh được bảo đảm 24/7.</li>
    </ul>
    <p>Hãy liên hệ ngay với <strong>Da Nang Homes</strong> để trải nghiệm thực tế không gian sống tuyệt vời này và nhận tư vấn chuyên sâu!</p>
  `;

  const enHtml = `
    <p class="lead">Welcome to an exceptional living space with the exclusive code <strong>${code}</strong>. ${view ? `Stunning views: ${view}.` : ''}</p>
    <p>Located in the prestigious <strong>${project}</strong>, this property offers an unparalleled living experience, perfectly blending elegant design with ultimate convenience for the discerning owner.</p>
    <ul>
      <li><strong>Prime Location:</strong> Easy access to the city center and full enjoyment of premium surrounding amenities.</li>
      <li><strong>Luxurious Design:</strong> Optimized for natural light and breeze, providing a spacious, airy feel while ensuring absolute privacy.</li>
      <li><strong>Elevated Lifestyle:</strong> A civilized community with 24/7 security.</li>
    </ul>
    <p>Contact <strong>Da Nang Homes</strong> today for a private viewing and expert advisory!</p>
  `;
  
  return { vi: viHtml, en: enHtml };
}

async function run() {
  const client = new MongoClient(URI);
  await client.connect();
  const db = client.db(DB);

  const properties = await db.collection('properties').find({}).toArray();
  console.log(`Enriching ${properties.length} properties...`);

  let count = 0;
  for (const prop of properties) {
    const catIdStr = prop.categoryId?.toHexString();
    let amenityIds = [];
    if (catIdStr === CAT_VILLA) amenityIds = VILLA_AMENITIES;
    else if (catIdStr === CAT_APARTMENT) amenityIds = APT_AMENITIES;
    else if (catIdStr === CAT_HOUSE) amenityIds = HOUSE_AMENITIES;

    const project = prop.description?.vi?.[2]?.replace('Dự án: ', '') || 'Da Nang Premium';

    const keyInfo = [
      { label: { vi: 'Pháp lý', en: 'Legal' }, value: { vi: 'Sổ hồng / Lâu dài', en: 'Pink book / Freehold' } },
      { label: { vi: 'Bàn giao', en: 'Handover' }, value: { vi: 'Đầy đủ nội thất', en: 'Fully Furnished' } },
      { label: { vi: 'Dự án', en: 'Project' }, value: { vi: project, en: project } }
    ];

    const nearby = [
      { place: { vi: 'Bãi biển Mỹ Khê', en: 'My Khe Beach' }, minutes: 5 },
      { place: { vi: 'Sân bay Quốc tế Đà Nẵng', en: 'Da Nang Int. Airport' }, minutes: 15 },
      { place: { vi: 'Trung tâm hành chính', en: 'City Center' }, minutes: 10 }
    ];

    const richDescription = getHtmlDescription(prop, catIdStr);

    await db.collection('properties').updateOne(
      { _id: prop._id },
      {
        $set: {
          description: richDescription,
          amenityIds: amenityIds,
          keyInfo: keyInfo,
          nearby: nearby
        }
      }
    );
    count++;
  }

  console.log(`Successfully enriched ${count} properties!`);
  await client.close();
}

run().catch(console.error);
