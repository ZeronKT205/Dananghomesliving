import { NextResponse } from 'next/server';

import { ok, withApi } from '@/lib/api/http';
import { getClientMeta } from '@/lib/api/request-meta';
import { clearAuthCookies, getRefreshTokenCookie, setAuthCookies } from '@/lib/auth/session';
import { refresh } from '@/server/services/auth-service';

import type { NextRequest } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * GET — middleware chuyển hướng tới đây khi access token hết hạn nhưng còn
 * refresh token. Gia hạn xong thì quay lại đúng trang đang mở.
 *
 * `next` PHẢI được kiểm tra là đường dẫn nội bộ. Nhận nguyên xi giá trị từ URL
 * rồi redirect là lỗ hổng open-redirect: `?next=https://evil.com` sẽ đẩy người
 * dùng đã đăng nhập sang site giả mạo.
 */
function safeNext(raw: string | null): string {
  if (!raw) return '/admin';
  // Chỉ chấp nhận đường dẫn tương đối bắt đầu bằng đúng MỘT dấu '/'.
  // '//evil.com' là protocol-relative URL — trình duyệt hiểu là host ngoài.
  if (!raw.startsWith('/') || raw.startsWith('//')) return '/admin';
  if (!raw.startsWith('/admin')) return '/admin';
  return raw;
}

export const GET = withApi(async (req: NextRequest) => {
  const next = safeNext(req.nextUrl.searchParams.get('next'));
  const token = await getRefreshTokenCookie();

  try {
    const meta = await getClientMeta(req);
    const { accessToken, refreshToken } = await refresh(token, meta);
    await setAuthCookies(accessToken, refreshToken);
    return NextResponse.redirect(new URL(next, req.nextUrl.origin));
  } catch {
    await clearAuthCookies();
    const loginUrl = new URL('/admin/login', req.nextUrl.origin);
    loginUrl.searchParams.set('next', next);
    return NextResponse.redirect(loginUrl);
  }
});

/** POST — dành cho client tự gọi gia hạn (fetch), trả JSON thay vì redirect. */
export const POST = withApi(async (req: NextRequest) => {
  const token = await getRefreshTokenCookie();
  const meta = await getClientMeta(req);
  const { accessToken, refreshToken, user } = await refresh(token, meta);
  await setAuthCookies(accessToken, refreshToken);
  return ok({ user });
});
