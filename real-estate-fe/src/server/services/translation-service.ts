import 'server-only';

import { ApiError } from '@/lib/api/http';
import { LOCALES, type Locale } from '@/config/locales';
import { sanitizeArticleHtml } from '@/lib/sanitize-html';

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

const RESPONSE_SCHEMA = {
  type: 'OBJECT',
  properties: {
    title: { type: 'STRING' },
    excerpt: { type: 'STRING' },
    content: { type: 'STRING' },
  },
  required: ['title', 'excerpt', 'content'],
} as const;

function systemPrompt(from: Locale, to: Locale): string {
  return [
    `You translate real-estate editorial content for a Da Nang luxury property agency from ${LOCALE_NAME[from]} into ${LOCALE_NAME[to]}.`,
    '',
    'HTML rules:',
    '- The `content` field is HTML. Preserve every tag, attribute and nesting level exactly.',
    '- Translate ONLY the visible text between tags.',
    '- Never translate attribute values such as class, data-variant, data-label, href, or src.',
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
  const parsed = await callGemini<TranslatableArticle>({
    system: systemPrompt(from, to),
    user: JSON.stringify({ title: source.title, excerpt: source.excerpt, content: source.content }),
    schema: RESPONSE_SCHEMA,
    label: `dịch sang ${LOCALE_NAME[to]}`,
    timeoutMs: 90_000,
  });

  return {
    title: parsed.title?.trim() ?? '',
    excerpt: parsed.excerpt?.trim() ?? '',
    // Đầu ra của mô hình cũng phải sanitize — HTML sinh tự động, không đáng tin.
    content: sanitizeArticleHtml(parsed.content ?? ''),
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
