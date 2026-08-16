import Image from 'next/image';

import { cn } from '@/lib/utils';

import { IcEdit, IcEye, IcImages, IcNews, IcPlus, IcTrash } from '../_components/icons';
import {
  EmptyState,
  IconButton,
  PageHead,
  Panel,
  PendingButton,
  Pill,
  SearchInput,
  SelectInput,
  Tabs,
  Toolbar,
} from '../_components/ui';
import { NEWS, NEWS_CATEGORIES, PUBLISH_STATE } from '../_data/mock';

import type { PublishState } from '../_data/mock';

const TABS = [
  { value: 'all', label: 'Tất cả bài viết', icon: <IcNews size={14} /> },
  { value: 'published', label: 'Đang hiển thị' },
  { value: 'draft', label: 'Bản nháp' },
] as const;

export default async function AdminNewsPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const { tab = 'all' } = await searchParams;
  const current = TABS.some((item) => item.value === tab) ? tab : 'all';

  const rows = current === 'all' ? NEWS : NEWS.filter((item) => item.state === current);
  const imageCount = rows.reduce((sum, item) => sum + item.imageCount, 0);

  const tabsWithCount = TABS.map((item) => ({
    ...item,
    count:
      item.value === 'all'
        ? NEWS.length
        : NEWS.filter((n) => n.state === (item.value as PublishState)).length,
  }));

  return (
    <>
      <PageHead
        title="Tin tức"
        desc="Bài viết về thị trường bất động sản hiển thị ở trang Tin tức."
      />

      <Panel noPad>
        <Tabs basePath="/admin/news" current={current} items={tabsWithCount} />
      </Panel>

      <Toolbar>
        <SearchInput placeholder="Tìm bài viết…" />
        <SelectInput label="Lọc theo chuyên mục" options={['Mọi chuyên mục', ...NEWS_CATEGORIES]} />
        <PendingButton icon={<IcPlus size={14} />}>Viết bài</PendingButton>
      </Toolbar>

      <p className="text-muted text-[12px]">
        <b className="text-navy">{rows.length}</b> bài viết ·{' '}
        <b className="text-navy">{imageCount}</b> hình ảnh
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
                <div className="bg-ivory relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={article.cover}
                    alt=""
                    fill
                    priority={index < 4}
                    sizes="(max-width: 640px) 100vw, (max-width: 1280px) 33vw, 280px"
                    className="object-cover"
                  />
                  <span className="absolute top-2 left-2 inline-flex items-center gap-1.5 rounded-full bg-[rgb(11_23_21/0.78)] px-2.5 py-1 text-[10px] font-bold text-white">
                    <IcImages size={11} />
                    {article.imageCount} ảnh
                  </span>
                  <span className="absolute top-2 right-2">
                    <Pill tone={status.tone} className="bg-white/94">
                      {status.label}
                    </Pill>
                  </span>
                </div>

                <div className="flex flex-1 flex-col gap-1.5 p-3.5">
                  <span className="bg-navy/6 text-navy w-fit rounded px-2 py-[3px] text-[10px] font-bold">
                    {article.category}
                  </span>
                  <h3 className="text-navy line-clamp-2 text-[13.5px] leading-[1.45] font-bold">
                    {article.title}
                  </h3>
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
                  <span className="flex shrink-0 items-center gap-1.5">
                    <IconButton label="Sửa">
                      <IcEdit size={13} />
                    </IconButton>
                    <IconButton label="Xoá" tone="danger">
                      <IcTrash size={13} />
                    </IconButton>
                  </span>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </>
  );
}
