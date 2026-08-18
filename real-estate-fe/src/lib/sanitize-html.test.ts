import { describe, expect, it } from 'vitest';

import { sanitizeArticleHtml } from './sanitize-html';

describe('làm sạch HTML bài viết', () => {
  it('giữ ảnh trỏ vào đường dẫn nội bộ /api/media', () => {
    const html = sanitizeArticleHtml('<p><img src="/api/media/article/2026/08/abc-anh.webp" alt="Ảnh"></p>');
    expect(html).toContain('src="/api/media/article/2026/08/abc-anh.webp"');
  });

  it('giữ ảnh trỏ vào CDN r2.dev', () => {
    const html = sanitizeArticleHtml('<img src="https://pub-abc.r2.dev/article/x.webp">');
    expect(html).toContain('https://pub-abc.r2.dev/article/x.webp');
  });

  it('chặn javascript: và data:text/html', () => {
    expect(sanitizeArticleHtml('<a href="javascript:alert(1)">x</a>')).not.toContain('javascript:');
    expect(sanitizeArticleHtml('<a href="data:text/html;base64,PHNjcmlwdD4=">x</a>')).not.toContain('data:text/html');
  });

  it('chặn URL giao thức tương đối //evil.com — trông như đường dẫn nội bộ', () => {
    expect(sanitizeArticleHtml('<img src="//evil.com/x.png">')).not.toContain('evil.com');
  });

  it('bỏ script và thẻ ngoài danh sách cho phép', () => {
    const html = sanitizeArticleHtml('<p>Giữ</p><script>alert(1)</script><iframe src="https://x.com"></iframe>');
    expect(html).toBe('<p>Giữ</p>');
  });

  it('giữ sắc thái hộp ghi nhớ', () => {
    // `data-variant` quyết định màu và nhãn của hộp; mất nó là hộp hoá xám.
    const html = sanitizeArticleHtml('<div class="callout" data-variant="tip"><p>x</p></div>');
    expect(html).toContain('data-variant="tip"');
    expect(html).toContain('class="callout"');
  });
});
