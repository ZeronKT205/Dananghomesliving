/**
 * Chuyển nội dung bài viết từ Markdown sang HTML — CHẠY MỘT LẦN.
 *
 * Bối cảnh: trước đây trình soạn thảo lưu Markdown và trang public tự tách
 * chuỗi ra để render. Giờ CMS dùng trình soạn thảo WYSIWYG, lưu thẳng HTML, và
 * trang public render bằng `dangerouslySetInnerHTML` trong khối `.article-body`.
 * Những bài lưu từ trước vì thế hiện ra nguyên dấu `##`, `**`.
 *
 * Script chỉ đụng vào bài mà nội dung KHÔNG bắt đầu bằng thẻ khối — bài đã là
 * HTML được bỏ qua, nên chạy lại nhiều lần vẫn an toàn.
 *
 * Bộ chuyển ở đây cố ý viết lại thay vì import `src/server/services/article-blocks.ts`:
 * file đó có `import 'server-only'` nên Node thuần không nạp được, và đây là
 * việc dùng một lần rồi thôi.
 *
 *   node --env-file=.env.local scripts/migrate-articles-html.mjs          # xem trước
 *   node --env-file=.env.local scripts/migrate-articles-html.mjs --apply  # ghi thật
 */

import { MongoClient } from 'mongodb';

const URI = process.env.MONGODB_URI;
const DB = process.env.MONGODB_DB;
const APPLY = process.argv.includes('--apply');

if (!URI || !DB) {
  console.error('Thieu MONGODB_URI hoac MONGODB_DB — chay kem --env-file=.env.local');
  process.exit(1);
}

const CALLOUT_LABEL = { note: 'Ghi nhớ', tip: 'Mẹo', warning: 'Lưu ý' };

const escapeHtml = (s) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** Escape TRƯỚC, đổi dấu SAU — chữ trong bài không thể biến thành thẻ thật. */
function inline(raw) {
  let s = escapeHtml(raw.trim());
  s = s.replace(
    /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g,
    (_m, label, href) => `<a href="${href}" rel="noreferrer noopener">${label}</a>`,
  );
  s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  s = s.replace(/(^|[^*])\*([^*]+)\*(?!\*)/g, '$1<em>$2</em>');
  return s;
}

/**
 * Markdown → HTML đúng schema trình soạn thảo (h2/h3, p, ul/ol, blockquote, hr,
 * div.callout). `dropHeading` là tiêu đề bài: seed cũ lặp lại tiêu đề bằng `## `
 * ngay dòng đầu, mà trang đã render tiêu đề thành `<h1>` rồi — giữ lại là lặp.
 */
function markdownToHtml(md, dropHeading = '') {
  const out = [];
  const lines = md.replace(/\r\n/g, '\n').split('\n');
  let i = 0;

  const flushList = (ordered) => {
    const items = [];
    const re = ordered ? /^\s*\d+[.)]\s+(.*)$/ : /^\s*[-*+]\s+(.*)$/;
    while (i < lines.length) {
      const m = lines[i].match(re);
      if (!m) break;
      items.push(inline(m[1]));
      i++;
    }
    if (items.length) {
      const tag = ordered ? 'ol' : 'ul';
      out.push(`<${tag}>${items.map((t) => `<li><p>${t}</p></li>`).join('')}</${tag}>`);
    }
  };

  while (i < lines.length) {
    const line = lines[i];

    if (!line.trim()) {
      i++;
      continue;
    }

    if (/^\s*(---|\*\*\*|___)\s*$/.test(line)) {
      out.push('<hr>');
      i++;
      continue;
    }

    const h = line.match(/^\s*(#{1,6})\s+(.*)$/);
    if (h) {
      const text = h[2].trim();
      i++;
      // Bỏ dòng tiêu đề trùng tên bài, kể cả khi nó là h1.
      if (dropHeading && text.toLowerCase() === dropHeading.trim().toLowerCase()) continue;
      const level = h[1].length >= 3 ? 3 : 2;
      out.push(`<h${level}>${inline(text)}</h${level}>`);
      continue;
    }

    if (/^\s*[-*+]\s+/.test(line)) {
      flushList(false);
      continue;
    }
    if (/^\s*\d+[.)]\s+/.test(line)) {
      flushList(true);
      continue;
    }

    if (/^\s*>\s?/.test(line)) {
      const parts = [];
      while (i < lines.length && /^\s*>\s?/.test(lines[i])) {
        parts.push(lines[i].replace(/^\s*>\s?/, ''));
        i++;
      }
      out.push(`<blockquote><p>${inline(parts.join(' '))}</p></blockquote>`);
      continue;
    }

    // Đoạn văn: gom các dòng liền nhau tới khi gặp dòng trống hoặc khối khác.
    const para = [];
    while (i < lines.length && lines[i].trim() && !/^\s*(#{1,6}\s|[-*+]\s|\d+[.)]\s|>|---|\*\*\*|___)/.test(lines[i])) {
      para.push(lines[i].trim());
      i++;
    }
    const t = inline(para.join(' '));
    if (t) out.push(`<p>${t}</p>`);
  }

  return out.join('');
}

const isHtml = (v) => /^\s*<(p|h2|h3|ul|ol|div|blockquote|hr)\b/i.test(v);

const client = new MongoClient(URI);

try {
  await client.connect();
  const db = client.db(DB);
  const articles = db.collection('articles');

  const docs = await articles.find({}).project({ slug: 1, title: 1, content: 1 }).toArray();
  console.log(`Ket noi OK -> ${DB}. Tong ${docs.length} bai.\n`);

  let changed = 0;

  for (const d of docs) {
    const next = {};
    const notes = [];

    for (const [loc, val] of Object.entries(d.content ?? {})) {
      const v = String(val ?? '');
      if (!v.trim()) continue;
      if (isHtml(v)) {
        notes.push(`${loc}: da la HTML, bo qua`);
        continue;
      }
      const html = markdownToHtml(v, d.title?.[loc] ?? '');
      if (!html) {
        notes.push(`${loc}: chuyen ra rong, bo qua`);
        continue;
      }
      next[`content.${loc}`] = html;
      notes.push(`${loc}: ${v.length} ky tu Markdown -> ${html.length} ky tu HTML`);
    }

    if (Object.keys(next).length === 0) {
      console.log(`- ${d.slug}: khong can doi (${notes.join('; ') || 'khong co noi dung'})`);
      continue;
    }

    console.log(`* ${d.slug}: ${notes.join('; ')}`);
    // In thử một đoạn để soát bằng mắt trước khi ghi.
    console.log(`    ${String(Object.values(next)[0]).slice(0, 120)}…`);

    if (APPLY) {
      await articles.updateOne({ _id: d._id }, { $set: { ...next, updatedAt: new Date() } });
    }
    changed++;
  }

  console.log(
    `\n${changed} bai ${APPLY ? 'da doi.' : 'se doi. Chay lai kem --apply de ghi that.'}`,
  );
} finally {
  await client.close();
}
