import { notFound } from 'next/navigation';

import { Link } from '@/i18n/routing';
import { MOCK_PROPERTIES } from '@/lib/mock-data';

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

export default async function PropertyDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  // Lấy dữ liệu từ mock-data
  const property = MOCK_PROPERTIES[id];
  
  // Nếu không tìm thấy, trả về trang 404
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
            <Link href="/" className="hover:text-navy transition-colors">Home</Link>
            <span>›</span>
            <Link href="/properties?type=sale" className="hover:text-navy transition-colors">Properties</Link>
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
            <PropertyOverview description={property.description} features={property.features} />
            <PropertyLocation 
              address={property.location.address} 
              nearby={property.nearby} 
              keyInfo={property.keyInfo} 
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
              <ContactButtons id={property.id} listedDate={property.listedDate} updatedDate={property.updatedDate} />
              <div id="enquiry-form">
                <EnquiryForm />
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Section */}
      <div className="bg-[#F9FAFB] py-16 mt-16 border-t border-line">
        <div className="container mx-auto px-4 lg:px-8">
          <SimilarPropertiesPublic currentId={property.id} />
        </div>
      </div>

      {/* Mobile Sticky CTA Bar */}
      <MobileStickyCTA price={property.price} title={property.title} />

      <SiteFooter />
    </div>
  );
}
