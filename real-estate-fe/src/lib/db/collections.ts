import 'server-only';

import { getDb } from './client';

import type { Locale } from '@/config/locales';
import type { PublishState } from '@/lib/validations/common';

// Re-export để nơi khác chỉ cần import từ một chỗ, khỏi phải nhớ PublishState
// nằm ở validations còn các kiểu document nằm ở đây.
export type { PublishState };
import type { Collection, ObjectId } from 'mongodb';

/**
 * Kiểu document ở TẦNG DB (đã là ObjectId, Date thật) và điểm truy cập
 * collection duy nhất. Không gọi `db.collection('...')` bằng chuỗi rải rác
 * trong code — gõ sai tên collection thì Mongo im lặng tạo collection mới rỗng
 * chứ không báo lỗi, loại bug đó rất tốn thời gian truy.
 */

export const COLLECTIONS = {
  properties: 'properties',
  categories: 'categories',
  amenities: 'amenities',
  articles: 'articles',
  articleCategories: 'articleCategories',
  inquiries: 'inquiries',
  media: 'media',
  users: 'users',
  sessions: 'sessions',
  redirects: 'redirects',
} as const;

/** Trường dịch được ở tầng DB. */
export type Localized<T = string> = Partial<Record<Locale, T>>;

/** Trường chung cho MỌI document. `deletedAt` là trụ cột của xoá mềm. */
export interface BaseDoc {
  _id: ObjectId;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  createdBy: ObjectId | null;
  updatedBy: ObjectId | null;
}

/* ─────────────── properties ─────────────── */

export type DealType = 'sale' | 'rent';
export type PropertyStatus = 'available' | 'pending' | 'sold' | 'rented';
export type Furnishing = 'full' | 'basic' | 'none';
export type Ownership = 'freehold' | 'leasehold';

export interface PropertyDoc extends BaseDoc {
  slug: string;

  title: Localized;
  summary: Localized;
  description: Localized<string[]>;

  deal: DealType;
  categoryId: ObjectId;
  status: PropertyStatus;

  price: {
    usd: number;
    vnd: number | null;
    period: 'total' | 'month';
    negotiable: boolean;
  };

  specs: {
    bedrooms: number;
    bathrooms: number;
    internalArea: number;
    landArea: number | null;
    buildingArea: number | null;
    floors: number | null;
    yearBuilt: number | null;
    parking: number | null;
    furnishing: Furnishing;
    ownership: Ownership;
  };

  location: {
    address: Localized;
    ward: string;
    district: string;
    city: string;
    /** GeoJSON — coordinates LUÔN là [lng, lat], ngược thói quen đọc. */
    geo: { type: 'Point'; coordinates: [number, number] } | null;
  };

  amenityIds: ObjectId[];
  keyInfo: Array<{ label: Localized; value: Localized }>;
  nearby: Array<{ place: Localized; minutes: number }>;

  coverId: ObjectId | null;
  mediaIds: ObjectId[];

  isFeatured: boolean;
  isVerified: boolean;
  badges: Localized[];

  seo: {
    title: Localized;
    description: Localized;
    focusKeyword: Localized;
    ogImageId: ObjectId | null;
  };

  publishState: PublishState;
  isPublic: boolean;
  publishedAt: Date | null;

  viewCount: number;
  inquiryCount: number;
}

/* ─────────────── categories ─────────────── */

export interface CategoryDoc extends BaseDoc {
  slug: string;
  name: Localized;
  description: Localized | null;
  showOnHome: boolean;
  order: number;
  coverId: ObjectId | null;
  propertyCount: number;
}

/* ─────────────── amenities ─────────────── */

export type AmenityGroup = 'indoor' | 'outdoor' | 'security' | 'service';

export interface AmenityDoc extends BaseDoc {
  slug: string;
  name: Localized;
  /** Tên icon, KHÔNG phải chuỗi path SVG — path là tài sản giao diện. */
  icon: string;
  group: AmenityGroup;
  order: number;
}

/* ─────────────── articles ─────────────── */

export interface ArticleDoc extends BaseDoc {
  slug: string;
  title: Localized;
  excerpt: Localized;
  content: Localized;
  categoryId: ObjectId;
  tags: string[];
  coverId: ObjectId | null;
  author: {
    name: string;
    role: string | null;
    avatarId: ObjectId | null;
  };
  readingMinutes: number;
  isFeatured: boolean;
  publishState: PublishState;
  publishedAt: Date | null;
  viewCount: number;
  seo: {
    title: Localized;
    description: Localized;
    ogImageId: ObjectId | null;
  };
}

export interface ArticleCategoryDoc extends BaseDoc {
  slug: string;
  name: Localized;
  order: number;
  articleCount: number;
}

/* ─────────────── inquiries ─────────────── */

