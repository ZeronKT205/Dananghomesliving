import 'server-only';

import { cookies } from 'next/headers';

import {
  ACCESS_TTL_SECONDS,
  COOKIE_ACCESS,
  COOKIE_REFRESH,
  REFRESH_TTL_SECONDS,
  verifyAccessToken,
} from './jwt';

import type { AccessTokenClaims, Permission, UserRole } from '@/lib/validations/auth';
import { hasPermission } from '@/lib/validations/auth';

/**
 * Đọc/ghi cookie phiên. Chỉ dùng ở Server Component, Server Action và Route
 * Handler — `next/headers` không có trong middleware.
 */

const isProd = process.env.NODE_ENV === 'production';

const BASE_COOKIE = {
  httpOnly: true, // JS phía client không đọc được → XSS không lấy được token
  secure: isProd, // dev chạy http://localhost nên không ép secure
  sameSite: 'lax' as const, // 'lax' cho phép điều hướng từ link ngoài, vẫn chặn CSRF POST
  path: '/',
};

export async function setAuthCookies(accessToken: string, refreshToken: string): Promise<void> {
  const jar = await cookies();
  jar.set(COOKIE_ACCESS, accessToken, { ...BASE_COOKIE, maxAge: ACCESS_TTL_SECONDS });
  jar.set(COOKIE_REFRESH, refreshToken, {
    ...BASE_COOKIE,
    maxAge: REFRESH_TTL_SECONDS,
    // Refresh token chỉ cần gửi tới các endpoint auth, không cần đính kèm mọi
    // request — thu hẹp bề mặt nếu có lỗ rò cookie ở route khác.
    path: '/',
  });
}

export async function clearAuthCookies(): Promise<void> {
  const jar = await cookies();
  jar.set(COOKIE_ACCESS, '', { ...BASE_COOKIE, maxAge: 0 });
  jar.set(COOKIE_REFRESH, '', { ...BASE_COOKIE, maxAge: 0 });
}

export async function getRefreshTokenCookie(): Promise<string | null> {
  const jar = await cookies();
  return jar.get(COOKIE_REFRESH)?.value ?? null;
}

/** Người dùng hiện tại, hoặc null. KHÔNG chạm DB — chỉ đọc chữ ký token. */
export async function getCurrentUser(): Promise<AccessTokenClaims | null> {
  const jar = await cookies();
  return verifyAccessToken(jar.get(COOKIE_ACCESS)?.value);
}

/** Bắt buộc đã đăng nhập. Ném để Server Action dừng ngay. */
export async function requireUser(): Promise<AccessTokenClaims> {
  const user = await getCurrentUser();
  if (!user) throw new AuthError('UNAUTHENTICATED', 'Chưa đăng nhập');
  return user;
}

/** Bắt buộc có quyền cụ thể. */
export async function requirePermission(permission: Permission): Promise<AccessTokenClaims> {
  const user = await requireUser();
  if (!hasPermission(user.role, permission)) {
    throw new AuthError('FORBIDDEN', 'Không đủ quyền thực hiện thao tác này');
  }
  return user;
}

export async function requireRole(...roles: UserRole[]): Promise<AccessTokenClaims> {
  const user = await requireUser();
  if (!roles.includes(user.role)) {
    throw new AuthError('FORBIDDEN', 'Không đủ quyền thực hiện thao tác này');
  }
  return user;
}

export class AuthError extends Error {
  constructor(
    public readonly code: 'UNAUTHENTICATED' | 'FORBIDDEN',
    message: string,
  ) {
    super(message);
    this.name = 'AuthError';
  }
}
