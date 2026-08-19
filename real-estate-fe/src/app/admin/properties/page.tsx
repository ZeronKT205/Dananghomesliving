import Link from 'next/link';

import type { PublishState } from '@/lib/db/collections';
import { listAmenities, listCategories } from '@/lib/db/repositories/catalog-repo';
import { countPropertiesByAmenity, listProperties } from '@/lib/db/repositories/property-repo';

import { IcBuilding, IcLayers, IcPlus } from '../_components/icons';
import { PropertyCard } from '../_components/property-card';
import {
  EmptyState,
  PageHead,
  Panel,
  SearchInput,
  SelectInput,
  Tabs,
  Toolbar,
} from '../_components/ui';
import { toAdminProperties } from '../_data/presenters';

import { AdminMapWrapper } from './_components/admin-map-wrapper';
import { AmenityManager } from './_components/amenity-manager';
import { CategoryManager } from './_components/category-manager';


export const dynamic = 'force-dynamic';

const EMPTY_PAGE = {
  items: [],
  total: 0,
  page: 1,
  limit: 0,
  totalPages: 1,
  hasNext: false,
  hasPrev: false,
};

const TABS = [
  { value: 'sale', label: 'Mua', icon: <IcBuilding size={14} /> },
  { value: 'rent', label: 'Thuê', icon: <IcBuilding size={14} /> },
  { value: 'groups', label: 'Nhóm bất động sản', icon: <IcLayers size={14} /> },
  { value: 'amenities', label: 'Tiện ích', icon: <IcLayers size={14} /> },
  {
    value: 'map',
    label: 'Bản đồ',
    icon: (
      <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
        />
      </svg>
    ),
  },
] as const;

const STATE_OPTIONS = [
  { value: 'all', label: 'Mọi trạng thái' },
  { value: 'published', label: 'Đang hiển thị' },
  { value: 'draft', label: 'Bản nháp' },
  { value: 'archived', label: 'Đã ẩn' },
];

export default async function AdminPropertiesPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string; q?: string; cat?: string; state?: string }>;
}) {
  const { tab, q, cat, state } = await searchParams;
  const current = TABS.some((item) => item.value === tab) ? (tab as string) : 'sale';
  const isList = current === 'sale' || current === 'rent';

  const [categories, amenities, result, saleCount, rentCount, allForMap] = await Promise.all([
    listCategories(),
    listAmenities(),
    isList
      ? listProperties({
          page: 1,
          limit: 60,
          deal: current as 'sale' | 'rent',
          includeUnpublished: true,
          publishState: state && state !== 'all' ? (state as PublishState) : undefined,
          categorySlug: cat && cat !== 'all' ? cat : undefined,
          q: q || undefined,
          sort: 'newest',
        })
      : Promise.resolve(EMPTY_PAGE),
    listProperties({ page: 1, limit: 1, deal: 'sale', includeUnpublished: true, sort: 'newest' }),
    listProperties({ page: 1, limit: 1, deal: 'rent', includeUnpublished: true, sort: 'newest' }),
    current === 'map'
      ? listProperties({ page: 1, limit: 200, includeUnpublished: true, sort: 'newest' })
      : Promise.resolve(EMPTY_PAGE),
  ]);

  const [rows, mapRows] = await Promise.all([
    toAdminProperties(result.items),
    toAdminProperties(allForMap.items),
  ]);

  const imageCount = rows.reduce((sum, item) => sum + item.imageCount, 0);
  const hasFilter = Boolean(q) || (cat && cat !== 'all') || (state && state !== 'all');

  const tabsWithCount = TABS.map((item) => ({
    ...item,
    count:
      item.value === 'sale'
        ? saleCount.total
        : item.value === 'rent'
          ? rentCount.total
          : item.value === 'groups'
            ? categories.length
            : item.value === 'amenities'
              ? amenities.length
              : saleCount.total + rentCount.total,
  }));

  const categoryOptions = [
    { value: 'all', label: 'Mọi nhóm' },
    ...categories.map((c) => ({ value: c.slug, label: c.name.vi ?? c.name.en ?? c.slug })),
  ];

  const groups = categories.map((c) => ({
    id: c._id.toHexString(),
    slug: c.slug,
    name: c.name.vi ?? c.name.en ?? c.slug,
    nameEn: c.name.en ?? c.slug,
    onHome: c.showOnHome,
    order: c.order,
    count: c.propertyCount,
  }));
  const groupById = new Map(groups.map((g) => [g.id, g]));

  /*
   * Đếm số BĐS đang dùng từng tiện ích, để cảnh báo trước khi xoá.
   *
   * Chỉ đếm khi đang mở đúng tab: `$unwind` trên toàn bộ bảng properties là
   * việc thừa với người chỉ vào xem danh sách tin.
   */
  const amenityRows =
    current === 'amenities'
      ? await (async () => {
          const usage = await countPropertiesByAmenity();
          return amenities.map((a) => ({
            id: a._id.toHexString(),
            name: a.name.vi ?? a.name.en ?? a.slug,
            nameEn: a.name.en ?? a.slug,
            group: a.group,
            order: a.order,
            usedBy: usage.get(a._id.toHexString()) ?? 0,
          }));
        })()
      : [];

  return (
    <>
      <PageHead
        title="Bất động sản"
        desc="Nội dung hiển thị ở khối Mua và Thuê ngoài trang chủ và các trang danh mục."
      />

      <Panel noPad>
        <Tabs basePath="/admin/properties" current={current} items={tabsWithCount} />
      </Panel>

      {current === 'map' ? (
        <AdminMapWrapper properties={mapRows} />
      ) : current === 'groups' ? (
        <CategoryManager groups={groups} />
      ) : current === 'amenities' ? (
        <AmenityManager amenities={amenityRows} />
      ) : (
        <>
          <Toolbar>
            <form method="get" className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
              <input type="hidden" name="tab" value={current} />
              <SearchInput name="q" defaultValue={q ?? ''} placeholder="Tìm bất động sản…" />
              <SelectInput
                label="Lọc theo nhóm"
                name="cat"
                defaultValue={cat ?? 'all'}
                options={categoryOptions}
              />
              <SelectInput
                label="Lọc theo trạng thái"
                name="state"
                defaultValue={state ?? 'all'}
                options={STATE_OPTIONS}
              />
            </form>
            <Link
              href="/admin/properties/new"
              className="bg-navy text-white hover:bg-gold inline-flex h-9 shrink-0 items-center gap-2 rounded-md px-4 text-[12.5px] font-bold transition-colors"
            >
              <IcPlus size={14} />
              Thêm bất động sản
            </Link>
          </Toolbar>

          <p className="text-muted text-[12px]">
            <b className="text-navy">{result.total}</b> bất động sản ·{' '}
            <b className="text-navy">{imageCount}</b> hình ảnh
          </p>

          {rows.length === 0 ? (
            <Panel>
              <EmptyState
                icon={<IcBuilding size={22} />}
                title={hasFilter ? 'Không có kết quả phù hợp' : 'Chưa có bất động sản nào'}
                message={
                  hasFilter
                    ? 'Thử bỏ bớt bộ lọc hoặc đổi từ khoá tìm kiếm.'
                    : 'Thêm bất động sản đầu tiên để nó hiển thị ngoài website.'
                }
              />
            </Panel>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
              {rows.map((property, index) => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  group={groupById.get(property.groupId)}
                  priority={index < 4}
                />
              ))}
            </div>
          )}
        </>
      )}
    </>
  );
}
