import { z } from 'zod';

import {
  zLocalized,
  zLocalizedRequired,
  zObjectId,
  zPagination,
  zPublishState,
  zSlug,
} from './common';

export const DEAL_TYPES = ['sale', 'rent'] as const;
export const PROPERTY_STATUSES = ['available', 'pending', 'sold', 'rented'] as const;
export const FURNISHINGS = ['full', 'basic', 'none'] as const;
export const OWNERSHIPS = ['freehold', 'leasehold'] as const;

export const zDealType = z.enum(DEAL_TYPES);
export const zPropertyStatus = z.enum(PROPERTY_STATUSES);

/* ── Khối con ─────────────────────────────────────────── */

export const zPrice = z.object({
  // Số gốc. KHÔNG nhận chuỗi đã format kiểu "$3,596,000" — không lọc theo
  // khoảng được, và mỗi nơi lại format một kiểu.
  usd: z.number().nonnegative().max(1_000_000_000),
  vnd: z.number().nonnegative().nullable().default(null),
  period: z.enum(['total', 'month']).default('total'),
  negotiable: z.boolean().default(false),
});

export const zSpecs = z.object({
  bedrooms: z.number().int().min(0).max(100).default(0),
  bathrooms: z.number().int().min(0).max(100).default(0),
  internalArea: z.number().nonnegative().max(100_000).default(0),
  landArea: z.number().nonnegative().max(1_000_000).nullable().default(null),
  buildingArea: z.number().nonnegative().max(1_000_000).nullable().default(null),
  floors: z.number().int().min(0).max(200).nullable().default(null),
  yearBuilt: z
    .number()
    .int()
    .min(1900)
    .max(new Date().getFullYear() + 10)
    .nullable()
    .default(null),
  parking: z.number().int().min(0).max(100).nullable().default(null),
  furnishing: z.enum(FURNISHINGS).default('none'),
  ownership: z.enum(OWNERSHIPS).default('freehold'),
});

export const zGeoPoint = z.object({
  type: z.literal('Point').default('Point'),
  // GeoJSON quy định [kinh độ, vĩ độ] — NGƯỢC với thói quen đọc "lat, lng".
  // Đảo thứ tự thì $near trả kết quả ở giữa Ấn Độ Dương mà không báo lỗi.
  coordinates: z.tuple([
    z.number().min(-180).max(180), // lng
    z.number().min(-90).max(90), // lat
  ]),
});

export const zLocation = z.object({
  address: zLocalized(z.string().max(300)),
  ward: z.string().max(120).default(''),
  district: z.string().max(120).default(''),
  city: z.string().max(120).default('Đà Nẵng'),
  geo: zGeoPoint.nullable().default(null),
});

export const zSeo = z.object({
  title: zLocalized(z.string().max(70)),
  description: zLocalized(z.string().max(180)),
  focusKeyword: zLocalized(z.string().max(120)),
  ogImageId: zObjectId.nullable().default(null),
});

/* ── Tạo / cập nhật ───────────────────────────────────── */

export const zPropertyCreate = z.object({
  slug: zSlug.optional(), // bỏ trống → sinh từ title

  title: zLocalizedRequired(z.string().max(200)),
  summary: zLocalized(z.string().max(400)),
  description: zLocalized(z.array(z.string().max(5000)).max(50)),

  deal: zDealType,
  categoryId: zObjectId,
  status: zPropertyStatus.default('available'),

  price: zPrice,
  specs: zSpecs.default({}),
  location: zLocation.default({}),

  amenityIds: z.array(zObjectId).max(100).default([]),
  keyInfo: z
    .array(z.object({ label: zLocalized(z.string().max(80)), value: zLocalized(z.string().max(200)) }))
    .max(30)
    .default([]),
  nearby: z
    .array(
      z.object({
        place: zLocalized(z.string().max(160)),
        // SỐ phút, không phải chuỗi "5 phút" — để dịch và sắp xếp được.
        minutes: z.number().int().min(0).max(600),
      }),
    )
    .max(30)
    .default([]),

  coverId: zObjectId.nullable().default(null),
  mediaIds: z.array(zObjectId).max(60).default([]),

  isFeatured: z.boolean().default(false),
  isVerified: z.boolean().default(false),
  badges: z.array(zLocalized(z.string().max(60))).max(6).default([]),

  seo: zSeo.default({}),

  publishState: zPublishState.default('draft'),
  isPublic: z.boolean().default(false),
});

/** Cập nhật: mọi trường optional, nhưng vẫn validate trường nào có mặt. */
export const zPropertyUpdate = zPropertyCreate.partial();

/* ── Truy vấn ─────────────────────────────────────────── */

export const PROPERTY_SORTS = [
  'newest',
  'oldest',
  'price_asc',
  'price_desc',
  'area_desc',
  'popular',
] as const;

export const zPropertyQuery = zPagination.extend({
  deal: zDealType.optional(),
  categorySlug: z.string().max(120).optional(),
  categoryId: zObjectId.optional(),
  district: z.string().max(120).optional(),
  status: zPropertyStatus.optional(),

  minPrice: z.coerce.number().nonnegative().optional(),
  maxPrice: z.coerce.number().nonnegative().optional(),
  minBeds: z.coerce.number().int().min(0).optional(),
  minBaths: z.coerce.number().int().min(0).optional(),
  minArea: z.coerce.number().nonnegative().optional(),
  maxArea: z.coerce.number().nonnegative().optional(),

  amenitySlugs: z
    .union([z.string(), z.array(z.string())])
    .optional()
    .transform((v) => (v === undefined ? undefined : Array.isArray(v) ? v : v.split(',').filter(Boolean))),

  featured: z
    .union([z.boolean(), z.string()])
    .optional()
    .transform((v) => (v === undefined ? undefined : v === true || v === 'true')),

  q: z.string().max(200).optional(),
  sort: z.enum(PROPERTY_SORTS).default('newest'),

  // Chỉ admin được dùng — service sẽ ép về undefined cho request public.
  publishState: zPublishState.optional(),
  includeUnpublished: z
    .union([z.boolean(), z.string()])
    .optional()
    .transform((v) => v === true || v === 'true'),
})
  .refine((v) => v.minPrice === undefined || v.maxPrice === undefined || v.minPrice <= v.maxPrice, {
    message: 'minPrice phải nhỏ hơn hoặc bằng maxPrice',
    path: ['minPrice'],
  })
  .refine((v) => v.minArea === undefined || v.maxArea === undefined || v.minArea <= v.maxArea, {
    message: 'minArea phải nhỏ hơn hoặc bằng maxArea',
    path: ['minArea'],
  });

/** Tìm BĐS quanh một toạ độ. */
export const zPropertyNearbyQuery = z.object({
  lng: z.coerce.number().min(-180).max(180),
  lat: z.coerce.number().min(-90).max(90),
  radiusKm: z.coerce.number().min(0.1).max(100).default(5),
  limit: z.coerce.number().int().min(1).max(50).default(8),
  excludeId: zObjectId.optional(),
});

export type PropertyCreateInput = z.infer<typeof zPropertyCreate>;
export type PropertyUpdateInput = z.infer<typeof zPropertyUpdate>;
export type PropertyQuery = z.infer<typeof zPropertyQuery>;
export type PropertyNearbyQuery = z.infer<typeof zPropertyNearbyQuery>;
