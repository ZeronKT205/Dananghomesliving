import 'server-only';

import { ObjectId } from 'mongodb';

import { ApiError } from '@/lib/api/http';
import { REFRESH_TTL_SECONDS, sha256Hex, signAccessToken, signRefreshToken, verifyRefreshToken } from '@/lib/auth/jwt';
import { fakeVerifyDelay, hashPassword, verifyPassword } from '@/lib/auth/password';
import {
  createSession,
  findActiveSession,
  findUserByEmail,
  findUserById,
  isUserLocked,
  markLoginFailure,
  markLoginSuccess,
  revokeAllSessionsForUser,
  revokeSession,
  rotateSession,
  touchSession,
} from '@/lib/db/repositories/user-repo';
import { createUser as repoCreateUser } from '@/lib/db/repositories/user-repo';
import type { LoginInput, UserCreateInput, UserRole } from '@/lib/validations/auth';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  user: { id: string; email: string; name: string; role: UserRole };
}

interface ClientMeta {
  userAgent?: string | null;
  ipHash?: string | null;
}

/**
 * Đăng nhập.
 *
 * Thông báo lỗi cố tình MƠ HỒ ("Email hoặc mật khẩu không đúng") cho cả hai
 * trường hợp email sai và mật khẩu sai — nói rõ "email không tồn tại" là tặng
 * kẻ tấn công công cụ dò danh sách tài khoản.
 */
export async function login(input: LoginInput, meta: ClientMeta = {}): Promise<AuthTokens> {
  const user = await findUserByEmail(input.email);

  if (!user) {
    // Vẫn tốn thời gian bcrypt để phản hồi không nhanh hơn trường hợp có user.
    await fakeVerifyDelay();
    throw new ApiError('UNAUTHENTICATED', 'Email hoặc mật khẩu không đúng');
  }

  if (!user.isActive) {
    throw new ApiError('FORBIDDEN', 'Tài khoản đã bị vô hiệu hoá');
  }

  if (isUserLocked(user)) {
    const mins = Math.ceil((user.lockedUntil!.getTime() - Date.now()) / 60_000);
    throw new ApiError('FORBIDDEN', `Tài khoản tạm khoá, thử lại sau ${mins} phút`);
  }

  const okPassword = await verifyPassword(input.password, user.passwordHash);
  if (!okPassword) {
    const { locked, lockedUntil } = await markLoginFailure(user._id);
    if (locked && lockedUntil) {
      throw new ApiError('FORBIDDEN', 'Sai quá nhiều lần, tài khoản tạm khoá 15 phút');
    }
    throw new ApiError('UNAUTHENTICATED', 'Email hoặc mật khẩu không đúng');
  }

  await markLoginSuccess(user._id);
  return issueTokens(user._id, user.email, user.name, user.role, meta);
}

async function issueTokens(
  userId: ObjectId,
  email: string,
  name: string,
  role: UserRole,
  meta: ClientMeta,
): Promise<AuthTokens> {
  const sessionId = new ObjectId();
  const refreshToken = await signRefreshToken({
    userId: userId.toHexString(),
    sessionId: sessionId.toHexString(),
  });

  await createSession({
    userId,
    tokenHash: await sha256Hex(refreshToken),
    expiresAt: new Date(Date.now() + REFRESH_TTL_SECONDS * 1000),
    userAgent: meta.userAgent ?? null,
    ipHash: meta.ipHash ?? null,
  });

  const accessToken = await signAccessToken({ userId: userId.toHexString(), email, name, role });

  return {
    accessToken,
    refreshToken,
    user: { id: userId.toHexString(), email, name, role },
  };
}

/**
 * Đổi refresh token lấy cặp token mới, đồng thời XOAY refresh token.
 *
 * Xoay mỗi lần refresh là cách phát hiện token bị đánh cắp: token cũ sau khi
 * xoay sẽ không còn trong DB, nên nếu ai đó dùng lại nó nghĩa là đã bị lộ.
 */
