import Image from 'next/image';

import { Link } from '@/i18n/routing';
import { cn } from '@/lib/utils';
import type { Listing } from '@/types';

import { FavoriteButton } from './favorite-button';

type ListingCardProps = {
  listing: Listing;
  /** Thẻ nổi bật dùng ảnh cao hơn. */
  featured?: boolean;
  /** Truyền xuống `sizes` của next/image để không tải ảnh quá khổ. */
  sizes: string;
  /** Chỉ ảnh đầu tiên trên màn hình mới cần ưu tiên tải. */
  priority?: boolean;
  /** Chế độ hiển thị dạng Lưới (grid) hay Hàng ngang (list) */
  viewMode?: 'grid' | 'list';
};

export function ListingCard({
  listing,
  featured = false,
  sizes,
  priority = false,
  viewMode = 'grid',
}: ListingCardProps) {
  // 🟢 List / Row View (Hiển thị dạng từng hàng ngang)
  if (viewMode === 'list') {
    return (
      <article className="border-line hover:shadow-lift group relative flex flex-col md:flex-row overflow-hidden border bg-white transition-all duration-300 rounded-none">
        {/* Horizontal Left Image */}
        <Link 
          href={`/properties/${listing.slug}`} 
          className="bg-sand skeleton-shimmer relative w-full md:w-[320px] lg:w-[380px] h-[240px] md:h-auto shrink-0 overflow-hidden block cursor-pointer"
        >
          <Image
            src={listing.image}
            alt={listing.imageAlt}
            fill
            priority={priority}
            sizes={sizes}
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
          <span
            className={cn(
              'absolute top-3 left-3 px-2.5 py-1 text-[9px] font-bold tracking-[0.14em] uppercase z-10 rounded-none border border-white/20',
              listing.badgeTone === 'gold' ? 'bg-gold text-navy' : 'bg-navy/94 text-white',
            )}
          >
            {listing.badge}
          </span>
          <span
            className={cn(
              'absolute bottom-3 left-3 px-2.5 py-1 text-[9px] font-bold tracking-[0.16em] uppercase z-10 border border-white/20',
              listing.listingType === 'sale' ? 'bg-navy text-white' : 'bg-gold text-navy',
            )}
          >
            {listing.listingType === 'sale' ? 'FOR SALE' : 'FOR RENT'}
          </span>
        </Link>

        {/* Right Content Area */}
        <div className="flex flex-1 flex-col justify-between p-5 md:p-6">
          <div>
            <div className="flex items-center justify-between gap-2">
              <p className="text-gold text-[10px] font-bold tracking-[0.14em] uppercase flex items-center gap-1">
                <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                {listing.location}
              </p>
              <FavoriteButton title={listing.title} />
            </div>

            <h3 className="font-display text-navy mt-1.5 text-[22px] leading-tight font-normal">
              <Link href={`/properties/${listing.slug}`} className="hover:text-gold transition-colors">
                {listing.title}
              </Link>
            </h3>

            <ul className="border-line text-muted mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 border-y py-2.5 text-[12px] font-medium">
              <li><strong className="text-navy font-bold">{listing.beds}</strong> Phòng ngủ</li>
              <li aria-hidden className="text-line">·</li>
              <li><strong className="text-navy font-bold">{listing.baths}</strong> Phòng tắm</li>
              <li aria-hidden className="text-line">·</li>
              <li><strong className="text-navy font-bold">{listing.area}</strong></li>
            </ul>
          </div>

          <div className="mt-4 flex items-end justify-between gap-4 pt-3 border-t border-line/50">
            <div>
              <span className="text-muted block text-[9px] tracking-[0.12em] uppercase font-semibold mb-0.5">
                {listing.listingType === 'sale' ? 'Giá chào bán' : 'Giá thuê dài hạn'}
              </span>
              <span className="font-sans text-gold text-[22px] font-semibold leading-none">
                {listing.price}
                {listing.priceNote ? (
                  <span className="text-muted ml-1 font-sans text-[11px] font-normal">{listing.priceNote}</span>
                ) : null}
              </span>
            </div>

            <Link 
              href={`/properties/${listing.slug}`}
              className="bg-navy hover:bg-gold text-white hover:text-navy px-4 py-2.5 rounded-none text-[11px] font-bold tracking-[0.14em] uppercase transition-all inline-flex items-center gap-1.5 shadow-xs"
            >
              Xem chi tiết <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
      </article>
    );
  }

  // 🟦 Standard Grid View (Hiển thị dạng Card vuông vức)
  return (
    <article className="border-line hover:shadow-lift group relative flex flex-col overflow-hidden border bg-white transition-all duration-300 hover:-translate-y-1.5 rounded-none">
      <Link href={`/properties/${listing.slug}`} className={cn('bg-sand skeleton-shimmer relative overflow-hidden block cursor-pointer', featured ? 'h-[340px]' : 'h-[250px]')}>
        <Image
          src={listing.image}
          alt={listing.imageAlt}
          fill
          priority={priority}
          sizes={sizes}
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <span
          className={cn(
            'absolute top-4 left-4 px-2.5 py-1.5 text-[9px] font-bold tracking-[0.14em] uppercase z-10 rounded-none border border-white/20',
            listing.badgeTone === 'gold' ? 'bg-gold text-navy' : 'bg-navy/94 text-white',
          )}
        >
          {listing.badge}
        </span>
        <span
          className={cn(
            'absolute top-4 right-14 px-3 py-1.5 text-[9.5px] font-bold tracking-[0.16em] uppercase z-10 border border-white/20',
            listing.listingType === 'sale'
              ? 'bg-navy text-white'
              : 'bg-gold text-navy',
          )}
        >
          {listing.listingType === 'sale' ? 'FOR SALE' : 'FOR RENT'}
        </span>
      </Link>
      
      {/* Favorite Button */}
      <div className="absolute top-0 right-0 z-20">
        <FavoriteButton title={listing.title} />
      </div>

      <div className="flex flex-1 flex-col p-5">
        <p className="text-gold text-[9.5px] font-bold tracking-[0.12em] uppercase">
          {listing.location}
        </p>
        <h3 className="font-display text-navy mt-1.5 text-[20px] leading-[1.1] font-normal text-balance">
          <Link href={`/properties/${listing.slug}`} className="hover:text-gold transition-colors">
            {listing.title}
          </Link>
        </h3>

        <ul className="border-line text-muted mt-4 flex flex-wrap gap-x-4 gap-y-2 border-y py-3 text-[11.5px]">
          <li><strong className="text-navy font-bold">{listing.beds}</strong> bed</li>
          <li aria-hidden className="text-line">·</li>
          <li><strong className="text-navy font-bold">{listing.baths}</strong> bath</li>
          <li aria-hidden className="text-line">·</li>
          <li><strong className="text-navy font-bold">{listing.area}</strong></li>
        </ul>

        <div className="mt-auto flex items-end justify-between gap-4 pt-4">
          <p className="leading-tight">
            <span className="text-muted block text-[9px] tracking-[0.12em] uppercase font-semibold mb-0.5">
              {listing.listingType === 'sale' ? 'Giá chào bán' : 'Giá thuê dài hạn'}
            </span>
            <span className="font-sans text-gold text-[20px] font-semibold">
              {listing.price}
              {listing.priceNote ? (
                <span className="text-muted ml-1 font-sans text-[11px] font-normal">{listing.priceNote}</span>
              ) : null}
            </span>
          </p>
          <Link 
            href={`/properties/${listing.slug}`}
            className="text-navy group-hover:text-gold font-bold text-[10.5px] tracking-[0.12em] uppercase border-b-2 border-gold pb-0.5 transition-colors inline-flex items-center gap-1"
          >
            Xem BĐS <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
          </Link>
        </div>
      </div>
    </article>
  );
}
