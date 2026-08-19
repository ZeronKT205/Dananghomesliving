import 'server-only';

import { LOCALES, type Locale } from '@/config/locales';
import { ApiError } from '@/lib/api/http';

import { callAi } from './ai-client';
import { normalizePlaceNames, stripVietnameseDiacritics } from './translation-service';

/**
 * AI cho tin bất động sản: rút toàn bộ dữ liệu từ ghi chú thô, và dịch.
 *
 * Đơn giản hơn hẳn phía bài viết — không có khối cấu trúc, không dựng HTML,
 * chỉ chữ thuần và mấy con số. Nhưng rút được NHIỀU hơn: cả thông số, địa chỉ
 * và tiện ích, để biên tập bấm một nút là form đầy.
 *
 * Cả ba ngôn ngữ đích dịch trong MỘT lượt gọi, không phải ba. Bên bài viết tách
 * từng ngôn ngữ vì bài dài dễ chạm trần token; ở đây nội dung chỉ vài trăm chữ.
 */

const LOCALE_NAME: Record<Locale, string> = {
  vi: 'Vietnamese',
  en: 'English',
  zh: 'Simplified Chinese',
  ko: 'Korean',
};

/**
 * Tỷ giá quy đổi VND → USD.
 *
 * Cố định trong mã, KHÔNG để model tự tính: mô hình ngôn ngữ làm toán rất tệ,
 * và sai một chữ số ở giá là sai cả bộ lọc khoảng giá ngoài web. Model chỉ có
 * việc đọc ra con số và đơn vị tiền; phép chia do code làm.
 *
 * Đổi bằng `USD_VND_RATE` trong `.env.local` khi tỷ giá biến động nhiều.
 */
const USD_VND_RATE = Number(process.env.USD_VND_RATE) || 25_400;

export interface PropertyText {
  title: string;
  summary: string;
  /** Mỗi phần tử là một đoạn văn. */
  description: string[];
}

/** Toàn bộ thứ AI rút được từ ghi chú. Trường nào không nói tới thì `null`. */
export interface PropertyDraft extends PropertyText {
  deal: 'sale' | 'rent';
  price: { amount: number; currency: 'USD' | 'VND'; period: 'total' | 'month'; negotiable: boolean } | null;
  /** Giá quy về USD, do code tính từ `price`. */
  priceUsd: number | null;
  specs: {
    bedrooms: number | null;
    bathrooms: number | null;
    internalArea: number | null;
    landArea: number | null;
    floors: number | null;
    yearBuilt: number | null;
    parking: number | null;
    furnishing: 'full' | 'basic' | 'none' | null;
    ownership: 'freehold' | 'leasehold' | null;
  };
  location: { address: string | null; ward: string | null; district: string | null };
  /** Tên tiện ích khớp với danh sách đã có trong CMS. */
  amenityNames: string[];
  /** Tiện ích có trong ghi chú nhưng CMS chưa có — nơi gọi quyết định tạo hay bỏ. */
  newAmenityNames: string[];
}

/* ── Rút dữ liệu từ ghi chú thô ────────────────────────── */

const DRAFT_SCHEMA = {
  type: 'OBJECT',
  properties: {
    title: { type: 'STRING' },
    summary: { type: 'STRING' },
    description: { type: 'ARRAY', items: { type: 'STRING' } },
    deal: { type: 'STRING', enum: ['sale', 'rent'] },

    priceAmount: { type: 'NUMBER' },
    priceCurrency: { type: 'STRING', enum: ['USD', 'VND'] },
    pricePeriod: { type: 'STRING', enum: ['total', 'month'] },
    negotiable: { type: 'BOOLEAN' },

    bedrooms: { type: 'INTEGER' },
    bathrooms: { type: 'INTEGER' },
    internalArea: { type: 'NUMBER' },
    landArea: { type: 'NUMBER' },
    floors: { type: 'INTEGER' },
    yearBuilt: { type: 'INTEGER' },
    parking: { type: 'INTEGER' },
    furnishing: { type: 'STRING', enum: ['full', 'basic', 'none'] },
    ownership: { type: 'STRING', enum: ['freehold', 'leasehold'] },

    address: { type: 'STRING' },
    ward: { type: 'STRING' },
    district: { type: 'STRING' },

    amenities: { type: 'ARRAY', items: { type: 'STRING' } },
  },
  required: ['title', 'summary', 'description', 'deal'],
} as const;

const MIN_INPUT = 40;
const MAX_INPUT = 8_000;

