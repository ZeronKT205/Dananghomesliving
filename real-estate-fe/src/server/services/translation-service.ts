import 'server-only';

import { LOCALES, type Locale } from '@/config/locales';
import { ApiError } from '@/lib/api/http';
import { sanitizeArticleHtml } from '@/lib/sanitize-html';

import { applySegments, blocksToHtml, blocksToSegments, htmlToBlocks } from './article-blocks';
import { callAi, isAiConfigured } from './ai-client';

/** Dịch nội dung bài viết sang các ngôn ngữ còn lại bằng Gemini. */

const LOCALE_NAME: Record<Locale, string> = {
  vi: 'Vietnamese',
  en: 'English',
  zh: 'Simplified Chinese',
  ko: 'Korean',
};

export interface TranslatableArticle {
  title: string;
  excerpt: string;
  /** HTML từ trình soạn thảo. */
  content: string;
}

export type TranslationResult = Partial<Record<Locale, TranslatableArticle>>;

/**
 * Model KHÔNG nhận và KHÔNG trả HTML. Nó chỉ thấy các đoạn văn bản đã bóc ra
 * khỏi khung bài, và phải trả lại đúng chừng ấy đoạn. Khung HTML do server dựng
 * lại, nên bản dịch luôn có y hệt tiêu đề mục, danh sách và hộp ghi nhớ như bản
 * gốc.
 *
 * Mỗi đoạn là một OBJECT có số thứ tự `i`, không phải chuỗi trần.
 *
 * Lý do: đã đo được lần bản tiếng Trung trả về 2.473 phần tử cho bài 35 đoạn —
 * model tách từng KÝ TỰ thành một phần tử. Mảng chuỗi trần thì không có gì để
 * phát hiện sớm, và cũng không có cách nào ghép lại. Bắt buộc mỗi phần tử phải
 * có số thứ tự khiến kiểu hỏng đó không thành hình được, đồng thời cho phép
 * ghép theo số chứ không theo vị trí — model đảo thứ tự cũng không sao.
 */
const RESPONSE_SCHEMA = {
  type: 'OBJECT',
  properties: {
    title: { type: 'STRING' },
    excerpt: { type: 'STRING' },
    segments: {
      type: 'ARRAY',
      items: {
        type: 'OBJECT',
        properties: {
          i: { type: 'INTEGER' },
          text: { type: 'STRING' },
        },
        propertyOrdering: ['i', 'text'],
        required: ['i', 'text'],
      },
    },
  },
  propertyOrdering: ['title', 'excerpt', 'segments'],
  required: ['title', 'excerpt', 'segments'],
} as const;

interface RawTranslation {
  title: string;
  excerpt: string;
  segments: Array<{ i: number; text: string }>;
}

/**
 * Xếp các đoạn đã dịch về đúng thứ tự gốc.
 *
 * Trả `null` nếu thiếu bất kỳ số thứ tự nào — thà báo hỏng một ngôn ngữ còn hơn
 * đăng bài thủng mất vài đoạn mà không ai để ý.
 */
function orderSegments(raw: RawTranslation['segments'], expected: number): string[] | null {
  if (!Array.isArray(raw)) return null;

  const byIndex = new Map<number, string>();
  for (const seg of raw) {
    if (!seg || typeof seg !== 'object') continue;
    const i = Number(seg.i);
    if (!Number.isInteger(i) || i < 0 || i >= expected) continue;
    // Trùng số thì lấy bản đầu: bản sau thường là do model tự lặp lại.
    if (!byIndex.has(i)) byIndex.set(i, String(seg.text ?? ''));
  }

  if (byIndex.size !== expected) return null;
  return Array.from({ length: expected }, (_, i) => byIndex.get(i)!);
}

/**
 * Bỏ dấu tiếng Việt — chỉ dùng cho bản dịch sang ngôn ngữ KHÁC tiếng Việt.
 *
 * Prompt đã yêu cầu viết tên riêng dạng Latin không dấu, nhưng model tuân
 * không đều: đã đo được bản tiếng Hàn giữ nguyên "An Thượng" ở tiêu đề trong
 * khi thân bài viết đúng "An Thuong". Luật này ép được bằng code thì không nên
 * trông vào model.
 *
 * An toàn với cả bốn ngôn ngữ đích: chữ Hán và Hangul không mang dấu tổ hợp
 * trong dải U+0300–U+036F, nên chỉ những từ tiếng Việt còn sót lại bị đổi.
 * NFC ở cuối ghép lại âm tiết Hangul mà NFD vừa tách ra.
 */
export function stripVietnameseDiacritics(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .normalize('NFC');
}

