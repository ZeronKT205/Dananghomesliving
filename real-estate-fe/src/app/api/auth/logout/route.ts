import { ok, withApi } from '@/lib/api/http';
import { clearAuthCookies, getRefreshTokenCookie } from '@/lib/auth/session';
import { logout } from '@/server/services/auth-service';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export const POST = withApi(async () => {
  const token = await getRefreshTokenCookie();
  // Thu hồi phiên trong DB TRƯỚC khi xoá cookie — xoá cookie mà quên thu hồi
  // thì refresh token vẫn đổi được token mới nếu ai đó đã sao chép nó.
  await logout(token);
  await clearAuthCookies();
  return ok({ loggedOut: true });
});
