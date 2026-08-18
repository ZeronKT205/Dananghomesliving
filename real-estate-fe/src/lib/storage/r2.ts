import 'server-only';

import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';

import { env } from '@/config/env';
import { serverEnv } from '@/config/env.server';
import { ApiError } from '@/lib/api/http';

/**
 * Lưu trữ tệp trên Cloudflare R2 (giao thức tương thích S3).
 *
 * Client dựng một lần rồi giữ trên `globalThis`: mỗi lần `new S3Client` là một
 * lần dựng lại connection pool, mà trên serverless thì module bị nạp lại rất
 * thường xuyên.
 */

const CLIENT_KEY = Symbol.for('dhl.r2.client');
type GlobalWithR2 = typeof globalThis & { [CLIENT_KEY]?: S3Client };

function client(): S3Client {
  const g = globalThis as GlobalWithR2;
  g[CLIENT_KEY] ??= new S3Client({
    // R2 không có khái niệm region; 'auto' là giá trị Cloudflare yêu cầu.
    region: 'auto',
    endpoint: serverEnv.R2_ENDPOINT,
    credentials: {
      accessKeyId: serverEnv.R2_ACCESS_KEY_ID,
      secretAccessKey: serverEnv.R2_SECRET_ACCESS_KEY,
    },
  });
  return g[CLIENT_KEY];
}

/* ── Định danh tệp ─────────────────────────────────────── */

const EXT_BY_MIME: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/avif': 'avif',
  'image/gif': 'gif',
};

export const ALLOWED_IMAGE_MIME = Object.keys(EXT_BY_MIME);

/** 10MB. Trình duyệt đã thu nhỏ ảnh trước khi gửi, đây là chốt chặn phía server. */
export const MAX_IMAGE_BYTES = 10 * 1024 * 1024;

/**
 * Dựng key cho tệp: `<owner>/<năm>/<tháng>/<ngẫu nhiên>-<tên gốc>.<đuôi>`.
 *
 * Tên gốc giữ lại (đã lược dấu và ký tự lạ) để sau này mở R2 dashboard còn
 * nhận ra ảnh nào của bài nào; phần ngẫu nhiên đứng trước đảm bảo hai người
 * upload cùng tên tệp trong cùng một giây vẫn không đè lên nhau.
 */
export function buildMediaKey(originalName: string, mimeType: string, ownerType = 'article'): string {
  const now = new Date();
  const yyyy = now.getUTCFullYear();
  const mm = String(now.getUTCMonth() + 1).padStart(2, '0');

  const base = originalName
    .replace(/\.[^.]+$/, '')
    .normalize('NFD')
    // Dải dấu thanh tổ hợp. Viết bằng mã \u thay vì dán ký tự thật: dấu tổ
    // hợp là ký tự vô hình trong mã nguồn, rất dễ bị công cụ khác nuốt mất.
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48);

  const rand = crypto.randomUUID().slice(0, 8);
  const ext = EXT_BY_MIME[mimeType] ?? 'bin';

  return `${ownerType}/${yyyy}/${mm}/${rand}-${base || 'anh'}.${ext}`;
}

/**
 * URL để trang web hiển thị ảnh.
 *
 * Có `NEXT_PUBLIC_R2_PUBLIC_URL` (host r2.dev hoặc custom domain) thì trỏ thẳng
 * vào CDN của Cloudflare. Chưa bật Public Access trên bucket thì rơi về route
 * `/api/media/...` của chính ứng dụng — chậm hơn vì đi qua server, nhưng CMS
 * dùng được NGAY mà không phải vào dashboard Cloudflare cấu hình gì.
 *
 * Cả hai dạng URL đều tồn tại lâu dài: ảnh cũ lưu đường dẫn `/api/media/...`
 * vẫn hiện bình thường sau khi bật CDN, không cần migrate dữ liệu.
 */
export function mediaPublicUrl(key: string): string {
  const host = env.NEXT_PUBLIC_R2_PUBLIC_URL?.replace(/\/+$/, '');

  /*
   * Bỏ qua host còn là mẫu điền sẵn.
   *
   * `.env.example` ghi `https://pub-xxxx.r2.dev` làm ví dụ, và chuyện chép cả
   * dòng đó sang `.env.local` rồi quên thay đã xảy ra thật trong dự án này:
   * ảnh tải lên thành công, `<Image>` không báo lỗi gì, nhưng mọi ảnh đều
   * hỏng. Zod `.url()` không bắt được vì đó vẫn là một URL hợp lệ.
   */
  const isPlaceholder = !host || /pub-x{2,}|<|example\.com/i.test(host);

  return isPlaceholder ? `/api/media/${key}` : `${host}/${key}`;
}

/* ── Thao tác ──────────────────────────────────────────── */

export async function putObject(key: string, body: Uint8Array, contentType: string): Promise<void> {
  try {
    await client().send(
      new PutObjectCommand({
        Bucket: serverEnv.R2_BUCKET,
        Key: key,
        Body: body,
        ContentType: contentType,
        // Ảnh là bất biến: key có phần ngẫu nhiên nên sửa ảnh là key mới.
        CacheControl: 'public, max-age=31536000, immutable',
      }),
    );
  } catch (err) {
    // Không đẩy message của SDK ra ngoài — có thể chứa endpoint và khoá.
    console.error('[r2] put that bai:', key, err);
    throw new ApiError('INTERNAL', 'Không tải được ảnh lên kho lưu trữ. Thử lại sau ít phút.');
  }
}

export interface StoredObject {
  body: ReadableStream<Uint8Array>;
  contentType: string;
  contentLength?: number;
  etag?: string;
}

/** Đọc tệp về để route `/api/media` phát lại cho trình duyệt. */
export async function getObject(key: string): Promise<StoredObject | null> {
  try {
    const res = await client().send(new GetObjectCommand({ Bucket: serverEnv.R2_BUCKET, Key: key }));
    if (!res.Body) return null;

    return {
      body: res.Body.transformToWebStream(),
      contentType: res.ContentType ?? 'application/octet-stream',
      contentLength: res.ContentLength,
      etag: res.ETag,
    };
  } catch (err) {
    const name = (err as { name?: string }).name;
    // Không có tệp là chuyện bình thường (ảnh đã xoá) — trả null, không phải lỗi.
    if (name === 'NoSuchKey' || name === 'NotFound') return null;
    console.error('[r2] get that bai:', key, err);
    return null;
  }
}

export async function deleteObject(key: string): Promise<void> {
  try {
    await client().send(new DeleteObjectCommand({ Bucket: serverEnv.R2_BUCKET, Key: key }));
  } catch (err) {
    // Xoá hụt trên R2 không được làm hỏng thao tác của người dùng: bản ghi
    // media đã gỡ rồi, tệp thừa để dọn rác định kỳ xử lý.
    console.error('[r2] delete that bai:', key, err);
  }
}
