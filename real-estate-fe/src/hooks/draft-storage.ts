/**
 * Đọc / ghi bản nháp trong localStorage.
 *
 * Tách khỏi `use-draft-backup.ts` để kiểm được bằng test: phần dễ sai không
 * phải là các `useEffect` mà là chuyện dữ liệu hỏng, nháp quá cũ, và hết dung
 * lượng — cả ba đều là logic thuần, không cần dựng React lên mới thử được.
 */

/** Nháp cũ hơn mốc này coi như bỏ đi — hỏi khôi phục bài tuần trước là phiền. */
export const MAX_DRAFT_AGE_MS = 7 * 24 * 60 * 60 * 1000;

export interface StoredDraft<T> {
  savedAt: number;
  value: T;
}

/** Kho lưu tối thiểu — để test truyền vào bản giả thay cho localStorage. */
export interface DraftStore {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

export function draftKey(id: string): string {
  return `dhl:draft:${id}`;
}

/**
 * Đọc nháp. Trả `null` khi không có, khi hỏng, hoặc khi quá cũ — và tự dọn
 * bản hỏng/quá cũ luôn.
 *
 * Nuốt mọi lỗi có chủ ý: nháp là tính năng phụ, không được phép làm trang soạn
 * bài không mở lên được.
 */
export function readDraft<T>(store: DraftStore, key: string, now = Date.now()): StoredDraft<T> | null {
  let raw: string | null;
  try {
    raw = store.getItem(key);
  } catch {
    return null;
  }
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as StoredDraft<T>;

    if (typeof parsed?.savedAt !== 'number' || !('value' in parsed)) {
      store.removeItem(key);
      return null;
    }

    if (now - parsed.savedAt > MAX_DRAFT_AGE_MS) {
      store.removeItem(key);
      return null;
    }

    return parsed;
  } catch {
    store.removeItem(key);
    return null;
  }
}

/**
 * Ghi nháp. Trả `false` nếu không ghi được (hết dung lượng, chế độ riêng tư).
 *
 * Không ném lỗi: hỏng chỗ này thì cùng lắm mất lớp cứu hộ, chứ không được chặn
 * người dùng gõ tiếp.
 */
export function writeDraft<T>(store: DraftStore, key: string, value: T, now = Date.now()): boolean {
  try {
    store.setItem(key, JSON.stringify({ savedAt: now, value } satisfies StoredDraft<T>));
    return true;
  } catch {
    return false;
  }
}

export function removeDraft(store: DraftStore, key: string): void {
  try {
    store.removeItem(key);
  } catch {
    /* không có gì để làm */
  }
}
