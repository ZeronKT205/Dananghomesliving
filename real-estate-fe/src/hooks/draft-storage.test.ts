import { describe, expect, it } from 'vitest';

import { MAX_DRAFT_AGE_MS, draftKey, readDraft, removeDraft, writeDraft, type DraftStore } from './draft-storage';

/** localStorage giả, có thể bắt lỗi để thử tình huống hết dung lượng. */
function fakeStore(opts: { failWrite?: boolean; failRead?: boolean } = {}): DraftStore & { map: Map<string, string> } {
  const map = new Map<string, string>();
  return {
    map,
    getItem: (k) => {
      if (opts.failRead) throw new Error('SecurityError');
      return map.get(k) ?? null;
    },
    setItem: (k, v) => {
      if (opts.failWrite) throw new Error('QuotaExceededError');
      map.set(k, v);
    },
    removeItem: (k) => void map.delete(k),
  };
}

const KEY = draftKey('abc123');
const NOW = 1_800_000_000_000;

describe('nháp bài viết trong localStorage', () => {
  it('ghi rồi đọc lại đúng nguyên nội dung', () => {
    const store = fakeStore();
    const value = { title: { vi: 'Căn hộ An Thượng' }, content: { vi: '<p>Nội dung</p>' } };

    expect(writeDraft(store, KEY, value, NOW)).toBe(true);
    expect(readDraft<typeof value>(store, KEY, NOW)).toEqual({ savedAt: NOW, value });
  });

  it('không có nháp thì trả null', () => {
    expect(readDraft(fakeStore(), KEY, NOW)).toBeNull();
  });

  it('bỏ và dọn nháp quá cũ', () => {
    const store = fakeStore();
    writeDraft(store, KEY, { a: 1 }, NOW - MAX_DRAFT_AGE_MS - 1);

    expect(readDraft(store, KEY, NOW)).toBeNull();
    expect(store.map.has(KEY)).toBe(false);
  });

  it('giữ nháp vừa chớm tới hạn', () => {
    const store = fakeStore();
    writeDraft(store, KEY, { a: 1 }, NOW - MAX_DRAFT_AGE_MS);

    expect(readDraft(store, KEY, NOW)).not.toBeNull();
  });

  it('bỏ và dọn nháp hỏng thay vì ném lỗi', () => {
    const store = fakeStore();
    store.map.set(KEY, '{ khong phai JSON');

    expect(readDraft(store, KEY, NOW)).toBeNull();
    expect(store.map.has(KEY)).toBe(false);
  });

  it('bỏ nháp thiếu trường bắt buộc', () => {
    const store = fakeStore();
    store.map.set(KEY, JSON.stringify({ value: { a: 1 } })); // thiếu savedAt

    expect(readDraft(store, KEY, NOW)).toBeNull();
  });

  it('hết dung lượng thì báo false chứ không ném lỗi', () => {
    // Người dùng vẫn phải gõ tiếp được dù không lưu được nháp.
    expect(writeDraft(fakeStore({ failWrite: true }), KEY, { a: 1 }, NOW)).toBe(false);
  });

  it('localStorage bị chặn thì đọc ra null chứ không ném lỗi', () => {
    expect(readDraft(fakeStore({ failRead: true }), KEY, NOW)).toBeNull();
  });

  it('xoá nháp sau khi lưu lên server', () => {
    const store = fakeStore();
    writeDraft(store, KEY, { a: 1 }, NOW);
    removeDraft(store, KEY);

    expect(readDraft(store, KEY, NOW)).toBeNull();
  });

  it('mỗi bài một khoá riêng', () => {
    expect(draftKey('new')).not.toBe(draftKey('abc123'));
  });
});
