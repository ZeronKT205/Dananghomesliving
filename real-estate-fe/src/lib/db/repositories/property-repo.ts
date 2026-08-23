import 'server-only';

import { ObjectId } from 'mongodb';

import type { Paginated } from '@/lib/validations/common';
import type { PropertyCreateInput, PropertyNearbyQuery, PropertyQuery, PropertyUpdateInput } from '@/lib/validations/property';

import { amenitiesCol, categoriesCol, propertiesCol } from '../collections';

import {
  alive,
  ensureUniqueSlug,
  findAliveById,
  findAliveBySlug,
  insertDoc,
  paginate,
  restoreDoc,
  softDelete,
  toObjectId,
  toObjectIds,
  updateDoc,
} from './base';

import type { PropertyDoc } from '../collections';
import type { Filter, Sort } from 'mongodb';

const SORT_MAP: Record<string, Sort> = {
  newest: { deal: 1, publishedAt: -1, createdAt: -1 },
  oldest: { deal: 1, publishedAt: 1, createdAt: 1 },
  price_asc: { deal: 1, 'price.usd': 1 },
  price_desc: { deal: 1, 'price.usd': -1 },
  area_desc: { deal: 1, 'specs.internalArea': -1 },
  popular: { deal: 1, viewCount: -1, createdAt: -1 },
};

/**
 * Dựng filter Mongo từ query đã validate.
 *
 * `includeUnpublished` chỉ được bật bởi service ở nhánh admin. Route public
 * KHÔNG BAO GIỜ truyền cờ này — nếu không, thêm `?includeUnpublished=true` vào
 * URL là xem được toàn bộ bản nháp.
 */
export async function buildPropertyFilter(q: PropertyQuery): Promise<Filter<PropertyDoc>> {
  const filter: Filter<PropertyDoc> = {};

  if (!q.includeUnpublished) {
    filter.publishState = 'published';
    filter.isPublic = true;
  } else if (q.publishState) {
    filter.publishState = q.publishState;
  }

  if (q.deal) filter.deal = q.deal;
  if (q.status) filter.status = q.status;
  if (q.district) filter['location.district'] = q.district;

  // categorySlug → categoryId. Cần một truy vấn phụ, nhưng danh mục rất ít và
  // được cache ở tầng service nên không phải điểm nghẽn.
  if (q.categoryId) {
    const oid = toObjectId(q.categoryId);
    if (oid) filter.categoryId = oid;
  } else if (q.categorySlug) {
    const cats = await categoriesCol();
    const cat = await cats.findOne(alive({ slug: q.categorySlug }), { projection: { _id: 1 } });
    // Không tìm thấy danh mục → filter không thể khớp gì. Dùng ObjectId rỗng
    // thay vì bỏ qua điều kiện, nếu không sẽ trả về TOÀN BỘ danh sách.
    filter.categoryId = cat?._id ?? new ObjectId('000000000000000000000000');
  }

  if (q.minPrice !== undefined || q.maxPrice !== undefined) {
    filter['price.usd'] = {
      ...(q.minPrice !== undefined ? { $gte: q.minPrice } : {}),
      ...(q.maxPrice !== undefined ? { $lte: q.maxPrice } : {}),
    };
  }

  if (q.minArea !== undefined || q.maxArea !== undefined) {
    filter['specs.internalArea'] = {
      ...(q.minArea !== undefined ? { $gte: q.minArea } : {}),
      ...(q.maxArea !== undefined ? { $lte: q.maxArea } : {}),
    };
  }

  if (q.minBeds !== undefined) filter['specs.bedrooms'] = { $gte: q.minBeds };
  if (q.minBaths !== undefined) filter['specs.bathrooms'] = { $gte: q.minBaths };
  if (q.featured !== undefined) filter.isFeatured = q.featured;

  if (q.amenitySlugs?.length) {
    const ams = await amenitiesCol();
    const found = await ams.find(alive({ slug: { $in: q.amenitySlugs } }), { projection: { _id: 1 } }).toArray();
    // $all = phải có ĐỦ các tiện ích được chọn, không phải "có một trong số".
    filter.amenityIds = { $all: found.map((a) => a._id) };
  }

  if (q.q?.trim()) {
    filter.$text = { $search: q.q.trim() };
  }

  return filter;
}

