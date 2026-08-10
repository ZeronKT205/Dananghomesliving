'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { SEARCH_AREAS, SEARCH_BUDGETS, SEARCH_PROPERTY_TYPES } from '@/config/constants';
import { cn } from '@/lib/utils';
import type { ListingType } from '@/types';

const TABS: { value: ListingType; label: string }[] = [
  { value: 'sale', label: 'Buy' },
  { value: 'rent', label: 'Rent' },
];

export function PropertySearch() {
  const router = useRouter();
  const [tab, setTab] = useState<ListingType>('sale');
  const [selectedArea, setSelectedArea] = useState<string>(SEARCH_AREAS[0]);
  const [selectedType, setSelectedType] = useState<string>(SEARCH_PROPERTY_TYPES[0]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const params = new URLSearchParams();
    params.set('type', tab);
    if (selectedArea && selectedArea !== 'All Da Nang') {
      params.set('area', selectedArea);
    }
    if (selectedType && selectedType !== 'Any property') {
      params.set('propertyType', selectedType);
    }
    router.push(`/properties?${params.toString()}`);
  };

  return (
    <div className="relative z-8 -mt-9">
      <div className="container-page">
        <form
          onSubmit={handleSubmit}
          className="border-t-gold shadow-lift grid grid-cols-1 border-t-[3px] bg-white md:grid-cols-[auto_1fr]"
        >
          <div
            role="tablist"
            aria-label="Listing type"
            className="border-line grid grid-cols-2 border-b md:grid-cols-1 md:grid-rows-2 md:border-r md:border-b-0"
          >
            {TABS.map((item) => {
              const isActive = item.value === tab;
              return (
                <button
                  key={item.value}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setTab(item.value)}
                  className={cn(
                    'focus-visible:outline-gold cursor-pointer px-6 py-4 text-[10.5px] font-bold tracking-[0.13em] uppercase transition-colors focus-visible:outline-2 focus-visible:-outline-offset-2 md:min-w-[118px]',
                    isActive ? 'bg-navy text-white' : 'text-navy hover:bg-ivory bg-white',
                  )}
                >
                  {item.label}
                </button>
              );
            })}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.1fr_1fr_1fr_auto]">
            {/* Area */}
            <div className="border-line grid content-center gap-0.5 border-b px-5 py-3.5 sm:border-b-0 lg:border-r">
              <label
                htmlFor="area"
                className="text-[8.5px] font-bold tracking-[0.14em] text-[#8992a0] uppercase"
              >
                Area
              </label>
              <select
                id="area"
                value={selectedArea}
                onChange={(e) => setSelectedArea(e.target.value)}
                className="text-navy focus-visible:outline-gold w-full cursor-pointer bg-transparent py-0.5 text-[13px] font-semibold focus-visible:outline-2"
              >
                {SEARCH_AREAS.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>

            {/* Property Type */}
            <div className="border-line grid content-center gap-0.5 border-b px-5 py-3.5 sm:border-b-0 lg:border-r">
              <label
                htmlFor="property-type"
                className="text-[8.5px] font-bold tracking-[0.14em] text-[#8992a0] uppercase"
              >
                Property type
              </label>
              <select
                id="property-type"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="text-navy focus-visible:outline-gold w-full cursor-pointer bg-transparent py-0.5 text-[13px] font-semibold focus-visible:outline-2"
              >
                {SEARCH_PROPERTY_TYPES.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>

            {/* Budget */}
            <div className="border-line grid content-center gap-0.5 border-b px-5 py-3.5 sm:border-b-0 lg:border-r">
              <label
                htmlFor="budget"
                className="text-[8.5px] font-bold tracking-[0.14em] text-[#8992a0] uppercase"
              >
                Budget
              </label>
              <select
                id="budget"
                defaultValue={SEARCH_BUDGETS[0]}
                className="text-navy focus-visible:outline-gold w-full cursor-pointer bg-transparent py-0.5 text-[13px] font-semibold focus-visible:outline-2"
              >
                {SEARCH_BUDGETS.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="bg-gold text-navy hover:bg-gold-soft focus-visible:outline-navy cursor-pointer px-6 py-4 text-[10px] font-extrabold tracking-[0.13em] uppercase transition-colors focus-visible:outline-2 focus-visible:-outline-offset-2 sm:col-span-2 lg:col-span-1 lg:min-w-[140px]"
            >
              Find a home →
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
