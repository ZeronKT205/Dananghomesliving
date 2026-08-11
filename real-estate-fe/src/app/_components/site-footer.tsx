import Image from 'next/image';
import Link from 'next/link';

import { NewsletterForm } from '@/components/features/newsletter/newsletter-form';
import {
  APP_NAME,
  APP_TAGLINE,
  CONTACT_CITY,
  CONTACT_EMAIL,
  CONTACT_HOURS,
  NAV_ITEMS,
} from '@/config/constants';

// Bỏ "Home" — footer đã ở cuối trang, link về đầu trang không có giá trị ở đây.
const EXPLORE_LINKS = NAV_ITEMS.filter((item) => item.href !== '/');

export function SiteFooter() {
  return (
    <footer className="bg-navy pt-16 pb-6 text-white">
      <div className="container-page">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.2fr_0.7fr_0.7fr_1fr] lg:gap-12">
          <div className="md:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-4">
              <Image
                src="/images/brand/logo.webp"
                alt=""
                width={144}
                height={144}
                className="h-16 w-16 rounded-full object-cover"
              />
              <p>
                <strong className="font-display block text-[20px] leading-none font-normal">
                  Da Nang Homes
                  <br />
                  &amp; Living
                </strong>
                <span className="text-gold-soft mt-2 block text-[8.5px] tracking-[0.18em] uppercase">
                  Real Estate
                </span>
              </p>
            </div>
            <p className="mt-5 max-w-[340px] text-[13px] text-white/63">
              Premium property curation and local advisory for buying, renting and living well in Da
              Nang.
            </p>
          </div>

          <div>
            <h2 className="text-gold-soft mb-4 text-[9.5px] font-bold tracking-[0.16em] uppercase">
              Explore
            </h2>
            <ul className="grid gap-2.5 text-[13px] text-white/68">
              {EXPLORE_LINKS.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="transition-colors hover:text-white">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-gold-soft mb-4 text-[9.5px] font-bold tracking-[0.16em] uppercase">
              Contact
            </h2>
            <ul className="grid gap-2.5 text-[13px] text-white/68">
              <li>{CONTACT_CITY}</li>
              <li>
                <a href={`mailto:${CONTACT_EMAIL}`} className="transition-colors hover:text-white">
                  {CONTACT_EMAIL}
                </a>
              </li>
              <li>{CONTACT_HOURS}</li>
              <li>Viewings by appointment</li>
            </ul>
          </div>

          <div className="md:col-span-2 lg:col-span-1 lg:max-w-[320px]">
            <h2 className="text-gold-soft mb-4 text-[9.5px] font-bold tracking-[0.16em] uppercase">
              Da Nang property notes
            </h2>
            <p className="mb-3 text-[13px] text-white/62">
              Occasional market insights, selected listings and neighbourhood guides.
            </p>
            <NewsletterForm />
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-white/13 pt-6 text-[10.5px] text-white/45 sm:flex-row sm:justify-between">
          <span>© 2026 {APP_NAME}. All rights reserved.</span>
          <span>{APP_TAGLINE}</span>
          <span>Privacy · Terms</span>
        </div>
      </div>
    </footer>
  );
}
