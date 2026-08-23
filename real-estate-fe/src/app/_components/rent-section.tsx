'use client';

import { ListingCard } from '@/components/features/listing/listing-card';
import { ButtonLink } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { Listing } from '@/types';

interface RentSectionProps {
  apartments: Listing[];
  villas: Listing[];
  houses: Listing[];
}

export function RentSection({ apartments, villas, houses }: RentSectionProps) {
  // Combine listings to ensure a good mix of all types
  const combined: Listing[] = [];
  const maxLen = Math.max(apartments.length, villas.length, houses.length);
  for (let i = 0; i < maxLen; i++) {
    if (apartments[i]) combined.push(apartments[i]);
    if (villas[i]) combined.push(villas[i]);
    if (houses[i]) combined.push(houses[i]);
  }
  
  // Show max 6 items
  const displayListings = combined.slice(0, 6);
  const totalCount = apartments.length + villas.length + houses.length;

  if (displayListings.length === 0) return null;

  return (
    <section id="rent" className="py-20 lg:py-28 bg-ivory">
      <div className="container-page">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <div>
            <p className="text-[11px] font-bold text-gold uppercase tracking-[0.22em] mb-3">
              — Homes to Rent
            </p>
            <h2 className="font-display text-navy text-[32px] sm:text-[38px] lg:text-[44px] leading-[1.1] font-normal max-w-lg">
              Arrive, settle in and feel at home.
            </h2>
          </div>
          <p className="text-muted text-[14px] leading-relaxed max-w-xs lg:max-w-sm text-left md:text-right">
            Handpicked apartments, private villas, and townhouses across Da Nang's most desirable addresses — curated for dependable long-term living.
          </p>
        </div>

        {/* Listings Grid */}
        <div
          className={cn(
            'grid gap-5 animate-fade-in',
            displayListings.length === 1
              ? 'sm:grid-cols-1 max-w-sm'
              : displayListings.length === 2
                ? 'sm:grid-cols-2 max-w-2xl'
                : 'sm:grid-cols-2 lg:grid-cols-3',
          )}
        >
          {displayListings.map((listing, index) => (
            <ListingCard
              key={listing.slug}
              listing={listing}
              featured={false}
              priority={index === 0}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ))}
        </div>

        {/* CTA */}
        <div className="mt-10 flex items-center justify-between border-t border-line pt-8">
          <p className="text-[13px] text-muted">
            Showing <strong className="text-navy">{displayListings.length}</strong> of{' '}
            <strong className="text-navy">{totalCount}</strong> properties for rent
          </p>
          <ButtonLink href="/properties?type=rent" variant="outline" className="text-navy">
            View all properties for rent <span aria-hidden>→</span>
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}

