'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

import { BrandLogo } from '@/components/ui/brand-logo';
import { cn } from '@/lib/utils';

import {
  IcBuilding,
  IcClose,
  IcDashboard,
  IcExternal,
  IcInbox,
  IcMenu,
  IcNews,
  IcSettings,
} from './icons';
import { UserMenu } from './user-menu';

import type { ReactNode } from 'react';

/** Đúng 5 mục. Mọi thứ khác gom thành tab bên trong trang tương ứng —
 *  menu dài là nguyên nhân chính khiến bản trước khó dùng. */
const NAV = [
  { href: '/admin', label: 'Tổng quan', Icon: IcDashboard },
  { href: '/admin/inquiries', label: 'Form tư vấn', Icon: IcInbox },
  { href: '/admin/properties', label: 'Bất động sản', Icon: IcBuilding },
  { href: '/admin/news', label: 'Tin tức', Icon: IcNews },
  { href: '/admin/settings', label: 'Cài đặt', Icon: IcSettings },
] as const;

export interface AdminShellProps {
  children: ReactNode;
  /** Số yêu cầu chưa xử lý — badge cạnh menu. Trước đây hardcode 3. */
  pendingInquiries?: number;
  currentUser?: { name: string; email: string; role: string } | null;
}

export function AdminShell({ children, pendingInquiries = 0, currentUser = null }: AdminShellProps) {
  const pathname = usePathname();
  const [navOpen, setNavOpen] = useState(false);
  const [pendingHref, setPendingHref] = useState<string | null>(null);

  useEffect(() => {
    setNavOpen(false);
    setPendingHref(null);
  }, [pathname]);

  useEffect(() => {
    if (!navOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setNavOpen(false);
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [navOpen]);

  const current = NAV.find((item) =>
    item.href === '/admin' ? pathname === '/admin' : pathname?.startsWith(item.href),
  );

  // Trang đăng nhập nằm dưới /admin nên bị layout này bọc, nhưng nó không được
  // có sidebar/header — người chưa đăng nhập thì chẳng có gì để điều hướng.
  if (pathname?.startsWith('/admin/login')) {
    return <div className="font-admin text-ink">{children}</div>;
  }

  const activeHref = pendingHref ?? current?.href;

  return (
    <div className="font-admin bg-ivory/50 text-ink flex min-h-screen text-[13.5px] leading-[1.55]">
      {navOpen ? (
        <div
          onClick={() => setNavOpen(false)}
          className="admin-fade-backdrop fixed inset-0 z-40 bg-[rgb(7_29_54/0.45)] lg:hidden"
        />
      ) : null}

      <aside
        className={cn(
          'bg-navy fixed inset-y-0 left-0 z-50 flex w-[236px] shrink-0 flex-col text-white/85 transition-transform duration-300 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0',
          navOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="flex h-14 shrink-0 items-center justify-between gap-2 border-b border-white/10 px-4">
          <Link
            href="/admin"
            onClick={() => setPendingHref('/admin')}
            className="group/logo flex min-w-0 items-center gap-2 transition-transform duration-200 hover:scale-[1.02]"
          >
            <BrandLogo light size="sm" subtitle="QUẢN TRỊ" showTagline={false} />
          </Link>
          <button
            type="button"
            onClick={() => setNavOpen(false)}
            aria-label="Đóng menu"
            className="focus-visible:outline-gold -mr-1 cursor-pointer p-1 text-white/60 hover:text-white focus-visible:outline-2 lg:hidden"
          >
            <IcClose size={16} />
          </button>
        </div>

        <nav aria-label="Menu quản trị" className="flex-1 overflow-y-auto px-3 py-4">
          <p className="px-3 pb-2 text-[9.5px] font-bold tracking-[0.2em] text-white/35 uppercase">
            Menu
          </p>
          <ul className="grid gap-0.5">
            {NAV.map(({ href, label, Icon }) => {
              const isActive = activeHref === href;
              const badge = href === '/admin/inquiries' ? pendingInquiries : 0;
              return (
                <li key={href}>
                  <Link
                    href={href}
                    prefetch={true}
                    onClick={() => setPendingHref(href)}
                    aria-current={isActive ? 'page' : undefined}
                    className={cn(
                      'focus-visible:outline-gold relative flex items-center gap-3 rounded-md px-3 py-2.5 text-[13px] transition-all duration-200 focus-visible:outline-2 focus-visible:-outline-offset-2',
                      isActive
                        ? 'bg-white/8 font-bold text-white'
                        : 'text-white/60 hover:bg-white/5 hover:text-white hover:pl-4',
                    )}
                  >
                    <span
                      aria-hidden
                      className={cn(
                        'bg-gold absolute top-1/2 left-0 w-[3px] -translate-y-1/2 rounded-r transition-all duration-300',
                        isActive ? 'h-5 opacity-100' : 'h-0 opacity-0',
                      )}
                    />
                    <Icon size={17} className="shrink-0 transition-transform duration-200 group-hover:translate-x-0.5" />
                    <span className="flex-1">{label}</span>
                    {badge > 0 ? (
                      <span className="admin-pulse-attention bg-gold text-navy rounded-full px-1.5 text-[10px] font-extrabold tabular-nums">
                        {badge}
                      </span>
                    ) : null}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="shrink-0 border-t border-white/10 p-3">
          <a
            href="/"
            target="_blank"
            rel="noreferrer noopener"
            className="focus-visible:outline-gold flex items-center gap-2.5 rounded-md px-3 py-2 text-[12.5px] text-white/60 transition-colors hover:bg-white/5 hover:text-white focus-visible:outline-2"
          >
            <IcExternal size={14} />
            Xem website
          </a>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="border-line sticky top-0 z-30 flex h-14 shrink-0 items-center justify-between gap-3 border-b bg-white px-4 lg:px-5">
          <div className="flex min-w-0 items-center gap-2.5">
            <button
              type="button"
              onClick={() => setNavOpen(true)}
              aria-label="Mở menu"
              className="border-line hover:border-gold hover:text-gold focus-visible:outline-gold grid h-9 w-9 shrink-0 cursor-pointer place-items-center rounded-md border transition-colors focus-visible:outline-2 lg:hidden"
            >
              <IcMenu size={16} />
            </button>
            {/* Đường dẫn, không phải tiêu đề — tiêu đề thật nằm trong trang. */}
            <p className="text-muted truncate text-[12.5px]">
              Quản trị<span className="px-1.5 opacity-40">/</span>
              <span className="text-navy font-bold">{current?.label ?? 'Tổng quan'}</span>
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <a
              href="/"
              target="_blank"
              rel="noreferrer noopener"
              className="border-line text-navy hover:border-gold hover:text-gold focus-visible:outline-gold inline-flex h-9 shrink-0 items-center gap-2 rounded-md border px-3 text-[12px] font-bold transition-colors focus-visible:outline-2"
            >
              <IcExternal size={13} />
              <span className="hidden sm:inline">Xem website</span>
            </a>
            <UserMenu user={currentUser} />
          </div>
        </header>

        {/* Không giới hạn bề ngang — nội dung giãn hết màn hình như CMS mẫu. */}
        <main className="min-w-0 flex-1 p-4 lg:p-5">
          <div className="flex flex-col gap-4">{children}</div>
        </main>
      </div>
    </div>
  );
}
