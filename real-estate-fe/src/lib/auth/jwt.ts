import { SignJWT, jwtVerify } from 'jose';

import type { AccessTokenClaims, RefreshTokenClaims, UserRole } from '@/lib/validations/auth';

/**
 * Ký / xác thực JWT bằng `jose`.
 *
 * File này CỐ TÌNH không import `server-only` và không import `env.server.ts`:
 * nó phải chạy được cả trong `middleware.ts` (Edge runtime).
 *
 * Hai ràng buộc của Edge:
 *  1. `jsonwebtoken` không dùng được (cần `crypto` của Node) → dùng `jose`.
 *  2. `process.env` trên Edge chỉ trả về biến được THAM CHIẾU TĨNH lúc build.
 *     Vì vậy phải viết `process.env.JWT_SECRET` nguyên văn, không được duyệt
 *     cả object `process.env` như `env.server.ts` đang làm.
 */

const enc = new TextEncoder();

function accessSecret(): Uint8Array {
  const s = process.env.JWT_SECRET;
  if (!s) throw new Error('Thiếu JWT_SECRET');
  return enc.encode(s);
}

function refreshSecret(): Uint8Array {
  const s = process.env.JWT_REFRESH_SECRET;
  if (!s) throw new Error('Thiếu JWT_REFRESH_SECRET');
  return enc.encode(s);
}

const ALG = 'HS256';
const ISSUER = 'dananghomesliving';
const AUDIENCE = 'dhl-admin';

/** '15m' | '30d' | '2h' → giây. Trả null nếu không parse được. */
export function parseTtlSeconds(ttl: string): number | null {
  const m = /^(\d+)([smhd])$/.exec(ttl.trim());
  if (!m) return null;
  const n = Number(m[1]);
  const unit = m[2];
  const mult = unit === 's' ? 1 : unit === 'm' ? 60 : unit === 'h' ? 3600 : 86_400;
  return n * mult;
}

export const ACCESS_TTL_SECONDS = parseTtlSeconds(process.env.JWT_ACCESS_TTL ?? '15m') ?? 900;
export const REFRESH_TTL_SECONDS = parseTtlSeconds(process.env.JWT_REFRESH_TTL ?? '30d') ?? 2_592_000;

export async function signAccessToken(payload: {
  userId: string;
  email: string;
  name: string;
  role: UserRole;
}): Promise<string> {
  return new SignJWT({
    email: payload.email,
    name: payload.name,
    role: payload.role,
    typ: 'access',
  })
    .setProtectedHeader({ alg: ALG })
    .setSubject(payload.userId)
    .setIssuer(ISSUER)
    .setAudience(AUDIENCE)
    .setIssuedAt()
    .setExpirationTime(`${ACCESS_TTL_SECONDS}s`)
    .sign(accessSecret());
}

export async function signRefreshToken(payload: { userId: string; sessionId: string }): Promise<string> {
  return new SignJWT({ sid: payload.sessionId, typ: 'refresh' })
    .setProtectedHeader({ alg: ALG })
    .setSubject(payload.userId)
    .setIssuer(ISSUER)
    .setAudience(AUDIENCE)
    .setIssuedAt()
    .setExpirationTime(`${REFRESH_TTL_SECONDS}s`)
    .sign(refreshSecret());
}

/** Trả null thay vì ném — hết hạn là chuyện bình thường, không phải lỗi hệ thống. */
export async function verifyAccessToken(token: string | undefined | null): Promise<AccessTokenClaims | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, accessSecret(), { issuer: ISSUER, audience: AUDIENCE });
    if (payload.typ !== 'access' || !payload.sub) return null;
    return {
      sub: payload.sub,
      email: String(payload.email ?? ''),
      name: String(payload.name ?? ''),
      role: payload.role as UserRole,
      typ: 'access',
    };
  } catch {
    return null;
  }
}

export async function verifyRefreshToken(token: string | undefined | null): Promise<RefreshTokenClaims | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, refreshSecret(), { issuer: ISSUER, audience: AUDIENCE });
    if (payload.typ !== 'refresh' || !payload.sub || !payload.sid) return null;
    return { sub: payload.sub, sid: String(payload.sid), typ: 'refresh' };
  } catch {
    return null;
  }
}

/**
 * SHA-256 bằng WebCrypto — có trên cả Edge và Node 18+.
 * Dùng để băm refresh token trước khi lưu DB và băm IP trước khi lưu inquiry.
 */
export async function sha256Hex(input: string): Promise<string> {
  const buf = await crypto.subtle.digest('SHA-256', enc.encode(input));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

export const COOKIE_ACCESS = 'dhl_at';
export const COOKIE_REFRESH = 'dhl_rt';
