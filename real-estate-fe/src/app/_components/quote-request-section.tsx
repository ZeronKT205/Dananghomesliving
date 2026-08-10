'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import { SectionKicker, SectionTitle } from '@/components/ui/section-heading';
import { QUOTE_SERVICE_OPTIONS } from '@/config/constants';
import { cn } from '@/lib/utils';

/* ── Cam kết hiển thị cạnh form ──────────────────────────── */
const COMMITMENTS = [
  { title: 'Prompt response', desc: 'We reply within one working day' },
  { title: 'Tailored shortlist', desc: 'Homes matched to your brief, not generic listings' },
  { title: 'Accompanied viewings', desc: 'Every visit with a knowledgeable local advisor' },
  { title: 'Transparent pricing', desc: 'No hidden fees — clear breakdown at every stage' },
] as const;

/* ── Confetti thương hiệu ─────────────────────────────────── */
function triggerConfetti(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const width = (canvas.width = canvas.offsetWidth);
  const height = (canvas.height = canvas.offsetHeight);

  // Brand palette: navy, gold, ivory accents
  const colors = ['#071d36', '#102b4d', '#c9922e', '#e0b75f', '#e8dcc5'];

  const particles = Array.from({ length: 50 }, () => ({
    x: width / 2,
    y: height / 2 - 20,
    radius: Math.random() * 4 + 2,
    color: colors[Math.floor(Math.random() * colors.length)]!,
    vx: (Math.random() - 0.5) * 12,
    vy: -Math.random() * 10 - 4,
    rotation: Math.random() * 360,
    rotationSpeed: (Math.random() - 0.5) * 8,
    opacity: 1,
  }));

  let frame: number;

  function update() {
    ctx!.clearRect(0, 0, width, height);
    let active = false;

    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.3;
      p.vx *= 0.98;
      p.rotation += p.rotationSpeed;

      if (p.y > height - 10) {
        p.vy = -p.vy * 0.4;
        p.vx *= 0.8;
      }
      if (p.vy > 1) p.opacity -= 0.015;

      if (p.opacity > 0) {
        active = true;
        ctx!.save();
        ctx!.translate(p.x, p.y);
        ctx!.rotate((p.rotation * Math.PI) / 180);
        ctx!.fillStyle = p.color;
        ctx!.globalAlpha = p.opacity;
        ctx!.fillRect(-p.radius, -p.radius * 1.5, p.radius * 2, p.radius * 3);
        ctx!.restore();
      }
    }

    if (active) frame = requestAnimationFrame(update);
    else ctx!.clearRect(0, 0, width, height);
  }

  update();
  return () => cancelAnimationFrame(frame);
}

