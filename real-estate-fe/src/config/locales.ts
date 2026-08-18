// Nguồn sự thật DUY NHẤT về danh sách locale.
// File này cố tình không import gì cả để cả server, client, Edge middleware và
// script Node đều dùng được. `i18n/routing.ts` import lại từ đây thay vì khai
// trùng — khai hai nơi thì sớm muộn lệch nhau.
export const LOCALES = ['en', 'vi', 'zh', 'ko'] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = 'en';

export function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && (LOCALES as readonly string[]).includes(value);
}

/**
 * Chọn nội dung theo locale, có fallback nhiều tầng.
 * Trường dịch được luôn có thể rỗng ở một số ngôn ngữ (biên tập viên chưa dịch),
 * nên KHÔNG bao giờ đọc thẳng `field[locale]` — dùng hàm này.
 *
 * Thứ tự: locale yêu cầu → DEFAULT_LOCALE → locale bất kỳ có nội dung → fallback.
 */
export function pickLocale<T>(
  field: Partial<Record<Locale, T>> | null | undefined,
  locale: Locale,
  fallback: T,
): T {
  if (!field) return fallback;

  const exact = field[locale];
  if (exact !== undefined && exact !== null && exact !== '') return exact;

  const def = field[DEFAULT_LOCALE];
  if (def !== undefined && def !== null && def !== '') return def;

  for (const l of LOCALES) {
    const v = field[l];
    if (v !== undefined && v !== null && v !== '') return v;
  }

  return fallback;
}
