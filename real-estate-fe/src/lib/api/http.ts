import { NextResponse } from 'next/server';
import { ZodError } from 'zod';

import type { Paginated } from '@/lib/validations/common';

/**
 * Vỏ response thống nhất cho MỌI API. Client chỉ cần viết một hàm xử lý lỗi
 * duy nhất thay vì đoán mỗi endpoint trả về hình gì.
 *
 *   { ok: true,  data: ... }
 *   { ok: false, error: { code, message, fields? } }
 */

export type ApiOk<T> = { ok: true; data: T };
export type ApiErr = {
  ok: false;
  error: { code: ApiErrorCode; message: string; fields?: Record<string, string[]> };
};
export type ApiResult<T> = ApiOk<T> | ApiErr;

export type ApiErrorCode =
  | 'VALIDATION'
  | 'UNAUTHENTICATED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'CONFLICT'
  | 'RATE_LIMITED'
  | 'INTERNAL';

const STATUS: Record<ApiErrorCode, number> = {
  VALIDATION: 422,
  UNAUTHENTICATED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  RATE_LIMITED: 429,
  INTERNAL: 500,
};

export class ApiError extends Error {
  constructor(
    public readonly code: ApiErrorCode,
    message: string,
    public readonly fields?: Record<string, string[]>,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export function ok<T>(data: T, init?: ResponseInit): NextResponse<ApiOk<T>> {
  return NextResponse.json({ ok: true, data }, init);
}

export function fail(
  code: ApiErrorCode,
  message: string,
  fields?: Record<string, string[]>,
): NextResponse<ApiErr> {
  return NextResponse.json({ ok: false, error: { code, message, fields } }, { status: STATUS[code] });
}

/** Gom lỗi Zod theo tên trường để form hiển thị ngay dưới ô nhập. */
export function zodFields(err: ZodError): Record<string, string[]> {
  const out: Record<string, string[]> = {};
  for (const issue of err.issues) {
    const key = issue.path.join('.') || '_';
    (out[key] ??= []).push(issue.message);
  }
  return out;
}

/**
 * Bọc handler để mọi lỗi đều ra đúng vỏ response.
 *
 * Quan trọng: lỗi không lường trước KHÔNG được lộ `err.message` ra ngoài —
 * thông báo của driver Mongo có thể chứa cả connection string.
 */
export function withApi<Args extends unknown[]>(
  handler: (...args: Args) => Promise<Response>,
): (...args: Args) => Promise<Response> {
  return async (...args: Args) => {
    try {
      return await handler(...args);
    } catch (err) {
      if (err instanceof ZodError) {
        return fail('VALIDATION', 'Dữ liệu không hợp lệ', zodFields(err));
      }
      if (err instanceof ApiError) {
        return fail(err.code, err.message, err.fields);
      }
      if (err && typeof err === 'object' && 'code' in err && (err as { code: unknown }).code === 11000) {
        return fail('CONFLICT', 'Dữ liệu đã tồn tại');
      }
      if (err instanceof Error && err.name === 'AuthError') {
        const code = (err as unknown as { code: ApiErrorCode }).code;
        return fail(code ?? 'UNAUTHENTICATED', err.message);
      }

      console.error('[api] Lỗi không lường trước:', err);
      return fail('INTERNAL', 'Có lỗi xảy ra, vui lòng thử lại');
    }
  };
}

/** Chuyển Paginated<T> thành payload gọn cho client. */
export function paginatedPayload<T, R>(p: Paginated<T>, map: (item: T) => R) {
  return {
    items: p.items.map(map),
    pagination: {
      total: p.total,
      page: p.page,
      limit: p.limit,
      totalPages: p.totalPages,
      hasNext: p.hasNext,
      hasPrev: p.hasPrev,
    },
  };
}

/** Đọc query string thành object phẳng để đưa vào Zod. */
export function searchParamsToObject(url: string): Record<string, string | string[]> {
  const sp = new URL(url).searchParams;
  const out: Record<string, string | string[]> = {};
  for (const key of new Set(sp.keys())) {
    const all = sp.getAll(key);
    out[key] = all.length > 1 ? all : all[0]!;
  }
  return out;
}
