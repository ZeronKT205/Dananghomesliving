import 'server-only';

import { getTranslations } from 'next-intl/server';

import { DEFAULT_LOCALE, pickLocale, type Locale } from '@/config/locales';
import type { Article } from '@/types';

import { getArticleCategoryBySlug, listArticleCategories, listArticles, getPublishedArticleBySlug } from './repositories/article-repo';
import { getMediaByIds } from './repositories/media-repo';
import { getSiteSettings } from './site-settings';

import type { ArticleDoc } from './collections';

/**
 * Nguồn bài viết cho các trang PUBLIC.
 *
 * Trước đây file này là một mảng dữ liệu mẫu viết tay. Giờ đọc thẳng từ Mongo
 * nhưng GIỮ NGUYÊN chữ ký `getArticles()` / `getArticleBySlug()` và kiểu
 * `Article`, nên các trang gọi nó không phải sửa gì.
 *
 * `content` giờ là HTML do trình soạn thảo sinh (đã sanitize lúc lưu), không
 * còn là Markdown — trang render bằng `dangerouslySetInnerHTML` trong khối
 * `.article-body`, đúng stylesheet mà CMS dùng lúc soạn.
 */

const PLACEHOLDER_IMAGE = '/images/journal/buying-guide.webp';

function formatDate(d: Date | null): string | undefined {
  if (!d) return undefined;
  return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

async function toArticle(
  doc: ArticleDoc,
  locale: Locale,
  categoryName: string,
  author: Article['author'],
  readingTime: string,
  coverUrl?: string,
): Promise<Article> {
  const title = pickLocale(doc.title, locale, doc.slug);

  return {
    slug: doc.slug,
    category: categoryName,
    readingTime,
    title,
    excerpt: pickLocale(doc.excerpt, locale, ''),
    image: coverUrl ?? PLACEHOLDER_IMAGE,
    imageAlt: title,
    date: formatDate(doc.publishedAt),
    author,
    content: pickLocale(doc.content, locale, ''),
    tags: doc.tags,
    featured: doc.isFeatured,
  };
}

/** Nạp tên chuyên mục + ảnh bìa cho nhiều bài trong số truy vấn cố định. */
async function hydrate(docs: readonly ArticleDoc[], locale: Locale): Promise<Article[]> {
  if (!docs.length) return [];

  const [categories, covers, settings] = await Promise.all([
    listArticleCategories(),
    getMediaByIds(docs.map((d) => d.coverId).filter((c): c is NonNullable<typeof c> => c !== null)),
    getSiteSettings(),
  ]);

  // Số phút đọc cũng phải dịch — trước đây cứng "phút đọc" nên thẻ bài trên
  // trang tiếng Hàn hiện "5 phút đọc".
  const tNews = await getTranslations({ locale, namespace: 'News' });

  /*
   * Tác giả lấy từ Cài đặt chứ không từ trường `author` lưu trong bài.
   *
   * Hiện chỉ một người đăng bài, và ảnh đại diện chỉ có ở Cài đặt. Lấy theo bài
   * thì đổi tên trong Cài đặt xong các bài cũ vẫn đứng tên cũ — đúng kiểu lỗi
   * "sửa rồi mà không thấy đổi". Khi nào có nhiều biên tập viên thì chuyển sang
   * đọc `doc.author` và chỉ dùng Cài đặt làm giá trị mặc định.
   */
  const author = {
    name: settings.author.name,
    role: settings.author.role || undefined,
    avatar: settings.author.avatarUrl ?? undefined,
  };

  const catName = new Map(categories.map((c) => [c._id.toHexString(), pickLocale(c.name, locale, c.slug)]));
  const coverUrl = new Map(covers.map((m) => [m._id.toHexString(), m.url]));

  return Promise.all(
    docs.map((d) =>
      toArticle(
        d,
        locale,
        catName.get(d.categoryId?.toHexString() ?? '') ?? '',
        author,
        tNews('readingMinutes', { minutes: d.readingMinutes }),
        d.coverId ? coverUrl.get(d.coverId.toHexString()) : undefined,
      ),
    ),
  );
}

export async function getArticles(locale: Locale = DEFAULT_LOCALE): Promise<Article[]> {
  const page = await listArticles({ page: 1, limit: 60, sort: 'newest', includeUnpublished: false });
  return hydrate(page.items, locale);
}

export async function getArticleBySlug(slug: string, locale: Locale = DEFAULT_LOCALE): Promise<Article | null> {
  const doc = await getPublishedArticleBySlug(slug);
  if (!doc) return null;
  const [article] = await hydrate([doc], locale);
  return article ?? null;
}

export async function getArticlesByCategory(categorySlug: string, locale: Locale = DEFAULT_LOCALE): Promise<Article[]> {
  const category = await getArticleCategoryBySlug(categorySlug);
  if (!category) return [];
  const page = await listArticles({
    page: 1,
    limit: 60,
    categoryId: category._id.toHexString(),
    sort: 'newest',
    includeUnpublished: false,
  });
  return hydrate(page.items, locale);
}
