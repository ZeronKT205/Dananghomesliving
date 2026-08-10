import { SectionKicker, SectionTitle } from '@/components/ui/section-heading';

const STEPS = [
  {
    number: '01',
    title: 'Consultation',
    detail: 'Understand your brief, budget, and timeline.',
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        className="h-6 w-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M20 2H4a2 2 0 00-2 2v12a2 2 0 002 2h3l5 4 5-4h3a2 2 0 002-2V4a2 2 0 00-2-2z"
        />
        <circle cx="8" cy="10" r="1" fill="currentColor" stroke="none" />
        <circle cx="12" cy="10" r="1" fill="currentColor" stroke="none" />
        <circle cx="16" cy="10" r="1" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    number: '02',
    title: 'Shortlist',
    detail: 'Curate verified options and virtual previews.',
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        className="h-6 w-6"
      >
        <rect x="3" y="2" width="18" height="20" rx="2" />
        <path strokeLinecap="round" d="M8 7h8M8 11h8M8 15h5" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 14l1.5 1.5L20 13" />
      </svg>
    ),
  },
  {
    number: '03',
    title: 'Viewing',
    detail: 'Accompanied visits and neighbourhood context.',
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        className="h-6 w-6"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 21h18M5 21V7l7-4 7 4v14" />
        <rect x="9" y="13" width="6" height="8" rx="0.5" />
        <rect x="10" y="8" width="4" height="3" rx="0.5" />
      </svg>
    ),
  },
  {
    number: '04',
    title: 'Negotiation',
    detail: 'Fair terms, legal review, and due diligence.',
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        className="h-6 w-6"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 11l3-3 2 2 5-5" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M14 5h3v3" />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 17l3 3h4l1.5-1.5M21 17l-3 3h-4l-1.5-1.5"
        />
        <path strokeLinecap="round" d="M9 14l6 0" />
      </svg>
    ),
  },
  {
    number: '05',
    title: 'Handover',
    detail: 'Contracts, keys, and ongoing assistance.',
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        className="h-6 w-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15 3a3 3 0 11-6 0M21 10a2 2 0 00-2-2h-4l-3 3-3-3H5a2 2 0 00-2 2v1a2 2 0 002 2h14a2 2 0 002-2v-1z"
        />
        <path strokeLinecap="round" d="M12 13v5" />
        <circle cx="12" cy="20" r="2" />
      </svg>
    ),
  },
] as const;

export function WhyChooseSection() {
  return (
    <section id="why-us" className="bg-ivory relative overflow-hidden py-20 lg:py-24">
      {/* ── Decorative background elements ─────────────── */}
      <svg
        aria-hidden
        className="pointer-events-none absolute inset-0 h-full w-full"
        preserveAspectRatio="none"
      >
        {/* Flowing curved path behind the cards */}
        <path
          d="M-40,320 C200,280 300,380 500,300 S800,360 1000,310 S1300,370 1600,290 S1900,350 2100,300"
          fill="none"
          stroke="var(--color-gold)"
          strokeWidth="1"
          opacity="0.12"
        />
        <path
          d="M-40,340 C200,300 300,400 500,320 S800,380 1000,330 S1300,390 1600,310 S1900,370 2100,320"
          fill="none"
          stroke="var(--color-gold)"
          strokeWidth="1"
          opacity="0.07"
        />
        {/* Decorative small dots */}
        <circle cx="5%" cy="20%" r="2" fill="var(--color-gold)" opacity="0.15" />
        <circle cx="95%" cy="25%" r="2" fill="var(--color-gold)" opacity="0.15" />
        <circle cx="15%" cy="75%" r="3" fill="var(--color-gold)" opacity="0.1" />
        <circle cx="85%" cy="80%" r="2.5" fill="var(--color-gold)" opacity="0.1" />
        <circle cx="50%" cy="15%" r="2" fill="var(--color-gold)" opacity="0.12" />
      </svg>

      <div className="container-page relative">
        {/* ── Section header ──────────────────────────────── */}
        <div className="mb-14 max-w-[560px]">
          <SectionKicker>Our process</SectionKicker>
          <SectionTitle>A clear five-step journey</SectionTitle>
          <p className="text-muted mt-4 max-w-[480px] text-[15px]">
            From first conversation to keys in hand — every stage is transparent and guided.
          </p>
        </div>

        {/* ── Steps grid ──────────────────────────────────── */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5 lg:gap-0">
          {STEPS.map((step, index) => (
            <div key={step.number} className="relative flex flex-col items-center">
              {/* Connector "+" between cards (desktop only) */}
              {index < STEPS.length - 1 && (
                <span
                  aria-hidden
                  className="text-gold/40 absolute top-[52px] -right-3 z-10 hidden text-[18px] font-light lg:block"
                >
                  +
                </span>
              )}

              {/* Circle icon */}
              <div className="border-gold/30 text-gold mb-4 grid h-[72px] w-[72px] place-items-center rounded-full border-2 bg-white shadow-[0_4px_20px_rgb(201_146_46/0.1)]">
                {step.icon}
              </div>

              {/* Card body */}
              <div className="border-line w-full border bg-white/70 px-5 py-6 text-center backdrop-blur-sm">
                <span className="text-gold text-[9px] font-bold tracking-[0.2em] uppercase">
                  Step {step.number}
                </span>
                <h3 className="font-display text-navy mt-2 text-[17px] leading-tight font-normal">
                  {step.title}
                </h3>
                <p className="text-muted mx-auto mt-2 max-w-[200px] text-[12px] leading-relaxed">
                  {step.detail}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
