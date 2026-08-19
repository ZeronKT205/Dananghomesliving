/**
 * Sinh messages/zh.json và messages/ko.json từ en.json.
 *
 * Chạy lại mỗi khi thêm khoá mới vào `messages/en.json`:
 *   node --env-file=.env.local scripts/gen-i18n.mjs
 *
 * Gọi THẲNG API Anthropic, KHÔNG qua dev server. Lần đầu làm qua một route tạm
 * thì Next liên tục biên dịch lại — vì chính script này ghi vào `messages/`,
 * thư mục Next đang theo dõi — và route bị xoá giữa chừng, hàng loạt 404/500.
 *
 * Dịch TỪNG namespace một: nhồi cả file vào một lượt thì model bỏ sót khoá mà
 * không báo gì.
 */
import { readFileSync, writeFileSync } from 'node:fs';

const KEY = process.env.ANTHROPIC_API_KEY;
const MODEL = process.env.ANTHROPIC_MODEL ?? 'claude-haiku-4-5-20251001';

if (!KEY) {
  console.error('Thieu ANTHROPIC_API_KEY — chay kem --env-file=.env.local');
  process.exit(1);
}

const en = JSON.parse(readFileSync('messages/en.json', 'utf8'));

/*
 * `script` là biểu thức nhận diện chữ viết của ngôn ngữ đích.
 *
 * Bắt buộc phải kiểm: đã đo — model dịch cả một namespace sang TIẾNG VIỆT khi
 * đang làm bản tiếng Hàn, không lỗi gì cả, và nhìn file JSON thì không ai để ý.
 */
const TARGETS = [
  { lang: 'zh', langName: 'Simplified Chinese', script: /[一-鿿]/ },
  { lang: 'ko', langName: 'Korean', script: /[가-힯]/ },
];

const SYSTEM = (langName, count) =>
  [
    `You translate website UI strings for a Da Nang luxury real-estate agency into ${langName}.`,
    '',
    `Return ALL ${count} keys. Every key is required.`,
    '- Translate the VALUES only. Never change or translate the keys.',
    '- These are interface labels: buttons, headings, placeholders. Keep them short and idiomatic, the way a native site would word them. Do not translate literally.',
    '- Keep placeholders like {count}, {name}, {phone}, {seconds}, {minutes} and tags like <gold>…</gold> or <code>…</code> exactly as they are, in the same position relative to the surrounding words.',
    '- Keep the brand name "Da Nang Homes & Living" unchanged.',
    '- Write Vietnamese place names in Latin script without diacritics: Da Nang, My Khe, Son Tra, Ngu Hanh Son, An Thuong. Never transliterate them into Hangul or Chinese characters.',
  ].join('\n');

async function translateNamespace(entries, langName, script) {
  const keys = Object.keys(entries);

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': KEY,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 8000,
      system: SYSTEM(langName, keys.length),
      messages: [{ role: 'user', content: JSON.stringify(entries) }],
      tools: [
        {
          name: 'tra_ve_ban_dich',
          description: 'Tra ve ban dich cho tung khoa.',
          input_schema: {
            type: 'object',
            properties: Object.fromEntries(keys.map((k) => [k, { type: 'string' }])),
            required: keys,
          },
        },
      ],
      tool_choice: { type: 'tool', name: 'tra_ve_ban_dich' },
    }),
  });

  if (!res.ok) throw new Error(`HTTP ${res.status}: ${(await res.text()).slice(0, 160)}`);

  const body = await res.json();
  const use = body.content?.find((c) => c.type === 'tool_use');
  if (!use?.input) throw new Error(`khong co ket qua (${body.stop_reason})`);

  const missing = keys.filter((k) => !use.input[k]);
  if (missing.length) throw new Error(`thieu khoa: ${missing.join(',')}`);

  const out = Object.fromEntries(keys.map((k) => [k, String(use.input[k])]));

  /*
   * Ít nhất một nửa số giá trị phải mang chữ viết của ngôn ngữ đích.
   *
   * Không đòi 100%: vài khoá là tên riêng hoặc viết tắt ("Da Nang Homes",
   * "bd"/"ba", "WhatsApp") thì giữ Latin mới đúng. Nhưng cả namespace không có
   * chữ nào của ngôn ngữ đích thì chắc chắn model dịch nhầm ngôn ngữ.
   */
  const hits = Object.values(out).filter((v) => script.test(v)).length;
  if (hits < keys.length / 2) {
    throw new Error(`dich sai ngon ngu (chi ${hits}/${keys.length} co chu ${langName})`);
  }

  return out;
}

for (const { lang, langName, script } of TARGETS) {
  const out = {};

  for (const [ns, entries] of Object.entries(en)) {
    let result = null;

    for (let attempt = 1; attempt <= 3 && !result; attempt++) {
      try {
        result = await translateNamespace(entries, langName, script);
      } catch (err) {
        process.stdout.write(`  ${lang}/${ns}: lan ${attempt} hong — ${err.message}\n`);
        // Chờ tăng dần: lỗi hay gặp là chạm giới hạn tần suất.
        if (attempt < 3) await new Promise((r) => setTimeout(r, 1500 * attempt));
      }
    }

    if (!result) {
      process.stdout.write(`  ${lang}/${ns}: BO QUA, giu tieng Anh\n`);
      result = entries;
    }
    out[ns] = result;
  }

  writeFileSync(`messages/${lang}.json`, JSON.stringify(out, null, 2) + '\n', 'utf8');
  process.stdout.write(`da ghi messages/${lang}.json\n`);
}
