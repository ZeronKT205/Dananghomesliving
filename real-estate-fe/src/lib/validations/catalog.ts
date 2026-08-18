import { z } from 'zod';

import { zLocalized, zLocalizedRequired, zObjectId, zSlug } from './common';

/** Danh mục BĐS — thay cho 3 danh sách hardcode rời rạc trước đây. */
export const zCategoryCreate = z.object({
  slug: zSlug.optional(),
  name: zLocalizedRequired(z.string().max(120)),
  description: zLocalized(z.string().max(500)).nullable().default(null),
  /** Hợp đồng: đúng 3 nhóm được lên trang chủ. Service sẽ kiểm tra ràng buộc này. */
  showOnHome: z.boolean().default(false),
  order: z.number().int().min(0).default(0),
  coverId: zObjectId.nullable().default(null),
});

export const zCategoryUpdate = zCategoryCreate.partial();

export const AMENITY_GROUPS = ['indoor', 'outdoor', 'security', 'service'] as const;

export const zAmenityCreate = z.object({
  slug: zSlug.optional(),
  name: zLocalizedRequired(z.string().max(120)),
  /** Tên icon (vd 'pool'), KHÔNG phải chuỗi path SVG. */
  icon: z.string().max(60).default('dot'),
  group: z.enum(AMENITY_GROUPS).default('indoor'),
  order: z.number().int().min(0).default(0),
});

export const zAmenityUpdate = zAmenityCreate.partial();

export type CategoryCreateInput = z.infer<typeof zCategoryCreate>;
export type AmenityCreateInput = z.infer<typeof zAmenityCreate>;
