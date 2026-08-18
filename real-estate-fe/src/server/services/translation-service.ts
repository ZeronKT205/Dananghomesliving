import 'server-only';

import { LOCALES, type Locale } from '@/config/locales';
import { ApiError } from '@/lib/api/http';
import { sanitizeArticleHtml } from '@/lib/sanitize-html';

import { applySegments, blocksToHtml, blocksToSegments, htmlToBlocks } from './article-blocks';
import { callGemini, isGeminiConfigured } from './gemini-client';

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
 * Model KHÔNG nhận và KHÔNG trả HTML. Nó chỉ thấy `segments` — mảng chuỗi đã
 * bóc ra khỏi khung bài — và phải trả về đúng chừng ấy chuỗi theo đúng thứ tự.
 * Khung HTML do server dựng lại, nên bản dịch luôn có y hệt tiêu đề mục, danh
 * sách và hộp ghi nhớ như bản gốc.
 */
const RESPONSE_SCHEMA = {
  type: 'OBJECT',
  properties: {
    title: { type: 'STRING' },
    excerpt: { type: 'STRING' },
    segments: { type: 'ARRAY', items: { type: 'STRING' } },
  },
  propertyOrdering: ['title', 'excerpt', 'segments'],
  required: ['title', 'excerpt', 'segments'],
} as const;

interface RawTranslation {
  title: string;
  excerpt: string;
  segments: string[];
}

function systemPrompt(from: Locale, to: Locale): string {
  return [
    `You translate real-estate editorial content for a Da Nang luxury property agency from ${LOCALE_NAME[from]} into ${LOCALE_NAME[to]}.`,
    '',
    'Input and output shape:',
    '- `segments` is an ordered array of text fragments taken from one article: paragraphs, section titles, list items, callout lines.',
    '- Return EXACTLY the same number of segments, in the same order. One input segment produces one output segment.',
    '- Never merge two segments, never split one, never drop an empty-looking one, never add a segment of your own.',
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

  const parsed = await callGemini<RawTranslation>({
    system: systemPrompt(from, to),
    user: JSON.stringify({ title: source.title, excerpt: source.excerpt, segments }),
    schema: RESPONSE_SCHEMA,
    label: `dịch sang ${LOCALE_NAME[to]}`,
    // 90s là thiếu — đã đo bản tiếng Trung của một bài 700 từ chạm hạn và
    // biên tập nhận về bài thiếu một ngôn ngữ.
    timeoutMs: 150_000,
  });

  const translatedBlocks = applySegments(blocks, Array.isArray(parsed.segments) ? parsed.segments.map(String) : []);

  if (!translatedBlocks) {
    throw new Error(
      `Bản dịch sang ${LOCALE_NAME[to]} trả về ${parsed.segments?.length ?? 0} đoạn trong khi bài có ${segments.length} — bỏ để tránh lệch nội dung.`,
    );
  }

  return {
    title: parsed.title?.trim() ?? '',
    excerpt: parsed.excerpt?.trim() ?? '',
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
  return isGeminiConfigured();
}
