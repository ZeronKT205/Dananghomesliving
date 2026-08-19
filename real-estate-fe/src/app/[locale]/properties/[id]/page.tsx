import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';

import { DEFAULT_LOCALE, isLocale } from '@/config/locales';
import { Link } from '@/i18n/routing';
import { getPropertyDetail, getSimilarListings } from '@/lib/db/listings';

import { SiteFooter } from '../../../_components/site-footer';
import { SiteHeader } from '../../../_components/site-header';

import { ContactButtons } from './_components/contact-buttons';
import { EnquiryForm } from './_components/enquiry-form';
import { MobileStickyCTA } from './_components/mobile-sticky-cta';
import { PropertyGallery } from './_components/property-gallery';
import { PropertyHeader } from './_components/property-header';
import { PropertyLocation } from './_components/property-location';
import { PropertyOverview } from './_components/property-overview';
import { PropertyTabs } from './_components/property-tabs';
import { SimilarPropertiesPublic } from './_components/similar-properties-public';

/*
 * Đoạn route tên là `[id]` nhưng giá trị thật là SLUG của bất động sản — link
 * ngoài danh sách đều trỏ tới `/properties/<slug>`. Giữ nguyên tên thư mục vì
 * đổi sẽ làm hỏng mọi link đã chia sẻ; đặt lại tên biến cho khỏi hiểu nhầm.
 */
export default async function PropertyDetailsPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id: slug } = await params;
  const lang = isLocale(locale) ? locale : DEFAULT_LOCALE;
  const tp = await getTranslations('Property');

  // Hai truy vấn độc lập nhau — chạy song song để khỏi cộng dồn thời gian chờ.
  const [property, similar] = await Promise.all([
    getPropertyDetail(slug, lang),
    getSimilarListings(slug, lang),
  ]);

  if (!property) {
    notFound();
  }

  return (
    <div className="bg-white min-h-screen text-ink pb-20 md:pb-0 relative">
      <SiteHeader />
      
      {/* Top Header / Breadcrumb Area */}
      <div className="border-b border-line">
        <div className="container mx-auto px-4 lg:px-8 py-4 flex items-center justify-between text-[13px]">
          <nav className="flex items-center text-muted gap-2">
            <Link href="/" className="hover:text-navy transition-colors">{tp('breadcrumbHome')}</Link>
            <span>›</span>
            <Link href="/properties?type=sale" className="hover:text-navy transition-colors">{tp('breadcrumbProperties')}</Link>
            <span>›</span>
            <span className="text-navy font-medium truncate max-w-xs sm:max-w-md">{property.title}</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-10">
          
          {/* Main Left Column */}
          <div className="space-y-10 min-w-0">
            <PropertyGallery images={property.images} badges={property.badges} />
            <PropertyTabs />
            <PropertyOverview description={property.description} features={property.amenities} />
            <PropertyLocation
              address={property.location.address}
              nearby={property.nearby}
              keyInfo={property.keyInfo}
              latitude={property.geo?.lat}
              longitude={property.geo?.lng}
            />
          </div>

          {/* Sticky Right Column */}
          <div className="space-y-6">
            <div className="sticky top-24 space-y-6">
              <PropertyHeader 
                title={property.title} 
                location={property.location.address} 
                price={property.price} 
                stats={property.stats} 
              />
              <ContactButtons listedDate={property.listedDate} updatedDate={property.updatedDate} />
              <div id="enquiry-form">
                <EnquiryForm propertySlug={property.slug} propertyTitle={property.title} />
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Section */}
      <div className="bg-[#F9FAFB] py-16 mt-16 border-t border-line">
        <div className="container mx-auto px-4 lg:px-8">
          <SimilarPropertiesPublic items={similar} />
        </div>
      </div>

      {/* Mobile Sticky CTA Bar */}
      <MobileStickyCTA price={property.price} title={property.title} />

      <SiteFooter />
    </div>
  );
}
