import Link from 'next/link';

/**
 * Trang 404 gốc — BẮT BUỘC tự render <html>/<body>.
 *
 * `app/layout.tsx` là layout pass-through (xem chú thích trong đó), nên các
 * route KHÔNG nằm dưới `[locale]` hay `/admin` — mà `_not-found` là một —
 * chẳng có layout nào cấp thẻ html/body. Thiếu file này Next báo
 * "Missing <html> and <body> tags in the root layout".
 *
 * Trường hợp thường gặp: gõ sai URL không khớp locale nào, hoặc gọi một
 * đường dẫn API không tồn tại.
 */
export default function RootNotFound() {
  return (
    <html lang="vi">
      <body className="bg-paper text-ink antialiased">
        <main className="grid min-h-screen place-items-center px-6 text-center">
          <div>
            <p className="text-gold text-[12px] font-bold tracking-[0.2em] uppercase">Lỗi 404</p>
            <h1 className="font-display text-navy mt-3 text-[32px] leading-tight sm:text-[40px]">
              Không tìm thấy trang
            </h1>
            <p className="text-muted mx-auto mt-3 max-w-[46ch] text-[14px] leading-relaxed">
              Đường dẫn bạn truy cập không tồn tại hoặc đã được chuyển đi nơi khác.
            </p>
            <Link
              href="/"
              className="bg-navy hover:bg-gold mt-8 inline-block px-6 py-3 text-[12px] font-bold tracking-wider text-white uppercase transition-colors"
            >
              Về trang chủ
            </Link>
          </div>
        </main>
      </body>
    </html>
  );
}
