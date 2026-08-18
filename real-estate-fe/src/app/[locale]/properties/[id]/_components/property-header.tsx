'use client';

interface PropertyHeaderProps {
  title: string;
  location: string;
  price: { usd: string; vnd?: string };
  stats: { bedrooms: number; bathrooms: number; internalArea: number; landArea: number };
}

export function PropertyHeader({ title, location, price, stats }: PropertyHeaderProps) {
  const displayPrice = price.usd.startsWith('$') ? price.usd : `$${price.usd}`;

  return (
    <div className="space-y-6">
      {/* Location Tag */}
      <div className="flex items-center gap-2 text-gold text-[11px] font-bold uppercase tracking-[0.18em]">
        <svg className="w-4 h-4 shrink-0 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <span>{location}</span>
      </div>
      
      {/* Elegant Luxury Title (Playfair Display) */}
      <h1 className="font-display text-navy text-[32px] sm:text-[42px] font-normal leading-[1.08] tracking-tight text-balance">
        {title}
      </h1>

      {/* Clean USD Pricing Block (Montserrat) */}
      <div className="bg-paper border border-line px-6 py-4 rounded-none flex items-center justify-between">
        <div>
          <span className="text-muted text-[10px] font-bold uppercase tracking-[0.2em] block mb-0.5">
            Giá niêm yết
          </span>
          <p className="font-sans text-[26px] sm:text-[30px] text-gold font-semibold leading-none tracking-tight">
            {displayPrice}
          </p>
        </div>
        <span className="text-navy text-[10.5px] font-bold tracking-widest uppercase bg-gold/15 px-3 py-1.5 border border-gold/30">
          Chính chủ
        </span>
      </div>

      {/* Subtle & Refined Specification Grid (Montserrat) */}
      <div className="border border-line bg-white p-4 rounded-none">
        <div className="flex flex-wrap items-center justify-around gap-4 text-center divide-x divide-line/60">
          {/* Bedrooms */}
          <div className="flex-1 min-w-[70px] px-2">
            <div className="flex items-center justify-center gap-1.5 text-navy mb-1">
              <svg className="w-4 h-4 text-gold shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span className="font-sans text-[17px] font-bold leading-none">{stats.bedrooms}</span>
            </div>
            <span className="text-[10px] uppercase tracking-[0.14em] text-muted font-bold block">Phòng ngủ</span>
          </div>

          {/* Bathrooms */}
          <div className="flex-1 min-w-[70px] px-2 pl-4">
            <div className="flex items-center justify-center gap-1.5 text-navy mb-1">
              <svg className="w-4 h-4 text-gold shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
              </svg>
              <span className="font-sans text-[17px] font-bold leading-none">{stats.bathrooms}</span>
            </div>
            <span className="text-[10px] uppercase tracking-[0.14em] text-muted font-bold block">Phòng tắm</span>
          </div>

          {/* Internal Area */}
          <div className="flex-1 min-w-[80px] px-2 pl-4">
            <div className="flex items-center justify-center gap-1 text-navy mb-1">
              <span className="font-sans text-[17px] font-bold leading-none">{stats.internalArea}</span>
              <span className="text-[11px] font-sans font-semibold text-muted">m²</span>
            </div>
            <span className="text-[10px] uppercase tracking-[0.14em] text-muted font-bold block">Diện tích sử dụng</span>
          </div>

          {/* Land Area - Only rendered if landArea > 0 */}
          {stats.landArea > 0 && (
            <div className="flex-1 min-w-[80px] px-2 pl-4">
              <div className="flex items-center justify-center gap-1 text-navy mb-1">
                <span className="font-sans text-[17px] font-bold leading-none">{stats.landArea}</span>
                <span className="text-[11px] font-sans font-semibold text-muted">m²</span>
              </div>
              <span className="text-[10px] uppercase tracking-[0.14em] text-muted font-bold block">Diện tích đất</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
