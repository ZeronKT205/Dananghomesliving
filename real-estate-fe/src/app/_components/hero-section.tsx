import { useTranslations } from 'next-intl';

import { ButtonLink } from '@/components/ui/button';
import { HERO_PROOF_POINTS } from '@/config/constants';

import { HeroGallery } from './hero-gallery';
import { PropertySearch } from './property-search';

export function HeroSection() {
  const t = useTranslations('Hero');

  return (
    <section id="hero" aria-labelledby="hero-title" className="bg-ivory relative pt-8 pb-12 lg:pt-14 lg:pb-16 overflow-hidden">
      {/* Decorative Gold Accent Background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 -left-24 h-[420px] w-[420px] rounded-full border border-gold/15 blur-[1px] hidden lg:block"
      />

      {/* Structured Data (JSON-LD) for SEO & Google Search Console indexing */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'RealEstateAgent',
            name: 'Da Nang Homes & Living',
            description: 'Bất động sản cao cấp tại Đà Nẵng - Mua bán & Cho thuê Căn hộ, Biệt thự biển sang trọng.',
            url: 'https://dananghomesliving.com',
            address: {
              '@type': 'PostalAddress',
              addressLocality: 'Đà Nẵng',
              addressCountry: 'VN',
            },
            areaServed: 'Đà Nẵng',
            priceRange: '$$$',
          }),
        }}
      />

      <div className="container-page relative">
        {/* Main Grid: Copy Left, Gallery Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 xl:gap-14 items-center mb-8 lg:mb-12">
          {/* Left Column: Heading, Lead & CTAs */}
          <div className="lg:col-span-6 z-10 flex flex-col justify-center">
            <div className="inline-flex items-center gap-2 mb-3">
              <span className="h-px w-6 bg-gold" />
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-gold">
                {t('subtitle')}
              </span>
            </div>

            <h1
              id="hero-title"
              className="font-display text-navy text-4xl sm:text-5xl xl:text-6xl font-normal leading-[1.08] tracking-tight text-balance"
            >
              {t.rich('title', {
                gold: (chunks) => <span className="text-gold italic font-serif block sm:inline">{chunks}</span>
              })}
            </h1>

            <p className="mt-5 text-[15px] sm:text-[16px] text-muted leading-relaxed max-w-xl">
              Bộ sưu tập bất động sản hạng sang, căn hộ mặt biển và biệt thự riêng tư được tuyển chọn dành cho khách hàng quốc tế, cư dân dài hạn và nhà đầu tư tại Đà Nẵng.
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <ButtonLink href="#rent" variant="gold" className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider rounded-xl">
                Xem bất động sản thuê <span aria-hidden>→</span>
              </ButtonLink>
              <ButtonLink href="#buy" variant="outline" className="text-navy px-6 py-3.5 text-xs font-bold uppercase tracking-wider border-navy/20 hover:border-navy rounded-xl">
                Khám phá mua nhà
              </ButtonLink>
            </div>

            {/* Proof Points Stats */}
            <dl className="mt-8 pt-6 border-t border-line grid grid-cols-3 gap-4 max-w-md">
              {HERO_PROOF_POINTS.map((point) => (
                <div key={point.label} className="flex flex-col">
                  <dd className="font-display text-navy text-2xl font-semibold leading-none">
                    {point.value}
                  </dd>
                  <dt className="mt-1.5 text-[10px] font-bold tracking-widest text-muted uppercase">
                    {point.label}
                  </dt>
                </div>
              ))}
            </dl>
          </div>

          {/* Right Column: Hero Gallery */}
          <div className="lg:col-span-6 z-10">
            <HeroGallery />
          </div>
        </div>

        {/* Integrated Property Search Bar */}
        <div className="relative z-20">
          <PropertySearch />
        </div>
      </div>
    </section>
  );
}

