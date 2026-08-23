import { getTranslations, setRequestLocale } from 'next-intl/server';

import { DEFAULT_LOCALE, isLocale } from '@/config/locales';
import { getArticles } from '@/lib/db/articles';
import { getListingsByCategorySlug, getListingsByType } from '@/lib/db/listings';

import { BuySection } from '../_components/buy-section';
import { HeroSection } from '../_components/hero-section';
import { JournalSection } from '../_components/journal-section';
import { QuoteRequestSection } from '../_components/quote-request-section';
import { RentSection } from '../_components/rent-section';
import { SiteFooter } from '../_components/site-footer';
import { SiteHeader } from '../_components/site-header';
import { StorySection } from '../_components/story-section';

/*
 * ISR 60 giây — danh sách được cập nhật ngay khi CMS revalidate.
 */
export const revalidate = 60;

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  await getTranslations('Listings');
  const lang = isLocale(locale) ? locale : DEFAULT_LOCALE;

  // Fetch all categories + sale listings in parallel
  const [aptListings, villaListings, houseListings, saleListings, articles] = await Promise.all([
    getListingsByCategorySlug('apartment', lang, 100),
    getListingsByCategorySlug('villa', lang, 100),
    getListingsByCategorySlug('house', lang, 100),
    getListingsByType('sale', lang),
    getArticles(lang),
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

        {/* RENT — Apartments, Villas, Houses with tab navigation */}
        <RentSection
          apartments={aptListings}
          villas={villaListings}
          houses={houseListings}
        />

        {/* BUY — Only renders when sale listings exist */}
        <BuySection listings={saleListings} />

        <JournalSection articles={articles} />
        <QuoteRequestSection />
      </main>

      <SiteFooter />
    </>
  );
}