export async function listProperties(q: PropertyQuery): Promise<Paginated<PropertyDoc>> {
  const col = await propertiesCol();
  const filter = await buildPropertyFilter(q);

  // Khi có $text, xếp theo điểm liên quan trước rồi mới tới tiêu chí phụ.
  const sort: Sort = filter.$text
    ? ({ score: { $meta: 'textScore' }, ...(SORT_MAP[q.sort] as object) } as Sort)
    : (SORT_MAP[q.sort] ?? SORT_MAP.newest!);

  return paginate(col, { filter, sort, page: q.page, limit: q.limit });
}

export async function getPropertyBySlug(slug: string): Promise<PropertyDoc | null> {
  return findAliveBySlug(await propertiesCol(), slug);
}

export async function getPropertyById(id: string): Promise<PropertyDoc | null> {
  return findAliveById(await propertiesCol(), id);
}

/** Chỉ lấy bản đã xuất bản — dùng cho trang public. */
export async function getPublishedPropertyBySlug(slug: string): Promise<PropertyDoc | null> {
  const col = await propertiesCol();
  return col.findOne(alive({ slug, publishState: 'published', isPublic: true }));
}

export async function getPropertiesByIds(ids: readonly string[]): Promise<PropertyDoc[]> {
  const oids = toObjectIds(ids);
  if (!oids.length) return [];
  const col = await propertiesCol();
  return col.find(alive({ _id: { $in: oids } })).toArray();
}

/** BĐS tương tự: cùng danh mục, cùng hình thức, loại trừ chính nó. */
export async function findSimilarProperties(
  property: Pick<PropertyDoc, '_id' | 'categoryId' | 'deal' | 'price'>,
  limit = 4,
): Promise<PropertyDoc[]> {
  const col = await propertiesCol();
  const range = { $gte: property.price.usd * 0.5, $lte: property.price.usd * 2 };

  const primary = await col
    .find(
      alive({
        _id: { $ne: property._id },
        categoryId: property.categoryId,
        deal: property.deal,
        publishState: 'published',
        isPublic: true,
        'price.usd': range,
      }),
    )
    .limit(limit)
    .toArray();

  if (primary.length >= limit) return primary;

  // Không đủ thì nới điều kiện — thà hiển thị hàng gần đúng còn hơn ô trống.
  const fill = await col
    .find(
      alive({
        _id: { $nin: [property._id, ...primary.map((p) => p._id)] },
        deal: property.deal,
        publishState: 'published',
        isPublic: true,
      }),
    )
    .limit(limit - primary.length)
    .toArray();

  return [...primary, ...fill];
}

/** Tìm quanh một toạ độ. Cần index 2dsphere trên location.geo. */
export async function findNearbyProperties(q: PropertyNearbyQuery): Promise<PropertyDoc[]> {
  const col = await propertiesCol();
  const exclude = toObjectId(q.excludeId);

  return col
    .find(
      alive({
        ...(exclude ? { _id: { $ne: exclude } } : {}),
        publishState: 'published',
        isPublic: true,
        'location.geo': {
          $nearSphere: {
            $geometry: { type: 'Point', coordinates: [q.lng, q.lat] },
            $maxDistance: q.radiusKm * 1000, // mét
          },
        },
      }),
    )
    .limit(q.limit)
    .toArray();
}

export async function countProperties(filter: Filter<PropertyDoc> = {}): Promise<number> {
  const col = await propertiesCol();
  return col.countDocuments(alive(filter));
}

/* ── Ghi ──────────────────────────────────────────────── */

type PropertyDocInput = Omit<PropertyDoc, '_id' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'createdBy' | 'updatedBy'>;

export async function createProperty(doc: PropertyDocInput, actorId?: string | null): Promise<PropertyDoc> {
  const col = await propertiesCol();
  const slug = await ensureUniqueSlug(col, doc.slug);
  return insertDoc(col, { ...doc, slug }, actorId);
}

