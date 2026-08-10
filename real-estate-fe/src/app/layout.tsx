import './globals.css';

import { DM_Sans, Instrument_Serif, Manrope } from 'next/font/google';

import { APP_DESCRIPTION, APP_NAME } from '@/config/constants';

import type { Metadata } from 'next';
import type { ReactNode } from 'react';

// ⚠️ Cả hai font đều KHÔNG có subset 'vietnamese' trên Google Fonts. Nội dung
// hiện tại viết không dấu ("Son Tra", "Hai Chau") nên không sao; nếu sau này
// thêm bản tiếng Việt có dấu, phải đổi sang font khác hoặc self-host, không thì
// dấu sẽ rơi về font hệ thống và lệch hẳn khỏi phần còn lại.
const dmSans = DM_Sans({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-dm-sans',
  display: 'swap',
});

const instrumentSerif = Instrument_Serif({
  subsets: ['latin', 'latin-ext'],
  weight: '400',
  variable: '--font-instrument',
  display: 'swap',
});

// Font riêng cho trang quản trị — cùng font với CMS mẫu Đức Giáp.
// Manrope CÓ subset 'vietnamese' nên chữ có dấu trong CMS hiển thị đúng.
const manrope = Manrope({
  subsets: ['latin', 'latin-ext', 'vietnamese'],
  variable: '--font-manrope',
  display: 'swap',
});

export const metadata: Metadata = {
  // template: trang con chỉ cần khai title riêng, hậu tố tên site tự gắn.
  title: { default: `${APP_NAME} | Premium Real Estate`, template: `%s | ${APP_NAME}` },
  description: APP_DESCRIPTION,
};

export const viewport = {
  themeColor: '#071d36',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={`${dmSans.variable} ${instrumentSerif.variable} ${manrope.variable}`}
      suppressHydrationWarning
    >
      <body className="bg-paper text-ink min-h-screen overflow-x-hidden antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
