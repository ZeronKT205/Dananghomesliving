import { ButtonLink } from '@/components/ui/button';
import { CONTACT_EMAIL } from '@/config/constants';

export function ContactCta() {
  return (
    <section id="contact" className="bg-gold text-navy py-14 lg:py-16">
      <div className="container-page flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center lg:gap-12">
        <h2 className="font-display max-w-[620px] text-[clamp(26px,3vw,40px)] leading-[1.02] font-normal text-balance">
          Tell us how you want to live. We will curate the right homes.
        </h2>
        <ButtonLink href={`mailto:${CONTACT_EMAIL}`} className="shrink-0">
          Start a private enquiry <span aria-hidden>→</span>
        </ButtonLink>
      </div>
    </section>
  );
}