export type InquiryStatus = 'new' | 'contacted' | 'done' | 'cancelled';
export type InquirySource = 'quote_form' | 'property_form';
export type InquiryService = 'buy' | 'rent' | 'invest' | 'valuation' | 'other';

export interface InquiryDoc extends BaseDoc {
  code: string;
  source: InquirySource;

  name: string;
  email: string;
  phone: string | null;
  locale: Locale;

  service: InquiryService | null;
  message: string;
  preferredViewingDate: Date | null;

  propertyId: ObjectId | null;
  /** Chụp lại lúc gửi — BĐS có thể đổi tên hoặc bị xoá sau đó. */
  propertySnapshot: { slug: string; title: string } | null;

  status: InquiryStatus;
  assignedTo: ObjectId | null;
  notes: Array<{ by: ObjectId; at: Date; text: string }>;
  respondedAt: Date | null;

  /** BĂM, không lưu IP thô — đủ để chặn spam mà không giữ dữ liệu cá nhân. */
  ipHash: string | null;
  userAgent: string | null;
  utm: Record<string, string> | null;
}

/* ─────────────── media ─────────────── */

export interface MediaDoc extends BaseDoc {
  key: string;
  url: string;
  mimeType: string;
  size: number;
  width: number | null;
  height: number | null;
  alt: Localized;
  blurDataUrl: string | null;
  ownerType: 'property' | 'article' | 'category' | 'site' | null;
  ownerId: ObjectId | null;
}

/* ─────────────── users ─────────────── */

export type UserRole = 'admin' | 'editor' | 'viewer';

export interface UserDoc extends BaseDoc {
  email: string;
  passwordHash: string;
  name: string;
  role: UserRole;
  avatarId: ObjectId | null;
  isActive: boolean;
  lastLoginAt: Date | null;
  failedLoginCount: number;
  lockedUntil: Date | null;
}

/* ─────────────── sessions ─────────────── */

/**
 * Refresh token nằm ở collection RIÊNG, không nhúng mảng vào `users`.
 *
 * Lý do bắt buộc: TTL index của MongoDB xoá NGUYÊN DOCUMENT. Nếu nhúng mảng
 * `refreshTokens` vào user rồi đặt TTL lên `refreshTokens.expiresAt`, thì token
 * hết hạn sẽ xoá luôn TÀI KHOẢN. Tách ra thì TTL xoá đúng phiên.
 *
 * Lợi ích kèm theo: document user không phình vô hạn, và liệt kê được
 * "các thiết bị đang đăng nhập" để thu hồi từng phiên.
 */
export interface SessionDoc {
  _id: ObjectId;
  userId: ObjectId;
  /** BĂM sha256, không lưu token thô. Lộ DB không đồng nghĩa lộ phiên. */
  tokenHash: string;
  expiresAt: Date;
  userAgent: string | null;
  ipHash: string | null;
  createdAt: Date;
  lastUsedAt: Date;
  revokedAt: Date | null;
}

/* ─────────────── redirects ─────────────── */

export interface RedirectDoc extends BaseDoc {
  from: string;
  to: string;
  statusCode: 301 | 302;
  hits: number;
}

/* ─────────────── accessors ─────────────── */

export async function propertiesCol(): Promise<Collection<PropertyDoc>> {
  return (await getDb()).collection<PropertyDoc>(COLLECTIONS.properties);
}
export async function categoriesCol(): Promise<Collection<CategoryDoc>> {
  return (await getDb()).collection<CategoryDoc>(COLLECTIONS.categories);
}
export async function amenitiesCol(): Promise<Collection<AmenityDoc>> {
  return (await getDb()).collection<AmenityDoc>(COLLECTIONS.amenities);
}
export async function articlesCol(): Promise<Collection<ArticleDoc>> {
  return (await getDb()).collection<ArticleDoc>(COLLECTIONS.articles);
}
export async function articleCategoriesCol(): Promise<Collection<ArticleCategoryDoc>> {
  return (await getDb()).collection<ArticleCategoryDoc>(COLLECTIONS.articleCategories);
}
export async function inquiriesCol(): Promise<Collection<InquiryDoc>> {
  return (await getDb()).collection<InquiryDoc>(COLLECTIONS.inquiries);
}
export async function mediaCol(): Promise<Collection<MediaDoc>> {
  return (await getDb()).collection<MediaDoc>(COLLECTIONS.media);
}
export async function usersCol(): Promise<Collection<UserDoc>> {
  return (await getDb()).collection<UserDoc>(COLLECTIONS.users);
}
export async function sessionsCol(): Promise<Collection<SessionDoc>> {
  return (await getDb()).collection<SessionDoc>(COLLECTIONS.sessions);
}
export async function redirectsCol(): Promise<Collection<RedirectDoc>> {
  return (await getDb()).collection<RedirectDoc>(COLLECTIONS.redirects);
}
