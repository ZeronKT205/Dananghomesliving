import 'server-only';

import { LOCALES, type Locale } from '@/config/locales';
import { ApiError } from '@/lib/api/http';
import { sanitizeArticleHtml } from '@/lib/sanitize-html';

import {
  BLOCKS_SCHEMA,
  blocksToHtml,
  inspectBlocks,
  normalizeBlocks,
  type ArticleBlock,
} from './article-blocks';
import { callGemini } from './gemini-client';
import { translateArticle } from './translation-service';

/**
 * Dựng bài viết hoàn chỉnh từ một cục nội dung thô.
 *
 * AI trả về JSON có cấu trúc (xem `article-blocks.ts`), server tự dựng HTML.
 * Đầu ra vì thế luôn nằm đúng schema của trình soạn thảo, và chữ của mô hình
 * được escape nên không thể lọt thẻ lạ.
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

export type ComposedBundle = {
  /** Bản gốc theo ngôn ngữ đang soạn. */
  primary: ComposedArticle;
  /** Các bản dịch, rỗng nếu không yêu cầu dịch. */
  translations: Partial<Record<Locale, { title: string; excerpt: string; content: string }>>;
  failedLocales: Array<{ locale: Locale; message: string }>;
  /** Số liệu đo bài, để báo lại cho biên tập. */
  stats: { words: number; headings: number; callouts: number };
};

interface RawCompose {
  title: string;
  excerpt: string;
  tags: string[];
  blocks: ArticleBlock[];
}

/** Bài dưới ngưỡng này coi là mỏng, sẽ yêu cầu mô hình viết dày thêm một lần. */
const MIN_WORDS = 550;
const TARGET_WORDS = '800–1200';

function systemPrompt(locale: Locale): string {
  const lang = LOCALE_NAME[locale];

  return [
    `You are a senior editor at a Da Nang luxury real-estate agency. You turn raw notes into a finished, publishable article in ${lang}.`,
    '',
    `Write in ${lang} regardless of what language the source notes are in.`,
    '',
    '## Output shape',
    'Return JSON only. `blocks` is an ordered array of 12–24 blocks.',
    'EVERY block carries its content in `lines` — an array of strings. There is no other content field.',
    '  { "type": "paragraph", "lines": ["one paragraph"] }',
    '  { "type": "heading",   "level": 2, "lines": ["section title"] }     // level 2 or 3',
    '  { "type": "list",      "ordered": false, "lines": ["item", "item", "item"] }',
    '  { "type": "callout",   "variant": "tip", "lines": ["one or two short paragraphs"] }  // note | tip | warning',
    '  { "type": "quote",     "lines": ["the quoted sentence"] }',
    '  { "type": "divider",   "lines": [] }',
    'Never put HTML tags inside `lines`. Formatting is expressed only with the inline markers below.',
    'Never emit the same block twice in a row. Every block must say something new.',
    '',
    '## Inline markers (use them — a wall of plain text reads as unfinished)',
    '  **bold**   — every concrete figure the first time it appears: prices, areas, distances, durations, percentages, deposit terms.',
    '  *italic*   — sparingly, for a term being introduced.',
    '  [label](https://…) — only for URLs that appear in the source.',
    '',
    '## Depth — this is the part most drafts get wrong',
    `- Target ${TARGET_WORDS} words across all blocks. A three-paragraph summary is a failure, not a concise article.`,
    '- Every fact in the source deserves a sentence that explains what it MEANS for a buyer or tenant, not just a restatement.',
    '  Weak:  "The apartment is 96 m²."',
    '  Right: "At **96 m²** the two-bedroom sits at the upper end of the local range, so the second room works as a real bedroom rather than a study."',
    '- Draw out the consequences the notes only imply: who this suits, what to check on a viewing, how it compares to the alternatives mentioned, what the cost picture looks like over a year.',
    '- Do NOT pad with generic real-estate filler ("Da Nang is a beautiful coastal city…"). Depth comes from working the source facts harder, never from adding background the notes do not contain.',
    '',
    '## Structure',
    '- 2 opening paragraphs of context BEFORE the first heading. Say what the piece covers and who it is for.',
    '- 3 to 5 `heading` level-2 sections. Give each a specific title, not "Overview" or "Conclusion".',
    '- Each section: 2–4 paragraphs, or paragraphs plus one list.',
    '- At least ONE `list` block. Raw notes almost always contain a set of comparable items — amenities, fees, features, areas, steps — and those read far better as a list than buried in a paragraph.',
    '- Keep every list item a full clause with its own detail, never a bare noun. Weak: "Pool". Right: "A **16 m** infinity pool facing east, so it catches morning sun rather than afternoon glare."',
    '- Exactly ONE or TWO `callout` blocks, placed where a reader genuinely benefits:',
    '    variant "warning" — a risk, a cost that surprises people, something to verify',
    '    variant "tip"     — practical advice on timing, negotiating, or what to ask',
    '    variant "note"    — a fact worth remembering that does not fit the flow',
    '- Close with a section that helps the reader decide, not a summary of what was already said.',
    '',
    '## title',
    '- 45–65 characters. Name the place and the property type, or the decision the reader faces.',
    '- No clickbait, no "Top 10", no ALL CAPS, no trailing punctuation.',
    // Model mặc định viết hoa kiểu tiêu đề tiếng Anh ("Căn Hộ An Thượng: Đánh
    // Giá Chi Tiết"). Tiếng Việt, Trung, Hàn đều không có quy ước đó.
    '- Capitalisation follows the target language. Only English uses title case; Vietnamese, Chinese and Korean use ordinary sentence capitalisation.',
    '',
    '## excerpt',
    '- One or two sentences, hard maximum 160 characters including spaces. Say what the reader gets, not what the article "will discuss".',
    '',
    '## tags',
    `- 4 to 6 short topical tags in ${lang}. No "#" prefix. Places and topics, not filler like "real estate".`,
    '',
    '## Fidelity — non-negotiable',
    '- Use only facts present in the source. Never invent a price, area, date, project name, developer, statistic, or amenity.',
    '- If the source is thin on a section you planned, drop that section rather than filling it with invented detail.',
    locale === 'vi'
      ? '- Vietnamese place names keep their normal Vietnamese spelling.'
      : '- Write Vietnamese place names in Latin script without diacritics: Da Nang, My Khe, Son Tra, Hai Chau, An Thuong, Ngu Hanh Son.',
  ].join('\n');
}

