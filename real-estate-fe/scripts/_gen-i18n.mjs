/**
 * Sinh messages/zh.json và messages/ko.json từ en.json.
 *
 * Dịch TỪNG namespace một: nhồi cả file vào một lượt thì model bỏ sót khoá mà
 * không báo gì (đã gặp đúng lỗi này khi dịch tin BĐS). Mỗi namespace là một
 * lượt nhỏ, và script kiểm lại đủ khoá trước khi ghi.
 *
 *   node scripts/_gen-i18n.mjs <port>
 */
import { readFileSync, writeFileSync } from 'node:fs';

const PORT = process.argv[2] ?? '3000';
const en = JSON.parse(readFileSync('messages/en.json', 'utf8'));

const TARGETS = [
  { lang: 'zh', langName: 'Simplified Chinese' },
  { lang: 'ko', langName: 'Korean' },
];

for (const { lang, langName } of TARGETS) {
  const out = {};

  for (const [ns, entries] of Object.entries(en)) {
    let attempt = 0;
    let result = null;

    while (attempt < 2 && !result) {
      attempt++;
      const res = await fetch(`http://localhost:${PORT}/api/i18ngen`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ source: entries, lang, langName }),
      });

      if (!res.ok) {
        process.stdout.write(`  ${lang}/${ns}: HTTP ${res.status}, thu lai\n`);
        continue;
      }

      const body = await res.json();
      if (body.missing?.length) {
        process.stdout.write(`  ${lang}/${ns}: thieu ${body.missing.join(',')}, thu lai\n`);
        continue;
      }
      result = body.translations;
    }

    if (!result) {
      process.stdout.write(`  ${lang}/${ns}: BO QUA, giu nguyen tieng Anh\n`);
      result = entries;
    }

    out[ns] = result;
    process.stdout.write(`  ${lang}/${ns}: ${Object.keys(result).length} khoa\n`);
  }

  writeFileSync(`messages/${lang}.json`, JSON.stringify(out, null, 2) + '\n', 'utf8');
  process.stdout.write(`da ghi messages/${lang}.json\n`);
}
