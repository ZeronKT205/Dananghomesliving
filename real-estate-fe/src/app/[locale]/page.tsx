import { getTranslations, setRequestLocale } from 'next-intl/server';

import { DEFAULT_LOCALE, isLocale } from '@/config/locales';
import { getArticles } from '@/lib/db/articles';
import { getListingsByType } from '@/lib/db/listings';

import { HeroSection } from '../_components/hero-section';
import { JournalSection } from '../_components/journal-section';
import { ListingsSection } from '../_components/listings-section';
import { QuoteRequestSection } from '../_components/quote-request-section';
import { SiteFooter } from '../_components/site-footer';
import { SiteHeader } from '../_components/site-header';
import { StorySection } from '../_components/story-section';

/*
 * ISR 60 giây.
 *
 * Trang này đọc DB nhưng được dựng sẵn lúc build, nên nếu không có dòng này thì
 * tin đăng mới KHÔNG bao giờ hiện ra cho tới lần build kế tiếp. Server Action
 * trong CMS đã gọi `revalidatePath` để cập nhật ngay; con số 60 giây là lưới
 * an toàn cho những thay đổi không đi qua CMS.
 */
export const revalidate = 60;

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('Listings');

  // Server Component fetch thẳng, song song — không useEffect, không client waterfall.
  const [saleListings, rentListings, articles] = await Promise.all([
    getListingsByType('sale', isLocale(locale) ? locale : DEFAULT_LOCALE),
    getListingsByType('rent', isLocale(locale) ? locale : DEFAULT_LOCALE),
    getArticles(isLocale(locale) ? locale : DEFAULT_LOCALE),
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
          kicker={t('rentKicker')}
          title={t('rentTitle')}
          lead={t('rentLead')}
          listings={rentListings}
          ctaLabel="Tell us your rental brief"
          layout="standard"
          className="bg-ivory"
        />

        <ListingsSection
          id="buy"
          kicker={t('saleKicker')}
          title={t('saleTitle')}
          lead={t('saleLead')}
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


