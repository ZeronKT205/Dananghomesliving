'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import { CloseIcon, MailIcon, MenuIcon } from '@/components/ui/icons';
import { APP_NAME, APP_TAGLINE, CONTACT_EMAIL, NAV_ITEMS } from '@/config/constants';
import { cn } from '@/lib/utils';

import { LanguageMenu } from './language-menu';
import { PrimaryNav } from './primary-nav';
import { QrContact } from './qr-contact';
import { SocialLinks } from './social-links';

/** Header 2 hàng:
 *  · Hàng trên — trái: QR gọi + email + ngôn ngữ | giữa: logo | phải: mạng xã hội
 *  · Hàng dưới — các tab chính (ẩn dưới lg, gộp vào panel mobile)
 *
 *  Cần client vì 3 thứ chỉ có ở trình duyệt: bóng đổ theo scroll, panel menu
 *  mobile, và mục tab đang xem. */
export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeHref, setActiveHref] = useState('');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const hashItems = NAV_ITEMS.filter((item) => item.href.includes('#'));
    const sections = hashItems
      .map((item) => {
        const hash = item.href.slice(item.href.indexOf('#'));
        return document.querySelector(hash);
      })
      .filter((element): element is Element => element !== null);
    if (sections.length === 0) return;

    // Giữ tập section đang giao nhau thay vì chỉ nhận entry mới nhất
    const visible = new Set<string>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target.id);
          else visible.delete(entry.target.id);
        }
        const current = hashItems.find((item) => {
          const hash = item.href.slice(item.href.indexOf('#') + 1);
          return visible.has(hash);
        });
        setActiveHref(current?.href ?? '');
      },
      { rootMargin: '-40% 0px -50% 0px' },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = menuOpen ? 'hidden' : previousOverflow;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };
    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [menuOpen]);

  return (
    <>
      <header
        className={cn(
          'border-line sticky top-0 z-80 border-b bg-[rgb(255_253_248/0.95)] backdrop-blur-lg transition-shadow duration-200',
          scrolled && 'shadow-header',
        )}
      >
        {/* ── Hàng 1 ── grid 3 cột để logo luôn nằm CHÍNH GIỮA viewport,
            không bị lệch theo bề rộng của cụm trái/phải. */}
        <div className="border-line/70 border-b">
          <div className="container-page text-navy grid h-[72px] grid-cols-[1fr_auto_1fr] items-center gap-3 lg:h-[88px]">
            <div className="flex items-center gap-1 justify-self-start sm:gap-2">
              <QrContact />
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                aria-label={`Email ${CONTACT_EMAIL}`}
                className="hover:text-gold focus-visible:outline-gold grid h-8 w-8 place-items-center transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
              >
                <MailIcon className="h-[17px] w-[17px]" />
              </a>
              <LanguageMenu className="ml-2 hidden md:block" />
            </div>

            <Link
              href="/"
              aria-label={`${APP_NAME} home`}
              className="flex items-center gap-3 justify-self-center"
            >
              <Image
                src="/images/brand/logo.webp"
                alt=""
                width={112}
                height={112}
                priority
                className="ring-gold/50 h-12 w-12 rounded-full object-cover ring-1 lg:h-16 lg:w-16"
              />
              <span className="grid leading-none">
                <strong className="font-display text-navy text-[17px] font-normal tracking-[0.02em] whitespace-nowrap sm:text-[19px] lg:text-[23px]">
                  {APP_NAME}
                </strong>
                <span className="text-gold mt-1.5 hidden text-[8px] font-bold tracking-[0.22em] uppercase sm:block lg:text-[9.5px]">
                  {APP_TAGLINE}
                </span>
              </span>
            </Link>

            <div className="flex items-center gap-2 justify-self-end">
              <SocialLinks className="hidden md:flex" />
              <button
                type="button"
                onClick={() => setMenuOpen(true)}
                aria-label="Open menu"
                aria-expanded={menuOpen}
                className="border-line hover:border-gold hover:text-gold focus-visible:outline-gold grid h-9 w-9 cursor-pointer place-items-center border transition-colors focus-visible:outline-2 lg:hidden"
              >
                <MenuIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* ── Hàng 2 ── */}
        <div className="hidden lg:block">
          <div className="container-page">
            <PrimaryNav activeHref={activeHref} />
          </div>
        </div>
      </header>

      <div
        onClick={() => setMenuOpen(false)}
        className={cn(
          'fixed inset-0 z-90 bg-[rgb(7_29_54/0.42)] transition-opacity duration-300 lg:hidden',
          menuOpen ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
      />

      <aside
        aria-hidden={!menuOpen}
        className={cn(
          'bg-paper fixed inset-y-0 right-0 z-100 flex w-[min(360px,100%)] flex-col overflow-y-auto px-7 pt-20 pb-8 transition-transform duration-300 lg:hidden',
          menuOpen ? 'translate-x-0' : 'translate-x-full',
        )}
      >
        <button
          type="button"
          onClick={() => setMenuOpen(false)}
          aria-label="Close menu"
          className="border-line focus-visible:outline-gold absolute top-5 right-7 grid h-9 w-9 cursor-pointer place-items-center border focus-visible:outline-2"
        >
          <CloseIcon className="h-4 w-4" />
        </button>

        <nav aria-label="Mobile">
          <ul className="grid">
            {NAV_ITEMS.map((item) => {
              const children = 'children' in item ? item.children : undefined;
              const locations = 'locations' in item ? item.locations : undefined;
              return (
                <li key={item.label} className="border-line border-b py-2.5">
                  <Link
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className="font-display text-navy hover:text-gold block text-[24px] transition-colors"
                  >
                    {item.label}
                  </Link>
                  {children ? (
                    <ul className="mt-1 grid gap-1 pl-3">
                      {children.map((child) => (
                        <li key={child.label}>
                          <Link
                            href={child.href}
                            onClick={() => setMenuOpen(false)}
                            className="text-muted hover:text-gold block text-[13px] transition-colors"
                          >
                            {child.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                  {locations ? (
                    <div className="mt-2 pl-3">
                      <span className="text-gold text-[10px] font-bold tracking-wider uppercase">
                        Locations
                      </span>
                      <ul className="border-gold/30 mt-1 grid gap-1 border-l pl-2">
                        {locations.map((loc) => (
                          <li key={loc.label}>
                            <Link
                              href={loc.href}
                              onClick={() => setMenuOpen(false)}
                              className="text-muted hover:text-gold block text-[12px] transition-colors"
                            >
                              {loc.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="mt-8">
          <LanguageMenu />
        </div>

        <div className="mt-auto pt-8">
          <SocialLinks />
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="text-muted hover:text-gold mt-4 block text-[13px] transition-colors"
          >
            {CONTACT_EMAIL}
          </a>
        </div>
      </aside>
    </>
  );
}