export async function refresh(refreshTokenRaw: string | null, meta: ClientMeta = {}): Promise<AuthTokens> {
  const claims = await verifyRefreshToken(refreshTokenRaw);
  if (!claims || !refreshTokenRaw) {
    throw new ApiError('UNAUTHENTICATED', 'Phiên đăng nhập đã hết hạn');
  }

  const tokenHash = await sha256Hex(refreshTokenRaw);
  const session = await findActiveSession(tokenHash);

  if (!session) {
    // Chữ ký hợp lệ nhưng phiên không còn → token đã bị thu hồi hoặc dùng lại
    // sau khi xoay. Huỷ TOÀN BỘ phiên của user này cho chắc.
    await revokeAllSessionsForUser(claims.sub);
    throw new ApiError('UNAUTHENTICATED', 'Phiên đăng nhập không còn hiệu lực');
  }

  const user = await findUserById(claims.sub);
  if (!user || !user.isActive) {
    await revokeSession(session._id);
    throw new ApiError('UNAUTHENTICATED', 'Tài khoản không còn hoạt động');
  }

  const newSessionId = new ObjectId();
  const newRefresh = await signRefreshToken({
    userId: user._id.toHexString(),
    sessionId: newSessionId.toHexString(),
  });

  await rotateSession(
    session._id,
    {
      tokenHash: await sha256Hex(newRefresh),
      expiresAt: new Date(Date.now() + REFRESH_TTL_SECONDS * 1000),
      userAgent: meta.userAgent ?? session.userAgent,
      ipHash: meta.ipHash ?? session.ipHash,
    },
    user._id,
  );

  await touchSession(session._id);

  const accessToken = await signAccessToken({
    userId: user._id.toHexString(),
    email: user.email,
    name: user.name,
    role: user.role,
  });

  return {
    accessToken,
    refreshToken: newRefresh,
    user: { id: user._id.toHexString(), email: user.email, name: user.name, role: user.role },
  };
}

export async function logout(refreshTokenRaw: string | null): Promise<void> {
  if (!refreshTokenRaw) return;
  const tokenHash = await sha256Hex(refreshTokenRaw);
  const session = await findActiveSession(tokenHash);
  if (session) await revokeSession(session._id);
}

export async function logoutAllDevices(userId: string): Promise<number> {
  return revokeAllSessionsForUser(userId);
}

/** Tạo tài khoản quản trị. */
export async function createUser(input: UserCreateInput, actorId?: string | null) {
  const existing = await findUserByEmail(input.email);
  if (existing) throw new ApiError('CONFLICT', 'Email này đã được sử dụng');

  const passwordHash = await hashPassword(input.password);

  return repoCreateUser(
    {
      email: input.email,
      passwordHash,
      name: input.name,
      role: input.role,
      avatarId: input.avatarId ? new ObjectId(input.avatarId) : null,
      isActive: true,
      lastLoginAt: null,
      failedLoginCount: 0,
      lockedUntil: null,
    },
    actorId,
  );
}

export async function changePassword(
  userId: string,
  currentPassword: string,
  newPassword: string,
): Promise<void> {
  const user = await findUserById(userId);
  if (!user) throw new ApiError('NOT_FOUND', 'Không tìm thấy tài khoản');

  const okPassword = await verifyPassword(currentPassword, user.passwordHash);
  if (!okPassword) throw new ApiError('VALIDATION', 'Mật khẩu hiện tại không đúng', {
    currentPassword: ['Mật khẩu hiện tại không đúng'],
  });

  const { usersCol } = await import('@/lib/db/collections');
  const col = await usersCol();
  await col.updateOne(
    { _id: user._id },
    { $set: { passwordHash: await hashPassword(newPassword), updatedAt: new Date() } },
  );

  // Đổi mật khẩu phải đá hết thiết bị khác ra — nếu không, kẻ đã chiếm phiên
  // vẫn ở lại dù nạn nhân vừa đổi mật khẩu.
  await revokeAllSessionsForUser(user._id);
}
