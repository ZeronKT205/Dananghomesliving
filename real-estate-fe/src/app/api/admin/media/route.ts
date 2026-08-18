import { ApiError, ok, withApi } from '@/lib/api/http';
import { requirePermission } from '@/lib/auth/session';
import { createMedia } from '@/lib/db/repositories/media-repo';
import {
  ALLOWED_IMAGE_MIME,
  MAX_IMAGE_BYTES,
  buildMediaKey,
  mediaPublicUrl,
  putObject,
} from '@/lib/storage/r2';

/**
 * Nhận ảnh từ CMS, đẩy lên Cloudflare R2, ghi bản ghi `media`.
 *
 * Là Route Handler chứ không phải Server Action: Server Action giới hạn thân
 * yêu cầu 1MB, ảnh nào cũng vượt. Route Handler đọc thẳng multipart nên không
 * dính trần đó.
 *
 * Ảnh đi QUA server thay vì trình duyệt PUT thẳng lên R2 bằng URL ký sẵn. Đổi
 * lại chút băng thông, nhưng khoá R2 không bao giờ rời khỏi server và bucket
 * không cần cấu hình CORS — bớt một thứ phải chỉnh trên dashboard Cloudflare
 * mới dùng được. Trình duyệt đã thu nhỏ ảnh trước khi gửi nên tệp thực tế chỉ
 * vài trăm KB, nằm xa dưới trần 4,5MB của Vercel.
 */

// Ảnh lớn cần hơn 10 giây mặc định trên Vercel.
export const maxDuration = 60;

export const POST = withApi(async (req: Request) => {
  const user = await requirePermission('media:write');

  const form = await req.formData().catch(() => null);
  if (!form) throw new ApiError('VALIDATION', 'Yêu cầu không hợp lệ.');

  const file = form.get('file');
  if (!(file instanceof File)) {
    throw new ApiError('VALIDATION', 'Chưa chọn tệp ảnh.');
  }

  if (!ALLOWED_IMAGE_MIME.includes(file.type)) {
    throw new ApiError('VALIDATION', 'Chỉ nhận ảnh JPG, PNG, WebP, AVIF hoặc GIF.');
  }

  if (file.size > MAX_IMAGE_BYTES) {
    throw new ApiError(
      'VALIDATION',
      `Ảnh nặng ${(file.size / 1024 / 1024).toFixed(1)}MB, vượt mức ${MAX_IMAGE_BYTES / 1024 / 1024}MB.`,
    );
  }
  if (file.size === 0) {
    throw new ApiError('VALIDATION', 'Tệp rỗng.');
  }

  const ownerTypeRaw = String(form.get('ownerType') ?? 'article');
  const ownerType = (['property', 'article', 'category', 'site'] as const).find((t) => t === ownerTypeRaw) ?? 'article';

  // Kích thước thật do trình duyệt đo và gửi kèm: đọc kích thước ảnh ở server
  // cần thư viện giải mã ảnh, thêm một phụ thuộc nặng chỉ để lấy hai con số.
  const width = Number(form.get('width')) || null;
  const height = Number(form.get('height')) || null;
  const alt = String(form.get('alt') ?? '').trim();

  const key = buildMediaKey(file.name || 'anh', file.type, ownerType);
  await putObject(key, new Uint8Array(await file.arrayBuffer()), file.type);

  const doc = await createMedia(
    {
      key,
      url: mediaPublicUrl(key),
      mimeType: file.type,
      size: file.size,
      width,
      height,
      alt: alt ? { vi: alt } : {},
      blurDataUrl: null,
      ownerType,
      // Gắn vào bài nào thì để lúc lưu bài quyết định — lúc upload bài có thể
      // còn chưa được tạo.
      ownerId: null,
    },
    user.sub,
  );

  return ok({ id: doc._id.toHexString(), url: doc.url, key: doc.key, width, height });
});
