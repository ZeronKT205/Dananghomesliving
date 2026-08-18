import 'server-only';

/**
 * Khối nội dung bài viết — hợp đồng giữa AI và trình soạn thảo.
 *
 * AI trả JSON có cấu trúc, KHÔNG trả HTML. Server tự dựng HTML từ đó.
 *
 * Lý do đổi khỏi cách cũ (bắt AI viết HTML):
 *  1. AI viết HTML thì thỉnh thoảng vẫn lọt thẻ ngoài schema của TipTap, và
 *     TipTap bỏ node lạ IM LẶNG — biên tập mất nội dung không hay biết.
 *  2. Mọi chữ từ AI ở đây đều được escape trước khi ghép vào HTML, nên đầu ra
 *     không thể chứa thẻ do mô hình bịa ra. Model là nguồn dữ liệu, không phải
 *     nguồn markup.
 *  3. Kiểm tra được chất lượng bằng code: đếm số mục, bắt buộc có hộp ghi nhớ,
 *     đo độ dài — những thứ không làm được khi đầu ra là một chuỗi HTML.
 */

export type CalloutVariant = 'note' | 'tip' | 'warning';

export type ArticleBlock =
  | { type: 'paragraph'; text: string }
  | { type: 'heading'; level: 2 | 3; text: string }
  | { type: 'list'; ordered?: boolean; items: string[] }
  | { type: 'callout'; variant: CalloutVariant; paragraphs: string[] }
  | { type: 'quote'; text: string }
  | { type: 'divider' };

/**
 * JSON Schema cho Gemini. Kiểu viết hoa theo quy ước của Gemini.
 *
 * MỌI loại khối dùng CHUNG một trường nội dung là `lines` (mảng chuỗi):
 *   paragraph → 1 dòng      heading → 1 dòng      quote → 1 dòng
 *   list      → mỗi mục 1 dòng                    callout → mỗi đoạn 1 dòng
 *   divider   → mảng rỗng
 *
 * Trước đây mỗi loại có trường riêng (`text` / `items` / `paragraphs`) nhưng
 * tất cả đều optional trong cùng một object. Model không biết loại nào dùng
 * trường nào, sinh ra `{"type":"list","text":"Tiện ích nội khu"}` — khối rỗng
 * theo nghĩa của bộ dựng — rồi LẶP nguyên khối đó hàng trăm lần cho tới khi
 * chạm trần token; đo được 60.721 ký tự JSON đứt đoạn. Một trường duy nhất thì
 * không còn gì để chọn sai.
 *
 * KHÔNG đặt `minItems`/`maxItems` cho `blocks`: đã đo, Gemini trả 400 khi mảng
 * OBJECT có giới hạn số phần tử (mảng STRING như `tags` thì lại chấp nhận).
 * Chốt chặn vòng lặp nằm ở `normalizeBlocks` — bỏ khối trùng liền kề và cắt
 * trần số khối.
 */
export const BLOCKS_SCHEMA = {
  type: 'OBJECT',
  properties: {
    title: { type: 'STRING' },
    excerpt: { type: 'STRING' },
    tags: { type: 'ARRAY', items: { type: 'STRING' }, minItems: 4, maxItems: 6 },
    blocks: {
      type: 'ARRAY',
      items: {
        type: 'OBJECT',
        properties: {
          type: { type: 'STRING', enum: ['paragraph', 'heading', 'list', 'callout', 'quote', 'divider'] },
          lines: { type: 'ARRAY', items: { type: 'STRING' } },
          // KHÔNG đặt `enum` ở đây: Gemini trả 400 khi một trường INTEGER
          // optional có enum. `normalizeBlocks` tự ép về 2 hoặc 3.
          level: { type: 'INTEGER' },
          ordered: { type: 'BOOLEAN' },
          variant: { type: 'STRING', enum: ['note', 'tip', 'warning'] },
        },
        propertyOrdering: ['type', 'level', 'ordered', 'variant', 'lines'],
        required: ['type', 'lines'],
      },
    },
  },
  propertyOrdering: ['title', 'excerpt', 'tags', 'blocks'],
  required: ['title', 'excerpt', 'tags', 'blocks'],
} as const;

/* ── Dựng HTML ────────────────────────────────────────── */

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * Chuyển đánh dấu inline sang thẻ.
 *
 * Escape TRƯỚC, thay dấu SAU — nên `<script>` trong chữ của AI thành
 * `&lt;script&gt;` chứ không bao giờ thành thẻ thật. Chỉ ba loại được phép:
 * **đậm**, *nghiêng*, [chữ](https://link).
 */
function inline(raw: string): string {
  let s = escapeHtml(raw.trim());

  // Link trước, vì cú pháp của nó chứa dấu * có thể đụng luật đậm/nghiêng.
  s = s.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, (_m, label: string, href: string) => {
    // href đã qua escapeHtml nên &quot; không thể phá thuộc tính.
    return `<a href="${href}" rel="noreferrer noopener">${label}</a>`;
  });

  s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  s = s.replace(/(^|[^*])\*([^*]+)\*(?!\*)/g, '$1<em>$2</em>');

  return s;
}

