import 'server-only';

import { ObjectId } from 'mongodb';

import { sessionsCol, usersCol } from '../collections';

import { alive, findAliveById, insertDoc, softDelete, toObjectId, updateDoc } from './base';

import type { SessionDoc, UserDoc } from '../collections';

/* ── Users ────────────────────────────────────────────── */

export async function findUserByEmail(email: string): Promise<UserDoc | null> {
  const col = await usersCol();
  return col.findOne(alive({ email: email.trim().toLowerCase() }));
}

export async function findUserById(id: string | ObjectId): Promise<UserDoc | null> {
  return findAliveById(await usersCol(), id);
}

export async function listUsers(): Promise<UserDoc[]> {
  const col = await usersCol();
  // Không bao giờ trả passwordHash ra ngoài repository.
  return col.find(alive()).project<UserDoc>({ passwordHash: 0 }).sort({ createdAt: 1 }).toArray();
}

type UserDocInput = Omit<UserDoc, '_id' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'createdBy' | 'updatedBy'>;

export async function createUser(doc: UserDocInput, actorId?: string | null): Promise<UserDoc> {
  return insertDoc(await usersCol(), doc, actorId);
}

export async function updateUser(
  id: string,
  patch: Partial<UserDocInput>,
  actorId?: string | null,
): Promise<UserDoc | null> {
  return updateDoc(await usersCol(), id, patch, actorId);
}

export async function deleteUser(id: string, actorId?: string | null): Promise<boolean> {
  // Xoá user thì phải huỷ hết phiên, nếu không họ vẫn dùng được access token
  // còn hạn và refresh token vẫn đổi được token mới.
  await revokeAllSessionsForUser(id);
  return softDelete(await usersCol(), id, actorId);
}

export async function markLoginSuccess(userId: ObjectId): Promise<void> {
  const col = await usersCol();
  await col.updateOne(
    { _id: userId },
    { $set: { lastLoginAt: new Date(), failedLoginCount: 0, lockedUntil: null } },
  );
}

/**
 * Ghi nhận đăng nhập sai. Sai 5 lần thì khoá 15 phút.
 * Trả về trạng thái khoá để tầng trên báo cho người dùng.
 */
export async function markLoginFailure(
  userId: ObjectId,
  maxAttempts = 5,
  lockMinutes = 15,
): Promise<{ locked: boolean; lockedUntil: Date | null }> {
  const col = await usersCol();
  const res = await col.findOneAndUpdate(
    { _id: userId },
    { $inc: { failedLoginCount: 1 } },
    { returnDocument: 'after', projection: { failedLoginCount: 1 } },
  );

  const count = res?.failedLoginCount ?? 0;
  if (count < maxAttempts) return { locked: false, lockedUntil: null };

  const lockedUntil = new Date(Date.now() + lockMinutes * 60_000);
  await col.updateOne({ _id: userId }, { $set: { lockedUntil, failedLoginCount: 0 } });
  return { locked: true, lockedUntil };
}

export function isUserLocked(user: Pick<UserDoc, 'lockedUntil'>): boolean {
  return user.lockedUntil !== null && user.lockedUntil.getTime() > Date.now();
}

/* ── Sessions (refresh token) ─────────────────────────── */

export async function createSession(args: {
  userId: ObjectId;
  tokenHash: string;
  expiresAt: Date;
  userAgent?: string | null;
  ipHash?: string | null;
}): Promise<SessionDoc> {
  const col = await sessionsCol();
  const now = new Date();
  const doc: SessionDoc = {
    _id: new ObjectId(),
    userId: args.userId,
    tokenHash: args.tokenHash,
    expiresAt: args.expiresAt,
    userAgent: args.userAgent ?? null,
    ipHash: args.ipHash ?? null,
    createdAt: now,
    lastUsedAt: now,
    revokedAt: null,
  };
  await col.insertOne(doc);
  return doc;
}

/** Lấy phiên còn hiệu lực theo hash của token. */
export async function findActiveSession(tokenHash: string): Promise<SessionDoc | null> {
  const col = await sessionsCol();
  return col.findOne({
    tokenHash,
    revokedAt: null,
    expiresAt: { $gt: new Date() },
  });
}

export async function touchSession(sessionId: ObjectId): Promise<void> {
  const col = await sessionsCol();
  await col.updateOne({ _id: sessionId }, { $set: { lastUsedAt: new Date() } });
}

/**
 * Xoay refresh token: thu hồi phiên cũ, tạo phiên mới.
 * Xoay mỗi lần refresh giúp phát hiện token bị đánh cắp — nếu token cũ được
 * dùng lại sau khi đã xoay, đó là dấu hiệu bị lộ.
 */
export async function rotateSession(
  oldSessionId: ObjectId,
  next: { tokenHash: string; expiresAt: Date; userAgent?: string | null; ipHash?: string | null },
  userId: ObjectId,
): Promise<SessionDoc> {
  const col = await sessionsCol();
  await col.updateOne({ _id: oldSessionId }, { $set: { revokedAt: new Date() } });
  return createSession({ userId, ...next });
}

export async function revokeSession(sessionId: string | ObjectId): Promise<boolean> {
  const oid = toObjectId(sessionId);
  if (!oid) return false;
  const col = await sessionsCol();
  const res = await col.updateOne({ _id: oid, revokedAt: null }, { $set: { revokedAt: new Date() } });
  return res.modifiedCount > 0;
}

export async function revokeAllSessionsForUser(userId: string | ObjectId): Promise<number> {
  const oid = toObjectId(userId);
  if (!oid) return 0;
  const col = await sessionsCol();
  const res = await col.updateMany({ userId: oid, revokedAt: null }, { $set: { revokedAt: new Date() } });
  return res.modifiedCount;
}

/** Danh sách thiết bị đang đăng nhập của một user. */
export async function listActiveSessions(userId: string | ObjectId): Promise<SessionDoc[]> {
  const oid = toObjectId(userId);
  if (!oid) return [];
  const col = await sessionsCol();
  return col
    .find({ userId: oid, revokedAt: null, expiresAt: { $gt: new Date() } })
    .sort({ lastUsedAt: -1 })
    .toArray();
}
