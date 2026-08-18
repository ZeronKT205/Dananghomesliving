import { notFound } from 'next/navigation';

import { getCurrentUser } from '@/lib/auth/session';
import { getArticleById, listArticleCategories } from '@/lib/db/repositories/article-repo';
import { getMediaByIds } from '@/lib/db/repositories/media-repo';
import { aiModelName } from '@/server/services/ai-client';
import { isTranslationConfigured } from '@/server/services/translation-service';

import { ArticleForm, type ArticleFormValue } from './_components/article-form';

export const dynamic = 'force-dynamic';

function loc(field: Record<string, string | undefined> | undefined): Record<string, string> {
  return Object.fromEntries(
    Object.entries(field ?? {}).filter(([, v]) => typeof v === 'string'),
  ) as Record<string, string>;
}

export default async function EditArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const isNew = id === 'new';

  const [cats, user] = await Promise.all([listArticleCategories(), getCurrentUser()]);

  const categories = cats.map((c) => ({
    id: c._id.toHexString(),
    name: c.name.vi ?? c.name.en ?? c.slug,
  }));

  // Tác giả lấy từ tài khoản đang đăng nhập — biên tập viên không phải gõ tên
  // mình vào mỗi bài, và tên hiển thị ngoài web luôn khớp tài khoản thật.
  const authorName = user?.name ?? 'Ban biên tập';
  const translationEnabled = isTranslationConfigured();
  // Hiện tên model cho biên tập biết bài do đâu ra — dự án có hai nhà cung cấp.
  const modelName = aiModelName();

  if (isNew) {
    const empty: ArticleFormValue = {
      id: null,
      slug: '',
      title: {},
      excerpt: {},
      content: {},
      categoryId: categories[0]?.id ?? '',
      coverId: null,
      coverUrl: null,
      tags: [],
      isFeatured: false,
      publishState: 'draft',
    };
    return (
      <ArticleForm
        initial={empty}
        categories={categories}
        translationEnabled={translationEnabled}
        modelName={modelName}
        authorName={authorName}
      />
    );
  }

  const doc = await getArticleById(id);
  if (!doc) notFound();

  const cover = doc.coverId ? (await getMediaByIds([doc.coverId]))[0] : null;

  const initial: ArticleFormValue = {
    id: doc._id.toHexString(),
    slug: doc.slug,
    title: loc(doc.title),
    excerpt: loc(doc.excerpt),
    content: loc(doc.content),
    categoryId: doc.categoryId?.toHexString() ?? categories[0]?.id ?? '',
    coverId: doc.coverId?.toHexString() ?? null,
    coverUrl: cover?.url ?? null,
    tags: doc.tags ?? [],
    isFeatured: doc.isFeatured,
    publishState: doc.publishState,
  };

  return (
    <ArticleForm
      initial={initial}
      categories={categories}
      translationEnabled={translationEnabled}
      modelName={modelName}
      authorName={authorName}
    />
  );
}
