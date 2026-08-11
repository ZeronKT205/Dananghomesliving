import Image from 'next/image';
import Link from 'next/link';
import { MOCK_PROPERTIES } from '@/lib/mock-data';

interface SimilarPropertiesPublicProps {
  currentId: string;
}

export function SimilarPropertiesPublic({ currentId }: SimilarPropertiesPublicProps) {
  // Lấy các BĐS khác BĐS hiện tại
  const similarProps = Object.values(MOCK_PROPERTIES).filter(p => p.id !== currentId).slice(0, 4);

  // Nếu không có dữ liệu, hiển thị một số dữ liệu tĩnh
  const displayProps = similarProps.length > 0 ? similarProps : [
    { id: '1', title: 'Biệt thự Mặt biển', location: { shortAddress: 'Hòa Hải, Ngũ Hành Sơn' }, price: { vnd: '75.000.000.000' }, stats: { bedrooms: 3, internalArea: 620 }, images: ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&q=80'], badges: ['Đang bán'] }
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-[24px] font-display font-medium text-navy">Bất động sản tương tự</h2>
        <a href="/properties" className="flex items-center gap-1.5 text-[12px] font-bold uppercase tracking-wider text-navy hover:text-[#C99224] transition-colors">
          Xem tất cả BĐS
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {displayProps.map((prop) => (
          <Link href={`/vi/properties/${prop.id}`} key={prop.id} className="bg-white border border-line rounded-lg overflow-hidden group hover:shadow-md transition-shadow block">
            <div className="relative aspect-[4/3] w-full overflow-hidden">
              <Image 
                src={prop.images[0]} 
                alt={prop.title} 
                fill 
                className="object-cover group-hover:scale-105 transition-transform duration-500" 
              />
              <div className="absolute top-3 left-3">
                <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white rounded ${prop.badges[0] === 'Hạng sang' ? 'bg-[#C99224]' : 'bg-navy'}`}>
                  {prop.badges[0] || 'Đang bán'}
                </span>
              </div>
              <button className="absolute top-3 right-3 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center text-navy hover:text-red-500 hover:bg-white transition-colors shadow-sm">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
              </button>
            </div>
            <div className="p-4">
              <div className="flex items-center gap-1.5 text-[11px] text-muted mb-2 truncate">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                {prop.location.shortAddress}
              </div>
              <h4 className="font-display text-[16px] text-navy font-medium mb-3 truncate">{prop.title}</h4>
              
              <div className="flex items-center gap-4 text-[11px] text-muted mb-4 border-b border-line pb-4">
                <span className="flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5 text-navy" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
                  {prop.stats.bedrooms} <span className="hidden sm:inline">phòng ngủ</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5 text-navy" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" /></svg>
                  {prop.stats.internalArea} m²
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <p className="text-[16px] text-[#C99224] font-bold">{prop.price.vnd} đ</p>
                <div className="w-8 h-8 flex items-center justify-center rounded-full border border-line text-navy group-hover:bg-navy group-hover:text-white group-hover:border-navy transition-colors">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
