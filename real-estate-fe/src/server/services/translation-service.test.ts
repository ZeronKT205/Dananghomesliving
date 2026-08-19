import { describe, expect, it } from 'vitest';

import { normalizePlaceNames, stripVietnameseDiacritics } from './translation-service';

/**
 * Luật "tên riêng Việt viết Latin không dấu" áp cho mọi ngôn ngữ đích trừ
 * tiếng Việt. Model tuân không đều nên code phải ép; các test này giữ cho việc
 * ép đó không làm hỏng chữ Hàn và chữ Hán.
 */
describe('bỏ dấu tiếng Việt trong bản dịch', () => {
  it('đổi tên riêng sang Latin không dấu', () => {
    expect(stripVietnameseDiacritics('An Thượng, Mỹ Khê, Đà Nẵng')).toBe('An Thuong, My Khe, Da Nang');
    expect(stripVietnameseDiacritics('Ngũ Hành Sơn')).toBe('Ngu Hanh Son');
    expect(stripVietnameseDiacritics('Phát Đạt')).toBe('Phat Dat');
  });

  it('không đụng vào chữ Hangul', () => {
    // NFD tách âm tiết Hangul thành jamo; thiếu bước NFC ở cuối là chữ Hàn vỡ.
    const ko = 'An Thượng 아파트: 해변 전망의 선택지';
    expect(stripVietnameseDiacritics(ko)).toBe('An Thuong 아파트: 해변 전망의 선택지');
  });

  it('không đụng vào chữ Hán', () => {
    expect(stripVietnameseDiacritics('An Thượng 公寓：两卧室')).toBe('An Thuong 公寓：两卧室');
  });

  it('giữ nguyên chữ đã không dấu và dấu câu', () => {
    expect(stripVietnameseDiacritics('An Thuong — 96 m², 3.596.000.000 VND')).toBe(
      'An Thuong — 96 m², 3.596.000.000 VND',
    );
  });

  it('giữ nguyên đánh dấu in đậm và liên kết', () => {
    expect(stripVietnameseDiacritics('Giá **3,6 tỷ** tại [Mỹ Khê](https://x.com/a)')).toBe(
      'Gia **3,6 ty** tai [My Khe](https://x.com/a)',
    );
  });
});

describe('chuẩn hoá tên riêng bị chuyển tự', () => {
  it('trả chữ Hán về Latin', () => {
    expect(normalizePlaceNames('An Thuong塔11层双卧室公寓，美溪海景房')).toBe(
      'An Thuong塔11层双卧室公寓，My Khe海景房',
    );
    expect(normalizePlaceNames('位于岘港市中心')).toBe('位于Da Nang市中心');
  });

  it('trả Hangul về Latin', () => {
    expect(normalizePlaceNames('다낭 미케 해변 인근')).toBe('Da Nang My Khe 해변 인근');
  });

  it('không đụng vào chữ đã đúng', () => {
    const ok = 'Two-bedroom apartment in An Thuong, 350 m from My Khe beach, Da Nang.';
    expect(normalizePlaceNames(ok)).toBe(ok);
  });

  it('không đụng vào chữ Hán/Hàn không phải tên riêng', () => {
    expect(normalizePlaceNames('两卧室公寓')).toBe('两卧室公寓');
    expect(normalizePlaceNames('침실 2개 아파트')).toBe('침실 2개 아파트');
  });
});
