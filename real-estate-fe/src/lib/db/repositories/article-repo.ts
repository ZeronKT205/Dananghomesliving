import 'server-only';

import { ObjectId } from 'mongodb';

import { articleCategoriesCol, articlesCol } from '../collections';
import {
  alive,
  ensureUniqueSlug,
  findAliveById,
  findAliveBySlug,
  insertDoc,
  paginate,
  softDelete,
  toObjectId,
  updateDoc,
} from './base';

import type { ArticleCategoryDoc, ArticleDoc } from '../collections';
import type { ArticleQuery } from '@/lib/validations/article';
import type { Paginated } from '@/lib/validations/common';
import type { Filter, Sort } from 'mongodb';

const SORT_MAP: Record<string, Sort> = {
  newest: { publishedAt: -1, createdAt: -1 },
  oldest: { publishedAt: 1, createdAt: 1 },
  popular: { viewCount: -1, publishedAt: -1 },
};

async function buildArticleFilter(q: ArticleQuery): Promise<Filter<ArticleDoc>> {
  const filter: Filter<ArticleDoc> = {};

  if (!q.includeUnpublished) {
    filter.publishState = 'published';
  } else if (q.publishState) {
    filter.publishState = q.publishState;
  }

  if (q.categoryId) {
    const oid = toObjectId(q.categoryId);
    if (oid) filter.categoryId = oid;
  } else if (q.categorySlug) {
    const cats = await articleCategoriesCol();
    const cat = await cats.findOne(alive({ slug: q.categorySlug }), { projection: { _id: 1 } });
    filter.categoryId = cat?._id ?? new ObjectId('000000000000000000000000');
  }

  if (q.tag) filter.tags = q.tag;
  if (q.featured !== undefined) filter.isFeatured = q.featured;

  if (q.q?.trim()) {
    // articles không có text index (Mongo chỉ cho 1 text index/collection và ở
    // đây ta ưu tiên properties). Dùng regex — chấp nhận được vì số bài viết
    // nhỏ. Escape ký tự đặc biệt để người dùng không chèn được regex phá hoại.
    const safe = q.q.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const rx = { $regex: safe, $options: 'i' };
    filter.$or = [
      { 'title.vi': rx },
      { 'title.en': rx },
      { 'excerpt.vi': rx },
      { 'excerpt.en': rx },
      { tags: rx },
    ] as Filter<ArticleDoc>[];
  }

  return filter;
}

export async function listArticles(q: ArticleQuery): Promise<Paginated<ArticleDoc>> {
  const col = await articlesCol();
  const filter = await buildArticleFilter(q);
  return paginate(col, {
    filter,
    sort: SORT_MAP[q.sort] ?? SORT_MAP.newest!,
    page: q.page,
    limit: q.limit,
  });
}

export async function getArticleBySlug(slug: string): Promise<ArticleDoc | null> {
  return findAliveBySlug(await articlesCol(), slug);
}

export async function getPublishedArticleBySlug(slug: string): Promise<ArticleDoc | null> {
  const col = await articlesCol();
  return col.findOne(alive({ slug, publishState: 'published' }));
}

export async function getArticleById(id: string): Promise<ArticleDoc | null> {
  return findAliveById(await articlesCol(), id);
}

/** Bài liên quan: cùng danh mục hoặc trùng tag, loại trừ chính nó. */
export async function findRelatedArticles(article: ArticleDoc, limit = 3): Promise<ArticleDoc[]> {
  const col = await articlesCol();

  const primary = await col
    .find(
      alive({
        _id: { $ne: article._id },
        publishState: 'published',
        $or: [{ categoryId: article.categoryId }, ...(article.tags.length ? [{ tags: { $in: article.tags } }] : [])],
      }),
    )
    .sort({ publishedAt: -1 })
    .limit(limit)
    .toArray();

  if (primary.length >= limit) return primary;

  const fill = await col
    .find(alive({ _id: { $nin: [article._id, ...primary.map((a) => a._id)] }, publishState: 'published' }))
    .sort({ publishedAt: -1 })
    .limit(limit - primary.length)
    .toArray();

  return [...primary, ...fill];
}

type ArticleDocInput = Omit<ArticleDoc, '_id' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'createdBy' | 'updatedBy'>;

export async function createArticle(doc: ArticleDocInput, actorId?: string | null): Promise<ArticleDoc> {
  const col = await articlesCol();
  const slug = await ensureUniqueSlug(col, doc.slug);
  return insertDoc(col, { ...doc, slug }, actorId);
}

export async function updateArticle(
  id: string,
  patch: Partial<ArticleDocInput>,
  actorId?: string | null,
): Promise<ArticleDoc | null> {
  const col = await articlesCol();
  if (patch.slug) patch = { ...patch, slug: await ensureUniqueSlug(col, patch.slug, id) };
  return updateDoc(col, id, patch, actorId);
}

export async function deleteArticle(id: string, actorId?: string | null): Promise<boolean> {
  return softDelete(await articlesCol(), id, actorId);
}

export async function incrementArticleViews(idCounts: Map<string, number>): Promise<number> {
  if (!idCounts.size) return 0;
  const col = await articlesCol();
  const ops = [...idCounts.entries()]
    .map(([id, n]) => {
      const oid = toObjectId(id);
      return oid ? { updateOne: { filter: { _id: oid }, update: { $inc: { viewCount: n } } } } : null;
    })
    .filter((o): o is NonNullable<typeof o> => o !== null);
  if (!ops.length) return 0;
  const res = await col.bulkWrite(ops, { ordered: false });
  return res.modifiedCount;
}

/* ── Danh mục bài viết ────────────────────────────────── */

export async function listArticleCategories(): Promise<ArticleCategoryDoc[]> {
  const col = await articleCategoriesCol();
  return col.find(alive()).sort({ order: 1 }).toArray();
}

export async function getArticleCategoryBySlug(slug: string): Promise<ArticleCategoryDoc | null> {
  return findAliveBySlug(await articleCategoriesCol(), slug);
}

type ArticleCategoryInput = Omit<
  ArticleCategoryDoc,
  '_id' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'createdBy' | 'updatedBy'
>;

export async function createArticleCategory(
  doc: ArticleCategoryInput,
  actorId?: string | null,
): Promise<ArticleCategoryDoc> {
  const col = await articleCategoriesCol();
  const slug = await ensureUniqueSlug(col, doc.slug);
  return insertDoc(col, { ...doc, slug }, actorId);
}

export async function updateArticleCategory(
  id: string,
  patch: Partial<ArticleCategoryInput>,
  actorId?: string | null,
): Promise<ArticleCategoryDoc | null> {
  const col = await articleCategoriesCol();
  if (patch.slug) patch = { ...patch, slug: await ensureUniqueSlug(col, patch.slug, id) };
  return updateDoc(col, id, patch, actorId);
}

export async function deleteArticleCategory(
  id: string,
  actorId?: string | null,
): Promise<{ ok: true } | { ok: false; reason: 'in_use'; count: number }> {
  const oid = toObjectId(id);
  if (!oid) return { ok: false, reason: 'in_use', count: 0 };

  const arts = await articlesCol();
  const count = await arts.countDocuments(alive({ categoryId: oid }));
  if (count > 0) return { ok: false, reason: 'in_use', count };

  await softDelete(await articleCategoriesCol(), id, actorId);
  return { ok: true };
}
