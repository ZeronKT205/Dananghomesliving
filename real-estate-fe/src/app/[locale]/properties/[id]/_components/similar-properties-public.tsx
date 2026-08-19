'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';


import { Link } from '@/i18n/routing';
import type { Listing } from '@/types';

/**
 * Khối "Bất động sản tương tự" cuối trang chi tiết.
 *
 * Nhận dữ liệu từ trang cha thay vì tự đọc: trang cha đã truy vấn rồi, để
 * component tự đọc nữa là hai lần truy vấn cho cùng một thứ.
 *
 * Trước đây component lọc `MOCK_PROPERTIES` và có cả một mảng dự phòng viết
 * tay khi không tìm thấy gì — nghĩa là trang luôn hiện tin, kể cả tin không tồn
 * tại. Không còn dữ liệu dự phòng: không có tin tương tự thì không hiện khối.
 */
export function SimilarPropertiesPublic({ items }: { items: Listing[] }) {
  const t = useTranslations('Property');
  const tl = useTranslations('Listings');

  if (items.length === 0) return null;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-[24px] font-display font-normal text-navy tracking-tight">{t('similarTitleFull')}</h2>
        <Link
          href="/properties"
          className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-navy hover:text-gold transition-colors"
        >
          {t('similarViewAllFull')}
          <span aria-hidden>→</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {items.map((prop) => (
          <Link
            href={`/properties/${prop.slug}`}
            key={prop.slug}
            className="bg-white border border-line rounded-none overflow-hidden group hover:shadow-lift transition-all block"
          >
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-sand">
              <Image
                src={prop.image}
                alt={prop.imageAlt}
                fill
                sizes="(min-width: 1024px) 300px, (min-width: 768px) 50vw, 100vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-3 left-3">
                <span
                  className={`px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest rounded-none border border-white/20 ${
                    prop.badgeTone === 'gold' ? 'bg-gold text-navy' : 'bg-navy text-white'
                  }`}
                >
                  {prop.badge}
                </span>
              </div>
            </div>

            <div className="p-4">
              <div className="flex items-center gap-1.5 text-[11px] text-gold font-semibold uppercase tracking-wider mb-1.5 truncate">
                <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {prop.location}
              </div>

              <h4 className="font-display text-[16px] text-navy font-normal mb-3 truncate leading-snug">
                {prop.title}
              </h4>

              <div className="flex items-center gap-4 text-[11px] text-muted mb-4 border-b border-line pb-3">
                <span className="flex items-center gap-1">
                  <strong className="text-navy font-semibold">{prop.beds}</strong> PN
                </span>
                <span className="text-line">|</span>
                <span className="flex items-center gap-1">
                  <strong className="text-navy font-semibold">{prop.area}</strong>
                </span>
              </div>

              <div className="flex items-center justify-between">
                <p className="font-sans text-[16px] text-gold font-semibold leading-none">
                  {prop.price}
                  {prop.priceNote ? <span className="text-muted text-[11px] font-normal"> {tl('perMonth')}</span> : null}
                </p>
                <div className="w-8 h-8 flex items-center justify-center rounded-none border border-line text-navy group-hover:bg-navy group-hover:text-white transition-colors">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