function systemPrompt(from: Locale, to: Locale): string {
  return [
    `You translate real-estate editorial content for a Da Nang luxury property agency from ${LOCALE_NAME[from]} into ${LOCALE_NAME[to]}.`,
    '',
    'Input and output shape:',
    '- The input `segments` is a numbered list of text fragments from ONE article: paragraphs, section titles, list items, callout lines.',
    '- Return one object per input segment: { "i": <the same number>, "text": "<the translation>" }.',
    '- `i` must repeat the number of the input segment you translated. Never renumber, never skip a number, never invent one.',
    '- `text` is the WHOLE translated fragment as a single string. Never split a fragment into characters, words or sentences.',
    '- Return exactly as many objects as there are input segments — no more, no fewer.',
    '- A segment may look like a fragment out of context. Translate it as part of the same article, but keep it self-contained.',
    '',
    'Formatting markers inside a segment:',
    '- `**text**` is bold, `*text*` is italic, `[label](https://…)` is a link. Keep all three, and keep the same number of each.',
    '- Move a marker so it wraps the natural equivalent words in the target language. Do not keep the source word order just to keep the marker in place.',
    '- Translate the link label. Never translate or alter the URL.',
    '- There is no HTML here. Never output a tag such as <p> or <h2>.',
    '',
    'Place names:',
    // Quy tắc này phải nói rõ. Bỏ lửng thì mỗi model xử lý một kiểu: có model
    // Việt hoá thành 미케/美溪, có model bê nguyên "Mỹ Khê" vào câu tiếng Hàn
    // (người Hàn không đọc được). Latin không dấu là dạng dùng trên bản đồ,
    // địa chỉ và giấy tờ — nhất quán ở cả bốn ngôn ngữ.
    '- Write Vietnamese place names in Latin script WITHOUT Vietnamese diacritics: Da Nang, My Khe, Son Tra, Hai Chau, Ngu Hanh Son, An Thuong, My An, Hoa Hai.',
    '- This applies to every target language, including Korean and Chinese. Never keep Vietnamese diacritics, and never transliterate place names into Hangul or Chinese characters.',
    '',
    'Style:',
    `- Write natural, professional ${LOCALE_NAME[to]} as a native editor would. Do not translate word for word.`,
    '- Keep all numbers, prices, areas and units exactly as written.',
    '- Do not add, remove or reorder any content.',
  ].join('\n');
}

async function translateOne(source: TranslatableArticle, from: Locale, to: Locale): Promise<TranslatableArticle> {
  const blocks = htmlToBlocks(source.content);
  const segments = blocksToSegments(blocks);

  const parsed = await callAi<RawTranslation>({
    system: systemPrompt(from, to),
    // Nói thẳng số đoạn phải trả về, và đánh số sẵn đầu vào: model bám theo con
    // số cụ thể tốt hơn nhiều so với luật chung "giữ đúng số lượng".
    user: JSON.stringify({
      title: source.title,
      excerpt: source.excerpt,
      segment_count: segments.length,
      segments: segments.map((text, i) => ({ i, text })),
    }),
    schema: RESPONSE_SCHEMA,
    label: `dịch sang ${LOCALE_NAME[to]}`,
    // 90s là thiếu — đã đo bản tiếng Trung của một bài 700 từ chạm hạn và
    // biên tập nhận về bài thiếu một ngôn ngữ.
    timeoutMs: 150_000,
  });

  const ordered = orderSegments(parsed.segments, segments.length);

  // Bản tiếng Việt giữ nguyên dấu; ba ngôn ngữ còn lại chỉ được dùng Latin
  // không dấu cho tên riêng Việt.
  const plain = (t: string) => (to === 'vi' ? t : stripVietnameseDiacritics(t));

  const translatedBlocks = ordered ? applySegments(blocks, ordered.map(plain)) : null;

  if (!translatedBlocks) {
    throw new Error(
      `Bản dịch sang ${LOCALE_NAME[to]} trả về ${parsed.segments?.length ?? 0} đoạn trong khi bài có ${segments.length} — bỏ để tránh lệch nội dung.`,
    );
  }

  return {
    title: plain(parsed.title?.trim() ?? ''),
    excerpt: plain(parsed.excerpt?.trim() ?? ''),
    // Vẫn sanitize dù HTML do server dựng: chữ trong đoạn là của model, và
    // `blocksToHtml` escape trước khi ghép nên đây chỉ là lớp chắn thứ hai.
    content: sanitizeArticleHtml(blocksToHtml(translatedBlocks)),
  };
}

/**
 * Dịch sang mọi locale khác `from`.
 *
 * Chạy song song vì biên tập viên đang chờ; tách từng ngôn ngữ thay vì bắt mô
 * hình trả cả ba trong một lần (một lần hỏng là mất cả ba, và bài dài dễ chạm
 * trần output). `allSettled` để một ngôn ngữ hỏng không kéo đổ cả mẻ.
 */
export async function translateArticle(
  source: TranslatableArticle,
  from: Locale,
  targets?: Locale[],
): Promise<{ translations: TranslationResult; failed: Array<{ locale: Locale; message: string }> }> {
  if (!source.title.trim() && !source.content.trim()) {
    throw new ApiError('VALIDATION', 'Chưa có nội dung để dịch.');
  }

  const list = (targets ?? LOCALES.filter((l) => l !== from)) as Locale[];
  const settled = await Promise.allSettled(list.map((to) => translateOne(source, from, to)));

  const translations: TranslationResult = {};
  const failed: Array<{ locale: Locale; message: string }> = [];

  settled.forEach((res, i) => {
    const locale = list[i]!;
    if (res.status === 'fulfilled') translations[locale] = res.value;
    else failed.push({ locale, message: res.reason instanceof Error ? res.reason.message : 'Lỗi không xác định' });
  });

  return { translations, failed };
}

export function isTranslationConfigured(): boolean {
  return isAiConfigured();
}
