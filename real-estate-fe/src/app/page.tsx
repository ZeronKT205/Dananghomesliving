import { getArticles } from '@/lib/db/articles';
import { getListingsByType } from '@/lib/db/listings';

import { ContactCta } from './_components/contact-cta';
import { HeroSection } from './_components/hero-section';
import { JournalSection } from './_components/journal-section';
import { ListingsSection } from './_components/listings-section';
import { PropertySearch } from './_components/property-search';
import { SiteFooter } from './_components/site-footer';
import { SiteHeader } from './_components/site-header';
import { StorySection } from './_components/story-section';

export default async function HomePage() {
  // Server Component fetch thẳng, song song — không useEffect, không client waterfall.
  const [saleListings, rentListings, articles] = await Promise.all([
    getListingsByType('sale'),
    getListingsByType('rent'),
    getArticles(),
  ]);

  return (
    <>
      <SiteHeader />

      <main>
        <HeroSection />
        <PropertySearch />
        <StorySection />

        <ListingsSection
          id="buy"
          kicker="Homes to buy"
          title="Own a distinctive address in Da Nang."
          lead="Five selected residences across the city’s most desirable coastal and urban neighbourhoods."
          listings={saleListings}
          ctaLabel="Request the full buyer collection"
          layout="featured"
          className="bg-paper"
        />

        <ListingsSection
          id="rent"
          kicker="Homes to rent"
          title="Arrive, settle in and feel at home."
          lead="Six fully furnished residences selected for comfort, location and dependable long-term living."
          listings={rentListings}
          ctaLabel="Tell us your rental brief"
          layout="standard"
          className="bg-ivory"
        />

        <JournalSection articles={articles} />
        <ContactCta />
      </main>

      <SiteFooter />
    </>
  );
}
