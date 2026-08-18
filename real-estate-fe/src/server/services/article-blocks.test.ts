import { describe, expect, it } from 'vitest';

import {
  applySegments,
  blocksToHtml,
  blocksToSegments,
  htmlToBlocks,
  inspectBlocks,
  normalizeBlocks,
  type ArticleBlock,
} from './article-blocks';

/**
 * Vòng HTML → khối → HTML là xương sống của khâu dịch: model chỉ được đụng vào
 * chữ, còn khung bài do server dựng lại. Nếu vòng này mất mát thì bản dịch mất
 * tiêu đề mục hoặc hộp ghi nhớ mà không ai thấy, nên nó phải có test.
 */

const SAMPLE: ArticleBlock[] = [
  { type: 'paragraph', text: 'Căn hộ **96 m²** nhìn ra biển *My Khe*.' },
  { type: 'heading', level: 2, text: 'Vị trí và pháp lý' },
  { type: 'paragraph', text: 'Xem thêm tại [trang dự án](https://example.com/a?b=1&c=2).' },
  { type: 'list', ordered: false, items: ['Hồ bơi **16 m**', 'Phòng gym **200 m²**'] },
  { type: 'list', ordered: true, items: ['Đặt cọc', 'Ký hợp đồng'] },
  { type: 'callout', variant: 'warning', paragraphs: ['Phí bảo trì **2%** chưa nằm trong giá chào.'] },
  { type: 'heading', level: 3, text: 'Chi tiết nhỏ' },
  { type: 'quote', text: 'Vị trí quyết định giá trị.' },
  { type: 'divider' },
];

describe('vòng HTML ↔ khối', () => {
  it('dựng rồi đọc lại ra đúng khối ban đầu', () => {
    expect(htmlToBlocks(blocksToHtml(SAMPLE))).toEqual(SAMPLE);
  });

  it('dựng lần hai ra HTML y hệt lần đầu', () => {
    const once = blocksToHtml(SAMPLE);
    expect(blocksToHtml(htmlToBlocks(once))).toBe(once);
  });

  it('giữ nguyên số tiêu đề mục, danh sách và hộp ghi nhớ', () => {
    const before = inspectBlocks(SAMPLE);
    const after = inspectBlocks(htmlToBlocks(blocksToHtml(SAMPLE)));
    expect(after).toEqual(before);
  });

  it('giữ nguyên URL và ký tự & trong link', () => {
    const html = blocksToHtml(SAMPLE);
    expect(html).toContain('href="https://example.com/a?b=1&amp;c=2"');
    expect(htmlToBlocks(html)[2]).toEqual(SAMPLE[2]);
  });

  it('bỏ qua thẻ lạ thay vì làm hỏng cả bài', () => {
    const blocks = htmlToBlocks('<p>Giữ lại</p><table><tr><td>bỏ</td></tr></table><h2>Mục</h2>');
    expect(blocks).toEqual([
      { type: 'paragraph', text: 'Giữ lại' },
      { type: 'heading', level: 2, text: 'Mục' },
    ]);
  });
});

describe('tách và ghép đoạn để dịch', () => {
  it('mỗi mục danh sách và mỗi dòng hộp ghi nhớ là một đoạn riêng', () => {
    expect(blocksToSegments(SAMPLE)).toHaveLength(10);
  });

  it('ghép lại đúng vị trí, khung bài không đổi', () => {
    const segments = blocksToSegments(SAMPLE);
    const dich = segments.map((s, i) => `[${i}] ${s}`);
    const applied = applySegments(SAMPLE, dich);

    expect(applied).not.toBeNull();
    expect(inspectBlocks(applied!)).toMatchObject({
      headings: 2,
      lists: 2,
      callouts: 1,
    });
    expect(applied![1]).toEqual({ type: 'heading', level: 2, text: '[1] Vị trí và pháp lý' });
  });

  it('trả null khi model thêm hoặc bớt đoạn', () => {
    const segments = blocksToSegments(SAMPLE);
    expect(applySegments(SAMPLE, segments.slice(1))).toBeNull();
    expect(applySegments(SAMPLE, [...segments, 'thừa'])).toBeNull();
  });
});

describe('chuẩn hoá khối từ AI', () => {
  it('đọc nội dung từ `lines` cho mọi loại khối', () => {
    const blocks = normalizeBlocks([
      { type: 'heading', level: 2, lines: ['Tiêu đề'] },
      { type: 'list', ordered: false, lines: ['a', 'b'] },
      { type: 'callout', variant: 'tip', lines: ['một', 'hai'] },
      { type: 'divider', lines: [] },
    ]);

    expect(blocks).toEqual([
      { type: 'heading', level: 2, text: 'Tiêu đề' },
      { type: 'list', ordered: false, items: ['a', 'b'] },
      { type: 'callout', variant: 'tip', paragraphs: ['một', 'hai'] },
      { type: 'divider' },
    ]);
  });

  it('vẫn nhận `text` / `items` / `paragraphs` của schema cũ', () => {
    const blocks = normalizeBlocks([
      { type: 'paragraph', text: 'đoạn' },
      { type: 'list', items: ['x'] },
      { type: 'callout', variant: 'note', paragraphs: ['y'] },
    ]);

    expect(blocks).toHaveLength(3);
    expect(inspectBlocks(blocks)).toMatchObject({ lists: 1, callouts: 1 });
  });

  it('ép `level` dạng chuỗi về số', () => {
    expect(normalizeBlocks([{ type: 'heading', level: '3', lines: ['x'] }])).toEqual([
      { type: 'heading', level: 3, text: 'x' },
    ]);
  });

  it('bỏ khối trùng liền kề khi model rơi vào vòng lặp', () => {
    const lap = Array.from({ length: 200 }, () => ({ type: 'list', lines: ['Tiện ích nội khu'] }));
    expect(normalizeBlocks(lap)).toHaveLength(1);
  });

  it('không để chữ của model biến thành thẻ thật', () => {
    const html = blocksToHtml(normalizeBlocks([{ type: 'paragraph', lines: ['<script>alert(1)</script>'] }]));
    expect(html).toBe('<p>&lt;script&gt;alert(1)&lt;/script&gt;</p>');
  });
});
