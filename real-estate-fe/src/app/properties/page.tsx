import { Suspense } from 'react';

import { APP_NAME } from '@/config/constants';
import { getAllListings } from '@/lib/db/listings';

import { QuoteRequestSection } from '../_components/quote-request-section';
import { SiteFooter } from '../_components/site-footer';
import { SiteHeader } from '../_components/site-header';

import { PropertiesClientGrid } from './_components/properties-client-grid';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: `Curated Properties | ${APP_NAME}`,
  description:
    'Explore curated apartments, villas, penthouses and beach residences available to buy or rent in Da Nang, Vietnam.',
};

export default async function PropertiesPage() {
  const listings = await getAllListings();

  return (
    <>
      <SiteHeader />

      <main className="bg-paper min-h-screen pt-4 pb-6 md:pt-6 animate-fade-in-up">
        <div className="container-page pb-6 lg:pb-8">
          {/* Interactive Filterable Properties Grid wrapped in Suspense for searchParams */}
          <Suspense fallback={<div className="p-8 text-center text-muted">Loading properties...</div>}>
            <PropertiesClientGrid listings={listings} />
          </Suspense>
        </div>

        {/* Consultation Request Form */}
        <QuoteRequestSection />
      </main>

      <SiteFooter />
    </>
  );
}
