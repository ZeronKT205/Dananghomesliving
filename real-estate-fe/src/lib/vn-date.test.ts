import { describe, expect, it } from 'vitest';

import { vnDateKey, vnDayRange, vnStartOfDay } from './vn-date';

/**
 * Lỗi từng gặp: khoá ngày dựng theo UTC trong khi Mongo gom nhóm theo giờ VN,
 * nên biểu đồ 7 ngày ở trang tổng quan luôn bằng 0. Các test này khoá lại đúng
 * ranh giới ngày — chỗ duy nhất có thể sai.
 */
describe('ngày theo giờ Việt Nam', () => {
  it('23:30 giờ VN vẫn là ngày hôm đó, không nhảy sang hôm sau', () => {
    // 16:30 UTC = 23:30 VN cùng ngày.
    expect(vnDateKey(new Date('2026-08-18T16:30:00Z'))).toBe('2026-08-18');
  });

  it('00:30 giờ VN thuộc về ngày mới, không lùi về hôm trước', () => {
    // 17:30 UTC ngày 18 = 00:30 VN ngày 19.
    expect(vnDateKey(new Date('2026-08-18T17:30:00Z'))).toBe('2026-08-19');
  });

  it('đầu ngày giờ VN là 17:00 UTC hôm trước', () => {
    expect(vnStartOfDay(new Date('2026-08-18T16:30:00Z')).toISOString()).toBe('2026-08-17T17:00:00.000Z');
  });

  it('dải 7 ngày kết thúc đúng ở ngày hiện tại theo giờ VN', () => {
    const { keys } = vnDayRange(7, new Date('2026-08-18T16:30:00Z'));

    expect(keys).toHaveLength(7);
    expect(keys.at(-1)).toBe('2026-08-18');
    expect(keys[0]).toBe('2026-08-12');
  });

  it('vẫn kết thúc ở hôm nay khi giờ UTC đã sang ngày khác', () => {
    // 01:00 UTC ngày 18 = 08:00 VN ngày 18 — hai lịch trùng ngày ở đây.
    expect(vnDayRange(7, new Date('2026-08-18T01:00:00Z')).keys.at(-1)).toBe('2026-08-18');
    // 18:00 UTC ngày 18 = 01:00 VN ngày 19 — lịch VN đã sang ngày mới.
    expect(vnDayRange(7, new Date('2026-08-18T18:00:00Z')).keys.at(-1)).toBe('2026-08-19');
  });

  it('`since` khớp đúng khoá đầu dải — nếu lệch là mất cột đầu tiên', () => {
    const { since, keys } = vnDayRange(7, new Date('2026-08-18T16:30:00Z'));
    expect(vnDateKey(since)).toBe(keys[0]);
  });

  it('không có ngày trùng hay nhảy cóc trong dải', () => {
    const { keys } = vnDayRange(30, new Date('2026-03-01T10:00:00Z'));
    expect(new Set(keys).size).toBe(30);
    expect(keys.at(-1)).toBe('2026-03-01');
  });
});
