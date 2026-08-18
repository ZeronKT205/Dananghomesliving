import 'server-only';

import type { Paginated } from '@/lib/validations/common';
import type { InquiryQuery } from '@/lib/validations/inquiry';

import { inquiriesCol } from '../collections';

import { alive, insertDoc, paginate, softDelete, toObjectId, updateDoc } from './base';

import type { InquiryDoc } from '../collections';
import type { Filter } from 'mongodb';

/**
 * Sinh mã yêu cầu dạng YC-1041 (khớp định dạng đang hiển thị trong admin).
 *
 * Dùng bộ đếm theo bản ghi lớn nhất hiện có chứ không phải countDocuments —
 * đếm số bản ghi sẽ sinh trùng mã ngay sau khi có bản bị xoá.
 * Vẫn có khe đua nếu hai request cùng lúc; unique index trên `code` sẽ bắt,
 * và hàm gọi thử lại. Đủ tốt cho khối lượng form liên hệ.
 */
async function nextInquiryCode(): Promise<string> {
  const col = await inquiriesCol();
  const [last] = await col.find({}).sort({ code: -1 }).limit(1).project<{ code: string }>({ code: 1 }).toArray();

  const lastNum = last?.code ? Number.parseInt(last.code.replace(/\D/g, ''), 10) : 1000;
  const next = Number.isFinite(lastNum) ? lastNum + 1 : 1001;
  return `YC-${next}`;
}

type InquiryDocInput = Omit<
  InquiryDoc,
  '_id' | 'code' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'createdBy' | 'updatedBy'
>;

export async function createInquiry(doc: InquiryDocInput): Promise<InquiryDoc> {
  const col = await inquiriesCol();

  // Thử lại khi đụng unique index do đua mã.
  for (let attempt = 0; attempt < 5; attempt++) {
    const code = await nextInquiryCode();
    try {
      return await insertDoc(col, { ...doc, code }, null);
    } catch (err) {
      const isDup = (err as { code?: number }).code === 11000;
      if (!isDup || attempt === 4) throw err;
    }
  }

  throw new Error('Không sinh được mã yêu cầu');
}

export async function listInquiries(q: InquiryQuery): Promise<Paginated<InquiryDoc>> {
  const col = await inquiriesCol();
  const filter: Filter<InquiryDoc> = {};

  if (q.status) filter.status = q.status;
  if (q.source) filter.source = q.source;
  if (q.propertyId) {
    const oid = toObjectId(q.propertyId);
    if (oid) filter.propertyId = oid;
  }

  if (q.from || q.to) {
    filter.createdAt = {
      ...(q.from ? { $gte: q.from } : {}),
      ...(q.to ? { $lte: q.to } : {}),
    };
  }

  if (q.q?.trim()) {
    const safe = q.q.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const rx = { $regex: safe, $options: 'i' };
    filter.$or = [{ name: rx }, { email: rx }, { phone: rx }, { code: rx }, { message: rx }];
  }

  return paginate(col, {
    filter,
    sort: { createdAt: q.sort === 'oldest' ? 1 : -1 },
    page: q.page,
    limit: q.limit,
  });
}

export async function getInquiryById(id: string): Promise<InquiryDoc | null> {
  const oid = toObjectId(id);
  if (!oid) return null;
  const col = await inquiriesCol();
  return col.findOne(alive({ _id: oid }));
}

export async function updateInquiryStatus(
  id: string,
  status: InquiryDoc['status'],
  actorId?: string | null,
): Promise<InquiryDoc | null> {
  const patch: Partial<InquiryDoc> = { status };
  // Đánh dấu thời điểm phản hồi lần đầu — nguồn để đo SLA.
  if (status === 'contacted') patch.respondedAt = new Date();
  return updateDoc(await inquiriesCol(), id, patch, actorId);
}

export async function addInquiryNote(id: string, actorId: string, text: string): Promise<InquiryDoc | null> {
  const oid = toObjectId(id);
  const actor = toObjectId(actorId);
  if (!oid || !actor) return null;

  const col = await inquiriesCol();
  const res = await col.findOneAndUpdate(
    alive({ _id: oid }),
    {
      $push: { notes: { by: actor, at: new Date(), text } },
      $set: { updatedAt: new Date(), updatedBy: actor },
    },
    { returnDocument: 'after' },
  );
  return res ?? null;
}

export async function assignInquiry(id: string, userId: string | null, actorId?: string | null) {
  return updateDoc(await inquiriesCol(), id, { assignedTo: toObjectId(userId) }, actorId);
}

export async function deleteInquiry(id: string, actorId?: string | null): Promise<boolean> {
  return softDelete(await inquiriesCol(), id, actorId);
}

/**
 * Đếm số yêu cầu từ một IP trong khoảng thời gian — chặn spam form.
 * Đây là lớp chặn ở tầng dữ liệu, độc lập với rate limit ở middleware (vốn
 * không tin cậy được vì bộ nhớ không chia sẻ giữa các lambda).
 */
export async function countRecentByIp(ipHash: string, withinMinutes: number): Promise<number> {
  const col = await inquiriesCol();
  return col.countDocuments({
    ipHash,
    createdAt: { $gte: new Date(Date.now() - withinMinutes * 60_000) },
  });
}

/** Thống kê cho trang tổng quan admin. */
export async function getInquiryStats(): Promise<{
  total: number;
  new: number;
  contacted: number;
  done: number;
  cancelled: number;
}> {
  const col = await inquiriesCol();
  const [row] = await col
    .aggregate<{ total: number; new: number; contacted: number; done: number; cancelled: number }>([
      { $match: { deletedAt: null } },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          new: { $sum: { $cond: [{ $eq: ['$status', 'new'] }, 1, 0] } },
          contacted: { $sum: { $cond: [{ $eq: ['$status', 'contacted'] }, 1, 0] } },
          done: { $sum: { $cond: [{ $eq: ['$status', 'done'] }, 1, 0] } },
          cancelled: { $sum: { $cond: [{ $eq: ['$status', 'cancelled'] }, 1, 0] } },
        },
      },
      { $project: { _id: 0 } },
    ])
    .toArray();

  return row ?? { total: 0, new: 0, contacted: 0, done: 0, cancelled: 0 };
}

/** Số yêu cầu theo ngày, N ngày gần nhất — nguồn cho biểu đồ cột ở admin. */
export async function getInquiriesByDay(days = 7): Promise<Array<{ date: string; count: number }>> {
  const col = await inquiriesCol();
  const since = new Date();
  since.setHours(0, 0, 0, 0);
  since.setDate(since.getDate() - (days - 1));

  const rows = await col
    .aggregate<{ _id: string; count: number }>([
      { $match: { deletedAt: null, createdAt: { $gte: since } } },
      {
        $group: {
          // timezone cứng theo giờ VN — nếu không, yêu cầu gửi lúc 23h tối sẽ
          // rơi sang ngày hôm sau theo UTC và biểu đồ lệch một ngày.
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt', timezone: 'Asia/Ho_Chi_Minh' } },
          count: { $sum: 1 },
        },
      },
    ])
    .toArray();

  const byDate = new Map(rows.map((r) => [r._id, r.count]));
  const out: Array<{ date: string; count: number }> = [];

  for (let i = 0; i < days; i++) {
    const d = new Date(since);
    d.setDate(since.getDate() + i);
    const key = d.toISOString().slice(0, 10);
    out.push({ date: key, count: byDate.get(key) ?? 0 });
  }

  return out;
}