function draftPrompt(locale: Locale, knownAmenities: string[]): string {
  const lang = LOCALE_NAME[locale];

  return [
    `You are a senior listing writer for a Da Nang luxury real-estate agency. You write in ${lang}.`,
    'Read the agent notes and return ONE JSON object with the listing copy AND every field you can extract.',
    '',
    '## Copy — this is what sells the property',
    `- title: 40–70 characters in ${lang}. Lead with the property type and area, then the single strongest selling point. Capitalisation follows ${lang} — only English uses title case.`,
    '- summary: ONE sentence, hard maximum 160 characters. The reason to book a viewing, not a list of specs.',
    '- description: 4 to 5 paragraphs, each 3–4 sentences, in this order:',
    '    1) Open with the experience of being there — the view, the light, the walk to the beach. Never open with "this property is located at".',
    '    2) Layout and interior, naming the brands and materials the notes mention.',
    '    3) Amenities, and what daily life there actually looks like.',
    '    4) Location: what is nearby and how far.',
    '    5) Who it suits, and the investment case if the notes give rental figures.',
    '- Turn every raw figure into a benefit. Weak: "917 m2". Right: "917 m2 of built space across three floors, so each bedroom keeps its own quiet wing."',
    '- Never invent a price, area, year, developer, amenity or distance. If the notes do not say it, leave it out.',
    '- Plain text only. No markdown, no HTML, no bullet characters.',
    '',
    '## Extracted fields — omit any field the notes do not state',
    '- deal: "sale" if the notes are about selling, "rent" if about leasing.',
    '- priceAmount + priceCurrency: the number EXACTLY as written, and its currency. Do NOT convert between currencies.',
    '    "3.596.000.000 dong" -> priceAmount 3596000000, priceCurrency "VND"',
    '    "3.596.000 USD" -> priceAmount 3596000, priceCurrency "USD"',
    '    "3,6 ty" -> priceAmount 3600000000, priceCurrency "VND"',
    '- pricePeriod: "month" for a monthly rent, "total" for a sale price.',
    '- negotiable: true only if the notes mention negotiating or a discount.',
    '- internalArea / landArea in m2. internalArea is the built or usable area; landArea is the plot.',
    '- furnishing: "full" fully furnished, "basic" partly, "none" bare shell.',
    '- ownership: "freehold" for so hong lau dai, "leasehold" for a fixed term.',
    '- address: the street-level address as written. ward and district separately if stated.',
    '',
    '## amenities',
    knownAmenities.length
      ? `- Pick from this exact list, copying each name character for character: ${knownAmenities.join(' | ')}`
      : '- No existing list; return the amenity names as written in the notes.',
    '- Add a name NOT on the list only if the notes clearly describe a facility the list has no equivalent for.',
    '- Do not invent amenities the notes never mention.',
    '',
    locale === 'vi'
      ? '- Vietnamese place names keep their normal Vietnamese spelling.'
      : '- Write Vietnamese place names in Latin script without diacritics: Da Nang, My Khe, Son Tra, Hai Chau, An Thuong, Ngu Hanh Son.',
  ].join('\n');
}

/* ── Chuẩn hoá kết quả ─────────────────────────────────── */

type Raw = Record<string, unknown>;

const str = (v: unknown): string => (typeof v === 'string' ? v.trim() : '');

/** Số dương; `null` nếu thiếu hoặc vô lý. `max` chặn con số model đọc nhầm chỗ. */
function num(v: unknown, max = Number.MAX_SAFE_INTEGER): number | null {
  const n = typeof v === 'number' ? v : Number(v);
  return Number.isFinite(n) && n > 0 && n <= max ? n : null;
}

function pick<T extends string>(v: unknown, allowed: readonly T[]): T | null {
  return typeof v === 'string' && (allowed as readonly string[]).includes(v) ? (v as T) : null;
}

function textOf(raw: Raw): PropertyText {
  return {
    title: str(raw.title),
    summary: str(raw.summary),
    description: Array.isArray(raw.description) ? raw.description.map(str).filter(Boolean) : [],
  };
}

/**
 * Quy giá về USD.
 *
 * Làm tròn tới đơn vị: giá bất động sản không ai quan tâm tới xu, mà số lẻ
 * hiện ra ngoài web trông như lỗi.
 */
function toUsd(amount: number, currency: 'USD' | 'VND'): number {
  return currency === 'USD' ? Math.round(amount) : Math.round(amount / USD_VND_RATE);
}

