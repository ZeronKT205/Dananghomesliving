import { getTranslations, setRequestLocale } from 'next-intl/server';

import { APP_NAME } from '@/config/constants';
import { DEFAULT_LOCALE, isLocale } from '@/config/locales';
import { getArticles } from '@/lib/db/articles';

import { QuoteRequestSection } from '../../_components/quote-request-section';
import { SiteFooter } from '../../_components/site-footer';
import { SiteHeader } from '../../_components/site-header';
import { NewsClientGrid } from '../tips/_components/news-client-grid';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: `News & Market Insights | ${APP_NAME}`,
  description:
    'Stay informed with curated real estate analysis, neighbourhood guides, ownership policies, and luxury coastal living insights in Da Nang.',
};

/*
 * ISR 60 giây.
 *
 * Trang này đọc DB nhưng được dựng sẵn lúc build, nên nếu không có dòng này thì
 * tin đăng mới KHÔNG bao giờ hiện ra cho tới lần build kế tiếp. Server Action
 * trong CMS đã gọi `revalidatePath` để cập nhật ngay; con số 60 giây là lưới
 * an toàn cho những thay đổi không đi qua CMS.
 */
export const revalidate = 60;

export default async function NewsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('News');

  const articles = await getArticles(isLocale(locale) ? locale : DEFAULT_LOCALE);

  return (
    <>
      <SiteHeader />

      <main className="bg-paper animate-fade-in min-h-screen pt-12 pb-0 lg:pt-20">
        <div className="container-page pb-16 lg:pb-20">
          {/* Header Banner */}
          <div className="border-line mb-10 border-b pb-8 md:mb-14">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div className="max-w-2xl">
                <span className="text-gold text-[11px] sm:text-[12px] font-bold tracking-[0.22em] uppercase block mb-1">
                  {t('pageKicker')}
                </span>
                <h1 className="font-display text-navy text-[32px] font-normal leading-[1.12] sm:text-[42px] lg:text-[48px]">
                  {t('pageTitle')}
                </h1>
              </div>

              <p className="text-muted max-w-xl text-[15px] sm:text-[16px] leading-relaxed font-sans">
                {t('pageLead')}
              </p>
            </div>
          </div>

          {/* Interactive News Grid */}
          <NewsClientGrid articles={articles} />
        </div>

        {/* Consultation Request Form */}
        <QuoteRequestSection />
      </main>

      <SiteFooter />
    </>
  );
}
