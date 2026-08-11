import Image from 'next/image';
import Link from 'next/link';

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
};

export function ListingCard({
  listing,
  featured = false,
  sizes,
  priority = false,
}: ListingCardProps) {
  return (
    <article className="border-line hover:shadow-lift group relative flex flex-col overflow-hidden border bg-white transition-all duration-300 hover:-translate-y-1.5">
      <Link href={`/vi/properties/${listing.slug}`} className={cn('bg-sand relative overflow-hidden block cursor-pointer', featured ? 'h-[340px]' : 'h-[250px]')}>
        <Image
          src={listing.image}
          alt={listing.imageAlt}
          fill
          priority={priority}
          sizes={sizes}
          className="object-cover transition-transform duration-700 group-hover:scale-[1.035]"
        />
        <span
          className={cn(
            'absolute top-4 left-4 px-2.5 py-1.5 text-[9px] font-bold tracking-[0.14em] uppercase z-10',
            listing.badgeTone === 'gold' ? 'bg-gold text-navy' : 'bg-navy/94 text-white',
          )}
        >
          {listing.badge}
        </span>
        <span
          className={cn(
            'absolute top-4 right-4 px-3 py-1.5 text-[9.5px] font-bold tracking-[0.16em] uppercase z-10 shadow-xs border border-white/20',
            listing.listingType === 'sale'
              ? 'bg-navy text-white'
              : 'bg-gold text-navy',
          )}
        >
          {listing.listingType === 'sale' ? 'FOR SALE' : 'FOR RENT'}
        </span>
      </Link>
      
      {/* Nút Favorite (Tránh đặt trong Link để không bị lỗi hydration do thẻ a lồng nhau hoặc click propagation) */}
      <div className="absolute top-0 right-0 z-20">
        <FavoriteButton title={listing.title} />
      </div>

      <div className="flex flex-1 flex-col p-5">
        <p className="text-gold text-[9px] font-bold tracking-[0.12em] uppercase">
          {listing.location}
        </p>
        <h3 className="font-display text-navy mt-2 text-[20px] leading-[1.08] font-normal text-balance">
          <Link href={`/vi/properties/${listing.slug}`} className="hover:text-gold transition-colors">
            {listing.title}
          </Link>
        </h3>

        <ul className="border-line text-muted mt-4 flex flex-wrap gap-x-4 gap-y-2 border-y py-3 text-[12px]">
          <li>{listing.beds} bed</li>
          <li aria-hidden>·</li>
          <li>{listing.baths} bath</li>
          <li aria-hidden>·</li>
          <li>{listing.area}</li>
        </ul>

        <div className="mt-auto flex items-end justify-between gap-4 pt-4">
          <p className="leading-tight">
            <span className="text-muted block text-[9px] tracking-[0.12em] uppercase">
              {listing.listingType === 'sale' ? 'For sale' : 'Long-term rent'}
            </span>
            <span className="font-display text-navy text-[21px]">
              {listing.price}
              {listing.priceNote ? (
                <span className="text-muted ml-1 font-sans text-[11px]">{listing.priceNote}</span>
              ) : null}
            </span>
          </p>
          <Link 
            href={`/vi/properties/${listing.slug}`}
            className="text-navy group-hover:text-gold font-bold text-[10.5px] tracking-[0.12em] uppercase border-b-2 border-gold pb-0.5 transition-colors inline-flex items-center gap-1 focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            View Property <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
          </Link>
        </div>
      </div>
    </article>
  );
}
