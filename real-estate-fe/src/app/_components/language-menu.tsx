'use client';

import { useLocale } from 'next-intl';
import { useEffect, useRef, useState, useTransition } from 'react';

import { ChevronDownIcon } from '@/components/ui/icons';
import { LANGUAGES } from '@/config/constants';
import type { LanguageCode } from '@/config/constants';
import { usePathname, useRouter } from '@/i18n/routing';
import { cn } from '@/lib/utils';

export function LanguageMenu({ className }: { className?: string }) {
  const [open, setOpen] = useState(false);
  const locale = useLocale() as LanguageCode;
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const pathname = usePathname();
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: MouseEvent) => {
      if (!wrapperRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };

    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  const onLanguageChange = (nextLocale: LanguageCode) => {
    startTransition(() => {
      router.replace(pathname, { locale: nextLocale });
    });
    setOpen(false);
  };

  return (
    <div ref={wrapperRef} className={cn('relative', className, isPending && 'opacity-70')}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-haspopup="menu"
        className="hover:text-gold focus-visible:outline-gold flex cursor-pointer items-center gap-1.5 text-[10.5px] font-semibold tracking-[0.14em] uppercase transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
      >
        Language
        <ChevronDownIcon
          className={cn('h-3 w-3 transition-transform duration-200', open && 'rotate-180')}
        />
      </button>

      {open ? (
        <ul
          role="menu"
          className="border-line shadow-lift absolute top-full left-0 z-50 mt-2 w-[150px] border bg-white py-1"
        >
          {LANGUAGES.map((language) => {
            const isActive = language.code === locale;
            return (
              <li key={language.code} role="none">
                <button
                  type="button"
                  role="menuitemradio"
                  aria-checked={isActive}
                  onClick={() => onLanguageChange(language.code)}
                  className={cn(
                    'hover:bg-ivory flex w-full cursor-pointer items-center justify-between px-3.5 py-2 text-left text-[12.5px] transition-colors',
                    isActive ? 'text-gold font-semibold' : 'text-navy',
                  )}
                >
                  {language.label}
                  <span className="text-[9px] tracking-[0.1em] opacity-60">{language.short}</span>
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
