'use client';

import { useTranslations } from 'next-intl';

import { ButtonLink } from '@/components/ui/button';
import { SectionKicker, SectionTitle } from '@/components/ui/section-heading';
import {
  CONTACT_HOURS,
  CONTACT_PHONE,
  CONTACT_PHONE_HREF,
  GOOGLE_MAPS_EMBED_URL,
  GOOGLE_MAPS_LINK,
  OFFICE_ADDRESS,
} from '@/config/constants';

export function OfficeLocationSection() {
  const t = useTranslations('Office');

  return (
    <section id="location" className="bg-navy relative overflow-hidden py-20 text-white lg:py-24">
      {/* Decorative background text */}
      <span
        aria-hidden
        className="font-display pointer-events-none absolute -right-6 -bottom-8 hidden text-[140px] leading-none whitespace-nowrap text-white/[0.02] lg:block"
      >
        ĐÀ NẴNG
      </span>

      <div className="container-page relative grid items-center gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
        {/* Left column — text */}
        <div>
          <SectionKicker className="text-gold-soft">{t('kicker')}</SectionKicker>
          <SectionTitle className="text-white">{t('title')}</SectionTitle>

          <p className="mt-5 max-w-[480px] text-[15px] text-white/70">
            Our office is centrally located for easy access. Drop by for a coffee, a conversation
            about the market, or to begin your property search in person.
          </p>

          <dl className="mt-6 grid gap-3 border-t border-white/16 pt-6">
            <div>
              <dt className="text-gold-soft text-[9px] font-bold tracking-[0.16em] uppercase">
                {t('addressLabel')}
              </dt>
              <dd className="mt-1 text-[14px] text-white/80">{OFFICE_ADDRESS}</dd>
            </div>
            <div>
              <dt className="text-gold-soft text-[9px] font-bold tracking-[0.16em] uppercase">
                {t('hoursLabel')}
              </dt>
              <dd className="mt-1 text-[14px] text-white/80">{CONTACT_HOURS}</dd>
            </div>
            <div>
              <dt className="text-gold-soft text-[9px] font-bold tracking-[0.16em] uppercase">
                {t('phoneLabel')}
              </dt>
              <dd className="mt-1 text-[14px] text-white/80">{CONTACT_PHONE}</dd>
            </div>
          </dl>

          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href={GOOGLE_MAPS_LINK} variant="gold" target="_blank" rel="noreferrer">
              {t('openMaps')} <span aria-hidden>→</span>
            </ButtonLink>
            <ButtonLink href={CONTACT_PHONE_HREF} variant="outline" className="text-white">
              Call {CONTACT_PHONE}
            </ButtonLink>
          </div>
        </div>

        {/* Right column — map */}
        <div className="border-navy-2 overflow-hidden border-8">
          <iframe
            title="Da Nang Homes &amp; Living office location"
            src={GOOGLE_MAPS_EMBED_URL}
            width="100%"
            height="420"
            style={{ border: 0, display: 'block' }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </section>
  );
}
