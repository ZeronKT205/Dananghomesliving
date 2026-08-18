import { getObject } from '@/lib/storage/r2';

/**
 * Phát lại ảnh trong bucket R2 cho trình duyệt.
 *
 * Chỉ dùng khi bucket CHƯA bật Public Access: `mediaPublicUrl()` sinh đường dẫn
 * này làm phương án dự phòng để CMS upload xong là thấy ảnh ngay, không phải
 * vào dashboard Cloudflare bật gì trước. Đặt `NEXT_PUBLIC_R2_PUBLIC_URL` thì
 * ảnh mới trỏ thẳng CDN, còn ảnh cũ vẫn đi qua đây nên không cần migrate.
 *
 * Chỉ đọc, không cần đăng nhập: ảnh bài viết vốn là nội dung công khai.
 */

// Ảnh bất biến theo key, cache thoải mái ở cả trình duyệt lẫn CDN.
const CACHE = 'public, max-age=31536000, immutable';

export async function GET(_req: Request, { params }: { params: Promise<{ key: string[] }> }) {
  const { key: segments } = await params;
  const key = segments.map(decodeURIComponent).join('/');

  // Chặn đường dẫn leo thư mục trước khi chạm tới R2.
  if (!key || key.includes('..')) {
    return new Response('Not found', { status: 404 });
  }

  const object = await getObject(key);
  if (!object) {
    return new Response('Not found', { status: 404 });
  }

  return new Response(object.body, {
    headers: {
      'Content-Type': object.contentType,
      'Cache-Control': CACHE,
      ...(object.contentLength ? { 'Content-Length': String(object.contentLength) } : {}),
      ...(object.etag ? { ETag: object.etag } : {}),
    },
  });
}
