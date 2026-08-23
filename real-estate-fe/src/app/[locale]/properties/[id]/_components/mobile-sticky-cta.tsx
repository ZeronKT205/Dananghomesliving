'use client';

import { useTranslations } from 'next-intl';

import { useSiteSettings } from '@/components/site-settings-provider';
import { PhoneIcon } from '@/components/ui/icons';

interface MobileStickyCTAProps {
  price: string | { usd: string; vnd?: string };
  title?: string;
}

export function MobileStickyCTA({ price }: MobileStickyCTAProps) {
  const t = useTranslations('Property');
  const settings = useSiteSettings();
  const phoneHref = settings?.contact.phoneHref || 'tel:+842363888888';

  const displayPrice = typeof price === 'string' ? price : price?.usd || '';
  const formattedPrice = displayPrice.startsWith('$') ? displayPrice : `$${displayPrice}`;

  const scrollToForm = () => {
    const enquiryForm = document.getElementById('enquiry-form');
    if (enquiryForm) {
      enquiryForm.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-80 border-t border-gold/40 bg-navy/98 text-white backdrop-blur-md px-4 py-3 shadow-2xl md:hidden animate-toast-in rounded-none">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0 flex-1">
          <span className="block text-[9px] font-bold tracking-[0.2em] text-gold uppercase">
            {t('listedPrice')}
          </span>
          <p className="font-sans text-[16px] font-semibold leading-none text-white truncate">
            {formattedPrice}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <a
            href={phoneHref}
            aria-label={t('callDirect')}
            className="grid h-11 w-11 cursor-pointer place-items-center rounded-none border border-gold/40 bg-navy-2 text-gold transition-colors hover:bg-gold hover:text-navy active:scale-95"
          >
            <PhoneIcon className="h-5 w-5" />
          </a>

          <button
            type="button"
            onClick={scrollToForm}
            className="flex items-center justify-center rounded-none bg-gold px-5 py-3 text-[12px] font-bold uppercase tracking-[0.14em] text-navy shadow-md transition-all hover:bg-gold-soft active:scale-95 whitespace-nowrap"
          >
            {t('bookViewing')}
          </button>
        </div>
      </div>
    </div>
  );
}
