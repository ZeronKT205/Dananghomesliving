/* ============================================================
   ⚠️ DỮ LIỆU MẪU — CHỈ ĐỂ DỰNG GIAO DIỆN

   Số liệu dưới đây là bịa. Khi nối Payload CMS thì xoá file này
   và thay bằng truy vấn thật; mọi trang chỉ đọc từ đây nên chỗ
   phải sửa gom về một chỗ.

   Hai điểm bám hợp đồng, đừng đổi ngược lại:
   · Giá hiển thị bằng USD, KHÔNG phải VND.
   · Nhóm gốc chỉ Căn hộ / Biệt thự / Nhà riêng — đúng 3 khối
     trang chủ. Penthouse là nhóm phụ, không lên trang chủ.
   ============================================================ */

export type Tone = 'neutral' | 'ok' | 'warn' | 'danger' | 'brand';

export type PublishState = 'published' | 'draft' | 'archived';

export const PUBLISH_STATE: Record<PublishState, { label: string; tone: Tone }> = {
  published: { label: 'Đang hiển thị', tone: 'ok' },
  draft: { label: 'Bản nháp', tone: 'neutral' },
  archived: { label: 'Đã ẩn', tone: 'warn' },
};

export type DealType = 'sale' | 'rent';

export const DEAL_TYPE: Record<DealType, { label: string }> = {
  sale: { label: 'Mua' },
  rent: { label: 'Thuê' },
};

export type PropertyGroup = {
  id: string;
  name: string;
  nameEn: string;
  /** Có nằm trong 3 khối trang chủ theo hợp đồng hay không. */
  onHome: boolean;
  order: number;
};

export const GROUPS: PropertyGroup[] = [
  { id: 'apartment', name: 'Căn hộ', nameEn: 'Apartment', onHome: true, order: 1 },
  { id: 'villa', name: 'Biệt thự', nameEn: 'Villa', onHome: true, order: 2 },
  { id: 'house', name: 'Nhà riêng', nameEn: 'House', onHome: true, order: 3 },
  { id: 'penthouse', name: 'Penthouse', nameEn: 'Penthouse', onHome: false, order: 4 },
];

export type AdminProperty = {
  id: string;
  title: string;
  summary: string;
  district: string;
  /** USD dạng số — bắt buộc, để lọc theo khoảng giá được. */
  priceUsd: number;
  perMonth?: boolean;
  groupId: string;
  deal: DealType;
  state: PublishState;
  cover: string;
  imageCount: number;
  beds: number;
  baths: number;
  area: number;
  /** Lượt bấm xem chi tiết — nguồn cho biểu đồ tròn ở Tổng quan. */
  views: number;
  updatedLabel: string;
};

