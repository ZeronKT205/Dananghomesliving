import { NextResponse } from 'next/server';

import { callAi } from '@/server/services/ai-client';
import { normalizePlaceNames, stripVietnameseDiacritics } from '@/server/services/translation-service';

export const maxDuration = 300;

/**
 * Sinh bản dịch giao diện cho một namespace.
 *
 * Route tạm dùng một lần khi dựng bộ từ điển — dịch từng namespace để mỗi lượt
 * gọi nhỏ, model không bỏ sót khoá như khi nhồi cả file.
 */
export async function POST(req: Request) {
  const { source, lang, langName } = (await req.json()) as {
    source: Record<string, string>;
    lang: string;
    langName: string;
  };

  const keys = Object.keys(source);

  const schema = {
    type: 'OBJECT',
    properties: Object.fromEntries(keys.map((k) => [k, { type: 'STRING' }])),
    required: keys,
  };

  const out = (await callAi({
    system: [
      `You translate website UI strings for a Da Nang luxury real-estate agency into ${langName}.`,
      '',
      `Return ALL ${keys.length} keys. Every key is required.`,
      '- Translate the VALUES only. Never change or translate the keys.',
      '- These are interface labels: buttons, headings, placeholders. Keep them short and idiomatic, the way a native site would word them. Do not translate literally.',
      '- Keep placeholders like {count}, {seconds}, {minutes} and tags like <gold>…</gold> or <code>…</code> exactly as they are, in the same position relative to the surrounding words.',
      '- Keep the brand name "Da Nang Homes & Living" unchanged.',
      '- Write Vietnamese place names in Latin script without diacritics: Da Nang, My Khe, Son Tra, Ngu Hanh Son, An Thuong. Never transliterate them into Hangul or Chinese characters.',
      '- Keep punctuation style natural for the target language.',
    ].join('\n'),
    user: JSON.stringify(source),
    schema,
    label: `dịch giao diện sang ${langName}`,
    maxOutputTokens: 8_000,
    timeoutMs: 180_000,
  })) as Record<string, string>;

  // Ép quy tắc tên riêng bằng code, giống mọi đường dịch khác trong dự án.
  const clean = Object.fromEntries(
    keys.map((k) => [k, normalizePlaceNames(stripVietnameseDiacritics(String(out[k] ?? source[k] ?? '')))]),
  );

  const missing = keys.filter((k) => !out[k]);
  return NextResponse.json({ lang, translations: clean, missing });
}
