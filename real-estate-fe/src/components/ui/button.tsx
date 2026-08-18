import { Link } from '@/i18n/routing';

import { cn } from '@/lib/utils';

import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';

type Variant = 'navy' | 'gold' | 'outline';

const BASE =
  'group inline-flex min-h-[46px] items-center justify-center gap-3 border px-5 text-[11px] font-bold tracking-[0.11em] uppercase transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold';

const VARIANTS: Record<Variant, string> = {
  navy: 'border-transparent bg-navy text-white hover:-translate-y-0.5 hover:bg-navy-2',
  gold: 'border-transparent bg-gold text-navy hover:-translate-y-0.5 hover:bg-gold-soft',
  outline: 'border-current bg-transparent hover:border-navy hover:bg-navy hover:text-white',
};

/** Mũi tên trượt nhẹ khi hover. Đặt trong phần tử có class `group`. */
export function Arrow() {
  return (
    <span
      aria-hidden
      className="text-base leading-none transition-transform duration-200 group-hover:translate-x-1"
    >
      →
    </span>
  );
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  children: ReactNode;
};

export function Button({ variant = 'navy', className, children, ...props }: ButtonProps) {
  return (
    <button className={cn(BASE, VARIANTS[variant], 'cursor-pointer', className)} {...props}>
      {children}
    </button>
  );
}

type ButtonLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'popover'> & {
  href: string;
  variant?: Variant;
  children: ReactNode;
};

export function ButtonLink({
  href,
  variant = 'navy',
  className,
  children,
  ...props
}: ButtonLinkProps) {
  return (
    <Link href={href} className={cn(BASE, VARIANTS[variant], className)} {...(props as any)}>
      {children}
    </Link>
  );
}

type TextLinkProps = {
  href: string;
  children: ReactNode;
  className?: string;
};

export function TextLink({ href, children, className }: TextLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        'group focus-visible:outline-gold inline-flex items-center gap-2.5 text-[11px] font-bold tracking-[0.11em] uppercase transition-colors focus-visible:outline-2 focus-visible:outline-offset-2',
        className,
      )}
    >
      {children}
      <Arrow />
    </Link>
  );
}
