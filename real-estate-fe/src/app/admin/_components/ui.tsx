import Link from 'next/link';

import { cn } from '@/lib/utils';

import { IcArrowRight, IcSearch } from './icons';

import type { Tone } from '../_data/mock';
import type { ReactNode } from 'react';

/* ============================================================
   Primitive dùng chung. Kỷ luật giữ giao diện đồng nhất:
   · cỡ chữ  10 · 11.5 · 12.5 · 13.5 · 15 · 19 · 28
   · bo góc  rounded-md (6px) nhỏ · rounded-[10px] khối
   · chỉ 2 mức đổ bóng
   ============================================================ */

const TONES: Record<Tone, string> = {
  neutral: 'border-line bg-ivory text-muted',
  ok: 'border-[#cfe3d5] bg-[#f1f7ec] text-[#3f7d1f]',
  warn: 'border-[#ecdcb8] bg-[#fbf5e9] text-[#9b6b1f]',
  danger: 'border-[#eed6d3] bg-[#f9efee] text-[#8a4038]',
  brand: 'border-gold/35 bg-gold/12 text-[#8f6614]',
};

export function Pill({
  tone = 'neutral',
  children,
  className,
}: {
  tone?: Tone;
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-[3px] text-[10px] font-bold whitespace-nowrap',
        TONES[tone],
        className,
      )}
    >
      <span aria-hidden className="h-1.5 w-1.5 shrink-0 rounded-full bg-current" />
      {children}
    </span>
  );
}

export function PageHead({
  title,
  desc,
  actions,
}: {
  title: string;
  desc?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="text-navy text-[19px] leading-tight font-extrabold tracking-[-0.015em]">
          {title}
        </h1>
        {desc ? <p className="text-muted mt-1 text-[12.5px]">{desc}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
    </div>
  );
}

export function Panel({
  title,
  desc,
  extra,
  noPad = false,
  className,
  children,
}: {
  title?: string;
  desc?: string;
  extra?: ReactNode;
  noPad?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section className={cn('border-line flex flex-col rounded-[10px] border bg-white', className)}>
      {title ? (
        <header className="border-line flex flex-wrap items-center justify-between gap-3 border-b px-4 py-3">
          <div>
            <h2 className="text-navy text-[15px] leading-tight font-extrabold">{title}</h2>
            {desc ? <p className="text-muted mt-0.5 text-[11.5px]">{desc}</p> : null}
          </div>
          {extra}
        </header>
      ) : null}
      <div className={cn('flex-1', noPad ? '' : 'p-4')}>{children}</div>
    </section>
  );
}

export function PanelLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="text-muted hover:text-gold focus-visible:outline-gold group inline-flex items-center gap-1.5 text-[11.5px] font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
    >
      {children}
      <IcArrowRight size={12} className="transition-transform group-hover:translate-x-0.5" />
    </Link>
  );
}

/** Ô số liệu bấm được ở Tổng quan — vừa là chỉ số vừa là lối tắt. */
export function StatCard({
  href,
  icon,
  value,
  label,
  sub,
  tone = 'neutral',
}: {
  href: string;
  icon: ReactNode;
  value: ReactNode;
  label: string;
  sub?: string;
  tone?: Tone;
}) {
  return (
    <Link
      href={href}
      className="border-line hover:border-gold focus-visible:outline-gold flex flex-col items-start gap-0.5 rounded-[10px] border bg-white p-4 transition-colors hover:shadow-[0_1px_2px_rgb(7_29_54/0.05)] focus-visible:outline-2 focus-visible:outline-offset-2"
    >
      <span className={cn('mb-2 grid h-9 w-9 place-items-center rounded-md border', TONES[tone])}>
        {icon}
      </span>
      <span className="text-navy text-[28px] leading-none font-extrabold tabular-nums">
        {value}
      </span>
      <span className="text-navy mt-1.5 text-[12.5px] font-bold">{label}</span>
      {sub ? <span className="text-muted text-[11.5px]">{sub}</span> : null}
    </Link>
  );
}

export function EmptyState({
  icon,
  title,
  message,
}: {
  icon?: ReactNode;
  title: string;
  message?: string;
}) {
  return (
    <div className="flex flex-col items-center gap-2 px-6 py-16 text-center">
      {icon ? (
        <span className="bg-ivory text-muted mb-1 grid h-12 w-12 place-items-center rounded-full">
          {icon}
        </span>
      ) : null}
      <p className="text-navy text-[13.5px] font-bold">{title}</p>
      {message ? <p className="text-muted max-w-[40ch] text-[12.5px]">{message}</p> : null}
    </div>
  );
}

