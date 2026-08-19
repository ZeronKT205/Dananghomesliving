'use server';

import { headers } from 'next/headers';

import { sha256Hex } from '@/lib/auth/jwt';
import { getPropertyBySlug } from '@/lib/db/repositories/property-repo';
import { zPropertyInquiryInput, zQuoteFormInput } from '@/lib/validations/inquiry';
import { submitPropertyInquiry, submitQuoteForm } from '@/server/services/inquiry-service';

import type { ZodError } from 'zod';

/**
 * Server Action cho các form PUBLIC (khách chưa đăng nhập).
 *
 * Tách khỏi `admin-actions.ts` có chủ đích: file đó mở đầu mọi hàm bằng
 * `requirePermission`, và một hàm public lọt vào giữa rất dễ bị đọc lướt qua
 * như thể cũng đã kiểm quyền. Ở đây thì rõ ràng: không có phiên đăng nhập, nên
 * mọi đầu vào đều phải Zod và mọi lời gọi đều phải qua chống spam.
 */

export type PublicFormResult =
  | { ok: true; code: string }
  | { ok: false; message: string; fields?: Record<string, string[]> };

/**
 * Băm IP để chống spam mà không lưu IP thật.
 *
 * Lưu IP thô là dữ liệu cá nhân, mà việc cần làm chỉ là "IP này đã gửi mấy lần
 * trong 10 phút" — băm một chiều là đủ.
 */
async function requestMeta(): Promise<{ ipHash: string | null; userAgent: string | null }> {
  const h = await headers();

  // `x-forwarded-for` có thể là chuỗi nhiều IP; IP thật của khách là cái đầu.
  const ip = h.get('x-forwarded-for')?.split(',')[0]?.trim() || h.get('x-real-ip')?.trim() || null;

  return {
    ipHash: ip ? await sha256Hex(ip) : null,
    userAgent: h.get('user-agent')?.slice(0, 400) ?? null,
  };
}

function fieldErrors(err: ZodError): Record<string, string[]> {
  const out: Record<string, string[]> = {};
  for (const issue of err.issues) {
    const key = issue.path.join('.') || 'form';
    (out[key] ??= []).push(issue.message);
  }
  return out;
}

/** Chuẩn hoá lỗi thành thông báo đọc được, KHÔNG lộ chi tiết nội bộ. */
function toResult(err: unknown): PublicFormResult {
  if (err && typeof err === 'object' && 'issues' in err) {
    const zerr = err as ZodError;
    return {
      ok: false,
      message: zerr.issues[0]?.message ?? 'Thông tin chưa hợp lệ',
      fields: fieldErrors(zerr),
    };
  }

  if (err instanceof Error) {
    const code = (err as { code?: string }).code;
    // Chỉ những lỗi nghiệp vụ đã định nghĩa mới được đưa nguyên văn ra ngoài.
    if (code === 'RATE_LIMITED' || code === 'VALIDATION' || code === 'NOT_FOUND') {
      return { ok: false, message: err.message };
    }
  }

  console.error('[public-action] lỗi không lường trước:', err);
  return { ok: false, message: 'Không gửi được yêu cầu. Vui lòng thử lại sau ít phút.' };
}

/** Form tư vấn chung (trang chủ, trang danh sách, footer). */
export async function actionSubmitQuote(input: unknown): Promise<PublicFormResult> {
  try {
    const data = zQuoteFormInput.parse(input);
    const { code } = await submitQuoteForm(data, await requestMeta());
    return { ok: true, code };
  } catch (err) {
    return toResult(err);
  }
}

/**
 * Form đặt lịch xem một BĐS cụ thể.
 *
 * Nhận `propertySlug` chứ không phải id: slug là thứ đã có trên URL, còn đẩy
 * ObjectId ra HTML chỉ để form gửi ngược lại là lộ định danh nội bộ không cần
 * thiết.
 */
export async function actionSubmitPropertyInquiry(input: unknown): Promise<PublicFormResult> {
  try {
    const { propertySlug, ...rest } = (input ?? {}) as Record<string, unknown> & { propertySlug?: string };

    if (!propertySlug) {
      return { ok: false, message: 'Thiếu thông tin bất động sản.' };
    }

    const property = await getPropertyBySlug(propertySlug);
    if (!property) {
      return { ok: false, message: 'Bất động sản này không còn được đăng.' };
    }

    const data = zPropertyInquiryInput.parse({ ...rest, propertyId: property._id.toHexString() });
    const { code } = await submitPropertyInquiry(data, await requestMeta());
    return { ok: true, code };
  } catch (err) {
    return toResult(err);
  }
}
