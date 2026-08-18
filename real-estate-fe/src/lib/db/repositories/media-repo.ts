import 'server-only';

import { mediaCol } from '../collections';
import { alive, findAliveById, insertDoc, paginate, softDelete, toObjectIds, updateDoc } from './base';

import type { MediaDoc } from '../collections';
import type { Paginated } from '@/lib/validations/common';

type MediaDocInput = Omit<MediaDoc, '_id' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'createdBy' | 'updatedBy'>;

export async function createMedia(doc: MediaDocInput, actorId?: string | null): Promise<MediaDoc> {
  return insertDoc(await mediaCol(), doc, actorId);
}

export async function getMediaById(id: string): Promise<MediaDoc | null> {
  return findAliveById(await mediaCol(), id);
}

/**
 * Lấy nhiều media và trả về ĐÚNG THỨ TỰ id được truyền vào.
 * Mongo `$in` không bảo toàn thứ tự — thư viện ảnh mà đảo lung tung mỗi lần
 * tải trang thì ảnh bìa không còn là ảnh đầu tiên nữa.
 */
export async function getMediaByIds(ids: readonly (string | MediaDoc['_id'])[]): Promise<MediaDoc[]> {
  const oids = toObjectIds(ids as readonly string[]);
  if (!oids.length) return [];

  const col = await mediaCol();
  const docs = await col.find(alive({ _id: { $in: oids } })).toArray();
  const byId = new Map(docs.map((d) => [d._id.toHexString(), d]));

  return oids.map((oid) => byId.get(oid.toHexString())).filter((d): d is MediaDoc => d !== undefined);
}

export async function listMedia(args: {
  page: number;
  limit: number;
  ownerType?: MediaDoc['ownerType'];
}): Promise<Paginated<MediaDoc>> {
  const col = await mediaCol();
  return paginate(col, {
    filter: args.ownerType ? { ownerType: args.ownerType } : {},
    sort: { createdAt: -1 },
    page: args.page,
    limit: args.limit,
  });
}

export async function updateMedia(
  id: string,
  patch: Partial<MediaDocInput>,
  actorId?: string | null,
): Promise<MediaDoc | null> {
  return updateDoc(await mediaCol(), id, patch, actorId);
}

/**
 * Xoá mềm bản ghi media. KHÔNG xoá file trên R2 ở đây — file có thể còn được
 * tham chiếu ở chỗ khác, và xoá được bản ghi thì dễ chứ khôi phục file đã xoá
 * trên R2 thì không. Dọn file thật để cho job riêng đối chiếu.
 */
export async function deleteMedia(id: string, actorId?: string | null): Promise<boolean> {
  return softDelete(await mediaCol(), id, actorId);
}

export async function findOrphanMedia(olderThanDays = 7): Promise<MediaDoc[]> {
  const col = await mediaCol();
  return col
    .find(
      alive({
        ownerId: null,
        createdAt: { $lt: new Date(Date.now() - olderThanDays * 86_400_000) },
      }),
    )
    .toArray();
}
