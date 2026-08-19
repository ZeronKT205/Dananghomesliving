import { getRequestConfig } from 'next-intl/server';

import { isLocale } from '@/config/locales';

import { routing } from './routing';

export default getRequestConfig(async ({ requestLocale }) => {
  // This typically corresponds to the `[locale]` segment
  let locale = await requestLocale;

  // `isLocale` thu hẹp kiểu thật sự, thay cho `includes(locale as any)`.
  if (!isLocale(locale)) {
    locale = routing.defaultLocale;
  }

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
