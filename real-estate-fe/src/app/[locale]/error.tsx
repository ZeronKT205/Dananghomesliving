"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Tùy chọn: Log lỗi vào một service như Sentry
    console.error("Application error:", error);
  }, [error]);

  return (
    <main className="container-page px-6 relative z-10 py-24 sm:py-32 flex flex-col items-center">
      {/* Background Ambient Gradients */}
      <div className="absolute top-[10%] left-[0%] w-[40%] h-[40%] bg-gold/10 rounded-full blur-[120px] -z-10 pointer-events-none" />
      <div className="absolute bottom-[10%] right-[0%] w-[50%] h-[50%] bg-navy/10 rounded-full blur-[120px] -z-10 pointer-events-none" />

      <div className="w-full max-w-3xl mx-auto bg-white/70 backdrop-blur-2xl border border-white/60 shadow-lift rounded-[40px] p-10 sm:p-16 md:p-20 text-center animate-fade-in-up">
        <div
          className="mb-8 flex justify-center stagger-1 opacity-0 animate-fade-in-up"
          style={{ animationFillMode: "forwards" }}
        >
          <div className="relative flex h-24 w-24 sm:h-32 sm:w-32 items-center justify-center rounded-full bg-navy/5 shadow-inner">
            <div className="absolute inset-0 rounded-full border border-gold/20 animate-pulse-glow"></div>
            <span className="text-gold text-4xl sm:text-5xl font-display font-medium italic">
              Lỗi
            </span>
          </div>
        </div>

        <p
          className="text-gold text-[12px] sm:text-[14px] font-bold tracking-[0.25em] uppercase mb-4 stagger-2 opacity-0 animate-fade-in-up"
          style={{ animationFillMode: "forwards" }}
        >
          Đã Xảy Ra Sự Cố
        </p>

        <h1
          className="font-display text-navy text-[32px] sm:text-[44px] md:text-[50px] leading-[1.1] mb-6 stagger-3 opacity-0 animate-fade-in-up"
          style={{ animationFillMode: "forwards" }}
        >
          Hệ thống đang gặp gián đoạn <br className="hidden sm:block" /> ngoài ý muốn
        </h1>

        <p
          className="text-muted mx-auto max-w-[48ch] text-[15px] sm:text-[16px] leading-relaxed mb-10 stagger-4 opacity-0 animate-fade-in-up"
          style={{ animationFillMode: "forwards" }}
        >
          Rất tiếc, đã có một sự cố xảy ra trong quá trình xử lý yêu cầu của bạn. 
          Vui lòng thử lại hoặc quay về trang chủ.
        </p>

        <div
          className="stagger-5 opacity-0 animate-fade-in-up flex flex-col sm:flex-row items-center justify-center gap-4"
          style={{ animationFillMode: "forwards" }}
        >
          <button
            onClick={() => reset()}
            className="group relative w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-navy hover:bg-navy-2 px-8 py-4 text-[13px] font-bold tracking-[0.15em] text-white uppercase transition-all duration-300 rounded-full overflow-hidden shadow-header hover:shadow-lift hover:-translate-y-1"
          >
            <span className="relative z-10">Thử lại ngay</span>
            <svg
              className="w-4 h-4 relative z-10 transition-transform duration-300 group-hover:rotate-180"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </button>
          
          <Link
            href="/"
            className="group relative w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-transparent hover:bg-navy/5 border border-navy/20 px-8 py-4 text-[13px] font-bold tracking-[0.15em] text-navy uppercase transition-all duration-300 rounded-full overflow-hidden hover:border-navy hover:-translate-y-1"
          >
            <span>Về trang chủ</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
