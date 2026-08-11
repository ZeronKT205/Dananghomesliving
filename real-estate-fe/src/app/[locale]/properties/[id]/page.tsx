import { notFound } from 'next/navigation';
import { MOCK_PROPERTIES } from '@/lib/mock-data';
import { PropertyGallery } from './_components/property-gallery';
import { PropertyHeader } from './_components/property-header';
import { ContactButtons } from './_components/contact-buttons';
import { PropertyTabs } from './_components/property-tabs';
import { PropertyOverview } from './_components/property-overview';
import { PropertyLocation } from './_components/property-location';
import { EnquiryForm } from './_components/enquiry-form';
import { SimilarPropertiesPublic } from './_components/similar-properties-public';
import { SiteHeader } from '../../../_components/site-header';
import { SiteFooter } from '../../../_components/site-footer';

export default async function PropertyDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  // Lấy dữ liệu từ mock-data
  const property = MOCK_PROPERTIES[id];
  
  // Nếu không tìm thấy, trả về trang 404
  if (!property) {
    notFound();
  }

  return (
    <div className="bg-white min-h-screen text-ink">
      <SiteHeader />
      
      {/* Top Header / Breadcrumb Area */}
      <div className="border-b border-line">
        <div className="container mx-auto px-4 lg:px-8 py-4 flex items-center justify-between text-[13px]">
          <nav className="flex items-center text-muted gap-2">
            <a href="/" className="hover:text-navy transition-colors">Trang chủ</a>
            <span>›</span>
            <a href="/buy" className="hover:text-navy transition-colors">Mua</a>
            <span>›</span>
            <a href="/buy/villas" className="hover:text-navy transition-colors">Biệt thự</a>
            <span>›</span>
            <span className="text-navy font-medium">{property.title}</span>
          </nav>
          <div className="hidden sm:flex items-center gap-6">
            <a href="#" className="flex items-center gap-1.5 hover:text-navy transition-colors text-muted">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
              Quay lại kết quả
            </a>
            <a href="#" className="flex items-center gap-1.5 hover:text-navy transition-colors text-muted">
              BĐS tiếp theo
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </a>
          </div>
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
              <EnquiryForm propertyTitle={property.title} />
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
      <SiteFooter />
    </div>
  );
}