export const PROPERTIES: AdminProperty[] = [
  {
    id: 'ocean-estate-villa',
    title: 'Ocean Estate Villa',
    summary: 'Biệt thự biển 3 phòng ngủ, sân vườn riêng và hồ bơi tràn bờ hướng Đông.',
    district: 'Ngũ Hành Sơn',
    priceUsd: 3_596_000,
    groupId: 'villa',
    deal: 'sale',
    state: 'published',
    cover: '/images/listings/ocean-estate-villa.webp',
    imageCount: 6,
    beds: 3,
    baths: 3,
    area: 917,
    views: 486,
    updatedLabel: '2 giờ trước',
  },
  {
    id: 'riverfront-penthouse',
    title: 'The Riverfront Penthouse',
    summary: 'Penthouse tầng cao nhìn thẳng sông Hàn và Cầu Rồng, bàn giao nội thất.',
    district: 'Hải Châu',
    priceUsd: 1_280_000,
    groupId: 'penthouse',
    deal: 'sale',
    state: 'published',
    cover: '/images/listings/riverfront-penthouse.webp',
    imageCount: 5,
    beds: 4,
    baths: 4,
    area: 318,
    views: 372,
    updatedLabel: '5 giờ trước',
  },
  {
    id: 'son-tra-sky-residence',
    title: 'Son Tra Sky Residence',
    summary: 'Căn góc hai mặt thoáng, view biển Mỹ Khê, gần trung tâm An Thượng.',
    district: 'Sơn Trà',
    priceUsd: 685_000,
    groupId: 'apartment',
    deal: 'sale',
    state: 'draft',
    cover: '/images/listings/son-tra-sky-residence.webp',
    imageCount: 4,
    beds: 3,
    baths: 3,
    area: 186,
    views: 118,
    updatedLabel: '1 ngày trước',
  },
  {
    id: 'an-thuong-design-apartment',
    title: 'An Thuong Design Apartment',
    summary: 'Căn hộ thiết kế riêng, bàn giao đầy đủ nội thất, đi bộ ra biển 5 phút.',
    district: 'Mỹ An',
    priceUsd: 425_000,
    groupId: 'apartment',
    deal: 'sale',
    state: 'published',
    cover: '/images/listings/an-thuong-design-apartment.webp',
    imageCount: 5,
    beds: 2,
    baths: 2,
    area: 128,
    views: 264,
    updatedLabel: '2 ngày trước',
  },
  {
    id: 'marina-garden-residence',
    title: 'Marina Garden Residence',
    summary: 'Nhà riêng có sân vườn trong khu compound yên tĩnh ven sông.',
    district: 'Sơn Trà',
    priceUsd: 790_000,
    groupId: 'house',
    deal: 'sale',
    state: 'archived',
    cover: '/images/listings/marina-garden-residence.webp',
    imageCount: 3,
    beds: 3,
    baths: 3,
    area: 204,
    views: 96,
    updatedLabel: '1 tuần trước',
  },
  {
    id: 'my-khe-coastal-apartment',
    title: 'My Khe Coastal Apartment',
    summary: 'Căn hộ ven biển đầy đủ nội thất, phù hợp khách thuê dài hạn.',
    district: 'Sơn Trà',
    priceUsd: 2_250,
    perMonth: true,
    groupId: 'apartment',
    deal: 'rent',
    state: 'published',
    cover: '/images/listings/my-khe-coastal-apartment.webp',
    imageCount: 6,
    beds: 2,
    baths: 2,
    area: 118,
    views: 421,
    updatedLabel: '3 ngày trước',
  },
  {
    id: 'ocean-villas-family-residence',
    title: 'Ocean Villas Family Residence',
    summary: 'Biệt thự gia đình sát bãi biển, có hồ bơi riêng và khu BBQ.',
    district: 'Hoà Hải',
    priceUsd: 3_900,
    perMonth: true,
    groupId: 'villa',
    deal: 'rent',
    state: 'published',
    cover: '/images/listings/ocean-villas-family-residence.webp',
    imageCount: 7,
    beds: 3,
    baths: 3,
    area: 280,
    views: 298,
    updatedLabel: '4 ngày trước',
  },
  {
    id: 'an-thuong-urban-loft',
    title: 'An Thuong Urban Loft',
    summary: 'Loft một phòng ngủ giữa khu An Thượng, đi bộ tới quán xá và biển.',
    district: 'Mỹ An',
    priceUsd: 1_450,
    perMonth: true,
    groupId: 'house',
    deal: 'rent',
    state: 'draft',
    cover: '/images/listings/an-thuong-urban-loft.webp',
    imageCount: 4,
    beds: 1,
    baths: 1,
    area: 78,
    views: 87,
    updatedLabel: '6 ngày trước',
  },
  {
    id: 'han-river-executive-home',
    title: 'Han River Executive Home',
    summary: 'Căn hộ trung tâm dành cho chuyên gia, gần văn phòng và trường quốc tế.',
    district: 'Hải Châu',
    priceUsd: 1_850,
    perMonth: true,
    groupId: 'apartment',
    deal: 'rent',
    state: 'published',
    cover: '/images/listings/han-river-executive-home.webp',
    imageCount: 5,
    beds: 2,
    baths: 2,
    area: 105,
    views: 203,
    updatedLabel: '1 tuần trước',
  },
];

export type InquiryStatus = 'new' | 'contacted' | 'done' | 'cancelled';

export const INQUIRY_STATUS: Record<InquiryStatus, { label: string; tone: Tone }> = {
  new: { label: 'Chưa xử lý', tone: 'warn' },
  contacted: { label: 'Đã liên hệ', tone: 'brand' },
  done: { label: 'Hoàn tất', tone: 'ok' },
  cancelled: { label: 'Đã huỷ', tone: 'danger' },
};

/** Mã ngôn ngữ → tên đầy đủ. Trong ngăn chi tiết hiện tên đầy đủ vì kèm icon
 *  quả cầu là đủ tự hiểu, không cần thêm dòng nhãn "Ngôn ngữ khách dùng". */
export const LOCALE_LABEL: Record<string, string> = {
  VI: 'Tiếng Việt',
  EN: 'English',
  ZH: '中文',
  KO: '한국어',
};

export type AdminInquiry = {
  id: string;
  code: string;
  name: string;
  phone: string;
  service: string;
  message: string;
  propertyId?: string;
  propertyTitle?: string;
  locale: string;
  status: InquiryStatus;
  receivedLabel: string;
  receivedAt: string;
  overdue?: boolean;
};