function isCalloutVariant(v: unknown): v is CalloutVariant {
  return v === 'note' || v === 'tip' || v === 'warning';
}

/**
 * Chuẩn hoá khối về đúng một hình dạng trước khi dựng HTML hoặc đo.
 *
 * Đọc `lines` — trường nội dung duy nhất trong schema hiện tại — nhưng vẫn
 * nhận `text` / `items` / `paragraphs` của schema cũ, vì bản nháp lưu trước khi
 * đổi vẫn có thể quay lại qua đường thử lại.
 *
 * Bỏ khối trùng liền kề: khi model rơi vào vòng lặp nó phát lại y nguyên một
 * khối, và phần đầu của chuỗi lặp vẫn hợp lệ nên không có gì chặn được nó
 * ngoài chỗ này.
 */
export function normalizeBlocks(input: unknown): ArticleBlock[] {
  if (!Array.isArray(input)) return [];
  const out: ArticleBlock[] = [];
  let previousKey = '';

  // Bài dài nhất theo prompt là ~24 khối. Trần này chỉ để chặn trường hợp model
  // lặp vô hạn mà lần nào cũng đổi một chữ nên qua được bộ lọc trùng bên dưới.
  const MAX_BLOCKS = 60;

  for (const b of input) {
    if (out.length >= MAX_BLOCKS) break;
    if (!b || typeof b !== 'object') continue;
    const raw = b as Record<string, unknown>;

    const asLines = (v: unknown): string[] =>
      Array.isArray(v) ? v.map(String).filter((x) => x.trim()) : [];

    // `lines` trước, rồi mới tới các trường của schema cũ.
    const lines = asLines(raw.lines);
    const legacyText = typeof raw.text === 'string' && raw.text.trim() ? [raw.text] : [];
    const body = lines.length
      ? lines
      : asLines(raw.items).length
        ? asLines(raw.items)
        : asLines(raw.paragraphs).length
          ? asLines(raw.paragraphs)
          : legacyText;

    let block: ArticleBlock | null = null;

    switch (raw.type) {
      case 'paragraph':
        // Nhiều dòng trong một `paragraph` là nhiều đoạn — nối lại thành một
        // đoạn thì mất nhịp xuống dòng của bài.
        if (body.length) block = { type: 'paragraph', text: body.join(' ') };
        break;

      case 'heading':
        if (body.length) {
          // `level` có thể về dạng chuỗi '2' vì enum của Gemini là chuỗi.
          block = { type: 'heading', level: Number(raw.level) === 3 ? 3 : 2, text: body[0]! };
        }
        break;

      case 'list':
        if (body.length) block = { type: 'list', ordered: raw.ordered === true, items: body };
        break;

      case 'callout':
        if (body.length) {
          block = {
            type: 'callout',
            variant: isCalloutVariant(raw.variant) ? raw.variant : 'note',
            paragraphs: body,
          };
        }
        break;

      case 'quote':
        if (body.length) block = { type: 'quote', text: body.join(' ') };
        break;

      case 'divider':
        block = { type: 'divider' };
        break;
    }

    if (!block) continue;

    const key = JSON.stringify(block);
    if (key === previousKey) continue;
    previousKey = key;
    out.push(block);
  }

  return out;
}

/** Blocks → HTML đúng schema của trình soạn thảo. */
export function blocksToHtml(blocks: ArticleBlock[]): string {
  const out: string[] = [];

  for (const b of blocks) {
    if (!b || typeof b !== 'object') continue;

    switch (b.type) {
      case 'paragraph': {
        const t = inline(b.text ?? '');
        if (t) out.push(`<p>${t}</p>`);
        break;
      }

      case 'heading': {
        const t = inline(b.text ?? '');
        if (!t) break;
        // Chỉ h2/h3. h1 là tiêu đề bài do trang render; h4+ không có trong schema.
        const level = b.level === 3 ? 3 : 2;
        out.push(`<h${level}>${t}</h${level}>`);
        break;
      }

      case 'list': {
        const items = (b.items ?? []).map((i) => inline(i)).filter(Boolean);
        if (!items.length) break;
        const tag = b.ordered ? 'ol' : 'ul';
        out.push(`<${tag}>${items.map((i) => `<li><p>${i}</p></li>`).join('')}</${tag}>`);
        break;
      }

      case 'callout': {
        const paras = (b.paragraphs ?? []).map((p) => inline(p)).filter(Boolean);
        if (!paras.length) break;
        const variant = isCalloutVariant(b.variant) ? b.variant : 'note';
        // Không ghi nhãn vào HTML: CSS sinh nhãn từ `data-variant` theo ngôn
        // ngữ trang, nên bản dịch không bị dính chữ Việt.
        out.push(
          `<div class="callout" data-variant="${variant}">` +
            paras.map((p) => `<p>${p}</p>`).join('') +
            `</div>`,
        );
        break;
      }

      case 'quote': {
        const t = inline(b.text ?? '');
        if (t) out.push(`<blockquote><p>${t}</p></blockquote>`);
        break;
      }

      case 'divider':
        out.push('<hr>');
        break;
    }
  }

  return out.join('');
}

