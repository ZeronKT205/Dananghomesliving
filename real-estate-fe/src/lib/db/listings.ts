import 'server-only';

import { getTranslations } from 'next-intl/server';

import { DEFAULT_LOCALE, pickLocale, type Locale } from '@/config/locales';
import type { Listing } from '@/types';

import { getAmenitiesByIds, listCategories } from './repositories/catalog-repo';
import { getMediaByIds } from './repositories/media-repo';
import {
  findSimilarProperties,
  getPublishedPropertyBySlug,
  listProperties,
} from './repositories/property-repo';

import type { PropertyDoc } from './collections';

function normalizeVi(str: string): string {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D');
}

function localizeLocationStr(str: string, locale: Locale): string {
  if (!str) return str;
  return locale === 'en' ? normalizeVi(str) : str;
}

/* ── MAPPING ───────────────────────────────────────────── */

/**
 * Nguồn bất động sản cho các trang PUBLIC.
 *
 * Trước đây file này là một mảng viết tay. Giờ đọc thẳng từ Mongo nhưng GIỮ
 * NGUYÊN chữ ký `getAllListings()` / `getListingsByType()` / `getListingBySlug()`
 * và kiểu `Listing`, nên các trang gọi nó không phải sửa gì.
 */

const PLACEHOLDER_IMAGE = '/images/listings/ocean-estate-villa.webp';

/** Bao nhiêu tin đổ về trang danh sách. Trang lọc phía client nên phải lấy đủ. */
const LIST_LIMIT = 60;

/* ── Định dạng hiển thị ────────────────────────────────── */

/**
 * Giá hiển thị. Cho thuê thì kèm hậu tố "/ tháng".
 *
 * Không dùng `Intl.NumberFormat` với style currency: nó cho ra "US$3,596,000"
 * ở một số locale, lệch hẳn với thiết kế đang dùng "$3,596,000".
 */
function formatPrice(doc: PropertyDoc): { price: string; priceNote?: string } {
  const usd = doc.price.usd;
  const price = usd > 0 ? `$${usd.toLocaleString('en-US')}` : 'Liên hệ';
  return doc.price.period === 'month' ? { price, priceNote: '/ month' } : { price };
}

function formatArea(doc: PropertyDoc): string {
  const m2 = doc.specs.internalArea || doc.specs.landArea || doc.specs.buildingArea || 0;
  return m2 > 0 ? `${m2.toLocaleString('en-US')} m²` : '—';
}

/**
 * Nhãn góc thẻ tin. Ưu tiên nhãn tự nhập, không có thì suy ra từ trạng thái.
 *
 * Luôn phải có nhãn: thẻ tin trong thiết kế chừa sẵn chỗ cho nó, để trống là
 * lưới bị hụt một khoảng trông như lỗi.
 */
function badgeOf(
  doc: PropertyDoc,
  locale: Locale,
  t: Awaited<ReturnType<typeof getTranslations>>,
): { badge: string; badgeTone: 'gold' | 'navy' } {
  const custom = doc.badges.map((b) => pickLocale(b, locale, '')).find(Boolean);
  if (custom) return { badge: custom, badgeTone: doc.isFeatured ? 'gold' : 'navy' };

  // Nhãn suy ra từ trạng thái phải qua file dịch — trước đây cứng tiếng Việt
  // nên trang tiếng Hàn vẫn hiện "Đang bán" giữa toàn chữ Hangul.
  if (doc.isFeatured) return { badge: t('badgeFeatured'), badgeTone: 'gold' };
  if (doc.status === 'sold') return { badge: t('badgeSold'), badgeTone: 'navy' };
  if (doc.status === 'rented') return { badge: t('badgeRented'), badgeTone: 'navy' };
  if (doc.status === 'pending') return { badge: t('badgePending'), badgeTone: 'navy' };

  return { badge: doc.deal === 'rent' ? t('badgeForRent') : t('badgeForSale'), badgeTone: 'navy' };
}

/* ── Nạp phụ trợ ───────────────────────────────────────── */

interface Lookup {
  categoryName: Map<string, string>;
  mediaUrl: Map<string, string>;
}

/**
 * Nạp tên chuyên mục và ảnh cho NHIỀU tin trong số truy vấn cố định.
 *
 * Gom tất cả id ảnh của cả trang vào một truy vấn: để từng tin tự nạp ảnh thì
 * trang 60 tin là 60 vòng đi Atlas.
 */
