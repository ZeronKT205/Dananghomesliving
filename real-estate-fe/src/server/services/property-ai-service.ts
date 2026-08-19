import 'server-only';

import { LOCALES, type Locale } from '@/config/locales';
import { ApiError } from '@/lib/api/http';

import { callAi } from './ai-client';
import { normalizePlaceNames, stripVietnameseDiacritics } from './translation-service';

/**
 * AI cho tin bất động sản: dựng mô tả và dịch.
 *
 * Cố tình ĐƠN GIẢN hơn hẳn phía bài viết. Bài viết cần khối có cấu trúc (tiêu
 * đề mục, danh sách, hộp ghi nhớ) nên phải có schema khối và bộ dựng HTML riêng.
 * Tin BĐS chỉ có ba trường chữ thuần — tiêu đề, tóm tắt, vài đoạn mô tả — nên
 * dùng lại bộ máy đó là thừa và tốn token vô ích.
 *
 * Cả ba ngôn ngữ đích dịch trong MỘT lượt gọi, không phải ba.
 * Bên bài viết tách từng ngôn ngữ vì bài dài dễ chạm trần token và hỏng một
 * ngôn ngữ thì mất cả ba. Ở đây toàn bộ nội dung chỉ vài trăm chữ, gộp lại rẻ
 * hơn ba lần gấp ba và vẫn nằm xa mọi giới hạn.
 */

const LOCALE_NAME: Record<Locale, string> = {
  vi: 'Vietnamese',
  en: 'English',
  zh: 'Simplified Chinese',
  ko: 'Korean',
};

export interface PropertyText {
  title: string;
  summary: string;
  /** Mỗi phần tử là một đoạn văn. */
  description: string[];
}

/* ── Dựng nội dung từ ghi chú thô ──────────────────────── */

const COMPOSE_SCHEMA = {
  type: 'OBJECT',
  properties: {
    title: { type: 'STRING' },
    summary: { type: 'STRING' },
    description: { type: 'ARRAY', items: { type: 'STRING' } },
  },
  propertyOrdering: ['title', 'summary', 'description'],
  required: ['title', 'summary', 'description'],
} as const;

const MIN_INPUT = 40;
const MAX_INPUT = 8_000;

function composePrompt(locale: Locale): string {
  const lang = LOCALE_NAME[locale];

  return [
    `You write listing copy for a Da Nang luxury real-estate agency, in ${lang}.`,
    'Turn the agent notes into three fields. Return JSON only.',
    '',
    `- title: 40–70 characters. Name the property type, the area, and one concrete standout (bedrooms, view, area). No ALL CAPS, no trailing punctuation. Capitalisation follows ${lang} — only English uses title case.`,
    '- summary: ONE sentence, hard maximum 160 characters. What a buyer gets, not "this property is located at".',
    '- description: 3 to 5 paragraphs, each 2–4 sentences. Cover in this order: what the place is and where; layout and interior; amenities and surroundings; who it suits.',
    '',
    'Rules:',
    '- Use ONLY facts in the notes. Never invent a price, area, year, developer, amenity or distance.',
    '- Plain text only. No markdown, no HTML, no bullet characters.',
    '- Keep every number exactly as written in the notes.',
    locale === 'vi'
      ? '- Vietnamese place names keep their normal Vietnamese spelling.'
      : '- Write Vietnamese place names in Latin script without diacritics: Da Nang, My Khe, Son Tra, Hai Chau, An Thuong, Ngu Hanh Son.',
  ].join('\n');
}

function clean(raw: unknown): PropertyText {
  const r = (raw ?? {}) as Partial<PropertyText>;
  return {
    title: String(r.title ?? '').trim(),
    summary: String(r.summary ?? '').trim(),
    description: Array.isArray(r.description)
      ? r.description.map((p) => String(p).trim()).filter(Boolean)
      : [],
  };
}

export async function composePropertyText(raw: string, locale: Locale): Promise<PropertyText> {
  const source = raw.trim();

  if (source.length < MIN_INPUT) {
    throw new ApiError('VALIDATION', 'Ghi chú quá ngắn — dán ít nhất vài dòng thông tin về bất động sản.');
  }
  if (source.length > MAX_INPUT) {
    throw new ApiError('VALIDATION', `Ghi chú quá dài (${source.length} ký tự). Cắt xuống dưới ${MAX_INPUT}.`);
  }

  const result = clean(
    await callAi({
      system: composePrompt(locale),
      user: source,
      schema: COMPOSE_SCHEMA,
      label: 'dựng mô tả bất động sản',
      // Ba trường chữ ngắn — 4.000 token là dư dùng. Đặt cao hơn chỉ tạo cơ hội
      // cho model viết lê thê.
      maxOutputTokens: 4_000,
      timeoutMs: 90_000,
    }),
  );

  if (!result.title || result.description.length === 0) {
    throw new ApiError('INTERNAL', 'AI không dựng được nội dung từ ghi chú này.');
  }
  return result;
}

/* ── Dịch sang các ngôn ngữ còn lại ────────────────────── */

const localeFields = {
  type: 'OBJECT',
  properties: {
    title: { type: 'STRING' },
    summary: { type: 'STRING' },
    description: { type: 'ARRAY', items: { type: 'STRING' } },
  },
  required: ['title', 'summary', 'description'],
} as const;

/**
 * Schema dựng theo đúng danh sách ngôn ngữ đích.
 *
 * `required` PHẢI liệt kê đủ. Trước đây để `required: []` cho gọn, và model
 * chỉ trả về mỗi tiếng Anh rồi bỏ tiếng Trung với tiếng Hàn — không lỗi, không
 * cảnh báo, chỉ là thiếu hai ngôn ngữ. Có `required` thì API bắt model điền đủ.
 */
