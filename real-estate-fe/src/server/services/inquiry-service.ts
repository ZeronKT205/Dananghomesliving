import 'server-only';

import { ObjectId } from 'mongodb';

import { ApiError } from '@/lib/api/http';
import {
  addInquiryNote,
  assignInquiry,
  countRecentByIp,
  createInquiry,
  deleteInquiry,
  getInquiriesByDay,
  getInquiryById,
  getInquiryStats,
  listInquiries,
  updateInquiryStatus,
} from '@/lib/db/repositories/inquiry-repo';
import { getPropertyById, incrementInquiryCount } from '@/lib/db/repositories/property-repo';
import { pickLocale } from '@/config/locales';

import type { InquiryDoc } from '@/lib/db/collections';
import type { InquiryQuery, PropertyInquiryInput, QuoteFormInput } from '@/lib/validations/inquiry';

/** Trần chống spam: tối đa 5 yêu cầu / 1 IP / 60 phút. */
const SPAM_MAX = 5;
const SPAM_WINDOW_MINUTES = 60;

async function guardSpam(ipHash: string | null): Promise<void> {
  if (!ipHash) return; // không xác định được IP thì thôi, không chặn oan
  const recent = await countRecentByIp(ipHash, SPAM_WINDOW_MINUTES);
  if (recent >= SPAM_MAX) {
    throw new ApiError('RATE_LIMITED', 'Bạn đã gửi quá nhiều yêu cầu. Vui lòng thử lại sau.');
  }
}

/**
 * Bẫy mật ong: input có trường ẩn `website`. Người thật không nhìn thấy nên
 * không bao giờ điền; bot tự động điền mọi input.
 *
 * Cố tình trả về THÀNH CÔNG GIẢ thay vì báo lỗi — báo lỗi là mách cho bot biết
 * bẫy nằm ở đâu để lần sau né.
 */
function isBot(input: { website?: string }): boolean {
  return typeof input.website === 'string' && input.website.length > 0;
}

export async function submitQuoteForm(
  input: QuoteFormInput,
  meta: { ipHash: string | null; userAgent: string | null },
): Promise<{ code: string }> {
  if (isBot(input)) return { code: 'YC-0000' };

  await guardSpam(meta.ipHash);

  const doc = await createInquiry({
    source: 'quote_form',
    name: input.name,
    email: input.email,
    phone: input.phone ?? null,
    locale: input.locale,
    service: input.service ?? null,
    message: input.message,
    preferredViewingDate: null,
    propertyId: null,
    propertySnapshot: null,
    status: 'new',
    assignedTo: null,
    notes: [],
    respondedAt: null,
    ipHash: meta.ipHash,
    userAgent: meta.userAgent,
    utm: input.utm ?? null,
  });

  return { code: doc.code };
}

export async function submitPropertyInquiry(
  input: PropertyInquiryInput,
  meta: { ipHash: string | null; userAgent: string | null },
): Promise<{ code: string }> {
  if (isBot(input)) return { code: 'YC-0000' };

  await guardSpam(meta.ipHash);

  const property = await getPropertyById(input.propertyId);
  if (!property) throw new ApiError('NOT_FOUND', 'Không tìm thấy bất động sản');

  const doc = await createInquiry({
    source: 'property_form',
    name: input.name,
    email: input.email,
    phone: input.phone,
    locale: input.locale,
    service: null,
    message: input.message,
    preferredViewingDate: input.preferredViewingDate,
    propertyId: property._id,
    // Chụp lại tên tại thời điểm gửi — BĐS có thể đổi tên hoặc bị xoá sau này,
    // nhưng yêu cầu tư vấn phải giữ nguyên bối cảnh lúc khách hỏi.
    propertySnapshot: {
      slug: property.slug,
      title: pickLocale(property.title, input.locale, property.slug),
    },
    status: 'new',
    assignedTo: null,
    notes: [],
    respondedAt: null,
    ipHash: meta.ipHash,
    userAgent: meta.userAgent,
    utm: input.utm ?? null,
  });

  await incrementInquiryCount(input.propertyId);
  return { code: doc.code };
}

/* ── Phía admin ───────────────────────────────────────── */

export async function getInquiries(query: InquiryQuery) {
  return listInquiries(query);
}

export async function getInquiry(id: string): Promise<InquiryDoc> {
  const doc = await getInquiryById(id);
  if (!doc) throw new ApiError('NOT_FOUND', 'Không tìm thấy yêu cầu');
  return doc;
}

export async function changeInquiryStatus(id: string, status: InquiryDoc['status'], actorId: string) {
  const updated = await updateInquiryStatus(id, status, actorId);
  if (!updated) throw new ApiError('NOT_FOUND', 'Không tìm thấy yêu cầu');
  return updated;
}

export async function noteInquiry(id: string, actorId: string, text: string) {
  const updated = await addInquiryNote(id, actorId, text);
  if (!updated) throw new ApiError('NOT_FOUND', 'Không tìm thấy yêu cầu');
  return updated;
}

export async function assign(id: string, userId: string | null, actorId: string) {
  return assignInquiry(id, userId, actorId);
}

export async function removeInquiry(id: string, actorId: string) {
  const okDelete = await deleteInquiry(id, actorId);
  if (!okDelete) throw new ApiError('NOT_FOUND', 'Không tìm thấy yêu cầu');
}

export async function countPendingInquiries(): Promise<number> {
  const stats = await getInquiryStats();
  return stats.new;
}

export async function getInquiryDashboard() {
  const [stats, byDay] = await Promise.all([getInquiryStats(), getInquiriesByDay(7)]);
  return { stats, byDay };
}

/**
 * Quá hạn = chưa xử lý và đã nhận hơn 24 giờ.
 * KHÔNG lưu cờ này trong DB — nó là giá trị tính được, lưu lại là chuốc lấy
 * dữ liệu lệch khi không có job cập nhật.
 */
export function isOverdue(doc: Pick<InquiryDoc, 'status' | 'createdAt'>): boolean {
  return doc.status === 'new' && Date.now() - doc.createdAt.getTime() > 24 * 3600_000;
}

export function toObjectIdOrNull(id: string | null): ObjectId | null {
  return id && ObjectId.isValid(id) ? new ObjectId(id) : null;
}
