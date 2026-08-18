/**
 * HỢP ĐỒNG GIAO DIỆN của khu quản trị.
 *
 * Chỉ chứa KIỂU và NHÃN — không có dữ liệu. Thay cho `mock.ts` cũ (vốn trộn
 * lẫn kiểu, nhãn và dữ liệu bịa vào một chỗ, nên không thể bỏ dữ liệu mẫu mà
 * không làm vỡ component).
 *
 * Dữ liệu thật do `presenters.ts` nạp từ DB rồi map sang đúng các kiểu này.
 */

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
  slug: string;
  name: string;
  nameEn: string;
  /** Có nằm trong 3 khối trang chủ theo hợp đồng hay không. */
  onHome: boolean;
  order: number;
  count: number;
};

export type AdminProperty = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  district: string;
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
  views: number;
  updatedLabel: string;
};

export type InquiryStatus = 'new' | 'contacted' | 'done' | 'cancelled';

export const INQUIRY_STATUS: Record<InquiryStatus, { label: string; tone: Tone }> = {
  new: { label: 'Chưa xử lý', tone: 'warn' },
  contacted: { label: 'Đã liên hệ', tone: 'brand' },
  done: { label: 'Hoàn tất', tone: 'ok' },
  cancelled: { label: 'Đã huỷ', tone: 'danger' },
};

export const LOCALE_LABEL: Record<string, string> = {
  VI: 'Tiếng Việt',
  EN: 'English',
  ZH: '中文',
  KO: '한국어',
};

export const SERVICE_LABEL: Record<string, string> = {
  buy: 'Mua bất động sản',
  rent: 'Thuê dài hạn',
  invest: 'Tư vấn đầu tư',
  valuation: 'Định giá',
  other: 'Nhu cầu khác',
};

export type AdminInquiry = {
  id: string;
  code: string;
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
  propertyId?: string;
  propertyTitle?: string;
  /** BĐS đã được JOIN sẵn ở tầng server. Trước đây component tự tra cứu trong
   *  mảng PROPERTIES — không làm được nữa khi dữ liệu nằm trong DB. */
  property?: {
    slug: string;
    title: string;
    cover: string;
    district: string;
    groupName: string;
    priceUsd: number;
    perMonth: boolean;
  };
  locale: string;
  status: InquiryStatus;
  receivedLabel: string;
  receivedAt: string;
  overdue?: boolean;
};

export type AdminNews = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  category: string;
  author: string;
  state: PublishState;
  cover: string;
  views: number;
  updatedLabel: string;
};

export function formatUsd(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);
}

/** "2 giờ trước" — nhãn thời gian tương đối, tiếng Việt. */
export function relativeLabel(date: Date | string | null | undefined): string {
  if (!date) return '—';
  const d = typeof date === 'string' ? new Date(date) : date;
  const diff = Date.now() - d.getTime();
  if (diff < 0) return 'Vừa xong';

  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return 'Vừa xong';
  if (mins < 60) return `${mins} phút trước`;

  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} giờ trước`;

  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} ngày trước`;
  if (days < 30) return `${Math.floor(days / 7)} tuần trước`;
  if (days < 365) return `${Math.floor(days / 30)} tháng trước`;
  return `${Math.floor(days / 365)} năm trước`;
}

/** "09:12 · 05/08/2026" */
export function formatDateTime(date: Date | string | null | undefined): string {
  if (!date) return '—';
  const d = typeof date === 'string' ? new Date(date) : date;
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${pad(d.getHours())}:${pad(d.getMinutes())} · ${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
}