/** Tab dạng link — trạng thái nằm trên URL nên trang vẫn là Server Component. */
export function Tabs({
  basePath,
  current,
  items,
}: {
  basePath: string;
  current: string;
  items: readonly { value: string; label: string; count?: number; icon?: ReactNode }[];
}) {
  return (
    <div role="tablist" className="border-line flex gap-0.5 overflow-x-auto border-b">
      {items.map((item) => {
        const isActive = item.value === current;
        const href = item.value === items[0]?.value ? basePath : `${basePath}?tab=${item.value}`;
        return (
          <Link
            key={item.value}
            href={href}
            role="tab"
            aria-selected={isActive}
            className={cn(
              'focus-visible:outline-gold relative flex shrink-0 items-center gap-2 px-4 py-3 text-[12.5px] font-bold transition-colors focus-visible:outline-2 focus-visible:-outline-offset-2',
              isActive ? 'text-navy' : 'text-muted hover:text-navy',
            )}
          >
            {item.icon}
            {item.label}
            {typeof item.count === 'number' ? (
              <span
                className={cn(
                  'rounded-full px-1.5 text-[10px] tabular-nums',
                  isActive ? 'bg-gold/15 text-[#8f6614]' : 'bg-ivory text-muted',
                )}
              >
                {item.count}
              </span>
            ) : null}
            {isActive ? (
              <span aria-hidden className="bg-gold absolute inset-x-0 bottom-0 h-[2px]" />
            ) : null}
          </Link>
        );
      })}
    </div>
  );
}

/** Thanh công cụ: ô tìm + bộ lọc + nút chính. */
export function Toolbar({ children }: { children: ReactNode }) {
  return (
    <div className="border-line flex flex-wrap items-center gap-2 rounded-[10px] border bg-white p-2.5">
      {children}
    </div>
  );
}

export function SearchInput({ placeholder }: { placeholder: string }) {
  return (
    <div className="border-line focus-within:border-gold flex h-9 min-w-[200px] flex-1 items-center gap-2 rounded-md border px-3 transition-colors">
      <IcSearch size={14} className="text-muted shrink-0" />
      <input
        type="search"
        placeholder={placeholder}
        aria-label={placeholder}
        className="text-navy placeholder:text-muted min-w-0 flex-1 bg-transparent text-[12.5px] focus:outline-none"
      />
    </div>
  );
}

export function SelectInput({ label, options }: { label: string; options: readonly string[] }) {
  return (
    <select
      aria-label={label}
      defaultValue={options[0]}
      className="border-line text-navy focus-visible:outline-gold h-9 cursor-pointer rounded-md border bg-white px-3 text-[12.5px] font-medium focus-visible:outline-2"
    >
      {options.map((option) => (
        <option key={option}>{option}</option>
      ))}
    </select>
  );
}

/** Nút của chức năng chưa dựng — viền đứt để nhìn là biết chưa dùng được. */
export function PendingButton({ icon, children }: { icon?: ReactNode; children: ReactNode }) {
  return (
    <button
      type="button"
      disabled
      title="Chức năng này chưa được xây dựng"
      className="border-line text-muted inline-flex h-9 shrink-0 cursor-not-allowed items-center gap-2 rounded-md border border-dashed bg-white px-4 text-[12.5px] font-bold"
    >
      {icon}
      {children}
    </button>
  );
}

/** Nút icon vuông dùng trong chân thẻ. */
export function IconButton({
  label,
  tone,
  children,
}: {
  label: string;
  tone?: 'danger';
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      disabled
      aria-label={label}
      title={`${label} — chưa được xây dựng`}
      className={cn(
        'border-line grid h-7 w-7 cursor-not-allowed place-items-center rounded-md border bg-white transition-colors',
        tone === 'danger' ? 'text-[#8a4038]/50' : 'text-muted/60',
      )}
    >
      {children}
    </button>
  );
}

export function Avatar({ name, size = 'md' }: { name: string; size?: 'md' | 'lg' }) {
  const initials = name
    .trim()
    .split(/\s+/)
    .slice(-2)
    .map((part) => part[0] ?? '')
    .join('')
    .toUpperCase();

  return (
    <span
      aria-hidden
      className={cn(
        'bg-navy/8 text-navy grid shrink-0 place-items-center rounded-full font-extrabold',
        size === 'lg' ? 'h-12 w-12 text-[15px]' : 'h-9 w-9 text-[12px]',
      )}
    >
      {initials}
    </span>
  );
}

/** Trường chỉ đọc trong Cài đặt. */
export function Field({
  label,
  value,
  hint,
  full = false,
}: {
  label: string;
  value: string;
  hint?: string;
  full?: boolean;
}) {
  return (
    <div className={cn('grid gap-1.5', full && 'sm:col-span-2')}>
      <span className="text-navy text-[12px] font-bold">{label}</span>
      <span className="border-line text-navy bg-ivory/40 rounded-md border px-3 py-2 text-[13px]">
        {value}
      </span>
      {hint ? <span className="text-muted text-[11.5px]">{hint}</span> : null}
    </div>
  );
}
