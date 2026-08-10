'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import { ListingCard } from '@/components/features/listing/listing-card';
import { cn } from '@/lib/utils';
import type { Listing } from '@/types';

const AREAS = ['All Da Nang', 'Son Tra', 'Ngu Hanh Son', 'Hai Chau', 'My An', 'Hoa Hai'] as const;
const PROPERTY_TYPES = ['All Types', 'Apartment', 'Villa', 'Penthouse', 'Beach residence'] as const;

export function PropertiesClientGrid({ listings }: { listings: Listing[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [activeDeal, setActiveDeal] = useState<'rent' | 'sale'>('sale');
  const [selectedArea, setSelectedArea] = useState<string>('All Da Nang');
  const [selectedType, setSelectedType] = useState<string>('All Types');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Sync state when URL params change or on initial client mount
  useEffect(() => {
    const typeFromUrl = searchParams?.get('type');
    setActiveDeal(typeFromUrl === 'rent' ? 'rent' : 'sale');

    const areaFromUrl = searchParams?.get('area');
    setSelectedArea(areaFromUrl || 'All Da Nang');

    const propTypeFromUrl = searchParams?.get('propertyType');
    setSelectedType(propTypeFromUrl || 'All Types');
  }, [searchParams]);

  // Update URL state
  const updateUrlState = (deal: 'rent' | 'sale', area: string, propType: string) => {
    const params = new URLSearchParams();
    params.set('type', deal);
    if (area && area !== 'All Da Nang') params.set('area', area);
    if (propType && propType !== 'All Types') params.set('propertyType', propType);
    router.replace(`/properties?${params.toString()}`, { scroll: false });
  };

  const handleDealChange = (deal: 'rent' | 'sale') => {
    setActiveDeal(deal);
    updateUrlState(deal, selectedArea, selectedType);
  };

  const handleAreaChange = (area: string) => {
    setSelectedArea(area);
    updateUrlState(activeDeal, area, selectedType);
  };

  const handleTypeChange = (propType: string) => {
    setSelectedType(propType);
    updateUrlState(activeDeal, selectedArea, propType);
  };

  const filteredListings = listings.filter((item) => {
    const matchesDeal = item.listingType === activeDeal;
    const matchesArea =
      selectedArea === 'All Da Nang' ||
      item.location.toLowerCase().includes(selectedArea.toLowerCase()) ||
      (item.areaName && item.areaName.toLowerCase().includes(selectedArea.toLowerCase()));
    const matchesType =
      selectedType === 'All Types' ||
      (item.propertyType && item.propertyType.toLowerCase() === selectedType.toLowerCase()) ||
      item.title.toLowerCase().includes(selectedType.toLowerCase());
    const matchesQuery =
      searchQuery.trim() === '' ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesDeal && matchesArea && matchesType && matchesQuery;
  });

  return (
    <div className="space-y-5">
      {/* ── Control Toolbar with Centered RENT / BUY ── */}
      <div className="border-line bg-white border p-3.5 shadow-xs">
        {/* 1. Centered RENT / BUY Segment Switch */}
        <div className="flex justify-center mb-3">
          <div className="border-line bg-paper flex items-center border p-1 shadow-xs">
            <button
              type="button"
              onClick={() => handleDealChange('rent')}
              className={cn(
                'px-7 py-2 text-[12px] font-bold tracking-[0.16em] uppercase transition-all duration-200 cursor-pointer min-w-[110px] text-center',
                activeDeal === 'rent'
                  ? 'bg-navy text-white shadow-xs'
                  : 'text-navy hover:text-gold hover:bg-white/50',
              )}
            >
              RENT
            </button>
            <button
              type="button"
              onClick={() => handleDealChange('sale')}
              className={cn(
                'px-7 py-2 text-[12px] font-bold tracking-[0.16em] uppercase transition-all duration-200 cursor-pointer min-w-[110px] text-center',
                activeDeal === 'sale'
                  ? 'bg-navy text-white shadow-xs'
                  : 'text-navy hover:text-gold hover:bg-white/50',
              )}
            >
              BUY
            </button>
          </div>
        </div>

        {/* 2. Sub-filters & Search Bar */}
        <div className="border-t border-line/60 pt-3 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-2.5 justify-center lg:justify-start">
            {/* Area Select */}
            <select
              aria-label="Location / Neighborhood"
              value={selectedArea}
              onChange={(e) => handleAreaChange(e.target.value)}
              className="border-line text-navy focus:border-gold bg-paper min-w-[160px] border px-3 py-1.5 text-[13px] font-semibold focus:outline-none cursor-pointer"
            >
              {AREAS.map((a) => (
                <option key={a} value={a}>
                  {a === 'All Da Nang' ? 'All Locations' : a}
                </option>
              ))}
            </select>

            {/* Property Type Select */}
            <select
              aria-label="Property Type / Service"
              value={selectedType}
              onChange={(e) => handleTypeChange(e.target.value)}
              className="border-line text-navy focus:border-gold bg-paper min-w-[160px] border px-3 py-1.5 text-[13px] font-semibold focus:outline-none cursor-pointer"
            >
              {PROPERTY_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t === 'All Types' ? 'All Property Types' : t}
                </option>
              ))}
            </select>
          </div>

          {/* Search Keyword & Summary Badge */}
          <div className="flex flex-wrap items-center gap-3 justify-center lg:justify-end">
            <div className="relative flex-1 min-w-[180px] lg:w-60">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search title, address..."
                className="border-line text-navy focus:border-gold w-full border bg-paper py-1.5 pl-8 pr-3 text-[13px] focus:outline-none"
              />
              <svg
                className="text-muted absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>

            <div className="flex items-center gap-2 text-[12px] whitespace-nowrap">
              <span className="bg-paper border-line text-navy border px-2.5 py-1 text-[12px] font-medium">
                <strong className="text-navy font-bold">{filteredListings.length}</strong> homes
              </span>

              {(selectedArea !== 'All Da Nang' || selectedType !== 'All Types' || searchQuery !== '') && (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedArea('All Da Nang');
                    setSelectedType('All Types');
                    setSearchQuery('');
                    updateUrlState(activeDeal, 'All Da Nang', 'All Types');
                  }}
                  className="text-gold hover:underline font-bold text-[11px] tracking-wider uppercase cursor-pointer"
                >
                  Reset
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Property Cards Grid */}
      {filteredListings.length === 0 ? (
        <div className="border border-line bg-white p-12 text-center">
          <p className="font-display text-navy text-[24px]">No matching properties found</p>
          <p className="text-muted mt-2 text-[14px]">
            Try clearing your search filters or switching between RENT and BUY modes.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredListings.map((listing, idx) => (
            <ListingCard
              key={listing.slug}
              listing={listing}
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              priority={idx < 3}
            />
          ))}
        </div>
      )}
    </div>
  );
}
