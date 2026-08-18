/**
 * Seed dữ liệu gốc + chuyển dữ liệu mẫu sang DB.
 *
 *   node --env-file=.env.local scripts/db-seed.mjs
 *   node --env-file=.env.local scripts/db-seed.mjs --reset   (xoá sạch rồi seed lại)
 *
 * Idempotent: chạy lại không nhân đôi dữ liệu (upsert theo slug/email).
 *
 * GỘP DỮ LIỆU: repo cũ có HAI nguồn BĐS mâu thuẫn — `lib/db/listings.ts`
 * (tiếng Anh) và `lib/mock-data.ts` (tiếng Việt), cùng slug nhưng khác nội
 * dung. Ở đây gộp thủ công: tiêu đề/mô tả tiếng Việt lấy từ mock-data, bản
 * tiếng Anh lấy từ listings, số liệu lấy bản của admin mock (đã là number).
 */
import bcrypt from 'bcryptjs';
import { MongoClient, ObjectId } from 'mongodb';

const URI = process.env.MONGODB_URI;
const DB = process.env.MONGODB_DB;
const RESET = process.argv.includes('--reset');

const ADMIN_EMAIL = process.env.SEED_ADMIN_EMAIL ?? 'admin@dananghomesliving.com';
const ADMIN_PASSWORD = process.env.SEED_ADMIN_PASSWORD ?? 'DanangHomes2026!';

if (!URI || !DB) {
  console.error('Thieu MONGODB_URI / MONGODB_DB');
  process.exit(1);
}

const now = new Date();
const base = () => ({ createdAt: now, updatedAt: now, deletedAt: null, createdBy: null, updatedBy: null });

/* ── Danh mục BĐS ─────────────────────────────────────── */
// Hợp đồng: đúng 3 nhóm lên trang chủ. Penthouse là nhóm phụ.
const CATEGORIES = [
  { slug: 'apartment', name: { vi: 'Căn hộ', en: 'Apartment' }, showOnHome: true, order: 1 },
  { slug: 'villa', name: { vi: 'Biệt thự', en: 'Villa' }, showOnHome: true, order: 2 },
  { slug: 'house', name: { vi: 'Nhà riêng', en: 'House' }, showOnHome: true, order: 3 },
  { slug: 'penthouse', name: { vi: 'Penthouse', en: 'Penthouse' }, showOnHome: false, order: 4 },
];

/* ── Tiện ích ─────────────────────────────────────────── */
const AMENITIES = [
  ['sea-view', 'Hướng biển', 'Sea view', 'waves', 'outdoor'],
  ['private-pool', 'Hồ bơi riêng', 'Private pool', 'pool', 'outdoor'],
  ['garden', 'Sân vườn', 'Garden', 'tree', 'outdoor'],
  ['balcony', 'Ban công', 'Balcony', 'balcony', 'outdoor'],
  ['bbq-area', 'Khu BBQ', 'BBQ area', 'flame', 'outdoor'],
  ['fully-furnished', 'Đầy đủ nội thất', 'Fully furnished', 'sofa', 'indoor'],
  ['modern-kitchen', 'Bếp hiện đại', 'Modern kitchen', 'kitchen', 'indoor'],
  ['smart-home', 'Nhà thông minh', 'Smart home', 'cpu', 'indoor'],
  ['elevator', 'Thang máy', 'Elevator', 'elevator', 'indoor'],
  ['gym', 'Phòng gym', 'Gym', 'dumbbell', 'service'],
  ['parking', 'Chỗ đậu xe', 'Parking', 'car', 'service'],
  ['maid-room', 'Phòng giúp việc', 'Maid room', 'bed', 'service'],
  ['pet-friendly', 'Nuôi thú cưng', 'Pet friendly', 'paw', 'service'],
  ['security-24-7', 'Bảo vệ 24/7', '24/7 security', 'shield', 'security'],
];

/* ── Chuyên mục bài viết ──────────────────────────────── */
const ARTICLE_CATEGORIES = [
  { slug: 'buying-guide', name: { vi: 'Hướng dẫn mua', en: 'Buying guide' }, order: 1 },
  { slug: 'design', name: { vi: 'Thiết kế', en: 'Design' }, order: 2 },
  { slug: 'neighbourhood', name: { vi: 'Khu vực', en: 'Neighbourhood' }, order: 3 },
  { slug: 'market', name: { vi: 'Thị trường', en: 'Market' }, order: 4 },
];

/* ── Bất động sản (đã gộp từ 2 nguồn mâu thuẫn) ───────── */
const IMG = (id, w = 1600) => `https://images.unsplash.com/photo-${id}?w=${w}&q=80`;