export const INQUIRIES: AdminInquiry[] = [
  {
    id: 'q-1041',
    code: 'YC-1041',
    name: 'Nguyễn Minh Khoa',
    phone: '0905 214 778',
    service: 'Mua bất động sản',
    message:
      'Cần tư vấn căn 2 phòng ngủ ven sông Hàn, ngân sách khoảng 400.000 USD. Ưu tiên bàn giao nội thất, có thể xem nhà cuối tuần này.',
    propertyId: 'an-thuong-design-apartment',
    propertyTitle: 'An Thuong Design Apartment',
    locale: 'VI',
    status: 'new',
    receivedLabel: '38 giờ trước',
    receivedAt: '09:12 · 05/08/2026',
    overdue: true,
  },
  {
    id: 'q-1040',
    code: 'YC-1040',
    name: 'Ji-woo Park',
    phone: '+82 10 4477 2210',
    service: 'Thuê dài hạn',
    message:
      'Looking for a furnished 2BR near My Khe beach from March. Budget around 2,000 USD per month, minimum 12-month lease.',
    propertyId: 'my-khe-coastal-apartment',
    propertyTitle: 'My Khe Coastal Apartment',
    locale: 'KO',
    status: 'new',
    receivedLabel: '30 giờ trước',
    receivedAt: '17:40 · 05/08/2026',
    overdue: true,
  },
  {
    id: 'q-1039',
    code: 'YC-1039',
    name: 'Trần Thu Hà',
    phone: '0778 903 112',
    service: 'Tư vấn đầu tư',
    message: 'Muốn xem quỹ căn cho thuê ngắn hạn khu Sơn Trà, tỷ suất khai thác thực tế thế nào.',
    locale: 'VI',
    status: 'new',
    receivedLabel: '6 giờ trước',
    receivedAt: '08:05 · 07/08/2026',
  },
  {
    id: 'q-1038',
    code: 'YC-1038',
    name: 'Chen Wei',
    phone: '+86 138 0013 8000',
    service: 'Mua bất động sản',
    message: '想了解海景别墅的产权与交付时间，以及外国人购买的相关手续。',
    propertyId: 'ocean-estate-villa',
    propertyTitle: 'Ocean Estate Villa',
    locale: 'ZH',
    status: 'contacted',
    receivedLabel: '2 ngày trước',
    receivedAt: '14:22 · 05/08/2026',
  },
  {
    id: 'q-1037',
    code: 'YC-1037',
    name: 'Michael Turner',
    phone: '+61 412 556 908',
    service: 'Thuê dài hạn',
    message: 'Relocating in May, need a 3BR villa with a pool for the family. Pets allowed?',
    propertyId: 'ocean-villas-family-residence',
    propertyTitle: 'Ocean Villas Family Residence',
    locale: 'EN',
    status: 'done',
    receivedLabel: '5 ngày trước',
    receivedAt: '10:03 · 02/08/2026',
  },
  {
    id: 'q-1036',
    code: 'YC-1036',
    name: 'Lê Quốc Bảo',
    phone: '0912 664 301',
    service: 'Định giá',
    message: 'Nhờ định giá căn hộ đang sở hữu tại Hải Châu để cân nhắc bán trong quý tới.',
    locale: 'VI',
    status: 'cancelled',
    receivedLabel: '1 tuần trước',
    receivedAt: '16:48 · 31/07/2026',
  },
];

/** Số yêu cầu nhận theo từng ngày, 7 ngày gần nhất — nguồn cho biểu đồ cột. */
export const INQUIRIES_BY_DAY = [
  { label: 'T5', date: '01', count: 2 },
  { label: 'T6', date: '02', count: 4 },
  { label: 'T7', date: '03', count: 1 },
  { label: 'CN', date: '04', count: 0 },
  { label: 'T2', date: '05', count: 5 },
  { label: 'T3', date: '06', count: 3 },
  { label: 'T4', date: '07', count: 6 },
] as const;

export type AdminNews = {
  id: string;
  title: string;
  summary: string;
  category: string;
  author: string;
  state: PublishState;
  cover: string;
  imageCount: number;
  views: number;
  updatedLabel: string;
};

export const NEWS_CATEGORIES = ['Hướng dẫn mua', 'Thiết kế', 'Khu vực', 'Thị trường'] as const;

export const NEWS: AdminNews[] = [
  {
    id: 'international-buyers-guide',
    title: 'Điều người mua nước ngoài cần biết trước khi chọn căn hộ tại Đà Nẵng',
    summary:
      'Tổng quan về vị trí, hình thức sở hữu, phí dịch vụ và những câu hỏi nên đặt ra trước khi xuống tiền.',
    category: 'Hướng dẫn mua',
    author: 'Ban biên tập',
    state: 'published',
    cover: '/images/journal/buying-guide.webp',
    imageCount: 4,
    views: 512,
    updatedLabel: '3 giờ trước',
  },
  {
    id: 'furnished-rental-details',
    title: 'Những chi tiết làm nên một căn hộ cho thuê thật sự cao cấp',
    summary:
      'Từ ánh sáng, tủ chứa đồ tới cách âm — các dấu hiệu chất lượng chỉ lộ ra sau buổi xem đầu tiên.',
    category: 'Thiết kế',
    author: 'Ban biên tập',
    state: 'published',
    cover: '/images/journal/design-details.webp',
    imageCount: 3,
    views: 287,
    updatedLabel: '2 ngày trước',
  },
  {
    id: 'choosing-your-neighbourhood',
    title: 'Mỹ Khê, An Thượng hay Hải Châu — chọn khu nào cho phù hợp',
    summary:
      'So sánh ngắn gọn ba khu phổ biến về mức độ gần biển, tiện đi bộ, chỗ làm việc và sinh hoạt lâu dài.',
    category: 'Khu vực',
    author: 'Ban biên tập',
    state: 'draft',
    cover: '/images/journal/neighbourhoods.webp',
    imageCount: 5,
    views: 64,
    updatedLabel: '4 ngày trước',
  },
];

/** Định dạng giá theo hợp đồng: luôn USD, không phần thập phân. */
export function formatUsd(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);
}
