import { ListingCard } from '@/components/features/listing/listing-card';
import { ButtonLink } from '@/components/ui/button';
import type { Listing } from '@/types';

interface BuySectionProps {
  listings: Listing[];
}

export function BuySection({ listings }: BuySectionProps) {
  const isEmpty = !listings || listings.length === 0;

  return (
    <section id="buy" className="py-20 lg:py-28 bg-paper">
      <div className="container-page">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <div>
            <p className="text-[11px] font-bold text-gold uppercase tracking-[0.22em] mb-3">
              — Homes to Buy
            </p>
            <h2 className="font-display text-navy text-[32px] sm:text-[38px] lg:text-[44px] leading-[1.1] font-normal max-w-lg">
              Own a distinctive address in Da Nang.
            </h2>
          </div>
          <p className="text-muted text-[14px] leading-relaxed max-w-xs lg:max-w-sm text-left md:text-right">
            Selected residences across Da&nbsp;Nang&apos;s most desirable coastal and urban neighbourhoods — for owner-occupiers and long-term investors.
          </p>
        </div>

        {isEmpty ? (
          /* ── Coming Soon State (No Button) ── */
          <div className="border border-dashed border-gold/40 bg-ivory/60 rounded-none py-20 px-8 flex flex-col items-center text-center gap-5">
            {/* Icon */}
            <div className="w-14 h-14 rounded-none bg-gold/10 border border-gold/30 flex items-center justify-center">
              <svg className="w-6 h-6 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M3 10.5l9-7.5 9 7.5M5.25 9v10.5A.75.75 0 006 20.25h4.5a.75.75 0 00.75-.75v-4.5a.75.75 0 01.75-.75h1.5a.75.75 0 01.75.75v4.5c0 .414.336.75.75.75H18a.75.75 0 00.75-.75V9" />
              </svg>
            </div>

            <div>
              <p className="text-[11px] font-bold text-gold uppercase tracking-[0.2em] mb-2">
                Coming Soon
              </p>
              <h3 className="font-display text-navy text-[22px] font-normal mb-3">
                Exclusive buy listings are being curated
              </h3>
              <p className="text-muted text-[13.5px] leading-relaxed max-w-md">
                Our team is personally reviewing premium properties for sale across Da Nang&apos;s most sought-after addresses. They will be available soon.
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Listings Grid — Featured layout (asymmetric) */}
            <div className="grid gap-5 md:grid-cols-12">
              {listings.map((listing, index) => (
                <div
                  key={listing.slug}
                  className={
                    listings.length === 1
                      ? 'md:col-span-12'
                      : index === 0
                        ? 'md:col-span-7'
                        : index === 1
                          ? 'md:col-span-5'
                          : 'md:col-span-4'
                  }
                >
                  <ListingCard
                    listing={listing}
                    featured={listings.length > 1 && index < 2}
                    priority={index === 0}
                    sizes={
                      listings.length > 1 && index < 2
                        ? '(max-width: 768px) 100vw, 50vw'
                        : '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'
                    }
                  />
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="mt-10 flex items-center justify-between border-t border-line pt-8">
              <p className="text-[13px] text-muted">
                <strong className="text-navy">{listings.length}</strong> properties for sale
              </p>
              <ButtonLink href="/properties?type=sale" variant="outline" className="text-navy">
                View all properties for sale <span aria-hidden>→</span>
              </ButtonLink>
            </div>
          </>
        )}
      </div>
    </section>
  );
}

