'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useState, useEffect } from 'react';

import { SEARCH_AREAS, SEARCH_BUDGETS, SEARCH_PROPERTY_TYPES } from '@/config/constants';
import { cn } from '@/lib/utils';
import type { ListingType } from '@/types';

const TABS: { value: ListingType; label: string }[] = [
  { value: 'sale', label: 'BUY' },
  { value: 'rent', label: 'RENT' },
];

export function PropertySearch({ redirectOnlyOnSubmit = false }: { redirectOnlyOnSubmit?: boolean }) {
  return (
    <Suspense fallback={null}>
      <PropertySearchInner redirectOnlyOnSubmit={redirectOnlyOnSubmit} />
    </Suspense>
  );
}

function PropertySearchInner({ redirectOnlyOnSubmit }: { redirectOnlyOnSubmit: boolean }) {
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

  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* Compact Filter Bar with BUY/RENT buttons on the same row on the left */}
      <form
        onSubmit={handleSubmit}
        className="w-full bg-white border border-line shadow-lift rounded-none p-2 sm:p-2.5"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[auto_1fr_1fr_1fr_auto] gap-2 items-stretch">
          {/* BUY & RENT Toggle Group on the left side of the same row */}
          <div
            role="tablist"
            aria-label="Listing type"
            className="relative inline-flex bg-paper p-1 rounded-none border border-line shadow-xs overflow-hidden items-center self-stretch justify-center"
          >
            {/* Sliding Pill Background Indicator */}
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
                  {item.label}
                </button>
              );
            })}
          </div>

          {/* Area Select */}
          <div className="bg-paper border border-line px-3.5 py-2 rounded-none flex flex-col justify-center">
            <label
              htmlFor="area"
              className="text-[8px] font-bold tracking-[0.14em] text-muted uppercase block mb-0.5"
            >
              Khu vực (Area)
            </label>
            <select
              id="area"
              value={selectedArea}
              onChange={(e) => setSelectedArea(e.target.value)}
              className="text-navy focus:outline-none w-full cursor-pointer bg-transparent py-0 text-[12.5px] font-semibold"
            >
              {SEARCH_AREAS.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>

          {/* Property Type Select */}
          <div className="bg-paper border border-line px-3.5 py-2 rounded-none flex flex-col justify-center">
            <label
              htmlFor="property-type"
              className="text-[8px] font-bold tracking-[0.14em] text-muted uppercase block mb-0.5"
            >
              Loại hình (Property Type)
            </label>
            <select
              id="property-type"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="text-navy focus:outline-none w-full cursor-pointer bg-transparent py-0 text-[12.5px] font-semibold"
            >
              {SEARCH_PROPERTY_TYPES.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>

          {/* Budget Select */}
          <div className="bg-paper border border-line px-3.5 py-2 rounded-none flex flex-col justify-center">
            <label
              htmlFor="budget"
              className="text-[8px] font-bold tracking-[0.14em] text-muted uppercase block mb-0.5"
            >
              Mức ngân sách (Budget)
            </label>
            <select
              id="budget"
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
                Đang tìm...
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