/* ── Đo chất lượng ────────────────────────────────────── */

export interface BlocksReport {
  words: number;
  headings: number;
  callouts: number;
  lists: number;
  bold: number;
}

/** Đo bài để biết có đủ dày và đủ định dạng không. */
export function inspectBlocks(blocks: ArticleBlock[]): BlocksReport {
  let words = 0;
  let bold = 0;
  let headings = 0;
  let callouts = 0;
  let lists = 0;

  const count = (s: string) => {
    words += s.split(/\s+/).filter(Boolean).length;
    bold += (s.match(/\*\*[^*]+\*\*/g) ?? []).length;
  };

  for (const b of blocks) {
    if (!b || typeof b !== 'object') continue;
    if (b.type === 'paragraph' || b.type === 'quote') count(b.text ?? '');
    else if (b.type === 'heading') {
      headings++;
      count(b.text ?? '');
    } else if (b.type === 'list') {
      lists++;
      (b.items ?? []).forEach(count);
    } else if (b.type === 'callout') {
      callouts++;
      (b.paragraphs ?? []).forEach(count);
    }
  }

  return { words, headings, callouts, lists, bold };
}

/* ── HTML → khối (đường ngược) ─────────────────────────── */

const UNESCAPE: Record<string, string> = {
  '&amp;': '&',
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&#39;': "'",
  '&apos;': "'",
  '&nbsp;': ' ',
};

/**
 * HTML nội tuyến → đánh dấu văn bản.
 *
 * Đúng nghịch đảo của `inline()`: `<strong>` → `**`, `<em>` → `*`,
 * `<a href>` → `[chữ](link)`, thẻ khác bỏ đi, thực thể trả về ký tự thường.
 */
