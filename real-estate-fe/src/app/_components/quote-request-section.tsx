'use client';

import { useLocale } from 'next-intl';
import { useCallback, useEffect, useRef, useState, useTransition } from 'react';

import { Button } from '@/components/ui/button';
import { SectionKicker } from '@/components/ui/section-heading';
import { useToast } from '@/components/ui/toast-provider';
import { QUOTE_SERVICE_OPTIONS } from '@/config/constants';
import { cn } from '@/lib/utils';
import { actionSubmitQuote } from '@/server/actions/public-actions';


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

const EMPTY_QUOTE = { name: '', email: '', phone: '', service: '', message: '' };

export function QuoteRequestSection() {
  const locale = useLocale();
  const [loading, startSending] = useTransition();
  const [submitted, setSubmitted] = useState(false);
  const [countdown, setCountdown] = useState(6);
  const [form, setForm] = useState(EMPTY_QUOTE);
  const [website, setWebsite] = useState(''); // bẫy bot
  const [error, setError] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { showToast } = useToast();

  const set = useCallback((k: keyof typeof EMPTY_QUOTE, value: string) => {
    setForm((p) => ({ ...p, [k]: value }));
  }, []);

  /*
   * Gửi thật vào bảng `inquiries`.
   *
   * Trước đây chỉ `setTimeout(600)` rồi bắn pháo giấy — khách tưởng đã gửi, còn
   * CMS không nhận được gì. Đây là kiểu lỗi tệ nhất vì không ai phát hiện ra
   * cho tới lúc khách gọi hỏi sao không thấy hồi âm.
   */
  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      setError(null);

      startSending(async () => {
        const res = await actionSubmitQuote({
          name: form.name,
          email: form.email,
          phone: form.phone || null,
          service: form.service || null,
          message: form.message,
          locale,
          website,
        });

        if (!res.ok) {
          setError(res.message);
          return;
        }

        setSubmitted(true);
        setCountdown(6);
        setForm(EMPTY_QUOTE);
        showToast('Đã gửi yêu cầu! Chúng tôi sẽ liên hệ lại sớm.', 'success');
      });
    },
    [form, locale, showToast, website],
  );

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
    <section id="quote" className="border-t border-line bg-ivory pt-16 pb-8 lg:pt-20 lg:pb-10 text-navy relative">
      <div className="container-page grid items-start gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
        {/* ── Left — copy + commitment points ─────────────── */}
        <div>
          <SectionKicker>Start your journey</SectionKicker>
          <h2 className="font-display text-navy mt-2 text-[32px] leading-tight font-normal sm:text-[40px]">
            A great home begins with the right conversation.
          </h2>
          <p className="text-muted mt-5 max-w-[520px] text-[15px] leading-relaxed">
            Share your requirements — preferred area, budget and move-in timeline. We will respond
            with a curated shortlist and arrange viewings at your convenience.
          </p>

          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            {COMMITMENTS.map((c) => (
              <div key={c.title} className="border-gold border-l-[3px] pl-4">
                <strong className="text-navy block text-[14px] font-semibold">{c.title}</strong>
                <span className="text-muted block text-[12px] mt-0.5">{c.desc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Right — Light Bright Luxury Form Card ────────────────────────────── */}
        <div className="border border-line bg-white shadow-lift relative overflow-hidden p-7 sm:p-9 text-navy rounded-sm">
          {submitted ? (
            <div className="flex min-h-[380px] flex-col items-center justify-center text-center animate-fade-in">
              <canvas
                ref={canvasRef}
                className="pointer-events-none absolute inset-0 h-full w-full"
              />
              <div className="bg-gold mb-5 grid h-16 w-16 place-items-center text-[28px] font-bold text-navy animate-checkmark rounded-full shadow-lg shadow-gold/20">
                ✓
              </div>
              <h3 className="font-display text-navy text-[24px] leading-tight font-normal">
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
              <h3 className="font-display text-navy text-[24px] leading-tight font-normal">
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
                      value={form.name}
                      onChange={(e) => set('name', e.target.value)}
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
                      value={form.email}
                      onChange={(e) => set('email', e.target.value)}
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
                      value={form.phone}
                      onChange={(e) => set('phone', e.target.value)}
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
                    <select
                      id="q-interest"
                      required
                      value={form.service}
                      onChange={(e) => set('service', e.target.value)}
                      className={cn(inputClass)}
                    >
                      <option value="" className="text-navy bg-white">
                        — Select —
                      </option>
                      {QUOTE_SERVICE_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value} className="text-navy bg-white">
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
                      required
                      value={form.message}
                      onChange={(e) => set('message', e.target.value)}
                      placeholder="Preferred area, number of bedrooms, budget range, move-in date…"
                      className={cn(inputClass, 'resize-y')}
                    />
                  </div>

                  {/* Bẫy bot: ẩn với người dùng và trình đọc màn hình. */}
                  <input
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden="true"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    className="hidden"
                  />
                </div>

                {error ? (
                  <p
                    role="alert"
                    className="mt-4 rounded border border-[#e5b8b8] bg-[#fdf4f4] px-3 py-2 text-[12px] text-[#a33]"
                  >
                    {error}
                  </p>
                ) : null}

                <Button type="submit" variant="gold" disabled={loading} className="mt-6 w-full sm:w-auto">
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4 text-navy" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Sending...
                    </span>
                  ) : (
                    <>
                      Send enquiry <span aria-hidden>→</span>
                    </>
                  )}
                </Button>
              </form>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

/* ── Light Bright Shared Input Styling ─────────────────────────── */
const inputClass =
  'w-full border border-line bg-paper px-4 py-3 text-[14px] text-navy placeholder:text-muted/60 transition-all focus:border-gold focus:ring-2 focus:ring-gold/30 focus:bg-white focus:outline-none rounded-sm';
