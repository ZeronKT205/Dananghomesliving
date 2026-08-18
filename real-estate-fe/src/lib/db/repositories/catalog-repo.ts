import 'server-only';

import { amenitiesCol, categoriesCol, propertiesCol } from '../collections';
import {
  alive,
  ensureUniqueSlug,
  findAliveById,
  findAliveBySlug,
  insertDoc,
  softDelete,
  toObjectIds,
  updateDoc,
} from './base';

import type { AmenityDoc, CategoryDoc } from '../collections';

/* ── Danh mục BĐS ─────────────────────────────────────── */

export async function listCategories(opts: { onHomeOnly?: boolean } = {}): Promise<CategoryDoc[]> {
  const col = await categoriesCol();
  return col
    .find(alive(opts.onHomeOnly ? { showOnHome: true } : {}))
    .sort({ order: 1, slug: 1 })
    .toArray();
}

export async function getCategoryBySlug(slug: string): Promise<CategoryDoc | null> {
  return findAliveBySlug(await categoriesCol(), slug);
}

export async function getCategoryById(id: string): Promise<CategoryDoc | null> {
  return findAliveById(await categoriesCol(), id);
}

type CategoryDocInput = Omit<CategoryDoc, '_id' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'createdBy' | 'updatedBy'>;

export async function createCategory(doc: CategoryDocInput, actorId?: string | null): Promise<CategoryDoc> {
  const col = await categoriesCol();
  const slug = await ensureUniqueSlug(col, doc.slug);
  return insertDoc(col, { ...doc, slug }, actorId);
}

export async function updateCategory(
  id: string,
  patch: Partial<CategoryDocInput>,
  actorId?: string | null,
): Promise<CategoryDoc | null> {
  const col = await categoriesCol();
  if (patch.slug) patch = { ...patch, slug: await ensureUniqueSlug(col, patch.slug, id) };
  return updateDoc(col, id, patch, actorId);
}

/**
 * Xoá danh mục. CHẶN nếu còn BĐS đang trỏ tới — xoá sẽ để lại `categoryId` mồ
 * côi, và mọi truy vấn theo danh mục của các BĐS đó im lặng trả về rỗng.
 */
export async function deleteCategory(
  id: string,
  actorId?: string | null,
): Promise<{ ok: true } | { ok: false; reason: 'in_use'; count: number }> {
  const cat = await getCategoryById(id);
  if (!cat) return { ok: false, reason: 'in_use', count: 0 };

  const props = await propertiesCol();
  const count = await props.countDocuments(alive({ categoryId: cat._id }));
  if (count > 0) return { ok: false, reason: 'in_use', count };

  await softDelete(await categoriesCol(), id, actorId);
  return { ok: true };
}

/** Tính lại `propertyCount` cho mọi danh mục. Chạy theo lịch hoặc sau khi sửa BĐS. */
export async function recountCategories(): Promise<number> {
  const props = await propertiesCol();
  const cats = await categoriesCol();

  const counts = await props
    .aggregate<{ _id: CategoryDoc['_id']; n: number }>([
      { $match: { deletedAt: null, publishState: 'published', isPublic: true } },
      { $group: { _id: '$categoryId', n: { $sum: 1 } } },
    ])
    .toArray();

  const byId = new Map(counts.map((c) => [c._id?.toHexString?.() ?? String(c._id), c.n]));
  const all = await cats.find(alive()).project<{ _id: CategoryDoc['_id'] }>({ _id: 1 }).toArray();

  const ops = all.map((c) => ({
    updateOne: {
      filter: { _id: c._id },
      update: { $set: { propertyCount: byId.get(c._id.toHexString()) ?? 0 } },
    },
  }));

  if (!ops.length) return 0;
  const res = await cats.bulkWrite(ops, { ordered: false });
  return res.modifiedCount;
}

/* ── Tiện ích ─────────────────────────────────────────── */

export async function listAmenities(): Promise<AmenityDoc[]> {
  const col = await amenitiesCol();
  return col.find(alive()).sort({ group: 1, order: 1 }).toArray();
}

export async function getAmenitiesByIds(ids: readonly (string | AmenityDoc['_id'])[]): Promise<AmenityDoc[]> {
  const oids = toObjectIds(ids as readonly string[]);
  if (!oids.length) return [];
  const col = await amenitiesCol();
  return col.find(alive({ _id: { $in: oids } })).sort({ group: 1, order: 1 }).toArray();
}

type AmenityDocInput = Omit<AmenityDoc, '_id' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'createdBy' | 'updatedBy'>;

export async function createAmenity(doc: AmenityDocInput, actorId?: string | null): Promise<AmenityDoc> {
  const col = await amenitiesCol();
  const slug = await ensureUniqueSlug(col, doc.slug);
  return insertDoc(col, { ...doc, slug }, actorId);
}

export async function updateAmenity(
  id: string,
  patch: Partial<AmenityDocInput>,
  actorId?: string | null,
): Promise<AmenityDoc | null> {
  const col = await amenitiesCol();
  if (patch.slug) patch = { ...patch, slug: await ensureUniqueSlug(col, patch.slug, id) };
  return updateDoc(col, id, patch, actorId);
}

/** Xoá tiện ích: gỡ luôn khỏi mọi BĐS đang tham chiếu để không còn id mồ côi. */
export async function deleteAmenity(id: string, actorId?: string | null): Promise<boolean> {
  const amenity = await findAliveById(await amenitiesCol(), id);
  if (!amenity) return false;

  const props = await propertiesCol();
  await props.updateMany({ amenityIds: amenity._id }, { $pull: { amenityIds: amenity._id } });

  return softDelete(await amenitiesCol(), id, actorId);
}
