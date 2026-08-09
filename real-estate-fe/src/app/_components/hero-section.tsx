import { ButtonLink } from '@/components/ui/button';
import { SectionKicker } from '@/components/ui/section-heading';
import { HERO_PROOF_POINTS } from '@/config/constants';

import { HeroGallery } from './hero-gallery';

export function HeroSection() {
  return (
    <section id="top" aria-labelledby="hero-title" className="bg-ivory relative overflow-hidden">
      {/* Vòng tròn vàng mảnh thò ra mép trái — chi tiết trang trí của bản thiết kế. */}
      <span
        aria-hidden
        className="border-gold/20 pointer-events-none absolute top-24 -left-28 hidden h-[420px] w-[420px] rounded-full border lg:block"
      />

      <div className="container-page relative grid items-center gap-12 py-14 lg:grid-cols-[minmax(0,0.86fr)_minmax(480px,1.14fr)] lg:gap-14 lg:py-20">
        <div className="relative z-10">
          <SectionKicker>Premium real estate in Da Nang</SectionKicker>

          <h1
            id="hero-title"
            className="font-display text-navy mt-5 text-[clamp(40px,5.4vw,68px)] leading-[0.92] font-normal tracking-[-0.035em] text-balance"
          >
            Exceptional homes.
            <br />
            <em className="text-gold not-italic">Effortless living.</em>
          </h1>

          <p className="mt-6 max-w-[520px] text-[15px] text-[#5f6b78]">
            A carefully curated collection of premium apartments, beachfront residences and private
            villas for international buyers, long-stay residents and investors.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <ButtonLink href="#buy" variant="gold">
              Explore homes to buy <span aria-hidden>→</span>
            </ButtonLink>
            <ButtonLink href="#rent" variant="outline" className="text-navy">
              View long-term rentals
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
    </section>
  );
}
