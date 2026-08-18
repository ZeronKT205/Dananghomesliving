import 'server-only';

import { ObjectId } from 'mongodb';

import type { BaseDoc } from '../collections';
import type { Paginated } from '@/lib/validations/common';
import type { Collection, Document, Filter, OptionalUnlessRequiredId, Sort } from 'mongodb';

/**
 * Nền tảng cho mọi repository.
 *
 * Nguyên tắc: `deletedAt: null` được chèn TỰ ĐỘNG vào mọi truy vấn đọc. Muốn
 * lấy cả bản đã xoá thì phải gọi hàm có chữ `IncludingDeleted` — dài dòng có
 * chủ đích, để việc bỏ qua bộ lọc trở thành hành động cố ý chứ không phải
 * quên. Đây là điểm khác biệt so với việc chỉ thêm cột `deletedAt` rồi hy vọng
 * mọi người nhớ lọc.
 */

/** Ghép điều kiện "chưa xoá" vào filter của người gọi. */
export function alive<T extends BaseDoc>(filter: Filter<T> = {}): Filter<T> {
  return { ...filter, deletedAt: null } as Filter<T>;
}

/** Chuyển chuỗi 24 hex sang ObjectId. Trả null nếu không hợp lệ, KHÔNG ném. */
export function toObjectId(id: string | ObjectId | null | undefined): ObjectId | null {
  if (!id) return null;
  if (id instanceof ObjectId) return id;
  return ObjectId.isValid(id) ? new ObjectId(id) : null;
}

export function toObjectIds(ids: readonly (string | ObjectId)[] | null | undefined): ObjectId[] {
  if (!ids?.length) return [];
  return ids.map((i) => toObjectId(i)).filter((i): i is ObjectId => i !== null);
}

/** Giá trị mặc định cho các trường hệ thống khi tạo mới. */
export function baseCreateFields(actorId?: ObjectId | string | null): Omit<BaseDoc, '_id'> {
  const now = new Date();
  return {
    createdAt: now,
    updatedAt: now,
    deletedAt: null,
    createdBy: toObjectId(actorId),
    updatedBy: toObjectId(actorId),
  };
}

export function baseUpdateFields(actorId?: ObjectId | string | null) {
  return {
    updatedAt: new Date(),
    updatedBy: toObjectId(actorId),
  };
}

export interface PaginateArgs<T extends BaseDoc> {
  filter?: Filter<T>;
  sort?: Sort;
  page: number;
  limit: number;
  projection?: Document;
}

/**
 * Phân trang + đếm tổng trong MỘT vòng đi mạng thay vì hai.
 *
 * Chạy `find` và `countDocuments` song song bằng Promise.all thì vẫn là hai
 * request tới Atlas; với latency VN→Singapore ~40ms thì tiết kiệm được một
 * nửa. Không dùng `$facet` vì `$facet` không tận dụng được index cho nhánh
 * đếm khi dữ liệu lớn.
 */
export async function paginate<T extends BaseDoc>(
  col: Collection<T>,
  { filter = {}, sort = { createdAt: -1 }, page, limit, projection }: PaginateArgs<T>,
): Promise<Paginated<T>> {
  const query = alive(filter);
  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    col.find(query, { projection, sort, skip, limit }).toArray(),
    col.countDocuments(query),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / limit));

  return {
    items: items as T[],
    total,
    page,
    limit,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1,
  };
}

/** Tìm một bản ghi CHƯA xoá theo _id. */
export async function findAliveById<T extends BaseDoc>(
  col: Collection<T>,
  id: string | ObjectId,
): Promise<T | null> {
  const oid = toObjectId(id);
  if (!oid) return null;
  return (await col.findOne(alive({ _id: oid } as Filter<T>))) as T | null;
}

/** Tìm kể cả bản đã xoá — tên dài có chủ đích, xem ghi chú đầu file. */
export async function findIncludingDeletedById<T extends BaseDoc>(
  col: Collection<T>,
  id: string | ObjectId,
): Promise<T | null> {
  const oid = toObjectId(id);
  if (!oid) return null;
  return (await col.findOne({ _id: oid } as Filter<T>)) as T | null;
}

