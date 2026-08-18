import '../globals.css';

import { Montserrat, Playfair_Display, Manrope } from 'next/font/google';
import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';

import { APP_DESCRIPTION, APP_NAME } from '@/config/constants';
import { InitialBrandLoader } from '@/components/ui/initial-brand-loader';
import { NavigationProgress } from '@/components/ui/navigation-progress';
import { ToastProvider } from '@/components/ui/toast-provider';
import { routing } from '@/i18n/routing';

import type { Metadata } from 'next';
import type { ReactNode } from 'react';

// Montserrat cho toàn bộ nội dung (Body text) — 100% tiếng Việt
const montserrat = Montserrat({
  subsets: ['latin', 'latin-ext', 'vietnamese'],
  variable: '--font-montserrat',
  display: 'swap',
});

// Playfair Display cho toàn bộ Tiêu đề (Headings) — 100% tiếng Việt
const playfairDisplay = Playfair_Display({
  subsets: ['latin', 'latin-ext', 'vietnamese'],
  variable: '--font-playfair',
  display: 'swap',
});

// Font riêng cho trang quản trị
const manrope = Manrope({
  subsets: ['latin', 'latin-ext', 'vietnamese'],
  variable: '--font-manrope',
  display: 'swap',
});

const SITE_URL = 'https://dananghomesliving.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${APP_NAME} — Luxury Real Estate Da Nang`,
    template: `%s | ${APP_NAME}`,
  },
  description: APP_DESCRIPTION,
  keywords: [
    'Da Nang Real Estate',
    'Danang Homes',
    'Luxury Villa Da Nang',
    'Apartments for Rent Da Nang',
    'Da Nang Properties',
  ],
  authors: [{ name: APP_NAME }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE_URL,
    siteName: APP_NAME,
    title: `${APP_NAME} — Luxury Real Estate Da Nang`,
    description: APP_DESCRIPTION,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1200&auto=format&fit=crop',
        width: 1200,
        height: 630,
        alt: `${APP_NAME} — Curated Luxury Residences`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${APP_NAME} — Luxury Real Estate Da Nang`,
    description: APP_DESCRIPTION,
    images: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1200&auto=format&fit=crop',
    ],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport = {
  themeColor: '#071d36',
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function RootLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      className={`${montserrat.variable} ${playfairDisplay.variable} ${manrope.variable}`}
      suppressHydrationWarning
    >
      <body className="bg-paper text-ink min-h-screen overflow-x-hidden antialiased">
        <NextIntlClientProvider messages={messages}>
          <ToastProvider>
            <InitialBrandLoader />
            <NavigationProgress />
            {children}
          </ToastProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