const PROPERTIES = [
  {
    slug: 'ocean-estate-villa', cat: 'villa', deal: 'sale', state: 'published', featured: true,
    vi: 'Biệt thự Ocean Estate', en: 'Ocean Estate Signature Villa',
    sumVi: 'Biệt thự biển 3 phòng ngủ, sân vườn riêng và hồ bơi tràn bờ hướng Đông.',
    sumEn: 'Beachfront villa with private garden and east-facing infinity pool.',
    usd: 3_596_000, beds: 3, baths: 3, area: 917, land: 450, year: 2022, floors: 2, parking: 2,
    ward: 'Hoà Hải', district: 'Ngũ Hành Sơn', lng: 108.2620, lat: 16.0075,
    amenities: ['sea-view', 'private-pool', 'garden', 'fully-furnished', 'smart-home', 'security-24-7'],
    images: ['1600596542815-ffad4c1539a9', '1600585154340-be6161a56a0c', '1512917774080-9991f1c4c750', '1600607687939-ce8a6c25118c'],
    views: 486,
  },
  {
    slug: 'riverfront-penthouse', cat: 'penthouse', deal: 'sale', state: 'published', featured: true,
    vi: 'Penthouse Sông Hàn', en: 'The Riverfront Sky Penthouse',
    sumVi: 'Penthouse tầng cao nhìn thẳng sông Hàn và Cầu Rồng, bàn giao nội thất.',
    sumEn: 'Top-floor penthouse overlooking the Han River and Dragon Bridge.',
    usd: 1_280_000, beds: 4, baths: 4, area: 318, land: null, year: 2023, floors: 1, parking: 2,
    ward: 'Thạch Thang', district: 'Hải Châu', lng: 108.2240, lat: 16.0710,
    amenities: ['sea-view', 'fully-furnished', 'smart-home', 'elevator', 'gym', 'security-24-7'],
    images: ['1512917774080-9991f1c4c750', '1600566753376-12c8ab7fb75b', '1600585154526-990dced4db0d'],
    views: 372,
  },
  {
    slug: 'son-tra-sky-residence', cat: 'apartment', deal: 'sale', state: 'draft', featured: false,
    vi: 'Căn hộ Sơn Trà Sky', en: 'Son Tra Sky Ocean Residence',
    sumVi: 'Căn góc hai mặt thoáng, view biển Mỹ Khê, gần trung tâm An Thượng.',
    sumEn: 'Corner residence 200m from My Khe Beach with dual aspect views.',
    usd: 685_000, beds: 3, baths: 3, area: 186, land: null, year: 2021, floors: 1, parking: 1,
    ward: 'Phước Mỹ', district: 'Sơn Trà', lng: 108.2470, lat: 16.0620,
    amenities: ['sea-view', 'balcony', 'modern-kitchen', 'elevator', 'gym', 'parking'],
    images: ['1545324418-cc1a3fa10c00', '1600566753190-17f0baa2a6c3', '1600585152220-90363fe7e115'],
    views: 118,
  },
  {
    slug: 'an-thuong-design-apartment', cat: 'apartment', deal: 'sale', state: 'published', featured: false,
    vi: 'Căn hộ thiết kế An Thượng', en: 'An Thuong Luxury Design Apartment',
    sumVi: 'Căn hộ thiết kế riêng, bàn giao đầy đủ nội thất, đi bộ ra biển 5 phút.',
    sumEn: 'Bespoke apartment, fully furnished, five minutes from the beach.',
    usd: 425_000, beds: 2, baths: 2, area: 128, land: null, year: 2022, floors: 1, parking: 1,
    ward: 'Mỹ An', district: 'Ngũ Hành Sơn', lng: 108.2440, lat: 16.0450,
    amenities: ['fully-furnished', 'modern-kitchen', 'balcony', 'elevator', 'parking'],
    images: ['1600607687939-ce8a6c25118c', '1600566753086-00f18fb6b3ea', '1600585154526-990dced4db0d'],
    views: 264,
  },
  {
    slug: 'my-khe-coastal-apartment', cat: 'apartment', deal: 'rent', state: 'published', featured: true,
    vi: 'Căn hộ ven biển Mỹ Khê', en: 'My Khe Executive Coastal Apartment',
    sumVi: 'Căn hộ 2 phòng ngủ ngay Mỹ Khê, đầy đủ nội thất, thuê dài hạn.',
    sumEn: 'Furnished two-bedroom by My Khe Beach, long-term lease.',
    usd: 1_950, beds: 2, baths: 2, area: 96, land: null, year: 2023, floors: 1, parking: 1,
    ward: 'Phước Mỹ', district: 'Sơn Trà', lng: 108.2480, lat: 16.0580, perMonth: true,
    amenities: ['sea-view', 'fully-furnished', 'modern-kitchen', 'elevator', 'gym', 'security-24-7'],
    images: ['1600585154340-be6161a56a0c', '1600607687920-4e2a09cf159d', '1512917774080-9991f1c4c750'],
    views: 341,
  },
  {
    slug: 'ocean-villas-family-residence', cat: 'villa', deal: 'rent', state: 'published', featured: false,
    vi: 'Biệt thự gia đình Ocean Villas', en: 'Ocean Villas Family Residence',
    sumVi: 'Biệt thự 3 phòng ngủ trong khu compound, hồ bơi chung, hợp gia đình.',
    sumEn: 'Three-bedroom villa in a gated compound with shared pool.',
    usd: 2_600, beds: 3, baths: 3, area: 280, land: 320, year: 2020, floors: 2, parking: 2,
    ward: 'Hoà Hải', district: 'Ngũ Hành Sơn', lng: 108.2600, lat: 16.0100, perMonth: true,
    amenities: ['private-pool', 'garden', 'fully-furnished', 'pet-friendly', 'security-24-7', 'parking'],
    images: ['1600585154526-990dced4db0d', '1600607687644-c7171b42498f', '1600596542815-ffad4c1539a9'],
    views: 298,
  },
  {
    slug: 'an-thuong-urban-loft', cat: 'house', deal: 'rent', state: 'draft', featured: false,
    vi: 'Loft An Thượng', en: 'An Thuong Urban Loft',
    sumVi: 'Loft một phòng ngủ giữa khu An Thượng, đi bộ tới quán xá và biển.',
    sumEn: 'One-bedroom loft in the heart of An Thuong.',
    usd: 1_450, beds: 1, baths: 1, area: 78, land: 60, year: 2019, floors: 2, parking: 0,
    ward: 'Mỹ An', district: 'Ngũ Hành Sơn', lng: 108.2430, lat: 16.0480, perMonth: true,
    amenities: ['fully-furnished', 'modern-kitchen', 'balcony', 'pet-friendly'],
    images: ['1600566753086-00f18fb6b3ea', '1512917774080-9991f1c4c750'],
    views: 87,
  },
  {
    slug: 'han-river-executive-home', cat: 'apartment', deal: 'rent', state: 'published', featured: false,
    vi: 'Căn hộ chuyên gia sông Hàn', en: 'Han River Executive Home',
    sumVi: 'Căn hộ trung tâm dành cho chuyên gia, gần văn phòng và trường quốc tế.',
    sumEn: 'Central apartment for professionals, near offices and schools.',
    usd: 1_850, beds: 2, baths: 2, area: 105, land: null, year: 2022, floors: 1, parking: 1,
    ward: 'Hải Châu I', district: 'Hải Châu', lng: 108.2230, lat: 16.0680, perMonth: true,
    amenities: ['fully-furnished', 'modern-kitchen', 'elevator', 'gym', 'parking', 'security-24-7'],
    images: ['1600607687920-4e2a09cf159d', '1600566753376-12c8ab7fb75b'],
    views: 203,
  },
];

