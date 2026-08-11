import { APP_NAME } from '@/config/constants';
import { getArticles } from '@/lib/db/articles';

import { QuoteRequestSection } from '../_components/quote-request-section';
import { SiteFooter } from '../_components/site-footer';
import { SiteHeader } from '../_components/site-header';

import { NewsClientGrid } from './_components/news-client-grid';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: `News & Market Insights | ${APP_NAME}`,
  description:
    'Stay informed with curated real estate analysis, neighbourhood guides, ownership policies, and luxury coastal living insights in Da Nang.',
};

export default async function NewsPage() {
  const articles = await getArticles();

  return (
    <>
      <SiteHeader />

      <main className="bg-paper min-h-screen pt-12 pb-0 lg:pt-20">
        <div className="container-page pb-16 lg:pb-20">
          {/* Header Banner */}
          <div className="mb-12 border-b border-line pb-10 md:mb-16">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <span className="text-gold text-[10px] font-bold tracking-[0.25em] uppercase">
                  Editorial &amp; Market Insights
                </span>
                <h1 className="font-display text-navy mt-2 text-[36px] leading-[1.1] font-normal sm:text-[46px] lg:text-[54px]">
                  Da Nang Real Estate News
                </h1>
              </div>

              <p className="text-muted max-w-md text-[14px] leading-relaxed md:text-right">
                Local expertise on coastal market trends, legal guidance for buyers, neighbourhood comparisons, and interior design signals.
              </p>
            </div>
          </div>

          {/* Interactive News Grid */}
          <NewsClientGrid articles={articles} />
        </div>

        {/* Consultation Request Form - Seamlessly touches Footer with zero margin */}
        <QuoteRequestSection />
      </main>

      <SiteFooter />
    </>
  );
}
