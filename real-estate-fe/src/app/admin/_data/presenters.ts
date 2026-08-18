import 'server-only';

import { pickLocale } from '@/config/locales';
import { getMediaByIds } from '@/lib/db/repositories/media-repo';
import { isOverdue } from '@/server/services/inquiry-service';

import {
  formatDateTime,
  relativeLabel,
  SERVICE_LABEL,
  type AdminInquiry,
  type AdminNews,
  type AdminProperty,
  type PropertyGroup,
} from './view-models';

import type {
  ArticleCategoryDoc,
  ArticleDoc,
  CategoryDoc,
  InquiryDoc,
  MediaDoc,
  PropertyDoc,
} from '@/lib/db/collections';

/**
 * Map document DB → kiểu mà component admin đang dùng.
 *
 * Admin luôn hiển thị tiếng Việt (layout khai `lang="vi"`), nên mọi trường dịch
 * được đều lấy qua `pickLocale(..., 'vi', ...)` — có fallback sang EN nếu biên
 * tập chưa dịch, thay vì hiện ô trống.
 */

const PLACEHOLDER_COVER = '/images/listings/ocean-estate-villa.webp';

/** Nạp ảnh bìa cho nhiều bản ghi trong MỘT truy vấn, tránh N+1. */
export async function loadCovers(
  ids: readonly (MediaDoc['_id'] | null)[],
): Promise<Map<string, string>> {
  const present = ids.filter((i): i is NonNullable<typeof i> => i !== null);
  if (!present.length) return new Map();
  const docs = await getMediaByIds(present);
  return new Map(docs.map((d) => [d._id.toHexString(), d.url]));
}

export function toAdminProperty(
  doc: PropertyDoc,
  coverUrl: string | undefined,
): AdminProperty {
  return {
    id: doc._id.toHexString(),
    slug: doc.slug,
    title: pickLocale(doc.title, 'vi', doc.slug),
    summary: pickLocale(doc.summary, 'vi', ''),
    district: doc.location.district || '—',
    priceUsd: doc.price.usd,
    perMonth: doc.price.period === 'month',
    groupId: doc.categoryId.toHexString(),
    deal: doc.deal,
    state: doc.publishState,
    cover: coverUrl ?? PLACEHOLDER_COVER,
    imageCount: doc.mediaIds.length,
    beds: doc.specs.bedrooms,
    baths: doc.specs.bathrooms,
    area: doc.specs.internalArea,
    views: doc.viewCount,
    updatedLabel: relativeLabel(doc.updatedAt),
  };
}

export async function toAdminProperties(docs: readonly PropertyDoc[]): Promise<AdminProperty[]> {
  const covers = await loadCovers(docs.map((d) => d.coverId));
  return docs.map((d) => toAdminProperty(d, d.coverId ? covers.get(d.coverId.toHexString()) : undefined));
}

export function toPropertyGroup(doc: CategoryDoc, count: number): PropertyGroup {
  return {
    id: doc._id.toHexString(),
    slug: doc.slug,
    name: pickLocale(doc.name, 'vi', doc.slug),
    nameEn: pickLocale(doc.name, 'en', doc.slug),
    onHome: doc.showOnHome,
    order: doc.order,
    count,
  };
}

export function toAdminInquiry(
  doc: InquiryDoc,
  property?: { slug: string; title: string; cover: string; district: string; groupName: string; priceUsd: number; perMonth: boolean },
): AdminInquiry {
  return {
    id: doc._id.toHexString(),
    code: doc.code,
    name: doc.name,
    email: doc.email,
    phone: doc.phone ?? '',
    service: doc.service ? (SERVICE_LABEL[doc.service] ?? doc.service) : '—',
    message: doc.message,
    propertyId: doc.propertyId?.toHexString(),
    propertyTitle: doc.propertySnapshot?.title,
    property,
    locale: doc.locale.toUpperCase(),
    status: doc.status,
    receivedLabel: relativeLabel(doc.createdAt),
    receivedAt: formatDateTime(doc.createdAt),
    // Tính tại chỗ, KHÔNG lưu trong DB — cờ tính được mà lưu lại là chuốc dữ
    // liệu lệch khi không có job cập nhật.
    overdue: isOverdue(doc),
  };
}

export async function toAdminInquiries(
  docs: readonly InquiryDoc[],
  properties: readonly PropertyDoc[],
  categories: readonly CategoryDoc[],
): Promise<AdminInquiry[]> {
  const covers = await loadCovers(properties.map((p) => p.coverId));
  const catName = new Map(categories.map((c) => [c._id.toHexString(), pickLocale(c.name, 'vi', c.slug)]));

  const propById = new Map(
    properties.map((p) => [
      p._id.toHexString(),
      {
        slug: p.slug,
        title: pickLocale(p.title, 'vi', p.slug),
        cover: (p.coverId ? covers.get(p.coverId.toHexString()) : undefined) ?? PLACEHOLDER_COVER,
        district: p.location.district || '—',
        groupName: catName.get(p.categoryId.toHexString()) ?? '—',
        priceUsd: p.price.usd,
        perMonth: p.price.period === 'month',
      },
    ]),
  );

  return docs.map((d) => toAdminInquiry(d, d.propertyId ? propById.get(d.propertyId.toHexString()) : undefined));
}

export function toAdminNews(
  doc: ArticleDoc,
  categoryName: string,
  coverUrl: string | undefined,
): AdminNews {
  return {
    id: doc._id.toHexString(),
    slug: doc.slug,
    title: pickLocale(doc.title, 'vi', doc.slug),
    summary: pickLocale(doc.excerpt, 'vi', ''),
    category: categoryName,
    author: doc.author.name,
    state: doc.publishState,
    cover: coverUrl ?? PLACEHOLDER_COVER,
    views: doc.viewCount,
    updatedLabel: relativeLabel(doc.updatedAt),
  };
}

export async function toAdminNewsList(
  docs: readonly ArticleDoc[],
  categories: readonly ArticleCategoryDoc[],
): Promise<AdminNews[]> {
  const covers = await loadCovers(docs.map((d) => d.coverId));
  const catName = new Map(categories.map((c) => [c._id.toHexString(), pickLocale(c.name, 'vi', c.slug)]));

  return docs.map((d) =>
    toAdminNews(
      d,
      catName.get(d.categoryId?.toHexString() ?? '') ?? '—',
      d.coverId ? covers.get(d.coverId.toHexString()) : undefined,
    ),
  );
}
