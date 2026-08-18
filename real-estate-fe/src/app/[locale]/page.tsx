import { setRequestLocale } from 'next-intl/server';

import { getArticles } from '@/lib/db/articles';
import { getListingsByType } from '@/lib/db/listings';

import { HeroSection } from '../_components/hero-section';
import { JournalSection } from '../_components/journal-section';
import { ListingsSection } from '../_components/listings-section';
import { QuoteRequestSection } from '../_components/quote-request-section';
import { SiteFooter } from '../_components/site-footer';
import { SiteHeader } from '../_components/site-header';
import { StorySection } from '../_components/story-section';

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  // Server Component fetch thẳng, song song — không useEffect, không client waterfall.
  const [saleListings, rentListings, articles] = await Promise.all([
    getListingsByType('sale'),
    getListingsByType('rent'),
    getArticles(),
  ]);

  return (
    <>
      <SiteHeader />

      <main className="animate-fade-in">
        <div className="animate-fade-in-up">
          <HeroSection />
        </div>
        <div className="animate-fade-in-up stagger-1">
          <StorySection />
        </div>

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

        <ListingsSection
          id="buy"
          kicker="Homes to buy"
          title="Own a distinctive address in Da Nang."
          lead="Five selected residences across the city's most desirable coastal and urban neighbourhoods."
          listings={saleListings}
          ctaLabel="Request the full buyer collection"
          layout="featured"
          className="bg-paper"
        />

        <JournalSection articles={articles} />
        <QuoteRequestSection />
      </main>

      <SiteFooter />
    </>
  );
}


