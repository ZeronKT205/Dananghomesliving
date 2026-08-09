'use client';

import { useState } from 'react';

import { SEARCH_AREAS, SEARCH_BUDGETS, SEARCH_PROPERTY_TYPES } from '@/config/constants';
import { cn } from '@/lib/utils';
import type { ListingType } from '@/types';

const TABS: { value: ListingType; label: string; target: string }[] = [
  { value: 'sale', label: 'Buy', target: 'buy' },
  { value: 'rent', label: 'Rent', target: 'rent' },
];

const FIELDS = [
  { id: 'area', label: 'Area', options: SEARCH_AREAS },
  { id: 'property-type', label: 'Property type', options: SEARCH_PROPERTY_TYPES },
  { id: 'budget', label: 'Budget', options: SEARCH_BUDGETS },
] as const;

/** Hộp tìm kiếm đè lên mép dưới hero.
 *  ⚠️ Chưa lọc thật — mới chỉ cuộn tới section tương ứng. Khi có API, chuyển
 *  các lựa chọn thành query param và validate bằng Zod ở phía server. */
export function PropertySearch() {
  const [tab, setTab] = useState<ListingType>('sale');

  return (
    <div className="relative z-8 -mt-9">
      <div className="container-page">
        <form
          onSubmit={(event) => {
            event.preventDefault();
            const target = TABS.find((item) => item.value === tab)?.target;
            if (target) document.getElementById(target)?.scrollIntoView({ behavior: 'smooth' });
          }}
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
            {FIELDS.map((field) => (
              <div
                key={field.id}
                className="border-line grid content-center gap-0.5 border-b px-5 py-3.5 last:border-b-0 sm:border-b-0 lg:border-r lg:border-b-0"
              >
                <label
                  htmlFor={field.id}
                  className="text-[8.5px] font-bold tracking-[0.14em] text-[#8992a0] uppercase"
                >
                  {field.label}
                </label>
                <select
                  id={field.id}
                  defaultValue={field.options[0]}
                  className="text-navy focus-visible:outline-gold w-full cursor-pointer bg-transparent py-0.5 text-[13px] font-semibold focus-visible:outline-2"
                >
                  {field.options.map((option) => (
                    <option key={option}>{option}</option>
                  ))}
                </select>
              </div>
            ))}

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
