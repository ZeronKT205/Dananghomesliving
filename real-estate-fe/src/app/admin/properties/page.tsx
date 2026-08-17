import Link from 'next/link';

import { IcBuilding, IcLayers, IcPlus } from '../_components/icons';
import { PropertyCard } from '../_components/property-card';
import {
  EmptyState,
  PageHead,
  Panel,
  PendingButton,
  Pill,
  SearchInput,
  SelectInput,
  Tabs,
  Toolbar,
} from '../_components/ui';
import { GROUPS, PROPERTIES } from '../_data/mock';

import { AdminMapWrapper } from './_components/admin-map-wrapper';

const TABS = [
  { value: 'sale', label: 'Mua', icon: <IcBuilding size={14} /> },
  { value: 'rent', label: 'Thuê', icon: <IcBuilding size={14} /> },
  { value: 'groups', label: 'Nhóm bất động sản', icon: <IcLayers size={14} /> },
  { value: 'map', label: 'Bản đồ', icon: <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg> },
] as const;

const STATE_OPTIONS = ['Mọi trạng thái', 'Đang hiển thị', 'Bản nháp', 'Đã ẩn'] as const;

export default async function AdminPropertiesPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const { tab } = await searchParams;
  const current = TABS.some((item) => item.value === tab) ? (tab as string) : 'sale';

  const rows = PROPERTIES.filter((item) => item.deal === current);
  const imageCount = rows.reduce((sum, item) => sum + item.imageCount, 0);

  const tabsWithCount = TABS.map((item) => ({
    ...item,
    count:
      item.value === 'groups'
        ? GROUPS.length
        : item.value === 'map'
        ? PROPERTIES.length
        : PROPERTIES.filter((p) => p.deal === item.value).length,
  }));

  const groupOptions = ['Mọi nhóm', ...GROUPS.map((group) => group.name)];

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
        <AdminMapWrapper properties={PROPERTIES} />
      ) : current === 'groups' ? (
        <>
          <Toolbar>
            <SearchInput placeholder="Tìm nhóm…" />
            <PendingButton icon={<IcPlus size={14} />}>Thêm nhóm</PendingButton>
          </Toolbar>

          <p className="text-muted text-[12px]">
            <b className="text-navy">{GROUPS.length}</b> nhóm ·{' '}
            <b className="text-navy">{GROUPS.filter((g) => g.onHome).length}</b> nhóm hiển thị ở
            trang chủ
          </p>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {GROUPS.map((group) => {
              const count = PROPERTIES.filter((item) => item.groupId === group.id).length;
              return (
                <article
                  key={group.id}
                  className="border-line hover:border-gold flex flex-col gap-2 rounded-[10px] border bg-white p-4 transition-colors"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="bg-navy/6 text-navy grid h-9 w-9 shrink-0 place-items-center rounded-md">
                      <IcLayers size={16} />
                    </span>
                    {group.onHome ? <Pill tone="ok">Trang chủ</Pill> : <Pill>Không</Pill>}
                  </div>
                  <h3 className="text-navy mt-1 text-[14px] font-extrabold">{group.name}</h3>
                  <p className="text-muted text-[11.5px]">{group.nameEn}</p>
                  <p className="border-line-soft text-muted mt-auto border-t pt-2.5 text-[11.5px]">
                    <b className="text-navy tabular-nums">{count}</b> bất động sản · thứ tự{' '}
                    <b className="text-navy tabular-nums">{group.order}</b>
                  </p>
                </article>
              );
            })}
          </div>
        </>
      ) : (
        <>
          <Toolbar>
            <SearchInput placeholder="Tìm bất động sản…" />
            <SelectInput label="Lọc theo nhóm" options={groupOptions} />
            <SelectInput label="Lọc theo trạng thái" options={STATE_OPTIONS} />
            <Link href="/admin/properties/new" className="bg-navy text-white hover:bg-gold inline-flex h-9 shrink-0 items-center gap-2 rounded-md px-4 text-[12.5px] font-bold transition-colors">
              <IcPlus size={14} />
              Thêm bất động sản
            </Link>
          </Toolbar>

          <p className="text-muted text-[12px]">
            <b className="text-navy">{rows.length}</b> bất động sản ·{' '}
            <b className="text-navy">{imageCount}</b> hình ảnh
          </p>

          {rows.length === 0 ? (
            <Panel>
              <EmptyState
                icon={<IcBuilding size={22} />}
                title="Chưa có bất động sản nào"
                message="Thêm bất động sản đầu tiên để nó hiển thị ngoài website."
              />
            </Panel>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
              {rows.map((property, index) => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  group={GROUPS.find((group) => group.id === property.groupId)}
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
