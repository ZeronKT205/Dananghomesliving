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

export const CALLOUT_LABEL: Record<CalloutVariant, string> = {
  note: 'Ghi nhớ',
  tip: 'Mẹo',
  warning: 'Lưu ý',
};

export type ArticleBlock =
  | { type: 'paragraph'; text: string }
  | { type: 'heading'; level: 2 | 3; text: string }
  | { type: 'list'; ordered?: boolean; items: string[] }
  | { type: 'callout'; variant: CalloutVariant; paragraphs: string[] }
  | { type: 'quote'; text: string }
  | { type: 'divider' };

/** JSON Schema cho Gemini. Kiểu viết hoa theo quy ước của Gemini. */
export const BLOCKS_SCHEMA = {
  type: 'OBJECT',
  properties: {
    title: { type: 'STRING' },
    excerpt: { type: 'STRING' },
    tags: { type: 'ARRAY', items: { type: 'STRING' } },
    blocks: {
      type: 'ARRAY',
      items: {
        type: 'OBJECT',
        properties: {
          type: { type: 'STRING', enum: ['paragraph', 'heading', 'list', 'callout', 'quote', 'divider'] },
          text: { type: 'STRING' },
          level: { type: 'INTEGER' },
          ordered: { type: 'BOOLEAN' },
          items: { type: 'ARRAY', items: { type: 'STRING' } },
          variant: { type: 'STRING', enum: ['note', 'tip', 'warning'] },
          paragraphs: { type: 'ARRAY', items: { type: 'STRING' } },
        },
        required: ['type'],
      },
    },
  },
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
 * Cần thiết vì schema JSON chỉ bắt buộc `type`; mọi trường khác đều optional,
 * nên mô hình tự do chọn cách điền. Thực tế nó trả hộp ghi nhớ bằng `text`
 * thay vì `paragraphs` — khối bị bỏ qua lúc dựng HTML trong khi hàm đo vẫn
 * đếm là có, tức số liệu báo cho biên tập bị sai.
 *
 * Chuẩn hoá một lần ở đây, cả render lẫn đo đều dùng kết quả này.
 */
export function normalizeBlocks(input: unknown): ArticleBlock[] {
  if (!Array.isArray(input)) return [];
  const out: ArticleBlock[] = [];

  for (const b of input) {
    if (!b || typeof b !== 'object') continue;
    const raw = b as Record<string, unknown>;
    const text = typeof raw.text === 'string' ? raw.text : '';
    const list = Array.isArray(raw.items) ? raw.items.map(String).filter((i) => i.trim()) : [];
    const paras = Array.isArray(raw.paragraphs) ? raw.paragraphs.map(String).filter((p) => p.trim()) : [];

    switch (raw.type) {
      case 'paragraph':
        if (text.trim()) out.push({ type: 'paragraph', text });
        break;

      case 'heading':
        if (text.trim()) out.push({ type: 'heading', level: raw.level === 3 ? 3 : 2, text });
        break;

      case 'list':
        if (list.length) out.push({ type: 'list', ordered: raw.ordered === true, items: list });
        break;

      case 'callout': {
        // Nhận cả `paragraphs` lẫn `text` — mô hình dùng lẫn lộn hai trường.
        const body = paras.length ? paras : text.trim() ? [text] : [];
        if (body.length) {
          out.push({
            type: 'callout',
            variant: isCalloutVariant(raw.variant) ? raw.variant : 'note',
            paragraphs: body,
          });
        }
        break;
      }

      case 'quote':
        if (text.trim()) out.push({ type: 'quote', text });
        break;

      case 'divider':
        out.push({ type: 'divider' });
        break;
    }
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
        const label = escapeHtml(CALLOUT_LABEL[variant]);
        out.push(
          `<div class="callout" data-variant="${variant}" data-label="${label}">` +
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
