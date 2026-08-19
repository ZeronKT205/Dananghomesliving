'use client';

import { useEffect } from 'react';

/**
 * Chặn điều hướng NỘI BỘ khi form còn thay đổi chưa lưu.
 *
 * `beforeunload` trong `use-draft-backup` chỉ bắt được đóng tab, tải lại và nút
 * Back của trình duyệt. Bấm một liên kết trong CMS thì Next điều hướng phía
 * client, trình duyệt không phát sự kiện nào, và form biến mất không một lời
 * cảnh báo — đúng tình huống người dùng gặp.
 *
 * App Router không còn `router.events` như Pages Router, nên cách còn lại là
 * bắt sự kiện click ở giai đoạn capture, trước khi Next kịp xử lý.
 *
 * Nháp vẫn được lưu song song, nên chọn "rời trang" cũng không mất gì — hộp
 * thoại chỉ để người dùng khỏi giật mình.
 */
export function useLeaveGuard({
  when,
  message = 'Bạn có thay đổi chưa lưu. Rời khỏi trang này?',
}: {
  when: boolean;
  message?: string;
}) {
  useEffect(() => {
    if (!when) return;

    const onClick = (event: MouseEvent) => {
      // Bỏ qua click chuột giữa / Ctrl+click: những cái đó mở tab mới, trang
      // hiện tại vẫn còn nguyên.
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const anchor = (event.target as HTMLElement | null)?.closest?.('a');
      if (!anchor) return;

      const href = anchor.getAttribute('href');
      if (!href || href.startsWith('#')) return;
      if (anchor.target === '_blank' || anchor.hasAttribute('download')) return;

      // Chỉ hỏi khi thật sự đi sang trang khác.
      const url = new URL(anchor.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      if (url.pathname === window.location.pathname) return;

      if (!window.confirm(message)) {
        event.preventDefault();
        event.stopPropagation();
      }
    };

    // `capture: true` để chạy TRƯỚC handler của `next/link`.
    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, [when, message]);
}
