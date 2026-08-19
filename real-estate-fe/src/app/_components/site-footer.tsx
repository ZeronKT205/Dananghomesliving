import Link from 'next/link';
import { getTranslations } from 'next-intl/server';

import { NewsletterForm } from '@/components/features/newsletter/newsletter-form';
import { BrandLogo } from '@/components/ui/brand-logo';
import { NAV_ITEMS } from '@/config/constants';
import { getSiteSettings } from '@/lib/db/site-settings';


// Bỏ "Home" — footer đã ở cuối trang, link về đầu trang không có giá trị ở đây.
const EXPLORE_LINKS = NAV_ITEMS.filter((item) => item.href !== '/');

// Server Component nên đọc thẳng cài đặt; `getSiteSettings` đã được cache
// trong phạm vi một request nên header và footer không gọi DB hai lần.
export async function SiteFooter() {
  // Server Component: `getTranslations` thay cho hook `useTranslations`.
  const [{ brand, contact }, tNav, t] = await Promise.all([
    getSiteSettings(),
    getTranslations('Nav'),
    getTranslations('Footer'),
  ]);

  return (
    <footer className="bg-navy pt-16 pb-6 text-white">
      <div className="container-page">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.2fr_0.7fr_0.7fr_1fr] lg:gap-12">
          <div className="md:col-span-2 lg:col-span-1">
            <div className="flex items-center">
              <BrandLogo light={true} />
            </div>
            <p className="mt-5 max-w-[340px] text-[13px] text-white/63">
              Premium property curation and local advisory for buying, renting and living well in Da
              Nang.
            </p>
          </div>

          <div>
            <h2 className="text-gold-soft mb-4 text-[9.5px] font-bold tracking-[0.16em] uppercase">
              {t('explore')}
            </h2>
            <ul className="grid gap-2.5 text-[13px] text-white/68">
              {EXPLORE_LINKS.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="transition-colors hover:text-white">
                    {tNav(item.labelKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-gold-soft mb-4 text-[9.5px] font-bold tracking-[0.16em] uppercase">
              {t('contact')}
            </h2>
            <ul className="grid gap-2.5 text-[13px] text-white/68">
              <li>{contact.address || contact.city}</li>
              <li>
                <a href={`mailto:${contact.email}`} className="transition-colors hover:text-white">
                  {contact.email}
                </a>
              </li>
              <li>
                <a href={contact.phoneHref} className="transition-colors hover:text-white">
                  {contact.phone}
                </a>
              </li>
              <li>{contact.hours}</li>
              <li>{t('byAppointment')}</li>
            </ul>
          </div>

          <div className="md:col-span-2 lg:col-span-1 lg:max-w-[320px]">
            <h2 className="text-gold-soft mb-4 text-[9.5px] font-bold tracking-[0.16em] uppercase">
              {t('newsletterTitle')}
            </h2>
            <p className="mb-3 text-[13px] text-white/62">
              {t('newsletterBody')}
            </p>
            <NewsletterForm />
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-white/13 pt-6 text-[10.5px] text-white/45 sm:flex-row sm:justify-between">
          <span>© {new Date().getFullYear()} {brand.name}. {t('rights')}</span>
          <span>{brand.tagline}</span>
          <span>
            {t('privacy')} · {t('terms')}
          </span>
        </div>
      </div>
    </footer>
  );
}
