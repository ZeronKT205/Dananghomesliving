'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useState, useEffect } from 'react';

import { SEARCH_AREAS, SEARCH_BUDGETS, SEARCH_PROPERTY_TYPES } from '@/config/constants';
import { cn } from '@/lib/utils';
import type { ListingType } from '@/types';

const TABS: { value: ListingType; label: string }[] = [
  { value: 'sale', label: 'BẤT ĐỘNG SẢN MUA' },
  { value: 'rent', label: 'BẤT ĐỘNG SẢN THUÊ' },
];

export function PropertySearch() {
  return (
    <Suspense fallback={<div className="h-28 w-full bg-white/50 animate-pulse rounded-2xl" />}>
      <PropertySearchInner />
    </Suspense>
  );
}

function PropertySearchInner() {
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
    const params = new URLSearchParams(searchParams.toString());
    params.set('type', newTab);
    router.push(`/properties?${params.toString()}`, { scroll: false });
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

    requestAnimationFrame(() => {
      document.getElementById('properties-results')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    setTimeout(() => {
      setIsSearching(false);
    }, 400);
  };

  return (
    <div className="w-full">
      <form
        onSubmit={handleSubmit}
        className="w-full bg-white/95 backdrop-blur-md border border-line shadow-lift rounded-2xl p-4 sm:p-5 transition-all"
        role="search"
        aria-label="Tìm kiếm bất động sản Đà Nẵng"
      >
        {/* Top bar: Tab Selectors */}
        <div className="flex items-center justify-between border-b border-line pb-3.5 mb-4">
          <div 
            role="tablist"
            aria-label="Loại hình giao dịch"
            className="inline-flex bg-paper p-1 rounded-xl border border-line"
          >
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
                    'px-4 sm:px-6 py-2 text-[11px] font-bold tracking-[0.14em] uppercase transition-all duration-200 cursor-pointer rounded-lg text-center',
                    isActive 
                      ? 'bg-navy text-white shadow-xs font-bold' 
                      : 'text-muted hover:text-navy hover:bg-black/5'
                  )}
                >
                  {item.label}
                </button>
              );
            })}
          </div>

          <span className="hidden md:inline-flex items-center gap-1.5 text-xs text-muted font-medium">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            Cập nhật liên tục 120+ bất động sản
          </span>
        </div>

        {/* Filter Selects Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_auto] gap-3 items-center">
          {/* Area */}
          <div className="bg-paper border border-line/80 hover:border-gold/50 focus-within:border-gold px-4 py-2.5 rounded-xl transition-colors">
            <label
              htmlFor="area-select"
              className="text-[9px] font-bold tracking-[0.14em] text-gold uppercase block mb-0.5"
            >
              Khu vực (Area)
            </label>
            <select
              id="area-select"
              value={selectedArea}
              onChange={(e) => setSelectedArea(e.target.value)}
              className="text-navy font-medium focus:outline-none w-full cursor-pointer bg-transparent py-0.5 text-[13px] tracking-tight"
            >
              {SEARCH_AREAS.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>

          {/* Property Type */}
          <div className="bg-paper border border-line/80 hover:border-gold/50 focus-within:border-gold px-4 py-2.5 rounded-xl transition-colors">
            <label
              htmlFor="property-type-select"
              className="text-[9px] font-bold tracking-[0.14em] text-gold uppercase block mb-0.5"
            >
              Loại hình (Property Type)
            </label>
            <select
              id="property-type-select"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="text-navy font-medium focus:outline-none w-full cursor-pointer bg-transparent py-0.5 text-[13px] tracking-tight"
            >
              {SEARCH_PROPERTY_TYPES.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>

          {/* Budget */}
          <div className="bg-paper border border-line/80 hover:border-gold/50 focus-within:border-gold px-4 py-2.5 rounded-xl transition-colors">
            <label
              htmlFor="budget-select"
              className="text-[9px] font-bold tracking-[0.14em] text-gold uppercase block mb-0.5"
            >
              Mức ngân sách (Budget)
            </label>
            <select
              id="budget-select"
              defaultValue={SEARCH_BUDGETS[0]}
              className="text-navy font-medium focus:outline-none w-full cursor-pointer bg-transparent py-0.5 text-[13px] tracking-tight"
            >
              {SEARCH_BUDGETS.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>

          {/* Search Action Button */}
          <button
            type="submit"
            disabled={isSearching}
            className="w-full lg:w-auto bg-navy hover:bg-gold text-white hover:text-navy px-8 py-4 text-[12px] font-bold uppercase tracking-[0.16em] transition-all rounded-xl cursor-pointer flex items-center justify-center gap-2.5 shrink-0 active:scale-98 shadow-sm hover:shadow-md disabled:opacity-75"
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
                <span className="text-base leading-none transition-transform duration-300 group-hover:translate-x-1">→</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

