import 'server-only';

import { ObjectId } from 'mongodb';

import { pickLocale } from '@/config/locales';
import type { Locale } from '@/config/locales';
import { ApiError } from '@/lib/api/http';
import type { PropertyDoc } from '@/lib/db/collections';
import { getAmenitiesByIds, getCategoryById } from '@/lib/db/repositories/catalog-repo';
import { getMediaByIds } from '@/lib/db/repositories/media-repo';
import {
  countProperties,
  createProperty,
  deleteProperty,
  findNearbyProperties,
  findSimilarProperties,
  getPropertiesByIds,
  getPropertyById,
  getPropertyBySlug,
  getPropertyStats,
  getPublishedPropertyBySlug,
  listProperties,
  restoreProperty,
  updateProperty,
} from '@/lib/db/repositories/property-repo';
import { slugify } from '@/lib/validations/common';
import type { PropertyCreateInput, PropertyNearbyQuery, PropertyQuery, PropertyUpdateInput } from '@/lib/validations/property';

/* ── Tỷ giá USD → VND ─────────────────────────────────── */

/**
 * Quy đổi VND từ USD. Một nguồn sự thật là USD; VND chỉ để hiển thị.
 * Nhập tay cả hai (như form cũ) thì hai số lệch nhau ngay lần đổi tỷ giá đầu.
 * Đặt ở đây để sau này thay bằng tỷ giá lấy từ API mà không đụng chỗ khác.
 */
export const USD_TO_VND = Number(process.env.USD_TO_VND ?? 25_400);

export function usdToVnd(usd: number): number {
  // Làm tròn tới triệu — giá BĐS không ai ghi lẻ tới đồng.
  return Math.round((usd * USD_TO_VND) / 1_000_000) * 1_000_000;
}

/* ── Chuyển input form → document ─────────────────────── */

function oid(v: string | null | undefined): ObjectId | null {
  return v && ObjectId.isValid(v) ? new ObjectId(v) : null;
}

function requireOid(v: string, field: string): ObjectId {
  if (!ObjectId.isValid(v)) throw new ApiError('VALIDATION', `${field} không hợp lệ`);
  return new ObjectId(v);
}

async function toDoc(input: PropertyCreateInput, existing?: PropertyDoc) {
  const category = await getCategoryById(input.categoryId);
  if (!category) throw new ApiError('VALIDATION', 'Danh mục không tồn tại', { categoryId: ['Danh mục không tồn tại'] });

  const titleForSlug = pickLocale(input.title, 'vi', '') || pickLocale(input.title, 'en', '') || 'bat-dong-san';

  return {
    slug: input.slug ?? existing?.slug ?? slugify(titleForSlug),

    title: input.title,
    summary: input.summary,
    description: input.description,

    deal: input.deal,
    categoryId: category._id,
    status: input.status,

    price: {
      usd: input.price.usd,
      // VND tự tính nếu không nhập. Nhập tay thì tôn trọng số người dùng nhập.
      vnd: input.price.vnd ?? usdToVnd(input.price.usd),
      period: input.price.period,
      negotiable: input.price.negotiable,
    },

    specs: input.specs,
    location: {
      ...input.location,
      geo: input.location.geo ? { type: 'Point' as const, coordinates: input.location.geo.coordinates } : null,
    },

    amenityIds: input.amenityIds.map((a) => requireOid(a, 'amenityId')),
    keyInfo: input.keyInfo,
    nearby: input.nearby,

    coverId: oid(input.coverId),
    mediaIds: input.mediaIds.map((m) => requireOid(m, 'mediaId')),

    isFeatured: input.isFeatured,
    isVerified: input.isVerified,
    badges: input.badges,

    seo: { ...input.seo, ogImageId: oid(input.seo.ogImageId) },

    publishState: input.publishState,
    isPublic: input.isPublic,
    // Chỉ đóng dấu publishedAt LẦN ĐẦU xuất bản. Ghi đè mỗi lần lưu sẽ làm
    // danh sách "mới nhất" xáo tung mỗi khi biên tập sửa chính tả.
    publishedAt:
      input.publishState === 'published'
        ? (existing?.publishedAt ?? new Date())
        : (existing?.publishedAt ?? null),

    viewCount: existing?.viewCount ?? 0,
    inquiryCount: existing?.inquiryCount ?? 0,
  };
}

/* ── Ghi ──────────────────────────────────────────────── */

export async function createPropertyFromInput(input: PropertyCreateInput, actorId: string) {
  return createProperty(await toDoc(input), actorId);
}

