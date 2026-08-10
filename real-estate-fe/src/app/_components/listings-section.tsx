import { ListingCard } from '@/components/features/listing/listing-card';
import { ButtonLink } from '@/components/ui/button';
import {
  SectionHead,
  SectionKicker,
  SectionLead,
  SectionTitle,
} from '@/components/ui/section-heading';
import { cn } from '@/lib/utils';
import type { Listing } from '@/types';

type ListingsSectionProps = {
  id: string;
  kicker: string;
  title: string;
  lead: string;
  listings: Listing[];
  ctaLabel: string;
  /** `featured` = lưới bất đối xứng 12 cột; `standard` = lưới 3 cột đều. */
  layout: 'featured' | 'standard';
  className?: string;
};

export function ListingsSection({
  id,
  kicker,
  title,
  lead,
  listings,
  ctaLabel,
  layout,
  className,
}: ListingsSectionProps) {
  const isFeatured = layout === 'featured';

  return (
    <section id={id} className={cn('py-20 lg:py-24', className)}>
      <div className="container-page">
        <SectionHead aside={<SectionLead className="mt-0">{lead}</SectionLead>}>
          <SectionKicker>{kicker}</SectionKicker>
          <SectionTitle>{title}</SectionTitle>
        </SectionHead>

        <div
          className={cn(
            'grid gap-5',
            isFeatured ? 'md:grid-cols-12' : 'sm:grid-cols-2 lg:grid-cols-3',
          )}
        >
          {listings.map((listing, index) => (
            <div
              key={listing.slug}
              className={cn(
                isFeatured &&
                  (index === 0 ? 'md:col-span-7' : index === 1 ? 'md:col-span-5' : 'md:col-span-4'),
              )}
            >
              <ListingCard
                listing={listing}
                featured={isFeatured && index < 2}
                priority={index === 0}
                sizes={
                  isFeatured && index < 2
                    ? '(max-width: 768px) 100vw, 50vw'
                    : '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'
                }
              />
            </div>
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <ButtonLink href={id === 'buy' ? '/properties?type=sale' : '/properties?type=rent'} variant="outline" className="text-navy">
            {ctaLabel} <span aria-hidden>→</span>
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
