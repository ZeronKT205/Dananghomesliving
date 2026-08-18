import 'server-only';

import DOMPurify from 'isomorphic-dompurify';

/**
 * Làm sạch HTML do trình soạn thảo sinh ra, TRƯỚC KHI lưu vào DB.
 *
 * TipTap chỉ sinh được các node khai trong schema, nên đầu ra vốn đã hẹp.
 * Nhưng nội dung tới server qua một Server Action — một endpoint HTTP gọi
 * thẳng được — nên không được tin vào việc "client chỉ gửi thứ hợp lệ".
 * Trang public render bằng `dangerouslySetInnerHTML`; đây là lớp chặn duy nhất
 * giữa một payload dựng tay và XSS trên site khách hàng.
 */
const ALLOWED_TAGS = [
  'p', 'br', 'strong', 'em', 'u', 's', 'code', 'pre',
  'h2', 'h3', 'ul', 'ol', 'li', 'blockquote', 'hr',
  'a', 'img', 'div', 'span',
];

const ALLOWED_ATTR = ['href', 'target', 'rel', 'src', 'alt', 'title', 'class', 'style', 'data-variant', 'data-label'];

export function sanitizeArticleHtml(dirty: string): string {
  if (!dirty?.trim()) return '';

  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    // Chỉ cho http/https/mailto/tel. Chặn `javascript:` và `data:` —
    // `data:text/html;base64,...` trong href chạy script được.
    ALLOWED_URI_REGEXP: /^(?:https?|mailto|tel):/i,
    // Không cho phép <svg>/<math>: chúng mở ra nhiều vector XSS lạ.
    USE_PROFILES: { html: true },
  });
}

/** Bóc thẻ, lấy chữ thuần — dùng để đếm từ và sinh tóm tắt. */
export function htmlToPlainText(html: string): string {
  if (!html?.trim()) return '';
  const stripped = DOMPurify.sanitize(html, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });
  return stripped.replace(/\s+/g, ' ').trim();
}

/** Số phút đọc, tính từ HTML. 200 từ/phút. */
export function readingMinutesFromHtml(html: string): number {
  const text = htmlToPlainText(html);
  const words = text ? text.split(' ').length : 0;
  return Math.max(1, Math.round(words / 200));
}
