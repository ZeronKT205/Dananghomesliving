// Hằng số dùng chung toàn app. Không hardcode rải rác trong code.
export const APP_NAME = 'Da Nang Homes & Living';
export const APP_TAGLINE = 'Trust · Quality · Dedication';
export const APP_DESCRIPTION =
  'Da Nang Homes & Living curates premium apartments, villas and residences to buy or rent in Da Nang, Vietnam.';

/** ⚠️ Thông tin liên hệ mẫu — thay bằng dữ liệu thật trước khi lên production. */
export const CONTACT_EMAIL = 'hello@dananghomesliving.com';
export const CONTACT_CITY = 'Da Nang, Vietnam';
export const CONTACT_HOURS = 'Mon–Sat · 08:30–18:00';
export const CONTACT_PHONE = '+84 236 3888 888';
export const CONTACT_PHONE_HREF = 'tel:+842363888888';

/** ⚠️ QR đang mã hoá ĐÚNG số điện thoại mẫu ở trên. Đổi số thật thì phải tạo
 *  lại ảnh, nếu không khách quét sẽ ra số sai. */
export const CONTACT_QR_IMAGE = '/images/brand/qr-contact.png';

/** ⚠️ Mới là bộ chọn hiển thị — chưa gắn i18n. Bật đa ngữ thật cần quyết định
 *  cấu trúc route (`/[locale]/...`) trước, sửa sau rất đắt. */
export const LANGUAGES = [
  { code: 'vi', label: 'Tiếng Việt', short: 'VI' },
  { code: 'en', label: 'English', short: 'EN' },
  { code: 'zh', label: '中文', short: 'ZH' },
  { code: 'ko', label: '한국어', short: 'KO' },
] as const;

export type LanguageCode = (typeof LANGUAGES)[number]['code'];

/** ⚠️ Toàn bộ href đang là placeholder — thay bằng link trang thật. */
export const SOCIAL_LINKS = [
  { name: 'WhatsApp', href: 'https://wa.me/842363888888', icon: 'whatsapp' },
  { name: 'Facebook', href: 'https://facebook.com', icon: 'facebook' },
  { name: 'Instagram', href: 'https://instagram.com', icon: 'instagram' },
  { name: 'TikTok', href: 'https://tiktok.com', icon: 'tiktok' },
  { name: 'YouTube', href: 'https://youtube.com', icon: 'youtube' },
] as const;

export type SocialLink = (typeof SOCIAL_LINKS)[number];

export const NAV_LOCATIONS = [
  { area: 'Son Tra', label: 'Son Tra Peninsula' },
  { area: 'Ngu Hanh Son', label: 'Ngu Hanh Son & Non Nuoc' },
  { area: 'Hai Chau', label: 'Hai Chau City Centre' },
  { area: 'My An', label: 'My An & An Thuong' },
  { area: 'Hoa Hai', label: 'Hoa Hai Beachfront' },
] as const;

export const NAV_ITEMS = [
  { href: '/', label: 'Home' },
  {
    href: '/properties?type=rent',
    label: 'Rent',
    children: [
      { href: '/properties?type=rent&propertyType=Apartment', label: 'Apartments' },
      { href: '/properties?type=rent&propertyType=Villa', label: 'Villas' },
      { href: '/properties?type=rent&propertyType=Penthouse', label: 'Penthouses' },
      { href: '/properties?type=rent&propertyType=Beach residence', label: 'Beach residences' },
    ],
    locations: NAV_LOCATIONS.map((loc) => ({
      href: `/properties?type=rent&area=${encodeURIComponent(loc.area)}`,
      label: loc.label,
    })),
  },
  {
    href: '/properties?type=sale',
    label: 'Buy',
    children: [
      { href: '/properties?type=sale&propertyType=Apartment', label: 'Apartments' },
      { href: '/properties?type=sale&propertyType=Villa', label: 'Villas' },
      { href: '/properties?type=sale&propertyType=Penthouse', label: 'Penthouses' },
      { href: '/properties?type=sale&propertyType=Beach residence', label: 'Beach residences' },
    ],
    locations: NAV_LOCATIONS.map((loc) => ({
      href: `/properties?type=sale&area=${encodeURIComponent(loc.area)}`,
      label: loc.label,
    })),
  },
  { href: '/tips', label: 'Tips' },
  { href: '/about', label: 'About us' },
] as const;

export type NavItem = (typeof NAV_ITEMS)[number];

export const HERO_PROOF_POINTS = [
  { value: '120+', label: 'Curated homes' },
  { value: '18', label: 'Prime communities' },
  { value: 'EN / VI', label: 'Bilingual service' },
] as const;

export const SEARCH_AREAS = [
  'All Da Nang',
  'Son Tra',
  'Ngu Hanh Son',
  'Hai Chau',
  'My An',
  'Hoa Hai',
] as const;

export const SEARCH_PROPERTY_TYPES = [
  'Any property',
  'Apartment',
  'Penthouse',
  'Villa',
  'Beach residence',
] as const;

export const SEARCH_BUDGETS = [
  'Any budget',
  'Under $1,500 / month',
  '$1,500–$3,000 / month',
  '$250k–$500k',
  '$500k+',
] as const;

/** ⚠️ Toạ độ placeholder — trung tâm Đà Nẵng. Thay bằng vị trí văn phòng thật. */
export const OFFICE_COORDS = { lat: 16.0544, lng: 108.2022 } as const;

/** ⚠️ Địa chỉ placeholder — thay bằng địa chỉ thật trước khi lên production. */
export const OFFICE_ADDRESS = '36 Bạch Đằng, Hải Châu, Đà Nẵng, Việt Nam';

export const GOOGLE_MAPS_EMBED_URL =
  `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3834.1!2d${OFFICE_COORDS.lng}!3d${OFFICE_COORDS.lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTbCsDAzJzE1LjgiTiAxMDjCsDEyJzA3LjkiRQ!5e0!3m2!1svi!2s!4v1` as const;

export const GOOGLE_MAPS_LINK =
  `https://www.google.com/maps?q=${OFFICE_COORDS.lat},${OFFICE_COORDS.lng}` as const;

export const QUOTE_SERVICE_OPTIONS = [
  { value: 'buy', label: 'Buy a property' },
  { value: 'rent', label: 'Long-term rental' },
  { value: 'invest', label: 'Investment advisory' },
  { value: 'valuation', label: 'Property valuation' },
  { value: 'other', label: 'Other enquiry' },
] as const;
