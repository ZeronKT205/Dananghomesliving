'use server';

import { ObjectId } from 'mongodb';
import { revalidatePath } from 'next/cache';

import { requirePermission } from '@/lib/auth/session';
import type { InquiryStatus, PublishState } from '@/lib/db/collections';
import { deleteArticle } from '@/lib/db/repositories/article-repo';
import {
  createAmenity,
  createCategory,
  deleteAmenity,
  deleteCategory,
  updateAmenity,
  updateCategory,
} from '@/lib/db/repositories/catalog-repo';
import { slugify } from '@/lib/validations/common';
import {
  changeInquiryStatus,
  noteInquiry,
  removeInquiry,
} from '@/server/services/inquiry-service';
import {
  createPropertyFromInput,
  removeProperty,
  setPublishState,
  undoRemoveProperty,
  updatePropertyFromInput,
} from '@/server/services/property-service';



/**
 * Server Actions cho khu quản trị.
 *
 * MỖI action tự kiểm tra quyền bằng `requirePermission`. Không dựa vào việc
 * middleware đã chặn /admin: Server Action là một endpoint HTTP độc lập, gọi
 * thẳng được từ bên ngoài mà không đi qua trang nào cả.
 */

export type ActionResult =
  | { ok: true; message?: string; id?: string }
  | { ok: false; message: string; fields?: Record<string, string[]> };

function fail(err: unknown): ActionResult {
  if (err instanceof Error) {
    const code = (err as { code?: string }).code;
    if (code === 'FORBIDDEN') return { ok: false, message: 'Không đủ quyền thực hiện thao tác này' };
    if (code === 'UNAUTHENTICATED') return { ok: false, message: 'Phiên đăng nhập đã hết hạn' };
    const fields = (err as { fields?: Record<string, string[]> }).fields;
    return { ok: false, message: err.message, fields };
  }
  return { ok: false, message: 'Có lỗi xảy ra, vui lòng thử lại' };
}

/* ── Bất động sản ─────────────────────────────────────── */

export async function actionDeleteProperty(id: string): Promise<ActionResult> {
  try {
    const user = await requirePermission('content:write');
    await removeProperty(id, user.sub);
    revalidatePath('/admin/properties');
    revalidatePath('/admin');
    return { ok: true, message: 'Đã chuyển vào thùng rác' };
  } catch (err) {
    return fail(err);
  }
}

export async function actionRestoreProperty(id: string): Promise<ActionResult> {
  try {
    const user = await requirePermission('content:write');
    await undoRemoveProperty(id, user.sub);
    revalidatePath('/admin/properties');
    return { ok: true, message: 'Đã khôi phục' };
  } catch (err) {
    return fail(err);
  }
}

export async function actionSetPropertyState(id: string, state: PublishState): Promise<ActionResult> {
  try {
    const user = await requirePermission('content:write');
    await setPublishState(id, state, user.sub);
    revalidatePath('/admin/properties');
    revalidatePath('/admin');
    return { ok: true, message: state === 'published' ? 'Đã xuất bản' : 'Đã cập nhật trạng thái' };
  } catch (err) {
    return fail(err);
  }
}

/** Lưu BĐS. `id` rỗng = tạo mới. Nhận payload JSON đã dựng sẵn từ form. */
export async function actionSaveProperty(id: string | null, payload: unknown): Promise<ActionResult> {
  try {
    const user = await requirePermission('content:write');
    const { zPropertyCreate, zPropertyUpdate } = await import('@/lib/validations/property');

    if (id) {
      const input = zPropertyUpdate.parse(payload);
      await updatePropertyFromInput(id, input, user.sub);
      revalidatePath('/admin/properties');
      revalidatePath(`/admin/properties/${id}`);
      return { ok: true, message: 'Đã cập nhật', id };
    }

    const input = zPropertyCreate.parse(payload);
    const created = await createPropertyFromInput(input, user.sub);
    revalidatePath('/admin/properties');
    return { ok: true, message: 'Đã tạo bất động sản', id: created._id.toHexString() };
  } catch (err) {
    return fail(err);
  }
}

/* ── Bài viết ─────────────────────────────────────────── */