function translateSchema(targets: Locale[]) {
  return {
    type: 'OBJECT',
    properties: Object.fromEntries(targets.map((t) => [t, localeFields])),
    required: targets,
  };
}

function translatePrompt(from: Locale, targets: Locale[]): string {
  const list = targets.map((t) => `"${t}" (${LOCALE_NAME[t]})`).join(', ');

  return [
    `You translate real-estate listing copy for a Da Nang agency from ${LOCALE_NAME[from]}.`,
    '',
    `You MUST return exactly ${targets.length} objects, one per language: ${list}.`,
    'Returning fewer languages is an error. Do not stop after the first one.',
    '',
    '- Each object has the same three fields as the source: title, summary, description.',
    '- `description` must keep EXACTLY the same number of paragraphs, in the same order. Never merge or split paragraphs.',
    '- Write natural, professional copy as a native agent would. Do not translate word for word.',
    '- Keep every number, price, area and unit exactly as written.',
    '- Write Vietnamese place names in Latin script WITHOUT Vietnamese diacritics — Da Nang, My Khe, Son Tra, An Thuong — in every target language. Never transliterate them into Hangul or Chinese characters.',
  ].join('\n');
}

export type PropertyTranslations = Partial<Record<Locale, PropertyText>>;

/**
 * Dịch sang mọi ngôn ngữ khác `from` trong một lượt gọi.
 *
 * Số đoạn mô tả phải khớp bản gốc; lệch thì BỎ ngôn ngữ đó thay vì ghép bừa —
 * mô tả thiếu một đoạn mà vẫn đăng thì không ai phát hiện ra.
 */
/** Gọi model một lượt cho danh sách ngôn ngữ cho trước. */
async function askForTranslations(
  source: PropertyText,
  from: Locale,
  targets: Locale[],
): Promise<{ got: PropertyTranslations; missing: Locale[] }> {
  const raw = (await callAi({
    system: translatePrompt(from, targets),
    user: JSON.stringify(source),
    schema: translateSchema(targets),
    label: 'dịch tin bất động sản',
    // Ba ngôn ngữ trong một lượt; chữ Hán và Hangul tốn token hơn tiếng Việt.
    maxOutputTokens: 12_000,
    timeoutMs: 120_000,
  })) as Record<string, unknown>;

  const got: PropertyTranslations = {};
  const missing: Locale[] = [];

  for (const locale of targets) {
    const item = clean(raw[locale]);

    if (!item.title || item.description.length !== source.description.length) {
      console.error(
        '[property-ai] bỏ bản dịch',
        locale,
        raw[locale] === undefined
          ? 'model không trả về ngôn ngữ này'
          : `lệch số đoạn: ${item.description.length} vs ${source.description.length}`,
      );
      missing.push(locale);
      continue;
    }

    // Quy tắc tên riêng ép bằng code — model tuân không đều, đã đo được bản
    // tiếng Hàn giữ nguyên "An Thượng" ở tiêu đề.
    const plain = (t: string) => normalizePlaceNames(stripVietnameseDiacritics(t));

    got[locale] = {
      title: plain(item.title),
      summary: plain(item.summary),
      description: item.description.map(plain),
    };
  }

  return { got, missing };
}

/**
 * Dịch sang mọi ngôn ngữ khác `from`.
 *
 * Một lượt gọi cho cả ba, rồi gọi BÙ đúng những ngôn ngữ còn thiếu.
 *
 * Cần lượt bù vì `required` trong schema của Anthropic chỉ là gợi ý, không phải
 * ràng buộc cứng: đã đo — yêu cầu en+zh+ko nhưng model chỉ trả về en, không lỗi
 * gì cả. Lượt bù thường không xảy ra, và khi xảy ra thì chỉ dịch phần thiếu nên
 * rẻ hơn hẳn so với gọi ba lượt riêng ngay từ đầu.
 *
 * Số đoạn mô tả phải khớp bản gốc; lệch thì BỎ ngôn ngữ đó thay vì ghép bừa —
 * mô tả thiếu một đoạn mà vẫn đăng thì không ai phát hiện ra.
 */
export async function translatePropertyText(
  source: PropertyText,
  from: Locale,
): Promise<{ translations: PropertyTranslations; failed: Locale[] }> {
  if (!source.title.trim() && source.description.length === 0) {
    throw new ApiError('VALIDATION', 'Chưa có nội dung để dịch.');
  }

  const targets = LOCALES.filter((l) => l !== from) as Locale[];

  const translations: PropertyTranslations = {};
  let pending = targets;

  /*
   * Tối đa ba vòng. Vòng đầu hỏi cả ba ngôn ngữ; vòng sau chỉ hỏi phần còn
   * thiếu nên payload nhỏ dần và model gần như luôn trả đủ.
   *
   * Đo thực tế: vòng 1 chỉ ra `en`, vòng 2 thêm `zh`, vòng 3 mới có `ko` —
   * model có xu hướng bỏ bớt ngôn ngữ cuối khi bị hỏi nhiều thứ cùng lúc.
   * Trường hợp tốt vẫn chỉ tốn một lượt gọi.
   */
  for (let round = 0; round < 3 && pending.length > 0; round++) {
    const { got, missing } = await askForTranslations(source, from, pending);
    Object.assign(translations, got);

    // Không tiến thêm được thì dừng, gọi tiếp cũng chỉ tốn token.
    if (missing.length === pending.length && Object.keys(got).length === 0) {
      pending = missing;
      break;
    }
    pending = missing;
  }

  return { translations, failed: pending };
}