export async function updatePropertyFromInput(id: string, input: PropertyUpdateInput, actorId: string) {
  const existing = await getPropertyById(id);
  if (!existing) throw new ApiError('NOT_FOUND', 'Không tìm thấy bất động sản');

  // Trộn patch lên bản hiện có rồi mới chuyển đổi — nếu không, các trường
  // không gửi lên sẽ bị ghi đè bằng default của Zod.
  const merged = {
    ...existing,
    ...input,
    categoryId: input.categoryId ?? existing.categoryId.toHexString(),
    price: { ...existing.price, ...input.price },
    specs: { ...existing.specs, ...input.specs },
    location: { ...existing.location, ...input.location },
    seo: {
      ...existing.seo,
      ...input.seo,
      ogImageId: input.seo?.ogImageId ?? existing.seo.ogImageId?.toHexString() ?? null,
    },
    amenityIds: input.amenityIds ?? existing.amenityIds.map((a) => a.toHexString()),
    mediaIds: input.mediaIds ?? existing.mediaIds.map((m) => m.toHexString()),
    coverId: input.coverId ?? existing.coverId?.toHexString() ?? null,
  } as unknown as PropertyCreateInput;

  return updateProperty(id, await toDoc(merged, existing), actorId);
}

export async function removeProperty(id: string, actorId: string) {
  const okDelete = await deleteProperty(id, actorId);
  if (!okDelete) throw new ApiError('NOT_FOUND', 'Không tìm thấy bất động sản');
}

export async function undoRemoveProperty(id: string, actorId: string) {
  return restoreProperty(id, actorId);
}

/** Đổi nhanh trạng thái xuất bản từ danh sách, không cần mở form. */
export async function setPublishState(
  id: string,
  publishState: PropertyDoc['publishState'],
  actorId: string,
) {
  const existing = await getPropertyById(id);
  if (!existing) throw new ApiError('NOT_FOUND', 'Không tìm thấy bất động sản');

  return updateProperty(
    id,
    {
      publishState,
      isPublic: publishState === 'published',
      publishedAt: publishState === 'published' ? (existing.publishedAt ?? new Date()) : existing.publishedAt,
    },
    actorId,
  );
}

/* ── Đọc ──────────────────────────────────────────────── */

export async function getPropertiesForAdmin(query: PropertyQuery) {
  return listProperties({ ...query, includeUnpublished: true });
}

export async function getPropertiesForPublic(query: PropertyQuery) {
  // Ép tắt cờ admin — nếu không, thêm ?includeUnpublished=true vào URL là xem
  // được toàn bộ bản nháp.
  return listProperties({ ...query, includeUnpublished: false, publishState: undefined });
}

export async function getPropertyDetailForPublic(slug: string, locale: Locale) {
  const property = await getPublishedPropertyBySlug(slug);
  if (!property) return null;
  return hydrateProperty(property, locale);
}

export async function getPropertyForAdmin(id: string) {
  const property = await getPropertyById(id);
  if (!property) throw new ApiError('NOT_FOUND', 'Không tìm thấy bất động sản');
  return property;
}

export async function getPropertyBySlugAny(slug: string) {
  return getPropertyBySlug(slug);
}

/**
 * Nạp đủ dữ liệu liên quan cho trang chi tiết trong SỐ TRUY VẤN CỐ ĐỊNH.
 * Gọi lần lượt từng ảnh/tiện ích sẽ thành N+1 — trang có 20 ảnh là 20 vòng
 * đi mạng tới Atlas.
 */
export async function hydrateProperty(property: PropertyDoc, locale: Locale) {
  const [category, amenities, media, cover, similar] = await Promise.all([
    getCategoryById(property.categoryId.toHexString()),
    getAmenitiesByIds(property.amenityIds),
    getMediaByIds(property.mediaIds),
    property.coverId ? getMediaByIds([property.coverId]).then((r) => r[0] ?? null) : Promise.resolve(null),
    findSimilarProperties(property, 4),
  ]);

  return { property, category, amenities, media, cover, similar, locale };
}

export async function getSimilar(propertyId: string, limit = 4) {
  const property = await getPropertyById(propertyId);
  if (!property) return [];
  return findSimilarProperties(property, limit);
}

export async function getNearby(query: PropertyNearbyQuery) {
  return findNearbyProperties(query);
}

export async function getPropertiesByIdList(ids: readonly string[]) {
  return getPropertiesByIds(ids);
}

export async function getDashboardStats() {
  return getPropertyStats();
}

export async function countAll() {
  return countProperties();
}
