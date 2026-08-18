'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

import { ChevronDownIcon, CloseIcon, MailIcon, MenuIcon } from '@/components/ui/icons';
import { APP_NAME, CONTACT_EMAIL, NAV_ITEMS } from '@/config/constants';
import { cn } from '@/lib/utils';

import { LanguageMenu } from './language-menu';
import { PrimaryNav } from './primary-nav';
import { QrContact } from './qr-contact';
import { SocialLinks } from './social-links';
import { BrandLogo } from '@/components/ui/brand-logo';

/** Header 2 hàng:
 *  · Hàng trên — trái: QR gọi + email + ngôn ngữ | giữa: logo | phải: mạng xã hội
 *  · Hàng dưới — các tab chính (ẩn dưới lg, gộp vào panel mobile)
 *
 *  Cần client vì 3 thứ chỉ có ở trình duyệt: bóng đổ theo scroll, panel menu
 *  mobile, và mục tab đang xem. */
export function SiteHeader() {
  // Primary header component with responsive desktop & mobile navigation
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeHref, setActiveHref] = useState('');
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});

  const toggleSubmenu = (label: string) => {
    setExpandedItems((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

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
              className="flex items-center justify-self-center hover:opacity-95 transition-opacity"
            >
              <BrandLogo />
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

      {/* ── Mobile Sidebar Backdrop & Drawer ── */}
      <div
        onClick={() => setMenuOpen(false)}
        className={cn(
          'fixed inset-0 z-90 bg-black/60 backdrop-blur-sm transition-opacity duration-300 lg:hidden',
          menuOpen ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
      />

      <aside
        aria-hidden={!menuOpen}
        className={cn(
          'fixed inset-y-0 right-0 z-100 flex w-[min(340px,85vw)] flex-col bg-[#071d36] text-white shadow-2xl transition-transform duration-300 ease-out lg:hidden',
          menuOpen ? 'translate-x-0' : 'translate-x-full',
        )}
      >
        {/* Drawer Top Bar */}
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
          <Link
            href="/"
            onClick={() => setMenuOpen(false)}
            className="flex items-center gap-3"
          >
            <BrandLogo light={true} className="scale-90 origin-left" />
          </Link>
          <button
            type="button"
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
            className="grid h-9 w-9 cursor-pointer place-items-center rounded-md border border-white/15 text-white/80 transition-colors hover:border-gold hover:text-gold"
          >
            <CloseIcon className="h-4 w-4" />
          </button>
        </div>

        {/* Scrollable Accordion Menu */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          <nav aria-label="Mobile Navigation">
            <ul className="flex flex-col gap-1">
              {NAV_ITEMS.map((item) => {
                const children = 'children' in item ? item.children : undefined;
                const locations = 'locations' in item ? item.locations : undefined;
                const hasSub = Boolean((children && children.length > 0) || (locations && locations.length > 0));
                const isExpanded = Boolean(expandedItems[item.label]);

                return (
                  <li key={item.label} className="border-b border-white/5 pb-1">
                    {hasSub ? (
                      <div>
                        {/* Parent item header with toggle */}
                        <div className="flex items-center justify-between rounded-md px-3 py-3 transition-colors hover:bg-white/5">
                          <Link
                            href={item.href}
                            onClick={() => setMenuOpen(false)}
                            className="font-medium text-[15px] tracking-wide text-white/90 transition-colors hover:text-gold"
                          >
                            {item.label}
                          </Link>
                          <button
                            type="button"
                            onClick={() => toggleSubmenu(item.label)}
                            aria-label={`Toggle ${item.label} menu`}
                            aria-expanded={isExpanded}
                            className="p-1.5 text-white/60 transition-colors hover:text-gold"
                          >
                            <ChevronDownIcon
                              className={cn(
                                'h-4 w-4 transition-transform duration-200',
                                isExpanded && 'rotate-180 text-gold',
                              )}
                            />
                          </button>
                        </div>

                        {/* Collapsible Dropdown Content */}
                        {isExpanded ? (
                          <div className="border-gold/30 ml-3 my-1 flex flex-col gap-0.5 border-l-2 pl-3 py-1">
                            {children?.map((child) => (
                              <Link
                                key={child.label}
                                href={child.href}
                                onClick={() => setMenuOpen(false)}
                                className="block rounded py-2 px-2 text-[13.5px] text-white/75 transition-colors hover:bg-white/5 hover:text-gold"
                              >
                                {child.label}
                              </Link>
                            ))}

                            {locations && locations.length > 0 ? (
                              <div className="mt-2 pt-2 border-t border-white/10">
                                <span className="text-gold block px-2 text-[10px] font-bold tracking-[0.2em] uppercase mb-1">
                                  Locations
                                </span>
                                <div className="flex flex-col gap-0.5">
                                  {locations.map((loc) => (
                                    <Link
                                      key={loc.label}
                                      href={loc.href}
                                      onClick={() => setMenuOpen(false)}
                                      className="block rounded py-1.5 px-2 text-[12.5px] text-white/65 transition-colors hover:bg-white/5 hover:text-gold"
                                    >
                                      {loc.label}
                                    </Link>
                                  ))}
                                </div>
                              </div>
                            ) : null}
                          </div>
                        ) : null}
                      </div>
                    ) : (
                      /* Direct Item without Submenu */
                      <Link
                        href={item.href}
                        onClick={() => setMenuOpen(false)}
                        className="block rounded-md px-3 py-3 font-medium text-[15px] tracking-wide text-white/90 transition-colors hover:bg-white/5 hover:text-gold"
                      >
                        {item.label}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>

        {/* Drawer Footer */}
        <div className="border-t border-white/10 bg-[#051529] px-6 py-5">
          <div className="flex items-center justify-between gap-2 mb-4">
            <LanguageMenu className="text-white/80" />
            <SocialLinks className="text-white/80" />
          </div>
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="flex items-center gap-2 text-[12.5px] text-white/60 transition-colors hover:text-gold"
          >
            <MailIcon className="h-3.5 w-3.5 text-gold" />
            {CONTACT_EMAIL}
          </a>
        </div>
      </aside>
    </>
  );
}
