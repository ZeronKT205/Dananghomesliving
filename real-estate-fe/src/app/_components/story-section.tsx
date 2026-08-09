import Image from 'next/image';

import { SectionKicker, SectionLead, SectionTitle } from '@/components/ui/section-heading';

const VALUES = [
  { number: '01', label: 'Clear advice, no pressure' },
  { number: '02', label: 'Verified property details' },
  { number: '03', label: 'Support beyond handover' },
] as const;

export function StorySection() {
  return (
    <section id="story" className="bg-navy relative overflow-hidden py-20 text-white lg:py-24">
      {/* Chữ nền khổng lồ, gần như chìm hẳn — chi tiết trang trí của bản thiết kế. */}
      <span
        aria-hidden
        className="font-display pointer-events-none absolute -right-8 -bottom-10 hidden text-[150px] leading-none whitespace-nowrap text-white/[0.025] lg:block"
      >
        DA NANG
      </span>

      <div className="container-page relative grid items-center gap-12 lg:grid-cols-[1.06fr_0.94fr] lg:gap-16">
        <div className="relative order-2 h-[420px] sm:h-[520px] lg:order-1 lg:h-[560px]">
          <div className="relative h-[88%] w-[78%]">
            <Image
              src="/images/story/interior.webp"
              alt="Contemporary Da Nang residence interior"
              fill
              sizes="(max-width: 1024px) 78vw, 40vw"
              className="object-cover"
            />
          </div>
          <div className="border-navy absolute right-0 bottom-0 h-[49%] w-[45%] border-8">
            <Image
              src="/images/story/detail.webp"
              alt="Premium bathroom detail"
              fill
              sizes="(max-width: 1024px) 45vw, 22vw"
              className="object-cover"
            />
          </div>
          <p className="bg-gold text-navy absolute top-[4%] right-[3%] grid h-24 w-24 rotate-[8deg] place-items-center rounded-full px-2 text-center text-[8px] font-extrabold tracking-[0.14em] uppercase shadow-[0_14px_30px_rgb(0_0_0/0.18)]">
            Local insight
            <br />
            Global standard
          </p>
        </div>

        <div className="order-1 lg:order-2">
          <SectionKicker>The Da Nang Homes &amp; Living story</SectionKicker>
          <SectionTitle className="text-white">
            A trusted local partner for a more considered way of living.
          </SectionTitle>
          <SectionLead className="text-white/67">
            The brand reads{' '}
            <strong className="font-semibold text-white">
              “DA NANG HOMES &amp; LIVING — REAL ESTATE”
            </strong>
            , guided by the promise{' '}
            <strong className="font-semibold text-white">Trust · Quality · Dedication</strong>.
          </SectionLead>
          <p className="mt-4 max-w-[560px] text-white/70">
            We combine on-the-ground knowledge with the clarity and service standards expected by
            international clients. Every home is reviewed for location, condition, lifestyle fit and
            long-term value before it enters our collection.
          </p>

          <dl className="mt-8 grid gap-5 border-t border-white/16 pt-6 sm:grid-cols-3">
            {VALUES.map((value) => (
              <div key={value.number}>
                <dd className="font-display text-gold-soft text-[26px] leading-none font-normal">
                  {value.number}
                </dd>
                <dt className="mt-1.5 text-[9px] tracking-[0.13em] text-white/56 uppercase">
                  {value.label}
                </dt>
              </div>
            ))}
          </dl>

          <p className="mt-7 flex items-center gap-4 text-[13px] text-white/76">
            <span aria-hidden className="bg-gold h-px w-10 shrink-0" />
            Independent guidance for buyers, tenants and owners.
          </p>
        </div>
      </div>
    </section>
  );
}