function inlineToText(html: string): string {
  let s = html;

  s = s.replace(/<a\b[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/gi, (_m, href: string, label: string) => {
    const text = inlineToText(label);
    return href ? `[${text}](${href})` : text;
  });
  s = s.replace(/<(strong|b)\b[^>]*>([\s\S]*?)<\/\1>/gi, (_m, _t, inner: string) => `**${inlineToText(inner)}**`);
  s = s.replace(/<(em|i)\b[^>]*>([\s\S]*?)<\/\1>/gi, (_m, _t, inner: string) => `*${inlineToText(inner)}*`);
  s = s.replace(/<br\s*\/?>/gi, ' ');
  s = s.replace(/<[^>]+>/g, '');
  s = s.replace(/&(?:amp|lt|gt|quot|#39|apos|nbsp);/g, (m) => UNESCAPE[m] ?? m);

  return s.replace(/\s+/g, ' ').trim();
}

/**
 * Lấy phần trong của mọi `<p>…</p>` hoặc `<li>…</li>`.
 *
 * Dùng biểu thức viết thẳng thay vì ghép chuỗi cho `new RegExp`: trong chuỗi
 * mẫu thì `\b` là ký tự backspace và `[\s\S]` thành `[sS]`, nên phải nhân đôi
 * dấu chéo ngược mới đúng. Cái bẫy đó đã sập một lần và làm MỌI danh sách biến
 * mất khỏi bản dịch mà không báo lỗi gì. Biểu thức viết thẳng thì không có gì
 * để escape sai.
 */
const INNER_SOURCE: Record<'p' | 'li', RegExp> = {
  p: /<p\b[^>]*>([\s\S]*?)<\/p>/gi,
  li: /<li\b[^>]*>([\s\S]*?)<\/li>/gi,
};

function innerOf(html: string, tag: 'p' | 'li'): string[] {
  // Bản sao mỗi lần gọi: `lastIndex` dùng chung sẽ làm lần sau bỏ sót.
  const re = new RegExp(INNER_SOURCE[tag].source, 'gi');
  return [...html.matchAll(re)].map((m) => m[1] ?? '');
}

/**
 * HTML của bài → khối.
 *
 * Chỉ hiểu đúng tập thẻ mà trình soạn thảo sinh ra (xem `blocksToHtml`), và đó
 * là toàn bộ những gì có thể lọt qua `sanitizeArticleHtml`. Thẻ lạ bị bỏ qua
 * thay vì báo lỗi — mất định dạng còn hơn mất bài.
 *
 * Dùng cho khâu dịch: bóc chữ ra khỏi khung, dịch chữ, rồi server tự dựng lại
 * khung. Trước đây bắt model chép nguyên HTML sang bản dịch, và đã đo được lần
 * nó trả về `2&gt;` thay cho `<h2>` — cả năm tiêu đề mục biến mất mà không ai
 * hay. Model không đụng vào thẻ nữa thì không thể làm hỏng thẻ.
 */
export function htmlToBlocks(html: string): ArticleBlock[] {
  const out: ArticleBlock[] = [];

  // Quét tuần tự các khối cấp ngoài cùng. `[\s\S]*?` không tham lam nên dừng ở
  // thẻ đóng gần nhất; callout và danh sách được bóc riêng bằng `innerOf`.
  const re =
    /<div\b[^>]*class="callout"[^>]*>([\s\S]*?)<\/div>|<(h2|h3)\b[^>]*>([\s\S]*?)<\/\2>|<(ul|ol)\b[^>]*>([\s\S]*?)<\/\4>|<blockquote\b[^>]*>([\s\S]*?)<\/blockquote>|<hr\s*\/?>|<p\b[^>]*>([\s\S]*?)<\/p>/gi;

  for (const m of html.matchAll(re)) {
    const [full, calloutInner, hTag, hInner, listTag, listInner, quoteInner, pInner] = m;

    if (calloutInner !== undefined) {
      const variantMatch = full.match(/data-variant="(note|tip|warning)"/i);
      const paragraphs = innerOf(calloutInner, 'p').map(inlineToText).filter(Boolean);
      const body = paragraphs.length ? paragraphs : [inlineToText(calloutInner)].filter(Boolean);
      if (body.length) {
        out.push({
          type: 'callout',
          variant: (variantMatch?.[1]?.toLowerCase() as CalloutVariant) ?? 'note',
          paragraphs: body,
        });
      }
      continue;
    }

    if (hInner !== undefined) {
      const text = inlineToText(hInner);
      if (text) out.push({ type: 'heading', level: hTag?.toLowerCase() === 'h3' ? 3 : 2, text });
      continue;
    }

    if (listInner !== undefined) {
      const items = innerOf(listInner, 'li').map(inlineToText).filter(Boolean);
      if (items.length) out.push({ type: 'list', ordered: listTag?.toLowerCase() === 'ol', items });
      continue;
    }

    if (quoteInner !== undefined) {
      const text = inlineToText(quoteInner);
      if (text) out.push({ type: 'quote', text });
      continue;
    }

    if (pInner !== undefined) {
      const text = inlineToText(pInner);
      if (text) out.push({ type: 'paragraph', text });
      continue;
    }

    out.push({ type: 'divider' });
  }

  return out;
}

/* ── Tách / ghép chuỗi để dịch ─────────────────────────── */

/**
 * Rút mọi chuỗi cần dịch, theo đúng thứ tự đọc.
 *
 * Một khối có thể cho nhiều chuỗi (mỗi mục danh sách, mỗi đoạn trong hộp ghi
 * nhớ là một chuỗi riêng) để model dịch trọn câu — cắt nhỏ hơn nữa, ví dụ tách
 * quanh `<strong>`, thì tiếng Hàn và tiếng Trung sẽ sai trật tự từ.
 */
export function blocksToSegments(blocks: ArticleBlock[]): string[] {
  const out: string[] = [];
  for (const b of blocks) {
    if (b.type === 'paragraph' || b.type === 'heading' || b.type === 'quote') out.push(b.text);
    else if (b.type === 'list') out.push(...b.items);
    else if (b.type === 'callout') out.push(...b.paragraphs);
  }
  return out;
}

/**
 * Ghép chuỗi đã dịch trở lại đúng vị trí cũ.
 *
 * Trả `null` khi số chuỗi không khớp — nghĩa là model đã thêm hoặc bớt đoạn, và
 * ghép theo chỉ số lúc đó sẽ trộn lẫn nội dung. Thà báo hỏng một ngôn ngữ còn
 * hơn lặng lẽ cho ra bài sai chỗ.
 */
export function applySegments(blocks: ArticleBlock[], segments: string[]): ArticleBlock[] | null {
  if (segments.length !== blocksToSegments(blocks).length) return null;

  let i = 0;
  const take = () => segments[i++] ?? '';

  return blocks.map((b) => {
    switch (b.type) {
      case 'paragraph':
        return { ...b, text: take() };
      case 'heading':
        return { ...b, text: take() };
      case 'quote':
        return { ...b, text: take() };
      case 'list':
        return { ...b, items: b.items.map(() => take()) };
      case 'callout':
        return { ...b, paragraphs: b.paragraphs.map(() => take()) };
      default:
        return b;
    }
  });
}