async function buildLookup(docs: readonly PropertyDoc[]): Promise<Lookup> {
  const mediaIds = new Set<string>();
  for (const d of docs) {
    if (d.coverId) mediaIds.add(d.coverId.toHexString());
    for (const m of d.mediaIds) mediaIds.add(m.toHexString());
  }

  const [categories, media] = await Promise.all([
    listCategories(),
    mediaIds.size ? getMediaByIds([...mediaIds]) : Promise.resolve([]),
  ]);

  return {
    categoryName: new Map(categories.map((c) => [c._id.toHexString(), pickLocale(c.name, DEFAULT_LOCALE, c.slug)])),
    mediaUrl: new Map(media.map((m) => [m._id.toHexString(), m.url])),
  };
}

function toListing(
  doc: PropertyDoc,
  locale: Locale,
  lookup: Lookup,
  t: Awaited<ReturnType<typeof getTranslations>>,
): Listing {
  const title = pickLocale(doc.title, locale, doc.slug);
  const { price, priceNote } = formatPrice(doc);
  const { badge, badgeTone } = badgeOf(doc, locale, t);

  const gallery: string[] = [];
  const seenUrls = new Set<string>();
  for (const id of [doc.coverId, ...doc.mediaIds]) {
    if (!id) continue;
    const url = lookup.mediaUrl.get(id.toHexString());
    if (url && !seenUrls.has(url)) {
      seenUrls.add(url);
      gallery.push(url);
    }
  }

  return {
    slug: doc.slug,
    title,
    location: localizeLocationStr(
      [doc.location.ward, doc.location.district].filter(Boolean).join(' · ') || doc.location.city,
      locale
    ),
    listingType: doc.deal,
    price,
    ...(priceNote ? { priceNote } : {}),
    beds: doc.specs.bedrooms,
    baths: doc.specs.bathrooms,
    area: formatArea(doc),
    badge,
    badgeTone,
    image: gallery[0] ?? PLACEHOLDER_IMAGE,
    imageAlt: title,
    propertyType: lookup.categoryName.get(doc.categoryId?.toHexString() ?? '') ?? undefined,
    areaName: doc.location.district || undefined,
    description: (Array.isArray(pickLocale(doc.description, locale, []))
      ? (pickLocale(doc.description, locale, []) as string[])
      : [pickLocale(doc.description, locale, '') as string]
    ).join('\n\n') || pickLocale(doc.summary, locale, ''),
    gallery: gallery.length ? gallery : [PLACEHOLDER_IMAGE],
  };
}

async function hydrate(docs: readonly PropertyDoc[], locale: Locale): Promise<Listing[]> {
  if (!docs.length) return [];
  const [lookup, t] = await Promise.all([
    buildLookup(docs),
    getTranslations({ locale, namespace: 'Listings' }),
  ]);
  return docs.map((d) => toListing(d, locale, lookup, t));
}

/* ── API cho trang public ──────────────────────────────── */

export async function getAllListings(locale: Locale = DEFAULT_LOCALE): Promise<Listing[]> {
  const page = await listProperties({
    page: 1,
    limit: LIST_LIMIT,
    sort: 'newest',
    includeUnpublished: false,
  });
  return hydrate(page.items, locale);
}

export async function getListingsByType(
  listingType: Listing['listingType'],
  locale: Locale = DEFAULT_LOCALE,
): Promise<Listing[]> {
  const page = await listProperties({
    page: 1,
    limit: LIST_LIMIT,
    deal: listingType,
    sort: 'newest',
    includeUnpublished: false,
  });
  return hydrate(page.items, locale);
}

export async function getListingsByCategorySlug(
  categorySlug: string,
  locale: Locale = DEFAULT_LOCALE,
  limit: number = LIST_LIMIT
): Promise<Listing[]> {
  const page = await listProperties({
    page: 1,
    limit,
    categorySlug,
    sort: 'newest',
    includeUnpublished: false,
  });
  return hydrate(page.items, locale);
}

export async function getListingBySlug(slug: string, locale: Locale = DEFAULT_LOCALE): Promise<Listing | null> {
  const doc = await getPublishedPropertyBySlug(slug);
  if (!doc) return null;
  const [listing] = await hydrate([doc], locale);
  return listing ?? null;
}

