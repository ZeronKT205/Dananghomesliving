'use client';

import { cn } from '@/lib/utils';

import type { ReactNode } from 'react';

/**
 * Primitive form dùng chung cho form BĐS và form bài viết.
 * Gom vào một chỗ để hai form không trôi dạt khỏi nhau về giao diện.
 */

export const inputClass =
  'border-line focus:border-navy focus:outline-navy w-full rounded-md border px-3 py-2 text-[13px] text-navy transition-colors disabled:bg-ivory disabled:text-muted';

export function Field({
  label,
  hint,
  error,
  full,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  full?: boolean;
  children: ReactNode;
}) {
  return (
    <div className={cn(full && 'sm:col-span-2')}>
      <label className="text-navy mb-1.5 block text-[11px] font-bold tracking-wider uppercase">
        {label}
      </label>
      {children}
      {error ? (
        <p className="mt-1 text-[11px] font-medium text-[#a33]">{error}</p>
      ) : hint ? (
        <p className="text-muted mt-1 text-[11px]">{hint}</p>
      ) : null}
    </div>
  );
}

export function FormCard({
  title,
  desc,
  children,
  className,
}: {
  title: string;
  desc?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn('border-line rounded-[10px] border bg-white', className)}>
      <header className="border-line border-b px-4 py-3">
        <h2 className="text-navy text-[15px] leading-tight font-extrabold">{title}</h2>
        {desc ? <p className="text-muted mt-0.5 text-[11.5px]">{desc}</p> : null}
      </header>
      <div className="p-4">{children}</div>
    </section>
  );
}

/**
 * Chuyển ngôn ngữ đang soạn.
 *
 * Schema lưu trường dịch được dạng `{ vi, en, zh, ko }`. Không có bộ chuyển này
 * thì CMS chỉ nhập được một thứ tiếng, và ba locale còn lại vĩnh viễn rỗng —
 * đúng tình trạng của bản trước.
 */
export function LocaleTabs({
  locales,
  current,
  onChange,
  filled,
}: {
  locales: readonly string[];
  current: string;
  onChange: (l: string) => void;
  filled?: Record<string, boolean>;
}) {
  return (
    <div className="border-line flex gap-0.5 border-b">
      {locales.map((l) => {
        const active = l === current;
        return (
          <button
            key={l}
            type="button"
            onClick={() => onChange(l)}
            className={cn(
              'relative px-3.5 py-2 text-[12px] font-bold uppercase transition-colors',
              active ? 'text-navy' : 'text-muted hover:text-navy',
            )}
          >
            {l}
            {/* Chấm vàng = ngôn ngữ này đã có nội dung. Nhìn là biết còn thiếu bản nào. */}
            {filled?.[l] ? (
              <span aria-hidden className="bg-gold ml-1.5 inline-block h-1.5 w-1.5 rounded-full align-middle" />
            ) : null}
            {active ? <span aria-hidden className="bg-gold absolute inset-x-0 bottom-0 h-[2px]" /> : null}
          </button>
        );
      })}
    </div>
  );
}

export function Toggle({
  checked,
  onChange,
  label,
  desc,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  desc?: string;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="border-line hover:bg-ivory/60 flex w-full items-center justify-between gap-3 rounded-md border p-3 text-left transition-colors"
    >
      <span className="min-w-0">
        <span className="text-navy block text-[13px] font-medium">{label}</span>
        {desc ? <span className="text-muted block text-[11px]">{desc}</span> : null}
      </span>
      <span
        className={cn(
          'relative inline-block h-4 w-8 shrink-0 rounded-full transition-colors',
          checked ? 'bg-gold' : 'bg-gray-300',
        )}
      >
        <span
          className={cn(
            'absolute top-0.5 h-3 w-3 rounded-full bg-white transition-all',
            checked ? 'left-[18px]' : 'left-[2px]',
          )}
        />
      </span>
    </button>
  );
}

export function SaveBar({
  saving,
  dirty,
  onSave,
  onCancel,
  saveLabel,
  error,
  message,
}: {
  saving: boolean;
  dirty: boolean;
  onSave: () => void;
  onCancel?: () => void;
  saveLabel: string;
  error?: string | null;
  message?: string | null;
}) {
  return (
    <div className="border-line sticky bottom-0 z-20 -mx-4 mt-2 flex flex-wrap items-center justify-between gap-3 border-t bg-white/95 px-4 py-3 backdrop-blur lg:-mx-5 lg:px-5">
      <div className="min-w-0 flex-1">
        {error ? (
          <p role="alert" className="truncate text-[12.5px] font-medium text-[#a33]">
            {error}
          </p>
        ) : message ? (
          <p className="truncate text-[12.5px] font-medium text-[#3f7d1f]">{message}</p>
        ) : dirty ? (
          <p className="text-muted text-[12px]">Có thay đổi chưa lưu</p>
        ) : null}
      </div>

      <div className="flex shrink-0 items-center gap-2">
        {onCancel ? (
          <button
            type="button"
            onClick={onCancel}
            className="border-line text-navy hover:border-gold h-9 rounded-md border px-4 text-[12.5px] font-bold transition-colors"
          >
            Huỷ
          </button>
        ) : null}
        <button
          type="button"
          onClick={onSave}
          disabled={saving}
          className="bg-navy hover:bg-gold h-9 rounded-md px-5 text-[12.5px] font-bold text-white transition-colors disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? 'Đang lưu…' : saveLabel}
        </button>
      </div>
    </div>
  );
}
