'use server';

import { ObjectId } from 'mongodb';
import { revalidatePath } from 'next/cache';
import { z, ZodError } from 'zod';

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
import { revalidatePublicArticles, revalidatePublicProperties } from '@/lib/revalidate-public';
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
  /*
   * ZodError phải bóc ra trước.
   *
   * `ZodError.message` là toàn bộ danh sách issue dạng JSON. Không bóc thì
   * người dùng nhận nguyên khối `[{"code":"custom","path":["social",1,...` —
   * đã thấy đúng như vậy khi lưu cài đặt với link sai định dạng.
   */
  if (err instanceof ZodError) {
    const fields: Record<string, string[]> = {};
    for (const issue of err.issues) {
      const key = issue.path.join('.') || 'form';
      (fields[key] ??= []).push(issue.message);
    }
    return { ok: false, message: err.issues[0]?.message ?? 'Dữ liệu không hợp lệ', fields };
  }

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
    revalidatePublicProperties();
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
    revalidatePublicProperties();
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
    revalidatePublicProperties();
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
      revalidatePublicProperties();
      revalidatePath(`/admin/properties/${id}`);
      return { ok: true, message: 'Đã cập nhật', id };
    }

    const input = zPropertyCreate.parse(payload);
    const created = await createPropertyFromInput(input, user.sub);
    revalidatePath('/admin/properties');
    revalidatePublicProperties();
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
      revalidatePublicArticles();
      return { ok: true, message: 'Đã cập nhật bài viết', id };
    }

    const created = await create(doc, user.sub);
    revalidatePath('/admin/news');
    revalidatePublicArticles();
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
    revalidatePublicArticles();
    return { ok: true, message: 'Đã xoá bài viết' };
  } catch (err) {
    return fail(err);
  }
}

/* ── Yêu cầu tư vấn ───────────────────────────────────── */

/**
 * Đổi trạng thái một yêu cầu tư vấn.
 *
 * PHẢI kiểm `status` bằng Zod dù TypeScript đã khai kiểu: Server Action là một
 * endpoint HTTP thật, ai cũng gọi thẳng được với giá trị tuỳ ý. Đã đo: gọi với
 * `status: 'khong-hop-le'` thì chuỗi đó ghi thẳng vào DB, và trang admin tra
 * `INQUIRY_STATUS[status]` ra `undefined` rồi vỡ khi render.
 */
