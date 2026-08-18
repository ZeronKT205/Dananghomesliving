import { z } from 'zod';

import { zLocalized, zLocalizedRequired, zObjectId, zPagination, zPublishState, zSlug } from './common';

export const zArticleCreate = z.object({
  slug: zSlug.optional(),
  title: zLocalizedRequired(z.string().max(250)),
  excerpt: zLocalized(z.string().max(500)),
  content: zLocalized(z.string().max(200_000)), // Markdown
  categoryId: zObjectId,
  tags: z.array(z.string().max(60)).max(20).default([]),
  coverId: zObjectId.nullable().default(null),
  author: z
    .object({
      name: z.string().min(1).max(120),
      role: z.string().max(120).nullable().default(null),
      avatarId: zObjectId.nullable().default(null),
    })
    .default({ name: 'Ban biên tập' }),
  isFeatured: z.boolean().default(false),
  publishState: zPublishState.default('draft'),
  seo: z
    .object({
      title: zLocalized(z.string().max(70)),
      description: zLocalized(z.string().max(180)),
      ogImageId: zObjectId.nullable().default(null),
    })
    .default({}),
});

export const zArticleUpdate = zArticleCreate.partial();

export const ARTICLE_SORTS = ['newest', 'oldest', 'popular'] as const;

export const zArticleQuery = zPagination.extend({
  categorySlug: z.string().max(120).optional(),
  categoryId: zObjectId.optional(),
  tag: z.string().max(60).optional(),
  featured: z
    .union([z.boolean(), z.string()])
    .optional()
    .transform((v) => (v === undefined ? undefined : v === true || v === 'true')),
  q: z.string().max(200).optional(),
  sort: z.enum(ARTICLE_SORTS).default('newest'),
  publishState: zPublishState.optional(),
  includeUnpublished: z
    .union([z.boolean(), z.string()])
    .optional()
    .transform((v) => v === true || v === 'true'),
});

export const zArticleCategoryCreate = z.object({
  slug: zSlug.optional(),
  name: zLocalizedRequired(z.string().max(120)),
  order: z.number().int().min(0).default(0),
});

export const zArticleCategoryUpdate = zArticleCategoryCreate.partial();

export type ArticleCreateInput = z.infer<typeof zArticleCreate>;
export type ArticleUpdateInput = z.infer<typeof zArticleUpdate>;
export type ArticleQuery = z.infer<typeof zArticleQuery>;
export type ArticleCategoryCreateInput = z.infer<typeof zArticleCategoryCreate>;

/**
 * Ước lượng thời gian đọc. Markdown bị bóc cú pháp trước khi đếm để dấu #,
 * *, [] không bị tính thành từ. 200 từ/phút là chuẩn thường dùng cho tiếng Anh;
 * tiếng Việt nhiều âm tiết hơn nhưng từ ngắn hơn nên xấp xỉ vẫn hợp lý.
 */
export function estimateReadingMinutes(markdown: string | undefined | null): number {
  if (!markdown) return 1;
  const plain = markdown
    .replace(/```[\s\S]*?```/g, ' ') // khối code
    .replace(/`[^`]*`/g, ' ') // code inline
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, '$1') // link/ảnh, giữ phần chữ
    .replace(/[#>*_~-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  const words = plain ? plain.split(' ').length : 0;
  return Math.max(1, Math.round(words / 200));
}
