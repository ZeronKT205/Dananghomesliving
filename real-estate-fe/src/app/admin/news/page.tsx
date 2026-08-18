import Image from 'next/image';
import Link from 'next/link';

import { listArticleCategories, listArticles } from '@/lib/db/repositories/article-repo';
import { cn } from '@/lib/utils';
import { actionDeleteArticle } from '@/server/actions/admin-actions';

import { IcEye, IcLayers, IcNews, IcPlus } from '../_components/icons';
import { ArticleCategoryManager } from './_components/article-category-manager';
import { RowActions } from '../_components/row-actions';
import {
  EmptyState,
  PageHead,
  Panel,
  Pill,
  SearchInput,
  SelectInput,
  Tabs,
  Toolbar,
} from '../_components/ui';
import { toAdminNewsList } from '../_data/presenters';
import { PUBLISH_STATE } from '../_data/view-models';

import type { PublishState } from '@/lib/db/collections';

export const dynamic = 'force-dynamic';

const TABS = [
  { value: 'all', label: 'Tất cả bài viết', icon: <IcNews size={14} /> },
  { value: 'published', label: 'Đang hiển thị' },
  { value: 'draft', label: 'Bản nháp' },
  { value: 'categories', label: 'Chuyên mục', icon: <IcLayers size={14} /> },
] as const;

export default async function AdminNewsPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string; q?: string; cat?: string }>;
}) {
  const { tab = 'all', q, cat } = await searchParams;
  const current = TABS.some((item) => item.value === tab) ? tab : 'all';

  const [result, categories, counts] = await Promise.all([
    listArticles({
      page: 1,
      limit: 60,
      includeUnpublished: true,
      publishState: current === 'all' || current === 'categories' ? undefined : (current as PublishState),
      q: q || undefined,
      categorySlug: cat && cat !== 'all' ? cat : undefined,
      sort: 'newest',
    }),
    listArticleCategories(),
    Promise.all(
      TABS.map(async (t) => {
        if (t.value === 'categories') return [t.value, -1] as const; // điền sau khi có danh sách
        const r = await listArticles({
          page: 1,
          limit: 1,
          includeUnpublished: true,
          publishState: t.value === 'all' ? undefined : (t.value as PublishState),
          sort: 'newest',
        });
        return [t.value, r.total] as const;
      }),
    ),
  ]);

  const rows = await toAdminNewsList(result.items, categories);
  const countByTab = new Map(counts);
  countByTab.set('categories', categories.length);
  const tabsWithCount = TABS.map((item) => ({ ...item, count: countByTab.get(item.value) ?? 0 }));

  const categoryRows = categories.map((c) => ({
    id: c._id.toHexString(),
    slug: c.slug,
    name: c.name.vi ?? c.name.en ?? c.slug,
    nameEn: c.name.en ?? c.slug,
    order: c.order,
    count: c.articleCount,
  }));

  const categoryOptions = [
    { value: 'all', label: 'Mọi chuyên mục' },
    ...categories.map((c) => ({ value: c.slug, label: c.name.vi ?? c.name.en ?? c.slug })),
  ];

  return (
    <>
      <PageHead title="Tin tức" desc="Bài viết hiển thị ở trang Tin tức ngoài website." />

      <Panel noPad>
        <Tabs basePath="/admin/news" current={current} items={tabsWithCount} />
      </Panel>

      {current === 'categories' ? (
        <ArticleCategoryManager rows={categoryRows} />
      ) : (
      <>
      <Toolbar>
        <form method="get" className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
          <input type="hidden" name="tab" value={current} />
          <SearchInput name="q" defaultValue={q ?? ''} placeholder="Tìm bài viết…" />
          <SelectInput
            label="Lọc theo chuyên mục"
            name="cat"
            defaultValue={cat ?? 'all'}
            options={categoryOptions}
          />
        </form>
        <Link
          href="/admin/news/new"
          className="bg-navy text-white hover:bg-gold inline-flex h-9 shrink-0 items-center gap-2 rounded-md px-4 text-[12.5px] font-bold transition-colors"
        >
          <IcPlus size={14} />
          Viết bài
        </Link>
      </Toolbar>

      <p className="text-muted text-[12px]">
        <b className="text-navy">{result.total}</b> bài viết
      </p>

      {rows.length === 0 ? (
        <Panel>
          <EmptyState
            icon={<IcNews size={22} />}
            title="Chưa có bài viết nào"
            message="Viết bài đầu tiên để nó hiển thị ở trang Tin tức."
          />
        </Panel>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {rows.map((article, index) => {
            const status = PUBLISH_STATE[article.state];
            return (
              <article
                key={article.id}
                className={cn(
                  'border-line hover:border-gold flex flex-col overflow-hidden rounded-[10px] border bg-white transition-all hover:shadow-[0_1px_2px_rgb(7_29_54/0.06)]',
                  article.state !== 'published' && 'opacity-[0.72]',
                )}
              >
                <Link
                  href={`/admin/news/${article.id}`}
                  className="bg-ivory relative aspect-[16/10] overflow-hidden"
                >
                  <Image
                    src={article.cover}
                    alt=""
                    fill
                    priority={index < 4}
                    sizes="(max-width: 640px) 100vw, (max-width: 1280px) 33vw, 280px"
                    className="object-cover"
                  />
                  <span className="absolute top-2 right-2">
                    <Pill tone={status.tone} className="bg-white/94">
                      {status.label}
                    </Pill>
                  </span>
                </Link>

                <div className="flex flex-1 flex-col gap-1.5 p-3.5">
                  <span className="bg-navy/6 text-navy w-fit rounded px-2 py-[3px] text-[10px] font-bold">
                    {article.category}
                  </span>
                  <Link href={`/admin/news/${article.id}`}>
                    <h3 className="text-navy hover:text-gold line-clamp-2 text-[13.5px] leading-[1.45] font-bold transition-colors">
                      {article.title}
                    </h3>
                  </Link>
                  <p className="text-muted line-clamp-2 text-[11.5px] leading-[1.6]">
                    {article.summary}
                  </p>
                  <div className="text-muted mt-auto flex items-center gap-3 pt-2 text-[11.5px]">
                    <span className="truncate">{article.author}</span>
                    <span className="inline-flex items-center gap-1.5">
                      <IcEye size={12} />
                      {article.views}
                    </span>
                  </div>
                </div>

                <div className="border-line-soft bg-ivory/40 flex items-center justify-between gap-2 border-t px-3.5 py-2.5">
                  <span className="text-muted truncate text-[11.5px]">
                    Sửa {article.updatedLabel}
                  </span>
                  <RowActions
                    editHref={`/admin/news/${article.id}`}
                    deleteLabel="Xoá bài viết"
                    onDelete={actionDeleteArticle.bind(null, article.id)}
                  />
                </div>
              </article>
            );
          })}
        </div>
      )}
      </>
      )}
    </>
  );
}
