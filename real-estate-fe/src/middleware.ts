import { NextResponse } from 'next/server';
import createMiddleware from 'next-intl/middleware';

import { COOKIE_ACCESS, COOKIE_REFRESH, verifyAccessToken } from '@/lib/auth/jwt';

import { routing } from './i18n/routing';

import type { NextRequest } from 'next/server';

/**
 * Thứ tự xử lý (quan trọng, đừng đảo):
 *   1. /api/*   → bỏ qua i18n, chỉ gắn security header
 *   2. /admin/* → auth guard, KHÔNG áp i18n (admin chỉ tiếng Việt)
 *   3. còn lại  → next-intl
 *
 * Ràng buộc Edge runtime: không truy vấn được MongoDB ở đây. Middleware chỉ
 * VERIFY CHỮ KÝ access token (thuần CPU). Việc kiểm tra phiên đã bị thu hồi
 * hay chưa nằm ở /api/auth/refresh — chạy Node runtime.
 */

const intlMiddleware = createMiddleware(routing);

/** Đường dẫn admin không cần đăng nhập. */
const ADMIN_PUBLIC_PATHS = ['/admin/login'];

function securityHeaders(res: NextResponse): NextResponse {
  res.headers.set('X-Content-Type-Options', 'nosniff');
  res.headers.set('X-Frame-Options', 'SAMEORIGIN');
  res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.headers.set('X-DNS-Prefetch-Control', 'on');
  res.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(self)');
  if (process.env.NODE_ENV === 'production') {
    res.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
  }
  return res;
}

export default async function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  /* ── 1. API ─────────────────────────────────────────── */
  if (pathname.startsWith('/api')) {
    return securityHeaders(NextResponse.next());
  }

  /* ── 2. Admin ───────────────────────────────────────── */
  if (pathname === '/admin' || pathname.startsWith('/admin/')) {
    if (ADMIN_PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`))) {
      return securityHeaders(NextResponse.next());
    }

    const claims = await verifyAccessToken(req.cookies.get(COOKIE_ACCESS)?.value);
    if (claims) {
      return securityHeaders(NextResponse.next());
    }

    // Access token hỏng/hết hạn nhưng còn refresh token → thử gia hạn im lặng
    // rồi quay lại đúng trang đang mở, thay vì bắt đăng nhập lại mỗi 15 phút.
    if (req.cookies.get(COOKIE_REFRESH)?.value) {
      const url = req.nextUrl.clone();
      url.pathname = '/api/auth/refresh';
      url.search = `?next=${encodeURIComponent(pathname + search)}`;
      return securityHeaders(NextResponse.redirect(url));
    }

    const loginUrl = req.nextUrl.clone();
    loginUrl.pathname = '/admin/login';
    loginUrl.search = pathname === '/admin' ? '' : `?next=${encodeURIComponent(pathname + search)}`;
    return securityHeaders(NextResponse.redirect(loginUrl));
  }

  /* ── 3. Trang public ────────────────────────────────── */
  return securityHeaders(intlMiddleware(req) as NextResponse);
}

export const config = {
  /**
   * Phải bắt cả /admin và /api (matcher cũ loại trừ /admin nên trang quản trị
   * hoàn toàn không có lớp bảo vệ nào). Vẫn loại _next, _vercel và file tĩnh.
   */
  matcher: ['/((?!_next|_vercel|favicon.ico|images|geo|.*\\..*).*)'],
};
