import Link from 'next/link';

import { APP_NAME } from '@/config/constants';

import { SiteFooter } from '../_components/site-footer';
import { SiteHeader } from '../_components/site-header';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: `About Us | ${APP_NAME}`,
  description: 'Trang thông tin giới thiệu về Da Nang Homes & Living.',
};

export default function AboutPage() {
  return (
    <>
      <SiteHeader />

      <main className="bg-paper min-h-[70vh] flex flex-col justify-center py-16 lg:py-24">
        <div className="container-page">
          <div className="border border-line bg-white shadow-lift p-8 sm:p-14 lg:p-16 text-center max-w-3xl mx-auto relative overflow-hidden">
            {/* Top Gold Accent Line */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gold"></div>

            {/* Status Icon */}
            <div className="mx-auto mb-6 grid h-16 w-16 place-items-center border border-gold/40 bg-gold/5 text-gold">
              <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>

            {/* Status Badge */}
            <span className="inline-block bg-gold/10 text-gold border border-gold/30 px-4 py-1 text-[10px] font-bold tracking-[0.2em] uppercase mb-4">
              Under Update • Đang Cập Nhật
            </span>

            {/* Main Heading */}
            <h1 className="font-display text-navy text-[30px] sm:text-[40px] leading-tight font-normal mb-4">
              Chúng tôi đang tiến hành cập nhật thông tin
            </h1>

            {/* Subtitle */}
            <p className="text-muted text-[14px] sm:text-[15px] leading-relaxed max-w-xl mx-auto mb-8">
              Trang thông tin giới thiệu chi tiết về **Da Nang Homes &amp; Living** đang trong quá trình bổ sung và hoàn thiện nội dung mới nhất. Rất mong quý khách thông cảm và quay lại sau!
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/"
                className="bg-navy hover:bg-gold text-white font-bold text-[12px] uppercase tracking-wider px-6 py-3.5 transition-colors w-full sm:w-auto"
              >
                ← Về Trang Chủ
              </Link>
              <Link
                href="/news"
                className="border border-line text-navy hover:border-gold hover:text-gold font-bold text-[12px] uppercase tracking-wider px-6 py-3.5 transition-colors w-full sm:w-auto"
              >
                Xem Tin Tức BĐS →
              </Link>
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