export async function actionSetInquiryStatus(id: string, status: InquiryStatus): Promise<ActionResult> {
  try {
    const user = await requirePermission('inquiry:write');

    const { zInquiryStatus } = await import('@/lib/validations/inquiry');
    const parsed = zInquiryStatus.safeParse(status);
    if (!parsed.success) return { ok: false, message: 'Trạng thái không hợp lệ' };

    await changeInquiryStatus(id, parsed.data, user.sub);
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

/** Poll số yêu cầu tư vấn mới cho thông báo thời gian thực trên admin panel. */
export async function actionGetPendingInquiriesPoll(): Promise<{
  ok: boolean;
  pendingCount: number;
  latestCode?: string;
  latestName?: string;
}> {
  try {
    await requirePermission('inquiry:read');
    const { getInquiryStats, listInquiries } = await import('@/lib/db/repositories/inquiry-repo');
    const stats = await getInquiryStats();
    const recent = await listInquiries({ page: 1, limit: 1, sort: 'newest', status: 'new' });
    const latest = recent.items[0];
    return {
      ok: true,
      pendingCount: stats.new,
      latestCode: latest?.code,
      latestName: latest?.name,
    };
  } catch {
    return { ok: false, pendingCount: 0 };
  }
}

/* ── Danh mục & tiện ích ──────────────────────────────── */

/*
 * Kiểm dữ liệu form ở RUNTIME, không chỉ dựa vào kiểu TypeScript.
 *
 * Server Action là một endpoint HTTP thật: `required` trên ô input chỉ chặn
 * được người dùng bình thường. Đã đo — gọi thẳng với tên rỗng thì tạo ra nhóm
 * không tên, slug rỗng; gọi với `group: 'khong-hop-le'` thì tiện ích lọt vào DB
 * rồi biến mất khỏi mọi nhóm trong giao diện quản lý.
 */
const zCategoryForm = z.object({
  name: z.string().trim().min(1, 'Chưa nhập tên nhóm').max(120),
  nameEn: z.string().trim().max(120).optional().default(''),
  showOnHome: z.boolean(),
  order: z.coerce.number().int().min(0).max(999),
});

const zAmenityForm = z.object({
  name: z.string().trim().min(1, 'Chưa nhập tên tiện ích').max(120),
  nameEn: z.string().trim().max(120).optional().default(''),
  icon: z.string().trim().max(60).default('check'),
  group: z.enum(['indoor', 'outdoor', 'security', 'service']),
  order: z.coerce.number().int().min(0).max(999),
});

export async function actionSaveCategory(
  id: string | null,
  data: { name: string; nameEn?: string; showOnHome: boolean; order: number },
): Promise<ActionResult> {
  try {
    const user = await requirePermission('content:write');
    const clean = zCategoryForm.parse(data);

    const payload = {
      slug: slugify(clean.nameEn || clean.name),
      name: { vi: clean.name, en: clean.nameEn || clean.name },
      description: null,
      showOnHome: clean.showOnHome,
      order: clean.order,
      coverId: null,
      propertyCount: 0,
    };

    if (id) {
      await updateCategory(id, payload, user.sub);
      revalidatePath('/admin/properties');
      revalidatePublicProperties();
      return { ok: true, message: 'Đã cập nhật nhóm' };
    }
    const created = await createCategory(payload, user.sub);
    revalidatePath('/admin/properties');
    revalidatePublicProperties();
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
    revalidatePublicProperties();
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
    const clean = zAmenityForm.parse(data);

    const payload = {
      slug: slugify(clean.nameEn || clean.name),
      name: { vi: clean.name, en: clean.nameEn || clean.name },
      icon: clean.icon,
      group: clean.group,
      order: clean.order,
    };
    if (id) {
      await updateAmenity(id, payload, user.sub);
    } else {
      await createAmenity(payload, user.sub);
    }
    revalidatePath('/admin/properties');
    revalidatePublicProperties();
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
    revalidatePublicProperties();
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

    // Trả về id để nơi gọi thêm thẳng chuyên mục mới vào ô chọn.
    // Trang soạn bài tạo chuyên mục ngay tại chỗ chứ không điều hướng đi — rời
    // trang là mất trắng nội dung AI vừa dựng.
    let savedId = id;
    if (id) {
      await updateArticleCategory(id, payload, user.sub);
    } else {
      const created = await createArticleCategory(payload, user.sub);
      savedId = created._id.toHexString();
    }

    revalidatePath('/admin/news');

    revalidatePublicArticles();
    return { ok: true, message: 'Đã lưu chuyên mục', id: savedId ?? undefined };
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
    revalidatePublicArticles();
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

/* ── Cài đặt website ──────────────────────────────────── */

/**
 * Lưu cài đặt website.
 *
 * `revalidatePath('/', 'layout')` là bắt buộc: cài đặt hiện ở header và footer
 * của MỌI trang public. Chỉ revalidate trang cài đặt thì đổi số hotline xong
 * ngoài web vẫn hiện số cũ cho tới khi cache tự hết hạn.
 */
export async function actionSaveSettings(input: unknown): Promise<ActionResult> {
  try {
    const user = await requirePermission('user:manage');
    const { zSiteSettings } = await import('@/lib/validations/settings');
    const { saveSettings } = await import('@/lib/db/repositories/settings-repo');

    const data = zSiteSettings.parse(input);
    await saveSettings(data, user.sub);

    revalidatePath('/[locale]', 'layout');
    revalidatePath('/admin/settings');

    return { ok: true, message: 'Đã lưu cài đặt' };
  } catch (err) {
    return fail(err);
  }
}

/* ── AI cho tin bất động sản ──────────────────────────── */

interface PropertyDraftPayload {
  title: string;
  summary: string;
  description: string[];
  deal: 'sale' | 'rent';
  priceUsd: number | null;
  priceNote: string | null;
  pricePeriod: 'total' | 'month';
  negotiable: boolean;
  specs: Record<string, number | string | null>;
  location: { address: string | null; ward: string | null; district: string | null };
  /** Id tiện ích để tick sẵn, gồm cả tiện ích vừa được tạo. */
  amenityIds: string[];
  /** Tiện ích vừa tạo, để form thêm vào danh sách hiển thị. */
  createdAmenities: Array<{ id: string; name: string; group: string }>;
  translations: Record<string, { title: string; summary: string; description: string[] }>;
  failedLocales: string[];
}

type PropertyDraftResult = { ok: true; draft: PropertyDraftPayload } | { ok: false; message: string };

/**
 * Đọc ghi chú thô → điền TOÀN BỘ form, kèm ba bản dịch.
 *
 * Gộp ba việc vào một hành động (đọc, tạo tiện ích còn thiếu, dịch) vì với
 * người dùng đó là một ý định duy nhất: "điền hộ tôi cái tin này". Tách thành
 * ba nút thì họ phải nhớ thứ tự bấm, và quên bước nào là tin lên web thiếu.
 *
 * Tiện ích chưa có trong CMS được TẠO LUÔN rồi tick. Trả về danh sách đã tạo
 * để form hiện chúng ra ngay mà không phải tải lại trang.
 */
export async function actionDraftProperty(
  raw: string,
  locale: string,
  alsoTranslate = true,
): Promise<PropertyDraftResult> {
  try {
    const user = await requirePermission('content:write');

    const { draftPropertyFromNotes, translatePropertyText } = await import(
      '@/server/services/property-ai-service'
    );
    const { isLocale } = await import('@/config/locales');
    const { listAmenities } = await import('@/lib/db/repositories/catalog-repo');

    if (!isLocale(locale)) return { ok: false, message: 'Ngôn ngữ không hợp lệ' };

    const amenities = await listAmenities();
    const nameOf = (a: (typeof amenities)[number]) => a.name.vi ?? a.name.en ?? a.slug;

    const draft = await draftPropertyFromNotes(raw, locale, amenities.map(nameOf));

    // Tick những tiện ích đã có.
    const idByName = new Map(amenities.map((a) => [nameOf(a).trim().toLowerCase(), a._id.toHexString()]));
    const amenityIds = draft.amenityNames
      .map((n) => idByName.get(n.trim().toLowerCase()))
      .filter((id): id is string => Boolean(id));

    /*
     * Tạo tiện ích ghi chú có nhắc mà CMS chưa có.
     *
     * Giới hạn 8 cái mỗi lần: model thỉnh thoảng tách một câu thành cả chục
     * "tiện ích" vụn, và tạo hết thì bảng tiện ích ngập rác chỉ sau vài tin.
     */
    const createdAmenities: Array<{ id: string; name: string; group: string }> = [];

    for (const name of draft.newAmenityNames.slice(0, 8)) {
      const created = await createAmenity(
        { slug: slugify(name), name: { vi: name }, icon: 'check', group: 'service', order: 99 },
        user.sub,
      );
      const id = created._id.toHexString();
      createdAmenities.push({ id, name, group: 'service' });
      amenityIds.push(id);
    }

    const text = { title: draft.title, summary: draft.summary, description: draft.description };

    const { translations, failed } = alsoTranslate
      ? await translatePropertyText(text, locale)
      : { translations: {}, failed: [] };

    if (createdAmenities.length > 0) {
      revalidatePath('/admin/properties');
    }

    return {
      ok: true,
      draft: {
        ...text,
        deal: draft.deal,
        priceUsd: draft.priceUsd,
        // Ghi lại giá gốc để biên tập đối chiếu — quy đổi sai tỷ giá là lỗi
        // rất khó phát hiện nếu chỉ nhìn con số USD.
        priceNote: draft.price
          ? `${draft.price.amount.toLocaleString('vi-VN')} ${draft.price.currency}`
          : null,
        pricePeriod: draft.price?.period ?? 'total',
        negotiable: draft.price?.negotiable ?? false,
        specs: draft.specs,
        location: draft.location,
        amenityIds,
        createdAmenities,
        translations: translations as never,
        failedLocales: failed,
      },
    };
  } catch (err) {
    const r = fail(err);
    return { ok: false, message: r.ok ? 'Lỗi không xác định' : r.message };
  }
}

type PropertyTranslateResult =
  | {
      ok: true;
      translations: Record<string, { title: string; summary: string; description: string[] }>;
      failed: string[];
    }
  | { ok: false; message: string };

/** Dịch tin sang ba ngôn ngữ còn lại. Dùng khi biên tập tự viết bản gốc. */
export async function actionTranslateProperty(
  source: { title: string; summary: string; description: string[] },
  locale: string,
): Promise<PropertyTranslateResult> {
  try {
    await requirePermission('content:write');
    const { translatePropertyText } = await import('@/server/services/property-ai-service');
    const { isLocale } = await import('@/config/locales');

    if (!isLocale(locale)) return { ok: false, message: 'Ngôn ngữ không hợp lệ' };

    const { translations, failed } = await translatePropertyText(source, locale);
    return { ok: true, translations: translations as never, failed };
  } catch (err) {
    const r = fail(err);
    return { ok: false, message: r.ok ? 'Lỗi không xác định' : r.message };
  }
}