const ARTICLES = [
  {
    slug: 'international-buyers-guide', cat: 'buying-guide', state: 'published', featured: true, views: 512,
    vi: 'Điều người mua nước ngoài cần biết trước khi chọn căn hộ tại Đà Nẵng',
    en: 'What international buyers should understand before choosing a Da Nang residence',
    exVi: 'Tổng quan về vị trí, hình thức sở hữu, phí dịch vụ và những câu hỏi nên đặt ra trước khi xuống tiền.',
    exEn: 'A practical overview of locations, ownership, service charges and key questions.',
    img: '1600596542815-ffad4c1539a9',
    tags: ['Hướng dẫn mua', 'Sở hữu nước ngoài', 'Pháp lý'],
  },
  {
    slug: 'furnished-rental-details', cat: 'design', state: 'published', featured: false, views: 287,
    vi: 'Những chi tiết làm nên một căn hộ cho thuê thật sự cao cấp',
    en: 'The details that make a rental genuinely premium',
    exVi: 'Từ ánh sáng, tủ chứa đồ tới cách âm — các dấu hiệu chất lượng chỉ lộ ra sau buổi xem đầu tiên.',
    exEn: 'Lighting, storage and acoustics — quality signals you only notice on a second viewing.',
    img: '1600585154526-990dced4db0d',
    tags: ['Thiết kế', 'Cho thuê'],
  },
  {
    slug: 'choosing-your-neighbourhood', cat: 'neighbourhood', state: 'published', featured: false, views: 194,
    vi: 'Mỹ Khê, An Thượng hay Hải Châu — chọn khu nào cho phù hợp',
    en: 'My Khe, An Thuong or Hai Chau — choosing your neighbourhood',
    exVi: 'So sánh ba khu vực được tìm nhiều nhất theo nhịp sống, tiện ích và tầm giá.',
    exEn: 'Comparing the three most searched areas by lifestyle, amenities and price.',
    img: '1512917774080-9991f1c4c750',
    tags: ['Khu vực', 'Đà Nẵng'],
  },
];

