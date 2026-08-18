'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import { draftKey, readDraft, removeDraft, writeDraft } from './draft-storage';

/**
 * Giữ hộ bản nháp trong localStorage và cảnh báo khi rời trang lúc chưa lưu.
 *
 * Lý do có hook này: trang soạn bài giữ toàn bộ nội dung trong state React. Bấm
 * nhầm một liên kết, lỡ tay đóng tab, hay trình duyệt tải lại là mất sạch —
 * kể cả bài AI vừa dựng mất cả phút mới xong. Đã xảy ra thật.
 *
 * Hai lớp chắn, vì mỗi lớp bịt một kiểu mất khác nhau:
 *  1. `beforeunload` chặn đóng tab / tải lại / bấm Back của trình duyệt — nhưng
 *     KHÔNG chặn được điều hướng nội bộ của Next.
 *  2. Nháp trong localStorage cứu mọi trường hợp còn lại, kể cả trình duyệt
 *     sập. Mở lại trang thì hỏi có khôi phục không.
 *
 * Cố tình KHÔNG tự lưu thẳng vào database: bài AI dựng ra luôn cần biên tập đọc
 * lại, tự đẩy lên server sẽ tạo ra một loạt bản nháp rác không ai chủ ý tạo.
 */

/** Chờ ngần này rồi mới ghi, để mỗi phím gõ không chạm localStorage một lần. */
const DEBOUNCE_MS = 800;

export interface DraftBackup<T> {
  /** Nháp tìm thấy lúc mở trang, `null` nếu không có. */
  found: { value: T; savedAt: Date } | null;
  /** Bỏ qua nháp và xoá nó đi. */
  discard: () => void;
  /** Xoá nháp sau khi đã lưu thành công lên server. */
  clear: () => void;
}

export function useDraftBackup<T>({
  key,
  value,
  enabled,
}: {
  /** Định danh bản nháp, nên gắn với id bài — 'new' cho bài chưa tạo. */
  key: string;
  value: T;
  /** Chỉ lưu khi có thay đổi chưa lưu. */
  enabled: boolean;
}): DraftBackup<T> {
  const storageKey = draftKey(key);
  const [found, setFound] = useState<{ value: T; savedAt: Date } | null>(null);

  // Chỉ đọc MỘT lần cho cả vòng đời: đổi khoá (bài mới vừa có id) không được
  // làm effect chạy lại rồi hỏi khôi phục chính thứ vừa lưu.
  const readRef = useRef(false);

  useEffect(() => {
    if (readRef.current) return;
    readRef.current = true;

    const draft = readDraft<T>(window.localStorage, storageKey);
    if (draft) setFound({ value: draft.value, savedAt: new Date(draft.savedAt) });
  }, [storageKey]);

  // Ghi nháp, có hoãn.
  useEffect(() => {
    if (!enabled) return;
    const timer = setTimeout(() => writeDraft(window.localStorage, storageKey, value), DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [storageKey, value, enabled]);

  // Cảnh báo khi đóng tab hoặc tải lại.
  useEffect(() => {
    if (!enabled) return;

    const warn = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      // Trình duyệt hiện nay bỏ qua nội dung tự đặt và hiện câu mặc định của
      // chúng; vẫn phải gán để hộp thoại xuất hiện.
      e.returnValue = '';
    };

    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [enabled]);

  const clear = useCallback(() => removeDraft(window.localStorage, storageKey), [storageKey]);

  const discard = useCallback(() => {
    clear();
    setFound(null);
  }, [clear]);

  return { found, discard, clear };
}
