import { z } from 'zod';

import { zLocaleCode, zObjectId, zPagination } from './common';

export const INQUIRY_STATUSES = ['new', 'contacted', 'done', 'cancelled'] as const;
export const INQUIRY_SOURCES = ['quote_form', 'property_form'] as const;
export const INQUIRY_SERVICES = ['buy', 'rent', 'invest', 'valuation', 'other'] as const;

export const zInquiryStatus = z.enum(INQUIRY_STATUSES);
export const zInquiryService = z.enum(INQUIRY_SERVICES);

/**
 * Số điện thoại: chỉ chuẩn hoá và kiểm tra độ dài, KHÔNG ép định dạng VN.
 * Khách Hàn/Trung/Úc đều gửi form này (xem dữ liệu mẫu trong admin), ép
 * `^0\d{9}$` là chặn đúng nhóm khách hàng chịu chi nhất.
 */
const zPhone = z
  .string()
  .trim()
  .min(6, 'Số điện thoại quá ngắn')
  .max(24, 'Số điện thoại quá dài')
  .regex(/^[+()\d\s.-]+$/, 'Số điện thoại chứa ký tự không hợp lệ');

const zEmail = z.string().trim().toLowerCase().email('Email không hợp lệ').max(200);
const zName = z.string().trim().min(1, 'Vui lòng nhập họ tên').max(160);
const zMessage = z.string().trim().max(4000).default('');

/** Form tư vấn chung (trang chủ / trang danh sách). */
export const zQuoteFormInput = z.object({
  name: zName,
  email: zEmail,
  phone: zPhone.optional().nullable().default(null),
  service: zInquiryService.nullable().default(null),
  message: zMessage,
  locale: zLocaleCode.default('vi'),
  utm: z.record(z.string().max(200)).nullable().default(null),
  /*
   * Bẫy bot: trường ẩn, người thật không bao giờ điền.
   *
   * KHÔNG dùng `.max(0)`. Zod sẽ chặn ngay và trả lỗi có kèm tên trường
   * `website` — tức mách thẳng cho bot biết bẫy nằm ở đâu để lần sau né, đúng
   * thứ mà `isBot()` trong service cố tránh bằng cách trả thành công giả.
   * Ở đây chỉ nhận chuỗi; việc phán xét để service làm.
   */
  website: z.string().max(200).optional(),
});

/** Form hỏi về một BĐS cụ thể (trang chi tiết). */
export const zPropertyInquiryInput = z.object({
  name: zName,
  email: zEmail,
  phone: zPhone, // form này bắt buộc số điện thoại
  message: zMessage,
  preferredViewingDate: z.coerce.date().nullable().default(null),
  propertyId: zObjectId,
  locale: zLocaleCode.default('vi'),
  utm: z.record(z.string().max(200)).nullable().default(null),
  /*
   * Bẫy bot: trường ẩn, người thật không bao giờ điền.
   *
   * KHÔNG dùng `.max(0)`. Zod sẽ chặn ngay và trả lỗi có kèm tên trường
   * `website` — tức mách thẳng cho bot biết bẫy nằm ở đâu để lần sau né, đúng
   * thứ mà `isBot()` trong service cố tránh bằng cách trả thành công giả.
   * Ở đây chỉ nhận chuỗi; việc phán xét để service làm.
   */
  website: z.string().max(200).optional(),
});

export const zInquiryQuery = zPagination.extend({
  status: zInquiryStatus.optional(),
  source: z.enum(INQUIRY_SOURCES).optional(),
  propertyId: zObjectId.optional(),
  q: z.string().max(200).optional(),
  from: z.coerce.date().optional(),
  to: z.coerce.date().optional(),
  sort: z.enum(['newest', 'oldest']).default('newest'),
});

export const zInquiryStatusUpdate = z.object({
  status: zInquiryStatus,
  note: z.string().max(2000).optional(),
});

export const zInquiryNote = z.object({ text: z.string().min(1).max(2000) });

export type QuoteFormInput = z.infer<typeof zQuoteFormInput>;
export type PropertyInquiryInput = z.infer<typeof zPropertyInquiryInput>;
export type InquiryQuery = z.infer<typeof zInquiryQuery>;