export async function actionSaveArticle(id: string | null, payload: unknown): Promise<ActionResult> {
  try {
    const user = await requirePermission('content:write');
    const { zArticleCreate, zArticleUpdate } = await import('@/lib/validations/article');
    const { sanitizeArticleHtml, readingMinutesFromHtml } = await import('@/lib/sanitize-html');
    const { getArticleById, createArticle: create, updateArticle: update } = await import(
      '@/lib/db/repositories/article-repo'
    );

    const input = id ? zArticleUpdate.parse(payload) : zArticleCreate.parse(payload);

    // Nội dung là HTML từ trình soạn thảo. Sanitize TỪNG ngôn ngữ trước khi
    // lưu — Server Action là endpoint HTTP gọi thẳng được, không tin client.
    const content: Record<string, string> = {};
    for (const [l, html] of Object.entries(input.content ?? {})) {
      if (typeof html === 'string' && html.trim()) content[l] = sanitizeArticleHtml(html);
    }

    const titleVi = input.title?.vi ?? input.title?.en ?? 'bai-viet';
    const primary = content.vi ?? content.en ?? Object.values(content)[0] ?? '';

    const doc = {
      slug: input.slug ?? slugify(titleVi),
      title: input.title ?? {},
      excerpt: input.excerpt ?? {},
      content,
      categoryId: new ObjectId(input.categoryId!),
      // Hashtag do AI sinh khi dựng bài, biên tập chỉ bỏ bớt chứ không gõ tay.
      tags: (input.tags ?? []).map((t) => String(t).replace(/^#+/, '').trim()).filter(Boolean).slice(0, 8),
      coverId: input.coverId ? new ObjectId(input.coverId) : null,
      // Tác giả lấy từ tài khoản đang đăng nhập, không nhập tay.
      author: { name: user.name, role: null, avatarId: null },
      readingMinutes: readingMinutesFromHtml(primary),
      isFeatured: input.isFeatured ?? false,
      publishState: (input.publishState ?? 'draft') as PublishState,
      publishedAt: input.publishState === 'published' ? new Date() : null,
      viewCount: 0,
      // SEO tự suy từ tiêu đề và tóm tắt — admin non-tech không cần nhập.
      // Khi gắn AI sinh SEO thì thay đúng chỗ này.
      seo: {
        title: input.title ?? {},
        description: input.excerpt ?? {},
        ogImageId: input.coverId ? new ObjectId(input.coverId) : null,
      },
    };

    if (id) {
      const existing = await getArticleById(id);
      await update(
        id,
        {
          ...doc,
          publishedAt:
            doc.publishState === 'published'
              ? (existing?.publishedAt ?? new Date())
              : (existing?.publishedAt ?? null),
          viewCount: existing?.viewCount ?? 0,
        },
        user.sub,
      );
      revalidatePath('/admin/news');
      return { ok: true, message: 'Đã cập nhật bài viết', id };
    }

    const created = await create(doc, user.sub);
    revalidatePath('/admin/news');
    return { ok: true, message: 'Đã tạo bài viết', id: created._id.toHexString() };
  } catch (err) {
    return fail(err);
  }
}

export async function actionDeleteArticle(id: string): Promise<ActionResult> {
  try {
    const user = await requirePermission('content:write');
    await deleteArticle(id, user.sub);
    revalidatePath('/admin/news');
    return { ok: true, message: 'Đã xoá bài viết' };
  } catch (err) {
    return fail(err);
  }
}

/* ── Yêu cầu tư vấn ───────────────────────────────────── */

export async function actionSetInquiryStatus(id: string, status: InquiryStatus): Promise<ActionResult> {
  try {
    const user = await requirePermission('inquiry:write');
    await changeInquiryStatus(id, status, user.sub);
    revalidatePath('/admin/inquiries');
    revalidatePath('/admin');
    return { ok: true, message: 'Đã cập nhật trạng thái' };
  } catch (err) {
    return fail(err);
  }
}

export async function actionAddInquiryNote(id: string, text: string): Promise<ActionResult> {
  try {
    const user = await requirePermission('inquiry:write');
    if (!text.trim()) return { ok: false, message: 'Ghi chú không được để trống' };
    await noteInquiry(id, user.sub, text.trim());
    revalidatePath('/admin/inquiries');
    return { ok: true, message: 'Đã thêm ghi chú' };
  } catch (err) {
    return fail(err);
  }
}

export async function actionDeleteInquiry(id: string): Promise<ActionResult> {
  try {
    const user = await requirePermission('inquiry:write');
    await removeInquiry(id, user.sub);
    revalidatePath('/admin/inquiries');
    return { ok: true, message: 'Đã xoá yêu cầu' };
  } catch (err) {
    return fail(err);
  }
}

/* ── Danh mục & tiện ích ──────────────────────────────── */

export async function actionSaveCategory(
  id: string | null,
  data: { name: string; nameEn?: string; showOnHome: boolean; order: number },
): Promise<ActionResult> {
  try {
    const user = await requirePermission('content:write');
    const payload = {
      slug: slugify(data.nameEn || data.name),
      name: { vi: data.name, en: data.nameEn || data.name },
      description: null,
      showOnHome: data.showOnHome,
      order: data.order,
      coverId: null,
      propertyCount: 0,
    };

    if (id) {
      await updateCategory(id, payload, user.sub);
      revalidatePath('/admin/properties');
      return { ok: true, message: 'Đã cập nhật nhóm' };
    }
    const created = await createCategory(payload, user.sub);
    revalidatePath('/admin/properties');
    return { ok: true, message: 'Đã tạo nhóm', id: created._id.toHexString() };
  } catch (err) {
    return fail(err);
  }
}

export async function actionDeleteCategory(id: string): Promise<ActionResult> {
  try {
    const user = await requirePermission('content:write');
    const res = await deleteCategory(id, user.sub);
    if (!res.ok) {
      // Chặn thay vì xoá — xoá danh mục còn BĐS trỏ tới sẽ để lại categoryId
      // mồ côi và các BĐS đó biến mất khỏi mọi bộ lọc theo nhóm.
      return { ok: false, message: `Còn ${res.count} bất động sản thuộc nhóm này. Chuyển chúng sang nhóm khác trước.` };
    }
    revalidatePath('/admin/properties');
    return { ok: true, message: 'Đã xoá nhóm' };
  } catch (err) {
    return fail(err);
  }
}

export async function actionSaveAmenity(
  id: string | null,
  data: { name: string; nameEn?: string; icon: string; group: 'indoor' | 'outdoor' | 'security' | 'service'; order: number },
): Promise<ActionResult> {
  try {
    const user = await requirePermission('content:write');
    const payload = {
      slug: slugify(data.nameEn || data.name),
      name: { vi: data.name, en: data.nameEn || data.name },
      icon: data.icon,
      group: data.group,
      order: data.order,
    };
    if (id) {
      await updateAmenity(id, payload, user.sub);
    } else {
      await createAmenity(payload, user.sub);
    }
    revalidatePath('/admin/properties');
    return { ok: true, message: 'Đã lưu tiện ích' };
  } catch (err) {
    return fail(err);
  }
}

export async function actionDeleteAmenity(id: string): Promise<ActionResult> {
  try {
    const user = await requirePermission('content:write');
    await deleteAmenity(id, user.sub);
    revalidatePath('/admin/properties');
    return { ok: true, message: 'Đã xoá tiện ích' };
  } catch (err) {
    return fail(err);
  }
}

/* ── Ảnh ──────────────────────────────────────────────── */

/**
 * Thêm ảnh bằng URL.
 *
 * Upload thẳng lên R2 chưa dựng, nhưng CMS phải nhập liệu được ngay. Hàm này
 * tạo bản ghi `media` trỏ tới URL bên ngoài; khi có R2 thì chỉ cần đổi nguồn,
 * `mediaIds` của BĐS/bài viết không phải migrate.
 */
export async function actionAddMediaByUrl(
  url: string,
  ownerType: 'property' | 'article' | null = null,
): Promise<ActionResult & { url?: string }> {
  try {
    await requirePermission('media:write');

    const trimmed = url.trim();
    let parsed: URL;
    try {
      parsed = new URL(trimmed);
    } catch {
      return { ok: false, message: 'URL không hợp lệ' };
    }
    // Chỉ nhận http(s). `javascript:` hay `data:` lọt vào src ảnh là lỗ XSS.
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return { ok: false, message: 'Chỉ chấp nhận đường dẫn http hoặc https' };
    }

    const { createMedia } = await import('@/lib/db/repositories/media-repo');
    const { mediaCol } = await import('@/lib/db/collections');

    // `key` là unique — cùng một URL thì dùng lại bản ghi cũ thay vì tạo trùng.
    const col = await mediaCol();
    const existing = await col.findOne({ key: trimmed, deletedAt: null });
    if (existing) {
      return { ok: true, id: existing._id.toHexString(), url: existing.url };
    }

    const doc = await createMedia({
      key: trimmed,
      url: trimmed,
      mimeType: 'image/jpeg',
      size: 0,
      width: null,
      height: null,
      alt: {},
      blurDataUrl: null,
      ownerType,
      ownerId: null,
    });

    return { ok: true, id: doc._id.toHexString(), url: doc.url };
  } catch (err) {
    return fail(err);
  }
}

/* ── Chuyên mục bài viết ──────────────────────────────── */

export async function actionSaveArticleCategory(
  id: string | null,
  data: { name: string; nameEn?: string; order: number },
): Promise<ActionResult> {
  try {
    const user = await requirePermission('content:write');
    const {
      createArticleCategory,
      updateArticleCategory,
    } = await import('@/lib/db/repositories/article-repo');

    const payload = {
      slug: slugify(data.nameEn || data.name),
      name: { vi: data.name, en: data.nameEn || data.name },
      order: data.order,
      articleCount: 0,
    };

    if (id) {
      await updateArticleCategory(id, payload, user.sub);
    } else {
      await createArticleCategory(payload, user.sub);
    }
    revalidatePath('/admin/news');
    return { ok: true, message: 'Đã lưu chuyên mục' };
  } catch (err) {
    return fail(err);
  }
}

export async function actionDeleteArticleCategory(id: string): Promise<ActionResult> {
  try {
    const user = await requirePermission('content:write');
    const { deleteArticleCategory } = await import('@/lib/db/repositories/article-repo');
    const res = await deleteArticleCategory(id, user.sub);
    if (!res.ok) {
      // Chặn thay vì xoá: bài viết trỏ tới chuyên mục đã xoá sẽ biến mất khỏi
      // mọi bộ lọc mà không báo gì.
      return { ok: false, message: `Còn ${res.count} bài viết thuộc chuyên mục này. Chuyển chúng sang chuyên mục khác trước.` };
    }
    revalidatePath('/admin/news');
    return { ok: true, message: 'Đã xoá chuyên mục' };
  } catch (err) {
    return fail(err);
  }
}

/* ── Dịch tự động ─────────────────────────────────────── */

export type TranslateResult =
  | { ok: true; translations: Record<string, { title: string; excerpt: string; content: string }>; failed: Array<{ locale: string; message: string }> }
  | { ok: false; message: string };

/**
 * Dịch nội dung đang soạn sang các ngôn ngữ còn lại.
 * Không tự lưu — trả kết quả về form để biên tập viên xem rồi mới bấm Lưu.
 */
export async function actionTranslateArticle(
  source: { title: string; excerpt: string; content: string },
  from: string,
): Promise<TranslateResult> {
  try {
    await requirePermission('content:write');
    const { translateArticle } = await import('@/server/services/translation-service');
    const { isLocale } = await import('@/config/locales');

    if (!isLocale(from)) return { ok: false, message: 'Ngôn ngữ nguồn không hợp lệ' };

    const { translations, failed } = await translateArticle(source, from);
    return { ok: true, translations: translations as never, failed: failed as never };
  } catch (err) {
    const r = fail(err);
    return { ok: false, message: r.ok ? 'Lỗi không xác định' : r.message };
  }
}

/**
 * Dựng bài viết từ nội dung thô, kèm tuỳ chọn dịch luôn sang các ngôn ngữ khác.
 *
 * Không tự lưu — trả về form để biên tập viên xem, sửa rồi mới bấm Lưu. AI
 * dựng bản nháp, người quyết định xuất bản.
 */
export type ComposeResult =
  | {
      ok: true;
      article: { title: string; excerpt: string; content: string; tags: string[] };
      translations: Record<string, { title: string; excerpt: string; content: string }>;
      failedLocales: Array<{ locale: string; message: string }>;
      stats: { words: number; headings: number; callouts: number };
    }
  | { ok: false; message: string };

export async function actionComposeArticle(
  raw: string,
  locale: string,
  alsoTranslate = true,
): Promise<ComposeResult> {
  try {
    await requirePermission('content:write');
    const { composeAndTranslate } = await import('@/server/services/article-ai-service');
    const { isLocale } = await import('@/config/locales');

    if (!isLocale(locale)) return { ok: false, message: 'Ngôn ngữ không hợp lệ' };

    const bundle = await composeAndTranslate(raw, locale, alsoTranslate);

    return {
      ok: true,
      article: bundle.primary,
      translations: bundle.translations as never,
      failedLocales: bundle.failedLocales as never,
      stats: bundle.stats,
    };
  } catch (err) {
    const r = fail(err);
    return { ok: false, message: r.ok ? 'Lỗi không xác định' : r.message };
  }
}