/* ── Trang chi tiết ────────────────────────────────────── */

/**
 * Dữ liệu đầy đủ cho trang chi tiết một bất động sản.
 *
 * Tách khỏi `Listing` vì trang chi tiết cần những thứ danh sách không dùng
 * (tiện ích, thông số, lân cận) — nhét hết vào `Listing` thì mọi thẻ tin ở
 * trang danh sách phải cõng theo dữ liệu không bao giờ hiển thị.
 */
export interface PropertyDetail {
  slug: string;
  title: string;
  location: { address: string; shortAddress: string };
  price: { usd: string; note?: string };
  stats: { bedrooms: number; bathrooms: number; internalArea: number; landArea: number };
  badges: string[];
  images: string[];
  description: string[];
  amenities: string[];
  keyInfo: { label: string; value: string }[];
  nearby: { time: string; place: string }[];
  listedDate: string;
  updatedDate: string;
  deal: 'sale' | 'rent';
  geo: { lat: number; lng: number } | null;
}

function formatDate(d: Date | null): string {
  return d ? d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '—';
}

export async function getPropertyDetail(
  slug: string,
  locale: Locale = DEFAULT_LOCALE,
): Promise<PropertyDetail | null> {
  const doc = await getPublishedPropertyBySlug(slug);
  if (!doc) return null;

  const [lookup, amenities] = await Promise.all([
    buildLookup([doc]),
    doc.amenityIds.length ? getAmenitiesByIds(doc.amenityIds) : Promise.resolve([]),
  ]);

  const images: string[] = [];
  const seenUrls = new Set<string>();
  for (const id of [doc.coverId, ...doc.mediaIds]) {
    if (!id) continue;
    const url = lookup.mediaUrl.get(id.toHexString());
    if (url && !seenUrls.has(url)) {
      seenUrls.add(url);
      images.push(url);
    }
  }

  const { price, priceNote } = formatPrice(doc);
  const { badge } = badgeOf(doc, locale, await getTranslations({ locale, namespace: 'Listings' }));
  const customBadges = doc.badges.map((b) => pickLocale(b, locale, '')).filter(Boolean);

  return {
    slug: doc.slug,
    title: pickLocale(doc.title, locale, doc.slug),
    location: {
      address:
        pickLocale(doc.location.address, locale, '') ||
        localizeLocationStr(
          [doc.location.ward, doc.location.district, doc.location.city].filter(Boolean).join(', '),
          locale
        ),
      shortAddress: localizeLocationStr(
        [doc.location.ward, doc.location.district].filter(Boolean).join(', ') || doc.location.city,
        locale
      ),
    },
    price: { usd: price, ...(priceNote ? { note: priceNote } : {}) },
    stats: {
      bedrooms: doc.specs.bedrooms,
      bathrooms: doc.specs.bathrooms,
      internalArea: doc.specs.internalArea,
      landArea: doc.specs.landArea ?? 0,
    },
    badges: customBadges.length ? customBadges : [badge],
    images: images.length ? images : [PLACEHOLDER_IMAGE],
    description: pickLocale(doc.description, locale, []) ?? [],
    amenities: amenities.map((a) => pickLocale(a.name, locale, a.slug)),
    keyInfo: doc.keyInfo.map((k) => ({
      label: pickLocale(k.label, locale, ''),
      value: pickLocale(k.value, locale, ''),
    })),
    nearby: doc.nearby.map((n) => ({
      time: `${n.minutes} phút`,
      place: pickLocale(n.place, locale, ''),
    })),
    listedDate: formatDate(doc.publishedAt ?? doc.createdAt),
    updatedDate: formatDate(doc.updatedAt),
    deal: doc.deal,
    geo: doc.location.geo
      ? { lng: doc.location.geo.coordinates[0], lat: doc.location.geo.coordinates[1] }
      : null,
  };
}

/** Tin tương tự cho cuối trang chi tiết. */
export async function getSimilarListings(slug: string, locale: Locale = DEFAULT_LOCALE): Promise<Listing[]> {
  const doc = await getPublishedPropertyBySlug(slug);
  if (!doc) return [];

  const similar = await findSimilarProperties(doc, 4);
  return hydrate(similar, locale);
}
