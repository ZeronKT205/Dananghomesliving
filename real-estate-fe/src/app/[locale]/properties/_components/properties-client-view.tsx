'use client';

import { useState } from 'react';

import { ListingCard } from '@/components/features/listing/listing-card';
import { Link } from '@/i18n/routing';
import type { Listing } from '@/types';

interface PropertiesClientViewProps {
  listings: Listing[];
  type?: string;
  area?: string;
  propertyType?: string;
}

export function PropertiesClientView({
  listings,
  type,
  area,
  propertyType,
}: PropertiesClientViewProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  return (
    <section className="container-page mt-10 sm:mt-14 scroll-mt-24" id="properties-results">
      {/* Section Header + View Mode Switcher */}
      <div className="border-line mb-8 flex flex-col justify-between gap-4 border-b pb-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-gold text-[10px] font-bold tracking-[0.2em] uppercase">
            Danh mục sản phẩm
          </p>
          <h2 className="font-display text-navy text-[24px] sm:text-[28px] tracking-tight">
            Hiển thị {listings.length} bất động sản
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          {/* Filter tags feedback */}
          {(type || (area && area !== 'All Da Nang') || (propertyType && propertyType !== 'Any property')) && (
            <div className="flex flex-wrap items-center gap-2 text-[12px]">
              <span className="text-muted">Đã lọc theo:</span>
              {type && (
                <span className="bg-navy/5 text-navy border-line rounded-none border px-2.5 py-0.5 font-semibold uppercase text-[10px]">
                  {type}
                </span>
              )}
              {area && area !== 'All Da Nang' && (
                <span className="bg-navy/5 text-navy border-line rounded-none border px-2.5 py-0.5 font-semibold text-[10px]">
                  {area}
                </span>
              )}
              {propertyType && propertyType !== 'Any property' && (
                <span className="bg-navy/5 text-navy border-line rounded-none border px-2.5 py-0.5 font-semibold text-[10px]">
                  {propertyType}
                </span>
              )}
              <Link
                href="/properties"
                className="text-gold hover:text-navy font-bold underline transition-colors text-[11px]"
              >
                Đặt lại
              </Link>
            </div>
          )}

          {/* View Mode Toggle: Grid vs List */}
          <div className="flex items-center gap-1 bg-paper border border-line p-1 rounded-none">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              title="Hiển thị dạng thẻ (Grid)"
              className={`px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'grid' 
                  ? 'bg-navy text-white shadow-xs' 
                  : 'text-muted hover:text-navy hover:bg-white'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
              Thẻ Card
            </button>
            <button
              type="button"
              onClick={() => setViewMode('list')}
              title="Hiển thị dạng danh sách (List/Row)"
              className={`px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'list' 
                  ? 'bg-navy text-white shadow-xs' 
                  : 'text-muted hover:text-navy hover:bg-white'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              Theo Hàng
            </button>
          </div>
        </div>
      </div>

      {/* Grid or List Listing Items with Smooth Transition */}
      {listings.length > 0 ? (
        <div
          key={`${type || 'all'}-${viewMode}`}
          className={`animate-fade-in transition-all duration-500 ease-out ${
            viewMode === 'grid' ? 'grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3' : 'flex flex-col gap-6'
          }`}
        >
          {listings.map((listing, idx) => (
            <div key={listing.slug} className="animate-fade-in transition-transform duration-300 hover:-translate-y-1">
              <ListingCard
                listing={listing}
                sizes={viewMode === 'grid' ? '(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw' : '(min-width: 1024px) 380px, 100vw'}
                priority={idx < 3}
                viewMode={viewMode}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="border-line shadow-lift my-12 border bg-white p-12 text-center rounded-none">
          <div className="bg-gold/10 text-gold border-gold/30 mx-auto mb-4 grid h-14 w-14 place-items-center rounded-none border">
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <h3 className="font-display text-navy text-[22px]">Không tìm thấy bất động sản phù hợp</h3>
          <p className="text-muted mt-2 text-[14px]">
            Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm để khám phá thêm nhiều lựa chọn.
          </p>
          <Link
            href="/properties"
            className="bg-navy text-white hover:bg-gold hover:text-navy mt-6 inline-block px-6 py-3 text-[12px] font-bold tracking-wider uppercase transition-colors rounded-none"
          >
            Xem tất cả sản phẩm
          </Link>
        </div>
      )}
    </section>
  );
}
