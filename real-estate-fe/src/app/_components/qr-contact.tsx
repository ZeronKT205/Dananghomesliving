'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { useEffect, useRef, useState } from 'react';

import { PhoneIcon } from '@/components/ui/icons';
import { CONTACT_PHONE, CONTACT_PHONE_HREF, CONTACT_QR_IMAGE } from '@/config/constants';
import { cn } from '@/lib/utils';

/** Icon điện thoại → bung khung mã QR để khách quét gọi ngay.
 *  Dùng nút bấm (không phải hover) để trên mobile cũng mở được. */
export function QrContact({ className }: { className?: string }) {
  const t = useTranslations('Office');

  const [open, setOpen] = useState(false);
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

  return (
    <div ref={wrapperRef} className={cn('relative', className)}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-label={`Show QR code for ${CONTACT_PHONE}`}
        className={cn(
          'hover:text-gold focus-visible:outline-gold grid h-8 w-8 cursor-pointer place-items-center transition-colors focus-visible:outline-2 focus-visible:outline-offset-2',
          open && 'text-gold',
        )}
      >
        <PhoneIcon className="h-[17px] w-[17px]" />
      </button>

      {open ? (
        <div className="border-line shadow-lift absolute top-full left-0 z-50 mt-2 w-[188px] border bg-white p-3 text-center">
          <Image
            src={CONTACT_QR_IMAGE}
            alt={`QR code linking to ${CONTACT_PHONE}`}
            width={164}
            height={164}
            className="mx-auto h-[164px] w-[164px]"
          />
          <a
            href={CONTACT_PHONE_HREF}
            className="text-navy hover:text-gold mt-2 block text-[12px] font-semibold transition-colors"
          >
            {CONTACT_PHONE}
          </a>
          <p className="text-muted mt-0.5 text-[9px] tracking-[0.1em] uppercase">{t('scanToCallShort')}</p>
        </div>
      ) : null}
    </div>
  );
}
