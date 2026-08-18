/**
 * Tạo toàn bộ index. Chạy lại được nhiều lần (idempotent) — Mongo bỏ qua index
 * đã tồn tại với cùng định nghĩa.
 *
 *   node --env-file=.env.local scripts/db-indexes.mjs
 *   node --env-file=.env.local scripts/db-indexes.mjs --drop-stale
 *
 * `--drop-stale` xoá các index không còn trong danh sách dưới đây. Cẩn thận khi
 * chạy trên production: xoá nhầm index đang phục vụ truy vấn sẽ làm chậm đột ngột.
 */
import { MongoClient } from 'mongodb';

const URI = process.env.MONGODB_URI;
const DB = process.env.MONGODB_DB;
const DROP_STALE = process.argv.includes('--drop-stale');

if (!URI || !DB) {
  console.error('Thieu MONGODB_URI hoac MONGODB_DB. Chay kem: node --env-file=.env.local ...');
  process.exit(1);
}

/**
 * `partialFilterExpression: { deletedAt: null }` là mấu chốt của xoá mềm:
 * slug chỉ cần duy nhất trong các bản CÒN SỐNG. Xoá tin cũ rồi thì tạo lại tin
 * mới cùng slug vẫn được — không có nó thì slug bị "cháy" vĩnh viễn.
 */
const ALIVE = { partialFilterExpression: { deletedAt: null } };

const INDEXES = {
  properties: [
    { key: { slug: 1 }, unique: true, name: 'slug_unique_alive', ...ALIVE },
    // Truy vấn xương sống của trang danh sách public.
    {
      key: { publishState: 1, isPublic: 1, deletedAt: 1, publishedAt: -1 },
      name: 'public_listing',
    },
    { key: { deal: 1, categoryId: 1, deletedAt: 1 }, name: 'deal_category' },
    { key: { 'price.usd': 1, deletedAt: 1 }, name: 'price_usd' },
    { key: { isFeatured: 1, publishState: 1, deletedAt: 1 }, name: 'featured' },
    { key: { 'location.district': 1, deletedAt: 1 }, name: 'district' },
    { key: { 'location.geo': '2dsphere' }, name: 'geo_2dsphere' },
    { key: { updatedAt: -1 }, name: 'updated_desc' },
    // Tìm kiếm toàn văn. Mongo chỉ cho phép MỘT text index mỗi collection,
    // nên gom hết trường cần tìm vào đây.
    {
      key: {
        'title.en': 'text',
        'title.vi': 'text',
        'summary.en': 'text',
        'summary.vi': 'text',
      },
      name: 'text_search',
      weights: { 'title.en': 10, 'title.vi': 10, 'summary.en': 3, 'summary.vi': 3 },
      default_language: 'none', // 'none' để không stem sai với tiếng Việt
    },
  ],

  categories: [
    { key: { slug: 1 }, unique: true, name: 'slug_unique_alive', ...ALIVE },
    { key: { showOnHome: 1, order: 1, deletedAt: 1 }, name: 'home_order' },
  ],

  amenities: [
    { key: { slug: 1 }, unique: true, name: 'slug_unique_alive', ...ALIVE },
    { key: { group: 1, order: 1 }, name: 'group_order' },
  ],

  articles: [
    { key: { slug: 1 }, unique: true, name: 'slug_unique_alive', ...ALIVE },
    { key: { publishState: 1, deletedAt: 1, publishedAt: -1 }, name: 'public_listing' },
    { key: { categoryId: 1, deletedAt: 1 }, name: 'category' },
    { key: { tags: 1, deletedAt: 1 }, name: 'tags' },
    { key: { isFeatured: 1, publishState: 1, deletedAt: 1 }, name: 'featured' },
  ],

  articleCategories: [
    { key: { slug: 1 }, unique: true, name: 'slug_unique_alive', ...ALIVE },
    { key: { order: 1 }, name: 'order' },
  ],

  inquiries: [
    { key: { code: 1 }, unique: true, name: 'code_unique' },
    { key: { status: 1, deletedAt: 1, createdAt: -1 }, name: 'status_recent' },
    { key: { propertyId: 1, deletedAt: 1 }, name: 'property' },
    { key: { email: 1 }, name: 'email' },
    { key: { createdAt: -1 }, name: 'recent' },
    // Chặn spam: đếm số lần gửi của một IP trong khoảng thời gian.
    { key: { ipHash: 1, createdAt: -1 }, name: 'ip_rate' },
  ],

  media: [
    { key: { key: 1 }, unique: true, name: 'key_unique' },
    { key: { ownerType: 1, ownerId: 1, deletedAt: 1 }, name: 'owner' },
  ],

  users: [{ key: { email: 1 }, unique: true, name: 'email_unique_alive', ...ALIVE }],

  /**
   * Refresh token ở collection riêng — KHÔNG nhúng mảng vào `users`.
   * TTL index của Mongo xoá NGUYÊN DOCUMENT: đặt TTL lên một trường trong mảng
   * của user thì token hết hạn sẽ xoá luôn tài khoản. Tách ra mới an toàn.
   */
  sessions: [
    { key: { tokenHash: 1 }, unique: true, name: 'token_unique' },
    { key: { userId: 1, revokedAt: 1 }, name: 'user_active' },
    // TTL an toàn: hết hạn thì xoá đúng document phiên này.
    { key: { expiresAt: 1 }, name: 'session_ttl', expireAfterSeconds: 0 },
  ],

  redirects: [{ key: { from: 1 }, unique: true, name: 'from_unique' }],
};

const client = new MongoClient(URI);

try {
  await client.connect();
  const db = client.db(DB);
  console.log(`Ket noi OK -> ${DB}\n`);

  let created = 0;
  let existed = 0;
  let dropped = 0;

  for (const [colName, specs] of Object.entries(INDEXES)) {
    const col = db.collection(colName);
    const before = await col.indexes().catch(() => []);
    const beforeNames = new Set(before.map((i) => i.name));

    console.log(`── ${colName}`);

    for (const spec of specs) {
      const { key, name, ...opts } = spec;
      if (beforeNames.has(name)) {
        console.log(`   = ${name}`);
        existed++;
        continue;
      }
      try {
        await col.createIndex(key, { name, ...opts });
        console.log(`   + ${name}`);
        created++;
      } catch (err) {
        console.log(`   ! ${name} — ${err.message}`);
      }
    }

    if (DROP_STALE) {
      const wanted = new Set(specs.map((s) => s.name));
      for (const idx of before) {
        if (idx.name !== '_id_' && !wanted.has(idx.name)) {
          await col.dropIndex(idx.name);
          console.log(`   - ${idx.name} (stale)`);
          dropped++;
        }
      }
    }
  }

  console.log(`\nTao moi: ${created} · Da co: ${existed}${DROP_STALE ? ` · Xoa: ${dropped}` : ''}`);
} catch (err) {
  console.error('\nLOI:', err.message);
  process.exitCode = 1;
} finally {
  await client.close();
}