export async function updateProperty(
  id: string,
  patch: Partial<PropertyDocInput>,
  actorId?: string | null,
): Promise<PropertyDoc | null> {
  const col = await propertiesCol();
  if (patch.slug) {
    patch = { ...patch, slug: await ensureUniqueSlug(col, patch.slug, id) };
  }
  return updateDoc(col, id, patch, actorId);
}

export async function deleteProperty(id: string, actorId?: string | null): Promise<boolean> {
  return softDelete(await propertiesCol(), id, actorId);
}

export async function restoreProperty(id: string, actorId?: string | null): Promise<boolean> {
  return restoreDoc(await propertiesCol(), id, actorId);
}

/**
 * Cộng lượt xem theo lô.
 *
 * KHÔNG gọi hàm này trong lúc render trang — mỗi lượt xem một lệnh ghi sẽ phá
 * cache static của Next và dội DB. Gọi từ route handler riêng mà client bắn
 * tới sau khi trang đã hiện.
 */
export async function incrementViewCounts(idCounts: Map<string, number>): Promise<number> {
  if (!idCounts.size) return 0;
  const col = await propertiesCol();

  const ops = [...idCounts.entries()]
    .map(([id, count]) => {
      const oid = toObjectId(id);
      if (!oid) return null;
      return { updateOne: { filter: { _id: oid }, update: { $inc: { viewCount: count } } } };
    })
    .filter((op): op is NonNullable<typeof op> => op !== null);

  if (!ops.length) return 0;
  // ordered:false — một op hỏng không chặn các op còn lại.
  const res = await col.bulkWrite(ops, { ordered: false });
  return res.modifiedCount;
}

export async function incrementInquiryCount(propertyId: string): Promise<void> {
  const oid = toObjectId(propertyId);
  if (!oid) return;
  const col = await propertiesCol();
  await col.updateOne({ _id: oid }, { $inc: { inquiryCount: 1 } });
}

/** Thống kê cho trang tổng quan admin — gộp trong MỘT vòng đi mạng. */
export async function getPropertyStats(): Promise<{
  total: number;
  published: number;
  draft: number;
  archived: number;
  forSale: number;
  forRent: number;
  totalViews: number;
}> {
  const col = await propertiesCol();
  const [row] = await col
    .aggregate<{
      total: number;
      published: number;
      draft: number;
      archived: number;
      forSale: number;
      forRent: number;
      totalViews: number;
    }>([
      { $match: { deletedAt: null } },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          published: { $sum: { $cond: [{ $eq: ['$publishState', 'published'] }, 1, 0] } },
          draft: { $sum: { $cond: [{ $eq: ['$publishState', 'draft'] }, 1, 0] } },
          archived: { $sum: { $cond: [{ $eq: ['$publishState', 'archived'] }, 1, 0] } },
          forSale: { $sum: { $cond: [{ $eq: ['$deal', 'sale'] }, 1, 0] } },
          forRent: { $sum: { $cond: [{ $eq: ['$deal', 'rent'] }, 1, 0] } },
          totalViews: { $sum: '$viewCount' },
        },
      },
      { $project: { _id: 0 } },
    ])
    .toArray();

  return row ?? { total: 0, published: 0, draft: 0, archived: 0, forSale: 0, forRent: 0, totalViews: 0 };
}

export type { PropertyCreateInput, PropertyUpdateInput };

/**
 * Đếm số bất động sản đang dùng từng tiện ích.
 *
 * Dùng cho màn quản lý tiện ích: xoá một tiện ích đang được gắn thì nó biến
 * mất khỏi mọi tin, nên phải nói rõ con số trước khi hỏi xác nhận.
 *
 * Một lượt `$unwind` + `$group` cho tất cả, thay vì `countDocuments` cho từng
 * tiện ích — hai chục tiện ích là hai chục vòng đi Atlas.
 */
export async function countPropertiesByAmenity(): Promise<Map<string, number>> {
  const col = await propertiesCol();

  const rows = await col
    .aggregate<{ _id: ObjectId; count: number }>([
      { $match: { deletedAt: null } },
      { $unwind: '$amenityIds' },
      { $group: { _id: '$amenityIds', count: { $sum: 1 } } },
    ])
    .toArray();

  return new Map(rows.map((r) => [r._id.toHexString(), r.count]));
}
