import Image from 'next/image';

import { cn } from '@/lib/utils';

import { DEAL_TYPE, formatUsd, PUBLISH_STATE } from '../_data/view-models';

import { IcBed, IcEdit, IcEye, IcImages, IcPin, IcTrash } from './icons';
import { IconButton, Pill } from './ui';

import type { AdminProperty, PropertyGroup } from '../_data/view-models';

/** Thẻ bất động sản trong lưới. Cùng khung với thẻ bài đăng của CMS mẫu:
 *  ảnh bìa 16/10 · badge số ảnh trái · trạng thái phải · nhóm · tiêu đề 2 dòng
 *  · mô tả 2 dòng · hàng thông số · chân thẻ có thời gian sửa và nút thao tác. */
export function PropertyCard({
  property,
  group,
  priority = false,
}: {
  property: AdminProperty;
  group?: PropertyGroup;
  priority?: boolean;
}) {
  const status = PUBLISH_STATE[property.state];

  return (
    <article
      className={cn(
        'border-line hover:border-gold group flex flex-col overflow-hidden rounded-[10px] border bg-white transition-all hover:shadow-[0_1px_2px_rgb(7_29_54/0.06)]',
        property.state !== 'published' && 'opacity-[0.72]',
      )}
    >
      <div className="bg-ivory relative aspect-[16/10] overflow-hidden">
        <Image
          src={property.cover}
          alt=""
          fill
          priority={priority}
          sizes="(max-width: 640px) 100vw, (max-width: 1280px) 33vw, 280px"
          className="object-cover"
        />
        <span className="text-navy/95 absolute top-2 left-2 inline-flex items-center gap-1.5 rounded-full bg-[rgb(11_23_21/0.78)] px-2.5 py-1 text-[10px] font-bold text-white">
          <IcImages size={11} />
          {property.imageCount} ảnh
        </span>
        <span className="absolute top-2 right-2">
          <Pill tone={status.tone} className="bg-white/94">
            {status.label}
          </Pill>
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-1.5 p-3.5">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="bg-navy/6 text-navy rounded px-2 py-[3px] text-[10px] font-bold">
            {group?.name ?? '—'}
          </span>
          <span className="bg-gold/12 rounded px-2 py-[3px] text-[10px] font-bold text-[#8f6614]">
            {DEAL_TYPE[property.deal].label}
          </span>
        </div>

        <h3 className="text-navy line-clamp-2 text-[13.5px] leading-[1.45] font-bold">
          {property.title}
        </h3>
        <p className="text-muted line-clamp-2 text-[11.5px] leading-[1.6]">{property.summary}</p>

        <p className="text-muted mt-1 flex items-center gap-1.5 text-[11.5px]">
          <IcPin size={11} className="shrink-0" />
          {property.district}
        </p>

        <div className="mt-auto flex flex-wrap items-center gap-x-3 gap-y-1 pt-2 text-[11.5px]">
          <span className="text-[12.5px] font-extrabold text-[#8f6614]">
            {formatUsd(property.priceUsd)}
            {property.perMonth ? (
              <span className="text-muted ml-0.5 text-[10.5px] font-normal">/th</span>
            ) : null}
          </span>
          <span className="text-muted inline-flex items-center gap-1.5">
            <IcBed size={12} />
            {property.beds}PN · {property.baths}WC
          </span>
          <span className="text-muted inline-flex items-center gap-1.5">
            <IcEye size={12} />
            {property.views}
          </span>
        </div>
      </div>

      <div className="border-line-soft bg-ivory/40 flex items-center justify-between gap-2 border-t px-3.5 py-2.5">
        <span className="text-muted truncate text-[11.5px]">Sửa {property.updatedLabel}</span>
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
}