export function QuoteRequestSection() {
  const [submitted, setSubmitted] = useState(false);
  const [countdown, setCountdown] = useState(6);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setCountdown(6);
  }, []);

  /* Confetti + countdown timer sau khi gửi */
  useEffect(() => {
    if (!submitted) return;

    let cleanup: (() => void) | undefined;
    if (canvasRef.current) cleanup = triggerConfetti(canvasRef.current);

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setSubmitted(false);
          return 6;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(timer);
      cleanup?.();
    };
  }, [submitted]);

  return (
    <section id="quote" className="bg-ivory py-20 lg:py-24">
      <div className="container-page grid items-start gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
        {/* ── Left — copy + commitment points ─────────────── */}
        <div>
          <SectionKicker>Start your journey</SectionKicker>
          <SectionTitle>A great home begins with the right conversation.</SectionTitle>
          <p className="text-muted mt-5 max-w-[520px] text-[15px]">
            Share your requirements — preferred area, budget and move-in timeline. We will respond
            with a curated shortlist and arrange viewings at your convenience.
          </p>

          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            {COMMITMENTS.map((c) => (
              <div key={c.title} className="border-line border-l-[3px] pl-4">
                <strong className="text-navy block text-[14px] font-semibold">{c.title}</strong>
                <span className="text-muted block text-[12px]">{c.desc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Right — form card ────────────────────────────── */}
        <div className="border-line shadow-lift relative overflow-hidden border bg-white p-7 sm:p-9">
          {submitted ? (
            <div className="flex min-h-[380px] flex-col items-center justify-center text-center">
              <canvas
                ref={canvasRef}
                className="pointer-events-none absolute inset-0 h-full w-full"
              />
              <div className="bg-gold mb-5 grid h-16 w-16 place-items-center rounded-full text-[28px] font-bold text-white">
                ✓
              </div>
              <h3 className="font-display text-navy text-[22px] leading-tight font-normal">
                Enquiry sent successfully
              </h3>
              <p className="text-muted mx-auto mt-3 max-w-[320px] text-[14px]">
                Thank you for reaching out. Our team will contact you within 24 hours with a
                tailored property selection.
              </p>
              <span className="text-gold mt-5 text-[12px] font-semibold tracking-[0.08em] uppercase">
                Returning to form in {countdown}s…
              </span>
            </div>
          ) : (
            <>
              <h3 className="font-display text-navy text-[22px] leading-tight font-normal">
                Request a consultation
              </h3>
              <p className="text-muted mt-1 text-[13px]">
                Fill in a few details and we will be in touch.
              </p>

              <form onSubmit={handleSubmit} className="mt-6">
                <div className="grid gap-5 sm:grid-cols-2">
                  {/* Name */}
                  <div className="flex flex-col gap-1.5">
                    <label
                      htmlFor="q-name"
                      className="text-navy text-[11px] font-bold tracking-[0.08em] uppercase"
                    >
                      Full name *
                    </label>
                    <input
                      id="q-name"
                      type="text"
                      required
                      placeholder="e.g. Nguyen Van A"
                      className={cn(inputClass)}
                    />
                  </div>

                  {/* Email */}
                  <div className="flex flex-col gap-1.5">
                    <label
                      htmlFor="q-email"
                      className="text-navy text-[11px] font-bold tracking-[0.08em] uppercase"
                    >
                      Email *
                    </label>
                    <input
                      id="q-email"
                      type="email"
                      required
                      placeholder="name@example.com"
                      className={cn(inputClass)}
                    />
                  </div>

                  {/* Phone */}
                  <div className="flex flex-col gap-1.5">
                    <label
                      htmlFor="q-phone"
                      className="text-navy text-[11px] font-bold tracking-[0.08em] uppercase"
                    >
                      Phone
                    </label>
                    <input
                      id="q-phone"
                      type="tel"
                      placeholder="+84 909 123 456"
                      className={cn(inputClass)}
                    />
                  </div>

                  {/* Interest */}
                  <div className="flex flex-col gap-1.5">
                    <label
                      htmlFor="q-interest"
                      className="text-navy text-[11px] font-bold tracking-[0.08em] uppercase"
                    >
                      Interest *
                    </label>
                    <select id="q-interest" required className={cn(inputClass)}>
                      <option value="">— Select —</option>
                      {QUOTE_SERVICE_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Message — full width */}
                  <div className="flex flex-col gap-1.5 sm:col-span-2">
                    <label
                      htmlFor="q-message"
                      className="text-navy text-[11px] font-bold tracking-[0.08em] uppercase"
                    >
                      Tell us about your ideal home
                    </label>
                    <textarea
                      id="q-message"
                      rows={4}
                      placeholder="Preferred area, number of bedrooms, budget range, move-in date…"
                      className={cn(inputClass, 'resize-y')}
                    />
                  </div>
                </div>

                <Button type="submit" variant="gold" className="mt-6 w-full sm:w-auto">
                  Send enquiry <span aria-hidden>→</span>
                </Button>
              </form>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

/* ── Shared input styling ─────────────────────────────────── */
const inputClass =
  'w-full border border-line bg-paper px-4 py-3 text-[14px] text-ink placeholder:text-muted/60 transition-colors focus:border-gold focus:outline-none';
