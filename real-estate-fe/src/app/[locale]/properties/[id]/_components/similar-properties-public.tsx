import Image from 'next/image';

import { Link } from '@/i18n/routing';
import { MOCK_PROPERTIES } from '@/lib/mock-data';

interface SimilarPropertiesPublicProps {
  currentId: string;
}

export function SimilarPropertiesPublic({ currentId }: SimilarPropertiesPublicProps) {
  // Lấy các BĐS khác BĐS hiện tại
  const similarProps = Object.values(MOCK_PROPERTIES).filter(p => p.id !== currentId).slice(0, 4);

  // Dữ liệu hiển thị
  const displayProps = similarProps.length > 0 ? similarProps : [
    { 
      id: 'ocean-estate-villa', 
      title: 'Biệt thự Ocean Estate Signature Villa', 
      location: { shortAddress: 'Hòa Hải, Ngũ Hành Sơn' }, 
      price: { usd: '$3,596,000' }, 
      stats: { bedrooms: 3, internalArea: 917 }, 
      images: ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&q=80'], 
      badges: ['Biệt thự biển'] 
    }
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-[24px] font-display font-normal text-navy tracking-tight">Bất động sản tương tự</h2>
        <Link href="/properties" className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-navy hover:text-gold transition-colors">
          Xem tất cả BĐS
          <span aria-hidden>→</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {displayProps.map((prop) => {
          const displayPrice = typeof prop.price === 'string' ? prop.price : prop.price?.usd || '';
          const formattedPrice = displayPrice.startsWith('$') ? displayPrice : `$${displayPrice}`;

          return (
            <Link href={`/properties/${prop.id}`} key={prop.id} className="bg-white border border-line rounded-none overflow-hidden group hover:shadow-lift transition-all block">
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-sand">
                <Image
                  src={prop.images[0] || '/images/listings/ocean-estate-villa.webp'}
                  alt={prop.title}
                  fill
                  sizes="(min-width: 1024px) 300px, (min-width: 768px) 50vw, 100vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3">
                  <span className={`px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest text-white rounded-none border border-white/20 ${prop.badges[0] === 'Biệt thự biển' ? 'bg-gold text-navy' : 'bg-navy'}`}>
                    {prop.badges[0] || 'Đang bán'}
                  </span>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center gap-1.5 text-[11px] text-gold font-semibold uppercase tracking-wider mb-1.5 truncate">
                  <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  {prop.location.shortAddress}
                </div>
                <h4 className="font-display text-[16px] text-navy font-normal mb-3 truncate leading-snug">{prop.title}</h4>
                
                <div className="flex items-center gap-4 text-[11px] text-muted mb-4 border-b border-line pb-3">
                  <span className="flex items-center gap-1">
                    <strong className="text-navy font-semibold">{prop.stats.bedrooms}</strong> PN
                  </span>
                  <span className="text-line">|</span>
                  <span className="flex items-center gap-1">
                    <strong className="text-navy font-semibold">{prop.stats.internalArea}</strong> m²
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <p className="font-sans text-[16px] text-gold font-semibold leading-none">{formattedPrice}</p>
                  <div className="w-8 h-8 flex items-center justify-center rounded-none border border-line text-navy group-hover:bg-navy group-hover:text-white transition-colors">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
