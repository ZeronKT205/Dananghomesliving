import { ok, withApi } from '@/lib/api/http';
import { getClientMeta } from '@/lib/api/request-meta';
import { setAuthCookies } from '@/lib/auth/session';
import { zLoginInput } from '@/lib/validations/auth';
import { login } from '@/server/services/auth-service';

import type { NextRequest } from 'next/server';

// bcrypt cần Node runtime — không chạy được trên Edge.
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export const POST = withApi(async (req: NextRequest) => {
  const body = await req.json().catch(() => ({}));
  const input = zLoginInput.parse(body);

  const meta = await getClientMeta(req);
  const { accessToken, refreshToken, user } = await login(input, meta);

  await setAuthCookies(accessToken, refreshToken);
  return ok({ user });
});
