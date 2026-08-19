import { useTranslations } from 'next-intl';

import { ButtonLink } from '@/components/ui/button';
import { SectionKicker } from '@/components/ui/section-heading';
import { HERO_PROOF_POINTS } from '@/config/constants';

import { HeroGallery } from './hero-gallery';
import { PropertySearch } from './property-search';

export function HeroSection() {
  const t = useTranslations('Hero');

  return (
    <section id="top" aria-labelledby="hero-title" className="bg-ivory relative overflow-hidden pb-12 lg:pb-16">
      {/* Vòng tròn vàng mảnh thò ra mép trái */}
      <span
        aria-hidden
        className="border-gold/20 pointer-events-none absolute top-24 -left-28 hidden h-[420px] w-[420px] rounded-full border lg:block"
      />

      <div className="container-page relative">
        <div className="grid items-center gap-12 py-12 lg:grid-cols-[minmax(0,0.86fr)_minmax(480px,1.14fr)] lg:gap-14 lg:py-16">
          <div className="relative z-10">
            <SectionKicker>{t('subtitle')}</SectionKicker>

            <h1
              id="hero-title"
              className="font-display text-navy mt-4 sm:mt-5 text-[clamp(34px,4.5vw,58px)] leading-[1.12] sm:leading-[1.08] lg:leading-[1.05] font-normal tracking-[-0.025em] text-balance"
            >
              {t.rich('title', {
                gold: (chunks) => <span className="text-gold inline-block mt-1 sm:mt-0">{chunks}</span>,
              })}
            </h1>

            <p className="mt-6 max-w-[520px] text-[15px] text-[#5f6b78]">
              {t('lead')}
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <ButtonLink href="#rent" variant="gold">
                {t('ctaRent')} <span aria-hidden>→</span>
              </ButtonLink>
              <ButtonLink href="#buy" variant="outline" className="text-navy">
                {t('ctaBuy')}
              </ButtonLink>
            </div>

            <dl className="border-line mt-9 flex flex-wrap gap-x-8 gap-y-4 border-t pt-6">
              {HERO_PROOF_POINTS.map((point) => (
                <div key={point.label}>
                  <dd className="font-display text-navy text-[24px] leading-none font-normal">
                    {point.value}
                  </dd>
                  <dt className="text-muted mt-1.5 text-[9px] font-bold tracking-[0.14em] uppercase">
                    {point.label}
                  </dt>
                </div>
              ))}
            </dl>
          </div>

          <HeroGallery />
        </div>

        {/* Integrated Property Search on Home Page with layout="inline" */}
        <div className="relative z-20 pt-2">
          <PropertySearch layout="inline" redirectOnlyOnSubmit={true} />
        </div>
      </div>
    </section>
  );
}