export async function draftPropertyFromNotes(
  raw: string,
  locale: Locale,
  knownAmenities: string[] = [],
): Promise<PropertyDraft> {
  const source = raw.trim();

  if (source.length < MIN_INPUT) {
    throw new ApiError('VALIDATION', 'Ghi chú quá ngắn — dán ít nhất vài dòng thông tin về bất động sản.');
  }
  if (source.length > MAX_INPUT) {
    throw new ApiError('VALIDATION', `Ghi chú quá dài (${source.length} ký tự). Cắt xuống dưới ${MAX_INPUT}.`);
  }

  const out = (await callAi({
    system: draftPrompt(locale, knownAmenities),
    user: source,
    schema: DRAFT_SCHEMA,
    label: 'đọc ghi chú bất động sản',
    // Mô tả 5 đoạn + hai chục trường số. 6.000 token là dư.
    maxOutputTokens: 6_000,
    timeoutMs: 120_000,
  })) as Raw;

  const text = textOf(out);
  if (!text.title || text.description.length === 0) {
    throw new ApiError('INTERNAL', 'AI không đọc được nội dung từ ghi chú này.');
  }

  const amount = num(out.priceAmount);
  const currency = pick(out.priceCurrency, ['USD', 'VND'] as const) ?? 'VND';
  const price = amount
    ? {
        amount,
        currency,
        period: pick(out.pricePeriod, ['total', 'month'] as const) ?? 'total',
        negotiable: out.negotiable === true,
      }
    : null;

  /*
   * Khớp tên tiện ích KHÔNG phân biệt hoa thường và khoảng trắng thừa.
   *
   * Model hay trả về "Hồ bơi riêng " hoặc "hồ bơi riêng" — so khớp nguyên văn
   * thì trượt hết và biên tập lại phải tick tay đúng thứ AI vừa đọc ra.
   */
  const known = new Map(knownAmenities.map((n) => [n.trim().toLowerCase(), n]));
  const matched: string[] = [];
  const unknown: string[] = [];

  for (const name of Array.isArray(out.amenities) ? out.amenities.map(str).filter(Boolean) : []) {
    const hit = known.get(name.toLowerCase());
    if (hit) {
      if (!matched.includes(hit)) matched.push(hit);
    } else if (!unknown.includes(name)) {
      unknown.push(name);
    }
  }

  return {
    ...text,
    deal: pick(out.deal, ['sale', 'rent'] as const) ?? 'sale',
    price,
    priceUsd: price ? toUsd(price.amount, price.currency) : null,
    specs: {
      // Trần hợp lý cho từng trường, chặn con số model đọc lẫn từ chỗ khác —
      // ví dụ lấy nhầm "gym 200 m2" làm số phòng ngủ.
      bedrooms: num(out.bedrooms, 50),
      bathrooms: num(out.bathrooms, 50),
      internalArea: num(out.internalArea, 100_000),
      landArea: num(out.landArea, 1_000_000),
      floors: num(out.floors, 200),
      yearBuilt: num(out.yearBuilt, new Date().getFullYear() + 5),
      parking: num(out.parking, 100),
      furnishing: pick(out.furnishing, ['full', 'basic', 'none'] as const),
      ownership: pick(out.ownership, ['freehold', 'leasehold'] as const),
    },
    location: {
      address: str(out.address) || null,
      ward: str(out.ward) || null,
      district: str(out.district) || null,
    },
    amenityNames: matched,
    newAmenityNames: unknown,
  };
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
 * `required` PHẢI liệt kê đủ. Để `required: []` cho gọn thì model chỉ trả về
 * mỗi tiếng Anh rồi bỏ tiếng Trung với tiếng Hàn — không lỗi, không cảnh báo.
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
    '- Write natural, persuasive copy as a native agent would. Do not translate word for word.',
    '- Keep every number, price, area and unit exactly as written.',
    '- Write Vietnamese place names in Latin script WITHOUT Vietnamese diacritics — Da Nang, My Khe, Son Tra, An Thuong — in every target language. Never transliterate them into Hangul or Chinese characters.',
  ].join('\n');
}

export type PropertyTranslations = Partial<Record<Locale, PropertyText>>;

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
  })) as Raw;

  const got: PropertyTranslations = {};
  const missing: Locale[] = [];

  for (const locale of targets) {
    const item = textOf((raw[locale] ?? {}) as Raw);

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
    // tiếng Hàn giữ "An Thượng" và bản tiếng Trung dịch "Mỹ Khê" thành 美溪.
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
 * Một lượt gọi cho cả ba, rồi gọi BÙ đúng những ngôn ngữ còn thiếu, tối đa ba
 * vòng. Cần lượt bù vì `required` trong schema của Anthropic chỉ là gợi ý:
 * đã đo — vòng 1 chỉ ra `en`, vòng 2 thêm `zh`, vòng 3 mới có `ko`. Trường hợp
 * tốt vẫn chỉ tốn một lượt.
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

  for (let round = 0; round < 3 && pending.length > 0; round++) {
    const { got, missing } = await askForTranslations(source, from, pending);
    Object.assign(translations, got);

    // Không tiến thêm được thì dừng, gọi tiếp cũng chỉ tốn token.
    if (missing.length === pending.length && Object.keys(got).length === 0) break;
    pending = missing;
  }

  return { translations, failed: pending };
}
