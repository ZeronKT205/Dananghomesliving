'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { useEffect, useId, useState } from 'react';
import { createPortal } from 'react-dom';

import { ButtonLink } from '@/components/ui/button';
import { CONTACT_EMAIL } from '@/config/constants';
import type { Listing } from '@/types';

/** Nút "{t('viewProperty')}" + modal xem nhanh của CHÍNH tin đó.
 *  Mỗi thẻ tự giữ state của mình nên thẻ tin vẫn là Server Component;
 *  modal chỉ được render khi mở.
 *
 *  BẮT BUỘC dùng portal ra `document.body`: thẻ tin có `hover:-translate-y-1.5`,
 *  mà lúc bấm nút thì con trỏ đang hover nên transform đang bật. Phần tử có
 *  transform trở thành containing block của `position: fixed`, làm overlay bị
 *  giam trong thẻ thay vì phủ toàn màn hình. */
export function ListingQuickView({ listing }: { listing: Listing }) {
  const t = useTranslations('Property');

  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const titleId = useId();

  // Portal chỉ chạy được ở client; cờ này tránh lệch hydration.
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKeyDown);

    // Khoá cuộn nền khi modal mở, trả lại đúng giá trị cũ khi đóng.
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  const specs = [
    { value: listing.beds, label: t('beds') },
    { value: listing.baths, label: t('baths') },
    { value: listing.area, label: t('internalArea') },
  ];

  return (
    <>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setOpen(true);
        }}
        className="text-navy border-gold focus-visible:outline-gold hover:text-gold cursor-pointer border-b pb-1 text-[10px] font-extrabold tracking-[0.12em] uppercase transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 relative z-10"
      >
        {t('viewProperty')}
      </button>

      {open && mounted
        ? createPortal(
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby={titleId}
              onClick={(event) => {
                if (event.target === event.currentTarget) setOpen(false);
              }}
              className="fixed inset-0 z-120 grid place-items-center bg-[rgb(4_14_27/0.78)] p-5 backdrop-blur-sm"
            >
              <div className="relative grid max-h-[92vh] w-[min(900px,100%)] grid-cols-1 overflow-auto bg-white shadow-[0_35px_100px_rgb(0_0_0/0.35)] md:grid-cols-[1.05fr_0.95fr]">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label={t('closeGallery')}
                  className="border-line focus-visible:outline-gold absolute top-3 right-3 z-10 h-9 w-9 cursor-pointer border bg-white text-xl leading-none focus-visible:outline-2"
                >
                  ×
                </button>

                <div className="relative h-64 md:h-auto md:min-h-[520px]">
                  <Image
                    src={listing.image}
                    alt={listing.imageAlt}
                    fill
                    sizes="(max-width: 768px) 100vw, 480px"
                    className="object-cover"
                  />
                </div>

                <div className="p-7 md:p-10">
                  <p className="text-gold text-[10px] font-bold tracking-[0.13em] uppercase">
                    {listing.location}
                  </p>
                  <h3
                    id={titleId}
                    className="font-display text-navy mt-2 text-[26px] leading-[1.02] font-normal md:text-[32px]"
                  >
                    {listing.title}
                  </h3>
                  <p className="font-display text-navy mt-4 text-[24px]">
                    {listing.price}
                    {listing.priceNote ? (
                      <span className="text-muted ml-1.5 font-sans text-[11px]">
                        {listing.priceNote}
                      </span>
                    ) : null}
                  </p>

                  <dl className="bg-line my-5 grid grid-cols-3 gap-px">
                    {specs.map((spec) => (
                      <div key={spec.label} className="bg-white px-2 py-3.5 text-center">
                        <dd className="text-navy text-[15px] font-semibold">{spec.value}</dd>
                        <dt className="text-muted mt-0.5 text-[9px] tracking-[0.1em] uppercase">
                          {spec.label}
                        </dt>
                      </div>
                    ))}
                  </dl>

                  <p className="text-muted text-[13px]">
                    This is a curated preview. Full specifications, current availability, ownership
                    or lease terms, viewing times and location details are shared privately after
                    enquiry.
                  </p>

                  <div className="mt-6 flex flex-col gap-2.5 sm:flex-row">
                    <ButtonLink href={`mailto:${CONTACT_EMAIL}`} variant="gold">
                      {t('requestDetails')}
                    </ButtonLink>
                  </div>
                </div>
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
