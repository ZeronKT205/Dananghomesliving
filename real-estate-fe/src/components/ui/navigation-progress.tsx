'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';

/**
 * Top Progress Bar + UX Click Feedback Listener
 * Cung cấp phản hồi thị giác tức thì (0ms latency) khi người dùng nhấp vào bất kỳ button hay link nào.
 *
 * Suspense nằm ngay tại đây, không đẩy cho nơi gọi. Component này render trong
 * [locale]/layout.tsx — layout gốc của toàn site — và `useSearchParams()` mà
 * thiếu Suspense sẽ ép TOÀN BỘ cây bên dưới bail out sang client-side render:
 * mọi trang mất static/server render, build cũng fail.
 * Xem: https://nextjs.org/docs/messages/missing-suspense-with-csr-bailout
 */
export function NavigationProgress() {
  return (
    <Suspense fallback={null}>
      <NavigationProgressInner />
    </Suspense>
  );
}

function NavigationProgressInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  /*
   * Khi pathname hoặc searchParams đổi -> kết thúc thanh tiến trình.
   *
   * `loading` PHẢI nằm trong deps. Trước đây bị bỏ ra để effect chỉ chạy khi
   * đổi URL, nhưng như vậy React đọc `loading` của lần render cũ — điều hướng
   * hai lần liên tiếp là thanh kẹt lại. Thay bằng bản cập nhật theo hàm nên
   * không cần đọc `loading` từ closure nữa.
   */
  useEffect(() => {
    setProgress(100);
    const timer = setTimeout(() => {
      setLoading(false);
      setProgress(0);
    }, 300);
    return () => clearTimeout(timer);
  }, [pathname, searchParams]);

  // Lắng nghe click toàn cục để khởi chạy progress bar tức thì khi bấm link hoặc submit form
  useEffect(() => {
    const handleGlobalClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      if (!target) return;

      // Tìm xem click có xuất phát từ thẻ <a> hoặc <button> hoặc thẻ có role="button" không
      const clickable = target.closest('a, button, [role="button"], [role="tab"]');
      if (!clickable) return;

      // Thêm hiệu ứng micro-scale / ripple tức thì trên phần tử được nhấp
      clickable.classList.add('ux-tap-active');
      setTimeout(() => clickable.classList.remove('ux-tap-active'), 250);

      // Chỉ bật progress bar khi nhấp vào thẻ <a> dẫn sang một TRANG KHÁC (khác pathname)
      if (clickable.tagName === 'A') {
        const anchor = clickable as HTMLAnchorElement;
        const href = anchor.getAttribute('href');

        if (
          href &&
          !href.startsWith('#') &&
          !href.startsWith('mailto:') &&
          !href.startsWith('tel:') &&
          !href.startsWith('javascript:') &&
          anchor.target !== '_blank'
        ) {
          try {
            const targetUrl = new URL(href, window.location.origin);
            const currentPath = window.location.pathname;

            // Chỉ khởi chạy progress bar khi CHUYỂN SANG TRANG KHÁC
            // Không kích hoạt cho cùng trang, anchor cuộn nội bộ (#hash), hay các thao tác trong trang
            if (
              targetUrl.origin === window.location.origin &&
              targetUrl.pathname !== currentPath
            ) {
              startProgress();
            }
          } catch {
            // URL parse fail -> bỏ qua
          }
        }
      }
    };

    const startProgress = () => {
      setLoading(true);
      setProgress(25);

      const t1 = setTimeout(() => setProgress(65), 150);
      const t2 = setTimeout(() => setProgress(85), 400);

      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    };

    document.addEventListener('click', handleGlobalClick, { capture: true });
    return () => {
      document.removeEventListener('click', handleGlobalClick, { capture: true });
    };
  }, []);

  if (!loading && progress === 0) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed top-0 right-0 left-0 z-9999 h-[3px] overflow-hidden bg-transparent"
    >
      <div
        className="bg-gold h-full shadow-[0_0_10px_#c9922e,0_0_5px_#e0b75f] transition-all duration-300 ease-out"
        style={{
          width: `${progress}%`,
          opacity: progress === 100 ? 0 : 1,
          transitionProperty: 'width, opacity',
        }}
      />
    </div>
  );
}
