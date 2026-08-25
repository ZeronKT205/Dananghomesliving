import Link from 'next/link';
import { Montserrat, Playfair_Display } from 'next/font/google';
import './globals.css';

const montserrat = Montserrat({
  subsets: ['latin', 'latin-ext', 'vietnamese'],
  variable: '--font-montserrat',
  display: 'swap',
});

const playfairDisplay = Playfair_Display({
  subsets: ['latin', 'latin-ext', 'vietnamese'],
  variable: '--font-playfair',
  display: 'swap',
});

/**
 * Trang 404 gốc — BẮT BUỘC tự render <html>/<body>.
 */
export default function RootNotFound() {
  return (
    <html lang="vi" className={`${montserrat.variable} ${playfairDisplay.variable}`}>
      <body className="bg-paper text-ink antialiased min-h-screen relative flex flex-col justify-center overflow-hidden">
        {/* Background Ambient Gradients */}
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-gold/10 rounded-full blur-[140px] -z-10 pointer-events-none" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-navy/10 rounded-full blur-[140px] -z-10 pointer-events-none" />
        <div className="absolute top-[40%] right-[20%] w-[30%] h-[30%] bg-ivory/50 rounded-full blur-[100px] -z-10 pointer-events-none" />

        <main className="container-page px-6 relative z-10 py-20 flex flex-col items-center">
          <div className="w-full max-w-3xl mx-auto bg-white/70 backdrop-blur-2xl border border-white/60 shadow-lift rounded-[40px] p-10 sm:p-16 md:p-20 text-center animate-fade-in-up">
            
            <div className="mb-8 flex justify-center stagger-1 opacity-0 animate-fade-in-up" style={{ animationFillMode: 'forwards' }}>
              <div className="relative flex h-24 w-24 sm:h-32 sm:w-32 items-center justify-center rounded-full bg-navy/5 shadow-inner">
                <div className="absolute inset-0 rounded-full border border-gold/20 animate-pulse-glow"></div>
                <span className="text-gold text-4xl sm:text-6xl font-display font-medium italic">
                  404
                </span>
              </div>
            </div>
            
            <p className="text-gold text-[12px] sm:text-[14px] font-bold tracking-[0.25em] uppercase mb-4 stagger-2 opacity-0 animate-fade-in-up" style={{ animationFillMode: 'forwards' }}>
              Trang Không Tồn Tại
            </p>
            
            <h1 className="font-display text-navy text-[36px] sm:text-[48px] md:text-[56px] leading-[1.1] mb-6 stagger-3 opacity-0 animate-fade-in-up" style={{ animationFillMode: 'forwards' }}>
              Đường dẫn này đã bị <br className="hidden sm:block" /> mất trên bản đồ
            </h1>
            
            <p className="text-muted mx-auto max-w-[48ch] text-[15px] sm:text-[16px] leading-relaxed mb-10 stagger-4 opacity-0 animate-fade-in-up" style={{ animationFillMode: 'forwards' }}>
              Rất tiếc, nội dung bạn đang tìm kiếm không tồn tại, đã bị xóa hoặc tạm thời không truy cập được. Khám phá lại từ trang chủ nhé.
            </p>
            
            <div className="stagger-5 opacity-0 animate-fade-in-up flex flex-col sm:flex-row items-center justify-center gap-4" style={{ animationFillMode: 'forwards' }}>
              <Link
                href="/"
                className="group relative inline-flex w-full sm:w-auto items-center justify-center gap-3 bg-navy hover:bg-gold px-8 py-4 text-[13px] font-bold tracking-[0.15em] text-white uppercase transition-all duration-400 rounded-full overflow-hidden shadow-header hover:shadow-lift hover:-translate-y-1"
              >
                <span className="relative z-10 transition-transform duration-300 group-hover:-translate-x-1">Trở về trang chủ</span>
                <svg className="w-5 h-5 relative z-10 transition-transform duration-300 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 absolute right-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>

          </div>
        </main>
      </body>
    </html>
  );
}
