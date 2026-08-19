'use client';

import { useTranslations } from 'next-intl';

import { ButtonLink } from '@/components/ui/button';
import { CONTACT_EMAIL } from '@/config/constants';

export function ContactCta() {
  const t = useTranslations('ContactCta');

  return (
    <section id="contact" className="bg-gold text-navy py-14 lg:py-16">
      <div className="container-page flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center lg:gap-12">
        <h2 className="font-display max-w-[620px] text-[clamp(26px,3vw,40px)] leading-[1.02] font-normal text-balance">
          {t('title')}
        </h2>
        <ButtonLink href={`mailto:${CONTACT_EMAIL}`} className="shrink-0">
          {t('cta')} <span aria-hidden>→</span>
        </ButtonLink>
      </div>
    </section>
  );
}
