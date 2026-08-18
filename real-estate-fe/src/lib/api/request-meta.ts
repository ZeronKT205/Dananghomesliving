import { sha256Hex } from '@/lib/auth/jwt';

import type { NextRequest } from 'next/server';

/**
 * Trích IP + user agent từ request.
 *
 * IP luôn được BĂM trước khi lưu: đây là dữ liệu cá nhân, và mục đích duy nhất
 * của ta là "hai request này có cùng nguồn không" — băm đáp ứng đủ mà không
 * giữ lại thông tin nhận dạng.
 */
export function getClientIp(req: NextRequest | Request): string {
  const h = req.headers;
  // Vercel/Cloudflare đặt các header này. `x-forwarded-for` có thể là danh sách,
  // phần tử ĐẦU là client thật, các phần sau là proxy.
  const candidates = [
    h.get('cf-connecting-ip'),
    h.get('x-real-ip'),
    h.get('x-forwarded-for')?.split(',')[0]?.trim(),
  ];
  return candidates.find((v) => v && v.length > 0) ?? 'unknown';
}

export async function getClientMeta(req: NextRequest | Request): Promise<{
  userAgent: string | null;
  ipHash: string | null;
}> {
  const ip = getClientIp(req);
  const salt = process.env.AUTH_SECRET ?? '';
  return {
    userAgent: req.headers.get('user-agent')?.slice(0, 300) ?? null,
    // Muối bằng AUTH_SECRET để hash không thể dò ngược bằng bảng tra IPv4.
    ipHash: ip === 'unknown' ? null : await sha256Hex(`${salt}:${ip}`),
  };
}
