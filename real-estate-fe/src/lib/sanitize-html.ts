import 'server-only';

/**
 * Làm sạch HTML do trình soạn thảo sinh ra, TRƯỚC KHI lưu vào DB.
 *
 * Thuần TypeScript/Regex nhẹ nhàng, KHÔNG dùng `isomorphic-dompurify` hay `jsdom`
 * để tránh lỗi ESM crash (`ERR_REQUIRE_ESM`) trên môi trường Serverless của Vercel.
 */
const ALLOWED_TAGS = new Set([
  'p', 'br', 'strong', 'em', 'u', 's', 'code', 'pre',
  'h2', 'h3', 'ul', 'ol', 'li', 'blockquote', 'hr',
  'a', 'img', 'div', 'span',
]);

const ALLOWED_ATTRS = new Set([
  'href', 'target', 'rel', 'src', 'alt', 'title', 'class', 'style', 'data-variant'
]);

const SAFE_URI_REGEXP = /^(?:(?:https?|mailto|tel):|\/(?!\/))/i;

export function sanitizeArticleHtml(dirty: string): string {
  if (!dirty?.trim()) return '';

  // 1. Loại bỏ hoàn toàn các thẻ nguy hiểm kèm nội dung bên trong của chúng
  let clean = dirty
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
    .replace(/<embed\b[^>]*>/gi, '')
    .replace(/<!--[\s\S]*?-->/g, '');

  // 2. Parse và lọc các thẻ cùng thuộc tính
  clean = clean.replace(/<\/?([a-zA-Z0-9-]+)([^>]*)>/g, (match, tagName: string, attrString: string) => {
    const tag = tagName.toLowerCase();
    if (!ALLOWED_TAGS.has(tag)) {
      return '';
    }

    // Thẻ đóng
    if (match.startsWith('</')) {
      return `</${tag}>`;
    }

    // Thẻ mở hoặc tự đóng — lọc thuộc tính
    const validAttrs: string[] = [];
    const attrRegex = /([a-zA-Z0-9_:-]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g;
    let attrMatch;

    while ((attrMatch = attrRegex.exec(attrString)) !== null) {
      const rawName = attrMatch[1];
      if (!rawName) continue;
      const attrName = rawName.toLowerCase();
      const attrValue = attrMatch[2] ?? attrMatch[3] ?? attrMatch[4] ?? '';

      // Chặn các thuộc tính on* (onclick, onerror, onload...)
      if (attrName.startsWith('on')) continue;

      // Chỉ cho phép thuộc tính trong danh sách hoặc data-*
      if (!ALLOWED_ATTRS.has(attrName) && !attrName.startsWith('data-')) continue;

      // Kiểm tra URL an toàn cho href và src
      if (attrName === 'href' || attrName === 'src') {
        const trimmed = attrValue.trim();
        if (!SAFE_URI_REGEXP.test(trimmed)) {
          continue; // Bỏ qua nếu là javascript:, data: hoặc //evil.com
        }
      }

      validAttrs.push(`${attrName}="${attrValue.replace(/"/g, '&quot;')}"`);
    }

    const attrsSerialized = validAttrs.length > 0 ? ` ${validAttrs.join(' ')}` : '';
    return `<${tag}${attrsSerialized}>`;
  });

  return clean;
}

/** Bóc thẻ, lấy chữ thuần — dùng để đếm từ và sinh tóm tắt. */
export function htmlToPlainText(html: string): string {
  if (!html?.trim()) return '';
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

/** Số phút đọc, tính từ HTML. 200 từ/phút. */
export function readingMinutesFromHtml(html: string): number {
  const text = htmlToPlainText(html);
  const words = text ? text.split(' ').length : 0;
  return Math.max(1, Math.round(words / 200));
}
