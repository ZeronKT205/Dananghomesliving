'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Suspense, useState, useEffect } from 'react';

import { SEARCH_AREAS, SEARCH_BUDGETS, SEARCH_PROPERTY_TYPES } from '@/config/constants';
import { cn } from '@/lib/utils';
import type { ListingType } from '@/types';

const TABS: { value: ListingType; labelKey: 'buy' | 'rent' }[] = [
  // Nhãn lấy từ file dịch lúc render; ở đây chỉ giữ khoá.
  { value: 'sale', labelKey: 'buy' },
  { value: 'rent', labelKey: 'rent' },
];

export function PropertySearch({
  layout = 'stacked',
  redirectOnlyOnSubmit = false,
}: {
  layout?: 'inline' | 'stacked';
  redirectOnlyOnSubmit?: boolean;
}) {
  return (
    <Suspense fallback={null}>
      <PropertySearchInner layout={layout} redirectOnlyOnSubmit={redirectOnlyOnSubmit} />
    </Suspense>
  );
}

function PropertySearchInner({
  layout,
  redirectOnlyOnSubmit,
}: {
  layout: 'inline' | 'stacked';
  redirectOnlyOnSubmit: boolean;
}) {
  const t = useTranslations('Search');
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentType = (searchParams.get('type') as ListingType) || 'sale';
  const currentArea = searchParams.get('area') || SEARCH_AREAS[0];
  const currentPropType = searchParams.get('propertyType') || SEARCH_PROPERTY_TYPES[0];

  const [tab, setTab] = useState<ListingType>(currentType);
  const [selectedArea, setSelectedArea] = useState<string>(currentArea);
  const [selectedType, setSelectedType] = useState<string>(currentPropType);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    setTab(currentType);
    setSelectedArea(currentArea);
    setSelectedType(currentPropType);
  }, [currentType, currentArea, currentPropType]);

  const handleTabChange = (newTab: ListingType) => {
    setTab(newTab);
    if (!redirectOnlyOnSubmit) {
      const params = new URLSearchParams(searchParams.toString());
      params.set('type', newTab);
      router.push(`/properties?${params.toString()}`, { scroll: false });
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setIsSearching(true);

    const params = new URLSearchParams();
    params.set('type', tab);
    if (selectedArea && selectedArea !== 'All Da Nang') {
      params.set('area', selectedArea);
    }
    if (selectedType && selectedType !== 'Any property') {
      params.set('propertyType', selectedType);
    }

    router.push(`/properties?${params.toString()}`, { scroll: false });

    if (!redirectOnlyOnSubmit) {
      requestAnimationFrame(() => {
        document.getElementById('properties-results')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }

    setTimeout(() => {
      setIsSearching(false);
    }, 400);
  };

  // Stacked Layout: Dùng cho trang Bất động sản (/properties) — Nút BUY/RENT ở giữa phía trên
  if (layout === 'stacked') {
    return (
      <div className="w-full flex flex-col items-center">
        {/* Centered BUY & RENT Toggle Group on top */}
        <div
          role="tablist"
          aria-label={t('listingType')}
          className="relative inline-flex bg-white p-1 rounded-none border border-line shadow-sm mb-3 z-10 overflow-hidden"
        >
          <div
            className={cn(
              'absolute top-1 bottom-1 w-[calc(50%-4px)] bg-navy rounded-none transition-all duration-300 ease-out shadow-xs',
              tab === 'sale' ? 'left-1' : 'left-[calc(50%+2px)]'
            )}
          />

          {TABS.map((item) => {
            const isActive = item.value === tab;
            return (
              <button
                key={item.value}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => handleTabChange(item.value)}
                className={cn(
                  'relative z-10 px-10 py-2.5 text-[11.5px] font-bold tracking-[0.18em] uppercase transition-colors duration-200 cursor-pointer rounded-none min-w-[120px] text-center',
                  isActive
                    ? 'text-white font-extrabold'
                    : 'text-navy/75 hover:text-navy'
                )}
              >
                {t(item.labelKey)}
              </button>
            );
          })}
        </div>

        {/* Filter Bar */}
        <form
          onSubmit={handleSubmit}
          className="w-full bg-white border border-line shadow-lift rounded-none p-2 sm:p-3"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_auto] gap-2 items-center">
            {/* Area */}
            <div className="bg-paper border border-line px-3.5 py-2 rounded-none flex flex-col justify-center">
              <label
                htmlFor="area-stacked"
                className="text-[8px] font-bold tracking-[0.14em] text-muted uppercase block mb-0.5"
              >
                {t('area')}
              </label>
              <select
                id="area-stacked"
                value={selectedArea}
                onChange={(e) => setSelectedArea(e.target.value)}
                className="text-navy focus:outline-none w-full cursor-pointer bg-transparent py-0 text-[12.5px] font-semibold"
              >
                {SEARCH_AREAS.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>

            {/* Property Type */}
            <div className="bg-paper border border-line px-3.5 py-2 rounded-none flex flex-col justify-center">
              <label
                htmlFor="property-type-stacked"
                className="text-[8px] font-bold tracking-[0.14em] text-muted uppercase block mb-0.5"
              >
                {t('propertyType')}
              </label>
              <select
                id="property-type-stacked"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="text-navy focus:outline-none w-full cursor-pointer bg-transparent py-0 text-[12.5px] font-semibold"
              >
                {SEARCH_PROPERTY_TYPES.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>

            {/* Budget */}
            <div className="bg-paper border border-line px-3.5 py-2 rounded-none flex flex-col justify-center">
              <label
                htmlFor="budget-stacked"
                className="text-[8px] font-bold tracking-[0.14em] text-muted uppercase block mb-0.5"
              >
                {t('budgetLabel')}
              </label>
              <select
                id="budget-stacked"
                defaultValue={SEARCH_BUDGETS[0]}
                className="text-navy focus:outline-none w-full cursor-pointer bg-transparent py-0 text-[12.5px] font-semibold"
              >
                {SEARCH_BUDGETS.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>

            {/* Submit Search Button */}
            <button
              type="submit"
              disabled={isSearching}
              className="w-full lg:w-auto bg-navy hover:bg-gold text-white hover:text-navy px-7 py-3.5 text-[11px] font-bold uppercase tracking-[0.16em] transition-all rounded-none cursor-pointer flex items-center justify-center gap-2 shrink-0 active:scale-97 shadow-sm disabled:opacity-75"
            >
              {isSearching ? (
                <>
                  <svg className="w-4 h-4 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  {t('searchingShort')}
                </>
              ) : (
                <>
                  TÌM KIẾM
                  <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    );
  }

  // Inline Layout: Dùng cho Trang Chủ (Home) — Nút BUY/RENT cùng 1 hàng bên góc trái gọn gàng
  return (
    <div className="w-full max-w-5xl mx-auto">
      <form
        onSubmit={handleSubmit}
        className="w-full bg-white border border-line shadow-lift rounded-none p-2 sm:p-2.5"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[auto_1fr_1fr_1fr_auto] gap-2 items-stretch">
          {/* BUY & RENT Toggle Group on left of same row */}
          <div
            role="tablist"
            aria-label={t('listingType')}
            className="relative inline-flex bg-paper p-1 rounded-none border border-line shadow-xs overflow-hidden items-center self-stretch justify-center"
          >
            <div
              className={cn(
                'absolute top-1 bottom-1 w-[calc(50%-4px)] bg-navy rounded-none transition-all duration-300 ease-out shadow-xs',
                tab === 'sale' ? 'left-1' : 'left-[calc(50%+2px)]'
              )}
            />

            {TABS.map((item) => {
              const isActive = item.value === tab;
              return (
                <button
                  key={item.value}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => handleTabChange(item.value)}
                  className={cn(
                    'relative z-10 px-5 py-2.5 text-[11.5px] font-bold tracking-[0.18em] uppercase transition-colors duration-200 cursor-pointer rounded-none min-w-[75px] text-center',
                    isActive
                      ? 'text-white font-extrabold'
                      : 'text-navy/75 hover:text-navy'
                  )}
                >
                  {t(item.labelKey)}
                </button>
              );
            })}
          </div>

          {/* Area */}
          <div className="bg-paper border border-line px-3.5 py-2 rounded-none flex flex-col justify-center">
            <label
              htmlFor="area-inline"
              className="text-[8px] font-bold tracking-[0.14em] text-muted uppercase block mb-0.5"
            >
              {t('area')}
            </label>
            <select
              id="area-inline"
              value={selectedArea}
              onChange={(e) => setSelectedArea(e.target.value)}
              className="text-navy focus:outline-none w-full cursor-pointer bg-transparent py-0 text-[12.5px] font-semibold"
            >
              {SEARCH_AREAS.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>

          {/* Property Type */}
          <div className="bg-paper border border-line px-3.5 py-2 rounded-none flex flex-col justify-center">
            <label
              htmlFor="property-type-inline"
              className="text-[8px] font-bold tracking-[0.14em] text-muted uppercase block mb-0.5"
            >
              {t('propertyType')}
            </label>
            <select
              id="property-type-inline"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="text-navy focus:outline-none w-full cursor-pointer bg-transparent py-0 text-[12.5px] font-semibold"
            >
              {SEARCH_PROPERTY_TYPES.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>

          {/* Budget */}
          <div className="bg-paper border border-line px-3.5 py-2 rounded-none flex flex-col justify-center">
            <label
              htmlFor="budget-inline"
              className="text-[8px] font-bold tracking-[0.14em] text-muted uppercase block mb-0.5"
            >
              {t('budgetLabel')}
            </label>
            <select
              id="budget-inline"
              defaultValue={SEARCH_BUDGETS[0]}
              className="text-navy focus:outline-none w-full cursor-pointer bg-transparent py-0 text-[12.5px] font-semibold"
            >
              {SEARCH_BUDGETS.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>

          {/* Submit Search Button */}
          <button
            type="submit"
            disabled={isSearching}
            className="w-full lg:w-auto bg-navy hover:bg-gold text-white hover:text-navy px-7 py-3.5 text-[11px] font-bold uppercase tracking-[0.16em] transition-all rounded-none cursor-pointer flex items-center justify-center gap-2 shrink-0 active:scale-97 shadow-sm disabled:opacity-75"
          >
            {isSearching ? (
              <>
                <svg className="w-4 h-4 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                {t('searchingShort')}
              </>
            ) : (
              <>
                TÌM KIẾM
                <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}


