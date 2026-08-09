import { cn } from '@/lib/utils';

import type { ReactNode } from 'react';

/** Nhãn nhỏ có gạch vàng phía trước, dùng mở đầu mọi section. */
export function SectionKicker({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <p
      className={cn(
        'text-gold flex items-center gap-3 text-[10px] font-bold tracking-[0.2em] uppercase',
        className,
      )}
    >
      <span aria-hidden className="h-px w-8 shrink-0 bg-current" />
      {children}
    </p>
  );
}

type SectionTitleProps = {
  children: ReactNode;
  /** Mặc định h2; hero dùng h1. */
  as?: 'h1' | 'h2';
  className?: string;
};

export function SectionTitle({ children, as: Tag = 'h2', className }: SectionTitleProps) {
  return (
    <Tag
      className={cn(
        'font-display mt-3 text-[clamp(30px,3.2vw,44px)] leading-[1.02] font-normal tracking-[-0.025em] text-balance',
        className,
      )}
    >
      {children}
    </Tag>
  );
}

export function SectionLead({ children, className }: { children: ReactNode; className?: string }) {
  return <p className={cn('text-muted mt-4 max-w-[560px] text-[15px]', className)}>{children}</p>;
}

/** Cụm đầu section: khối tiêu đề bên trái, phần phụ (lead hoặc link) bên phải. */
export function SectionHead({ children, aside }: { children: ReactNode; aside?: ReactNode }) {
  return (
    <div className="mb-10 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end md:gap-12">
      <div className="max-w-[640px]">{children}</div>
      {aside ? <div className="md:mb-1.5 md:max-w-[420px]">{aside}</div> : null}
    </div>
  );
}