const client = new MongoClient(URI);

try {
  await client.connect();
  const db = client.db(DB);
  console.log(`Ket noi OK -> ${DB}\n`);

  if (RESET) {
    for (const c of ['properties', 'categories', 'amenities', 'articles', 'articleCategories', 'media']) {
      await db.collection(c).deleteMany({});
    }
    console.log('Da xoa sach content collections\n');
  }

  /* 1. Tài khoản quản trị */
  const users = db.collection('users');
  const existingAdmin = await users.findOne({ email: ADMIN_EMAIL });
  if (existingAdmin) {
    console.log(`= admin: ${ADMIN_EMAIL} (da ton tai)`);
  } else {
    await users.insertOne({
      _id: new ObjectId(), ...base(),
      email: ADMIN_EMAIL,
      passwordHash: bcrypt.hashSync(ADMIN_PASSWORD, 12),
      name: 'Quản trị viên',
      role: 'admin',
      avatarId: null,
      isActive: true,
      lastLoginAt: null,
      failedLoginCount: 0,
      lockedUntil: null,
    });
    console.log(`+ admin: ${ADMIN_EMAIL}  /  mat khau: ${ADMIN_PASSWORD}`);
  }

  /* 2. Danh mục */
  const cats = db.collection('categories');
  for (const c of CATEGORIES) {
    await cats.updateOne(
      { slug: c.slug },
      { $set: { ...c, description: null, coverId: null, propertyCount: 0, updatedAt: now, deletedAt: null },
        $setOnInsert: { _id: new ObjectId(), createdAt: now, createdBy: null, updatedBy: null } },
      { upsert: true },
    );
  }
  console.log(`= categories: ${CATEGORIES.length}`);

  /* 3. Tiện ích */
  const ams = db.collection('amenities');
  for (const [slug, vi, en, icon, group] of AMENITIES) {
    await ams.updateOne(
      { slug },
      { $set: { slug, name: { vi, en }, icon, group, order: 0, updatedAt: now, deletedAt: null },
        $setOnInsert: { _id: new ObjectId(), createdAt: now, createdBy: null, updatedBy: null } },
      { upsert: true },
    );
  }
  console.log(`= amenities: ${AMENITIES.length}`);

  /* 4. Chuyên mục bài viết */
  const artCats = db.collection('articleCategories');
  for (const c of ARTICLE_CATEGORIES) {
    await artCats.updateOne(
      { slug: c.slug },
      { $set: { ...c, articleCount: 0, updatedAt: now, deletedAt: null },
        $setOnInsert: { _id: new ObjectId(), createdAt: now, createdBy: null, updatedBy: null } },
      { upsert: true },
    );
  }
  console.log(`= articleCategories: ${ARTICLE_CATEGORIES.length}`);

  /* 5. Media + BĐS */
  const catMap = new Map((await cats.find({}).toArray()).map((c) => [c.slug, c._id]));
  const amMap = new Map((await ams.find({}).toArray()).map((a) => [a.slug, a._id]));
  const media = db.collection('media');
  const props = db.collection('properties');

  const USD_TO_VND = Number(process.env.USD_TO_VND ?? 25_400);
  let propCount = 0;

  for (const p of PROPERTIES) {
    const mediaIds = [];
    for (const [i, photoId] of p.images.entries()) {
      const url = IMG(photoId, i === 0 ? 1600 : 800);
      const r = await media.findOneAndUpdate(
        { key: `seed/${p.slug}/${i}` },
        { $set: { key: `seed/${p.slug}/${i}`, url, mimeType: 'image/jpeg', size: 0, width: null, height: null,
                  alt: { vi: p.vi, en: p.en }, blurDataUrl: null, ownerType: 'property', ownerId: null,
                  updatedAt: now, deletedAt: null },
          $setOnInsert: { _id: new ObjectId(), createdAt: now, createdBy: null, updatedBy: null } },
        { upsert: true, returnDocument: 'after' },
      );
      mediaIds.push(r._id);
    }

    await props.updateOne(
      { slug: p.slug },
      {
        $set: {
          slug: p.slug,
          title: { vi: p.vi, en: p.en },
          summary: { vi: p.sumVi, en: p.sumEn },
          description: { vi: [p.sumVi], en: [p.sumEn] },
          deal: p.deal,
          categoryId: catMap.get(p.cat),
          status: 'available',
          price: {
            usd: p.usd,
            vnd: Math.round((p.usd * USD_TO_VND) / 1_000_000) * 1_000_000,
            period: p.perMonth ? 'month' : 'total',
            negotiable: false,
          },
          specs: {
            bedrooms: p.beds, bathrooms: p.baths, internalArea: p.area,
            landArea: p.land, buildingArea: null, floors: p.floors,
            yearBuilt: p.year, parking: p.parking,
            furnishing: 'full', ownership: 'freehold',
          },
          location: {
            address: { vi: `${p.ward}, ${p.district}, Đà Nẵng`, en: `${p.ward}, ${p.district}, Da Nang` },
            ward: p.ward, district: p.district, city: 'Đà Nẵng',
            geo: { type: 'Point', coordinates: [p.lng, p.lat] },
          },
          amenityIds: p.amenities.map((s) => amMap.get(s)).filter(Boolean),
          keyInfo: [], nearby: [],
          coverId: mediaIds[0] ?? null,
          mediaIds,
          isFeatured: p.featured, isVerified: true, badges: [],
          seo: { title: { vi: p.vi, en: p.en }, description: { vi: p.sumVi, en: p.sumEn }, focusKeyword: {}, ogImageId: mediaIds[0] ?? null },
          publishState: p.state,
          isPublic: p.state === 'published',
          publishedAt: p.state === 'published' ? now : null,
          viewCount: p.views, inquiryCount: 0,
          updatedAt: now, deletedAt: null,
        },
        $setOnInsert: { _id: new ObjectId(), createdAt: now, createdBy: null, updatedBy: null },
      },
      { upsert: true },
    );
    propCount++;
  }
  console.log(`= properties: ${propCount}`);

  /* 6. Bài viết */
  const artCatMap = new Map((await artCats.find({}).toArray()).map((c) => [c.slug, c._id]));
  const articles = db.collection('articles');

  for (const a of ARTICLES) {
    const r = await media.findOneAndUpdate(
      { key: `seed/article/${a.slug}` },
      { $set: { key: `seed/article/${a.slug}`, url: IMG(a.img, 1200), mimeType: 'image/jpeg', size: 0,
                width: null, height: null, alt: { vi: a.vi, en: a.en }, blurDataUrl: null,
                ownerType: 'article', ownerId: null, updatedAt: now, deletedAt: null },
        $setOnInsert: { _id: new ObjectId(), createdAt: now, createdBy: null, updatedBy: null } },
      { upsert: true, returnDocument: 'after' },
    );

    await articles.updateOne(
      { slug: a.slug },
      {
        $set: {
          slug: a.slug,
          title: { vi: a.vi, en: a.en },
          excerpt: { vi: a.exVi, en: a.exEn },
          content: { vi: `## ${a.vi}\n\n${a.exVi}`, en: `## ${a.en}\n\n${a.exEn}` },
          categoryId: artCatMap.get(a.cat),
          tags: a.tags,
          coverId: r._id,
          author: { name: 'Ban biên tập', role: null, avatarId: null },
          readingMinutes: 5,
          isFeatured: a.featured,
          publishState: a.state,
          publishedAt: a.state === 'published' ? now : null,
          viewCount: a.views,
          seo: { title: { vi: a.vi, en: a.en }, description: { vi: a.exVi, en: a.exEn }, ogImageId: r._id },
          updatedAt: now, deletedAt: null,
        },
        $setOnInsert: { _id: new ObjectId(), createdAt: now, createdBy: null, updatedBy: null },
      },
      { upsert: true },
    );
  }
  console.log(`= articles: ${ARTICLES.length}`);

  /* 7. Tính lại propertyCount */
  const counts = await props.aggregate([
    { $match: { deletedAt: null, publishState: 'published' } },
    { $group: { _id: '$categoryId', n: { $sum: 1 } } },
  ]).toArray();
  for (const c of counts) {
    await cats.updateOne({ _id: c._id }, { $set: { propertyCount: c.n } });
  }

  console.log('\nSeed xong.');
} catch (err) {
  console.error('\nLOI:', err.message);
  process.exitCode = 1;
} finally {
  await client.close();
}
