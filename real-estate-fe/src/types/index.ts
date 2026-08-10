// Type/interface dùng chung nhiều nơi đặt tại đây.
export type Nullable<T> = T | null;

/** Hình thức: bán hay cho thuê. Xem bảng từ vựng trong CLAUDE.md. */
export type ListingType = 'sale' | 'rent';

export type Listing = {
  slug: string;
  title: string;
  /** "Son Tra · My Khe" — quận · khu vực. */
  location: string;
  listingType: ListingType;
  /** Giá đã format sẵn để hiển thị; chưa có tầng tiền tệ nên giữ nguyên chuỗi. */
  price: string;
  /** Hậu tố giá, ví dụ "/ month". */
  priceNote?: string;
  beds: number;
  baths: number;
  /** Diện tích, đã kèm đơn vị. */
  area: string;
  badge: string;
  badgeTone: 'gold' | 'navy';
  image: string;
  imageAlt: string;
  propertyType?: string;
  areaName?: string;
  description?: string;
  features?: string[];
  gallery?: string[];
};

export type Article = {
  slug: string;
  category: string;
  readingTime: string;
  title: string;
  excerpt: string;
  image: string;
  imageAlt: string;
  date?: string;
  author?: {
    name: string;
    avatar?: string;
    role?: string;
  };
  content?: string;
  tags?: string[];
  featured?: boolean;
};

