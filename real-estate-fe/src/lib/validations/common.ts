import { z } from 'zod';

import { LOCALES } from '@/config/locales';

/**
 * Zod dùng chung. File này KHÔNG import `mongodb` — schema validation phải chạy
 * được cả ở Client Component (validate form phía trình duyệt). ObjectId vì thế
 * biểu diễn bằng chuỗi 24 hex; repository mới là chỗ đổi sang ObjectId thật.
 */

export const zObjectId = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, 'ObjectId không hợp lệ');

export const zSlug = z
  .string()
  .min(1)
  .max(120)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug chỉ gồm chữ thường, số và dấu gạch ngang');

export const zLocaleCode = z.enum(LOCALES);

/**
 * Trường dịch được: mọi locale đều optional, chờ biên tập điền dần.
 * Bản thân object cũng có default `{}` — nếu không, mọi schema cha chứa nó sẽ
 * không `.default({})` được vì trường này bị coi là bắt buộc.
 */
export function zLocalized<T extends z.ZodTypeAny>(inner: T) {
  const shape = z.object({
    en: inner.optional(),
    vi: inner.optional(),
    zh: inner.optional(),
    ko: inner.optional(),
  });
  // Cast qua z.input: với generic T chưa resolve, TS không tự xác nhận được
  // `{}` khớp kiểu input dù mọi khoá đều optional.
  return shape.default({} as z.input<typeof shape>);
}

/**
 * Trường dịch được nhưng BẮT BUỘC có ít nhất một ngôn ngữ.
 * Dùng cho title/name — một bản ghi không có tên ở bất kỳ ngôn ngữ nào là rác.
 */
export function zLocalizedRequired<T extends z.ZodTypeAny>(inner: T) {
  return zLocalized(inner).refine(
    (v) => LOCALES.some((l) => {
      const val = (v as Record<string, unknown>)[l];
      return val !== undefined && val !== null && val !== '';
    }),
    { message: 'Phải điền ít nhất một ngôn ngữ' },
  );
}

/** Phân trang. `limit` chặn trần 100 để một request không kéo sập DB. */
export const zPagination = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(12),
});

export type Pagination = z.infer<typeof zPagination>;

export const zSortOrder = z.enum(['asc', 'desc']).default('desc');

/** Kết quả phân trang trả về cho client. */
export type Paginated<T> = {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
};

export const PUBLISH_STATES = ['draft', 'published', 'archived'] as const;
export const zPublishState = z.enum(PUBLISH_STATES);
export type PublishState = (typeof PUBLISH_STATES)[number];

/**
 * Chuẩn hoá chuỗi bất kỳ thành slug. Xử lý được tiếng Việt có dấu:
 * "Biệt thự Ocean Estate" → "biet-thu-ocean-estate".
 */
export function slugify(input: string): string {
  return input
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // bỏ dấu thanh (combining diacritics)
    .replace(/[đ]/g, 'd') // đ — không tách được bằng NFD
    .replace(/[Đ]/g, 'D') // Đ
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/[\s-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 120);
}