const MAX_INPUT_CHARS = 40_000;

async function askForBlocks(system: string, user: string): Promise<RawCompose> {
  return callGemini<RawCompose>({
    system,
    user,
    schema: BLOCKS_SCHEMA,
    label: 'dựng bài viết',
    /*
     * Trần này phải bao GỒM cả token suy nghĩ — Gemini tính chung.
     *
     * Đo thật một bài tiếng Việt: 3.935 token suy nghĩ + 8.049 token nội dung.
     * Đặt 12.000 như trước là cắt ngang giữa chừng, JSON đứt đôi, người dùng
     * chỉ thấy "kết quả không đúng định dạng". 24.000 cho đủ chỗ thở.
     */
    maxOutputTokens: 24_000,
    // Chỉ là gợi ý chứ không phải trần cứng — đo thấy model 3.x vẫn nghĩ tới
    // ~3.9k dù đặt 2.048. Vẫn giữ vì nó kéo mức suy nghĩ xuống đáng kể.
    thinkingBudget: 2048,
    timeoutMs: 150_000,
  });
}

function normalize(raw: RawCompose): { article: ComposedArticle; blocks: ArticleBlock[] } {
  // Chuẩn hoá trước: mô hình điền các trường optional không nhất quán.
  const blocks = normalizeBlocks(raw.blocks);
  const html = sanitizeArticleHtml(blocksToHtml(blocks));

  const tags = Array.isArray(raw.tags)
    ? [
        ...new Set(
          raw.tags.map((t) => String(t).replace(/^#+/, '').trim()).filter((t) => t.length > 0 && t.length <= 40),
        ),
      ].slice(0, 8)
    : [];

  return {
    article: {
      title: String(raw.title ?? '').trim(),
      excerpt: String(raw.excerpt ?? '').trim(),
      content: html,
      tags,
    },
    blocks,
  };
}

/**
 * Dựng bài. Nếu bản đầu quá mỏng thì yêu cầu viết dày thêm MỘT lần.
 *
 * Thử lại thay vì chấp nhận bài ngắn: lỗi hay gặp nhất là mô hình tóm tắt ghi
 * chú thay vì khai thác nó. Nói thẳng vào lần hai hiệu quả hơn nhiều so với
 * việc siết thêm luật ở lần một.
 */
export async function composeArticle(raw: string, locale: Locale): Promise<{ article: ComposedArticle; stats: { words: number; headings: number; callouts: number } }> {
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

  const system = systemPrompt(locale);

  let result = normalize(await askForBlocks(system, source));
  let report = inspectBlocks(result.blocks);

  const tooThin =
    report.words < MIN_WORDS || report.headings < 3 || report.callouts === 0 || report.lists === 0;

  if (tooThin) {
    const missing = [
      report.words < MIN_WORDS ? `only ${report.words} words (target ${TARGET_WORDS})` : null,
      report.headings < 3 ? `only ${report.headings} level-2 sections (need 3–5)` : null,
      report.callouts === 0 ? 'no callout block' : null,
      report.lists === 0 ? 'no list block' : null,
    ]
      .filter(Boolean)
      .join('; ');

    const retry = [
      source,
      '',
      '---',
      `Your previous draft was too thin: ${missing}.`,
      'Rewrite it properly. Work every fact in the notes harder — explain what each one means for a buyer or tenant, what to check, how the options compare.',
      'Do NOT add facts that are not in the notes. Depth comes from interpreting the given facts, not from inventing new ones.',
    ].join('\n');

    const second = normalize(await askForBlocks(system, retry));
    const secondReport = inspectBlocks(second.blocks);

    // Chỉ nhận bản hai nếu thật sự dày hơn — thỉnh thoảng nó còn mỏng hơn.
    if (secondReport.words > report.words) {
      result = second;
      report = secondReport;
    }
  }

  if (!result.article.content) {
    throw new ApiError('INTERNAL', 'AI không dựng được nội dung từ đoạn văn bản này.');
  }

  return {
    article: result.article,
    stats: { words: report.words, headings: report.headings, callouts: report.callouts },
  };
}

/**
 * Dựng bài rồi dịch luôn sang các ngôn ngữ còn lại.
 *
 * Gộp hai bước vào một hành động: dựng xong mà vẫn phải bấm thêm nút dịch là
 * thừa một thao tác, và biên tập hay quên nên bài lên web chỉ có một thứ tiếng.
 */
export async function composeAndTranslate(
  raw: string,
  locale: Locale,
  alsoTranslate: boolean,
): Promise<ComposedBundle> {
  const { article, stats } = await composeArticle(raw, locale);

  if (!alsoTranslate) {
    return { primary: article, translations: {}, failedLocales: [], stats };
  }

  const { translations, failed } = await translateArticle(
    { title: article.title, excerpt: article.excerpt, content: article.content },
    locale,
    LOCALES.filter((l) => l !== locale) as Locale[],
  );

  return { primary: article, translations, failedLocales: failed, stats };
}
