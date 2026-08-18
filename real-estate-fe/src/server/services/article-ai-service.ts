import 'server-only';

import { ApiError } from '@/lib/api/http';
import type { Locale } from '@/config/locales';
import { sanitizeArticleHtml } from '@/lib/sanitize-html';

import { callGemini } from './gemini-client';

/**
 * Dựng bài viết hoàn chỉnh từ một cục nội dung thô.
 *
 * Biên tập viên dán ghi chú, bản nháp, hay nội dung copy từ nơi khác — AI cắt
 * thành tiêu đề, mô tả ngắn, nội dung đã định dạng và hashtag.
 *
 * Ràng buộc quan trọng nhất: HTML sinh ra phải nằm gọn trong bộ thẻ mà trình
 * soạn thảo hỗ trợ. TipTap chỉ dựng được node có trong schema của nó — thẻ lạ
 * (table, h1, h4, figure…) bị bỏ IM LẶNG khi nạp vào editor, biên tập viên mất
 * nội dung mà không có cảnh báo nào. Vì vậy prompt liệt kê thẳng danh sách thẻ
 * cho phép thay vì chỉ nói "trả về HTML".
 */

const LOCALE_NAME: Record<Locale, string> = {
  vi: 'Vietnamese',
  en: 'English',
  zh: 'Simplified Chinese',
  ko: 'Korean',
};

export interface ComposedArticle {
  title: string;
  excerpt: string;
  content: string;
  tags: string[];
}

const RESPONSE_SCHEMA = {
  type: 'OBJECT',
  properties: {
    title: { type: 'STRING' },
    excerpt: { type: 'STRING' },
    content: { type: 'STRING' },
    tags: { type: 'ARRAY', items: { type: 'STRING' } },
  },
  required: ['title', 'excerpt', 'content', 'tags'],
} as const;

function systemPrompt(locale: Locale): string {
  const lang = LOCALE_NAME[locale];

  return [
    `You are an editor at a Da Nang luxury real-estate agency. You turn raw notes into a finished article in ${lang}.`,
    '',
    'The user gives you unstructured text: rough notes, a draft, or content pasted from elsewhere.',
    `Produce a publishable article in ${lang}. Keep the writing in ${lang} even if the source is in another language.`,
    '',
    '## title',
    '- One line, 45–65 characters. Concrete and specific — name the place, the property type, or the decision the reader faces.',
    '- No clickbait, no "Top 10", no ALL CAPS, no trailing punctuation.',
    // Model mặc định viết hoa kiểu tiêu đề tiếng Anh ("Căn Hộ An Thượng: Đánh
    // Giá Chi Tiết"). Tiếng Việt, Trung, Hàn đều không có quy ước đó.
    '- Capitalisation follows the target language. Only English uses title case; Vietnamese, Chinese and Korean use ordinary sentence capitalisation.',
    '',
    '## excerpt',
    '- One or two sentences. Hard maximum 160 characters including spaces — count them. Says what the reader gets, not what the article "will discuss".',
    '',
    '## content — HTML, and ONLY these tags:',
    // Danh sách này khớp chính xác schema của trình soạn thảo. Thêm thẻ ngoài
    // danh sách thì TipTap bỏ đi im lặng khi nạp vào editor.
    '  <h2> <h3> <p> <ul> <ol> <li> <strong> <em> <u> <blockquote> <a href> <hr>',
    '  and callout boxes written EXACTLY as:',
    '  <div class="callout" data-variant="note" data-label="Ghi nhớ"><p>…</p></div>',
    '  data-variant is one of: note | tip | warning',
    '  data-label must match the variant: note→"Ghi nhớ", tip→"Mẹo", warning→"Lưu ý"',
    '',
    'Structure rules:',
    '- Never emit <h1> — the page renders the title as h1 already.',
    '- Open with one or two paragraphs of context BEFORE the first <h2>.',
    '- Break the body into 2–5 <h2> sections. Use <h3> only inside a section that genuinely needs sub-parts.',
    '- Use <ul> for comparable items, <ol> only for real step-by-step order.',
    '- Include ONE callout where a reader would benefit from a practical warning or tip. Do not add more than two.',
    '- Use <blockquote> at most once, only for a genuinely quotable line.',
    '- No tables, no images, no headings deeper than h3, no inline style attributes, no class attributes except on callouts.',
    '',
    '## tags',
    '- 3 to 6 short topical tags in ' + lang + '.',
    '- Plain words, no "#" prefix, no spaces-as-separators inside a tag.',
    '- Topics and places, not generic filler like "real estate" or "article".',
    '',
    '## Fidelity',
    '- Work only from the facts in the source. Do not invent prices, areas, dates, project names, or statistics.',
    '- If the source is thin, write a shorter article rather than padding it.',
    '- Write Vietnamese place names in Latin script without diacritics (Da Nang, My Khe, Son Tra, Hai Chau) unless the target language is Vietnamese.',
  ].join('\n');
}

/** Bỏ thẻ mà editor không dựng được, chuyển về thẻ tương đương gần nhất. */
function normalizeToEditorSchema(html: string): string {
  return (
    html
      // Mô hình thỉnh thoảng vẫn trả h1/h4 dù đã cấm.
      .replace(/<h1(\s[^>]*)?>/gi, '<h2>')
      .replace(/<\/h1>/gi, '</h2>')
      .replace(/<h[4-6](\s[^>]*)?>/gi, '<h3>')
      .replace(/<\/h[4-6]>/gi, '</h3>')
      // `b`/`i` không nằm trong schema TipTap; `strong`/`em` mới là chuẩn.
      .replace(/<b(\s[^>]*)?>/gi, '<strong>')
      .replace(/<\/b>/gi, '</strong>')
      .replace(/<i(\s[^>]*)?>/gi, '<em>')
      .replace(/<\/i>/gi, '</em>')
      // Đôi khi mô hình bọc cả bài trong ```html … ```
      .replace(/^\s*```(?:html)?\s*/i, '')
      .replace(/\s*```\s*$/i, '')
      .trim()
  );
}

const MAX_INPUT_CHARS = 40_000;

export async function composeArticle(raw: string, locale: Locale): Promise<ComposedArticle> {
  const source = raw.trim();

  if (source.length < 80) {
    throw new ApiError('VALIDATION', 'Nội dung quá ngắn để dựng thành bài — dán ít nhất vài đoạn.');
  }
  if (source.length > MAX_INPUT_CHARS) {
    throw new ApiError(
      'VALIDATION',
      `Nội dung quá dài (${source.length.toLocaleString('vi-VN')} ký tự). Cắt xuống dưới ${MAX_INPUT_CHARS.toLocaleString('vi-VN')} rồi thử lại.`,
    );
  }

  const parsed = await callGemini<ComposedArticle>({
    system: systemPrompt(locale),
    user: source,
    schema: RESPONSE_SCHEMA,
    label: 'dựng bài viết',
  });

  const content = sanitizeArticleHtml(normalizeToEditorSchema(parsed.content ?? ''));

  if (!content) {
    throw new ApiError('INTERNAL', 'AI không dựng được nội dung từ đoạn văn bản này.');
  }

  return {
    title: (parsed.title ?? '').trim(),
    excerpt: (parsed.excerpt ?? '').trim(),
    content,
    tags: Array.isArray(parsed.tags)
      ? [
          ...new Set(
            parsed.tags
              .map((t) => String(t).replace(/^#+/, '').trim())
              .filter((t) => t.length > 0 && t.length <= 40),
          ),
        ].slice(0, 8)
      : [],
  };
}