export async function findAliveBySlug<T extends BaseDoc & { slug: string }>(
  col: Collection<T>,
  slug: string,
): Promise<T | null> {
  return (await col.findOne(alive({ slug } as Filter<T>))) as T | null;
}

export async function insertDoc<T extends BaseDoc>(
  col: Collection<T>,
  doc: Omit<T, keyof BaseDoc>,
  actorId?: ObjectId | string | null,
): Promise<T> {
  const full = {
    ...doc,
    ...baseCreateFields(actorId),
    _id: new ObjectId(),
  } as unknown as OptionalUnlessRequiredId<T>;

  await col.insertOne(full);
  return full as unknown as T;
}

/**
 * Cập nhật một phần. Trả về document SAU khi sửa để không phải đọc lại.
 * Chỉ chạm được bản chưa xoá.
 */
export async function updateDoc<T extends BaseDoc>(
  col: Collection<T>,
  id: string | ObjectId,
  patch: Partial<Omit<T, keyof BaseDoc>>,
  actorId?: ObjectId | string | null,
): Promise<T | null> {
  const oid = toObjectId(id);
  if (!oid) return null;

  const result = await col.findOneAndUpdate(
    alive({ _id: oid } as Filter<T>),
    { $set: { ...patch, ...baseUpdateFields(actorId) } } as never,
    { returnDocument: 'after' },
  );

  return (result as T | null) ?? null;
}

/**
 * Xoá mềm. Idempotent: gọi lại trên bản đã xoá trả về null vì filter `alive`
 * không khớp — đúng ý, không ghi đè `deletedAt` cũ.
 */
export async function softDelete<T extends BaseDoc>(
  col: Collection<T>,
  id: string | ObjectId,
  actorId?: ObjectId | string | null,
): Promise<boolean> {
  const oid = toObjectId(id);
  if (!oid) return false;

  const res = await col.updateOne(
    alive({ _id: oid } as Filter<T>),
    { $set: { deletedAt: new Date(), ...baseUpdateFields(actorId) } } as never,
  );

  return res.modifiedCount > 0;
}

/** Khôi phục bản đã xoá mềm. */
export async function restoreDoc<T extends BaseDoc>(
  col: Collection<T>,
  id: string | ObjectId,
  actorId?: ObjectId | string | null,
): Promise<boolean> {
  const oid = toObjectId(id);
  if (!oid) return false;

  const res = await col.updateOne(
    { _id: oid, deletedAt: { $ne: null } } as Filter<T>,
    { $set: { deletedAt: null, ...baseUpdateFields(actorId) } } as never,
  );

  return res.modifiedCount > 0;
}

/**
 * Sinh slug chưa bị trùng. Trùng thì thêm hậu tố -2, -3…
 * Chỉ xét các bản CHƯA xoá, khớp với partial unique index — xoá tin cũ rồi thì
 * được dùng lại slug đó.
 */
export async function ensureUniqueSlug<T extends BaseDoc & { slug: string }>(
  col: Collection<T>,
  base: string,
  excludeId?: string | ObjectId | null,
): Promise<string> {
  const excluded = toObjectId(excludeId);
  let candidate = base;
  let suffix = 1;

  // Trần 200 để không lặp vô hạn nếu có gì đó sai ở tầng dưới.
  while (suffix < 200) {
    const filter: Record<string, unknown> = { slug: candidate, deletedAt: null };
    if (excluded) filter._id = { $ne: excluded };

    const existing = await col.findOne(filter as Filter<T>, { projection: { _id: 1 } });
    if (!existing) return candidate;

    suffix += 1;
    candidate = `${base}-${suffix}`;
  }

  // Hết cách thì gắn hậu tố ngẫu nhiên, vẫn hơn là ném lỗi cho người dùng.
  return `${base}-${Math.random().toString(36).slice(2, 8)}`;
}
