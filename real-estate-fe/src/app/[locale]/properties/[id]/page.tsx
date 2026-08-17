import { notFound } from 'next/navigation';

import { MOCK_PROPERTIES } from '@/lib/mock-data';

import { SiteFooter } from '../../../_components/site-footer';
import { SiteHeader } from '../../../_components/site-header';

import { ContactButtons } from './_components/contact-buttons';
import { EnquiryForm } from './_components/enquiry-form';
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

      {/* Mobile Sticky CTA Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-line p-3 lg:hidden z-50 flex gap-3 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
        <button className="flex-1 bg-navy text-white py-3 rounded-md font-bold text-[14px] flex items-center justify-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
          Gọi Điện
        </button>
        <button className="flex-1 bg-[#C99224] text-white py-3 rounded-md font-bold text-[14px] flex items-center justify-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
          Đặt Hẹn Xem
        </button>
      </div>

      <SiteFooter />
    </div>
  );
}
