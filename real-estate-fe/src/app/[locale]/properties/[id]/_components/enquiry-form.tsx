'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useMemo, useState, useTransition } from 'react';

import { useToast } from '@/components/ui/toast-provider';
import { Link } from '@/i18n/routing';
import { actionSubmitPropertyInquiry } from '@/server/actions/public-actions';

/**
 * Form đặt lịch xem một bất động sản.
 *
 * Trước đây form này chỉ `setTimeout(1200)` rồi báo thành công — khách tưởng đã
 * gửi, còn CMS không nhận được gì. Giờ ghi thật vào bảng `inquiries`.
 *
 * Các ô là controlled input: gửi lỗi (mạng chập, chạm giới hạn chống spam) thì
 * chữ khách đã gõ vẫn còn nguyên. Form không lưu nháp như trang soạn bài vì
 * ngắn, nhưng mất chữ khi bấm gửi hụt là lỗi UX nặng nhất ở đây.
 */

const INPUT =
  'w-full px-3.5 py-2.5 border border-line bg-paper text-navy rounded-none text-[13px] focus:border-gold focus:ring-2 focus:ring-gold/20 focus:outline-none transition-all';
const LABEL = 'block text-[10.5px] font-bold text-navy uppercase tracking-wider mb-1.5';

const EMPTY = { name: '', phone: '', email: '', date: '', message: '' };

export function EnquiryForm({ propertySlug, propertyTitle }: { propertySlug: string; propertyTitle: string }) {
  const locale = useLocale();
  const t = useTranslations('Enquiry');
  const { showToast } = useToast();

  const [form, setForm] = useState(EMPTY);
  const [website, setWebsite] = useState(''); // bẫy bot, người thật không thấy
  const [sending, startSending] = useTransition();
  const [done, setDone] = useState<{ code: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [fields, setFields] = useState<Record<string, string[]>>({});

  function set<K extends keyof typeof EMPTY>(k: K, value: string) {
    setForm((p) => ({ ...p, [k]: value }));
    // Xoá lỗi của đúng ô đang sửa: để lỗi đỏ nguyên trong lúc người ta đang gõ
    // lại là thứ gây bực nhất trong form.
    setFields((p) => (p[k] ? { ...p, [k]: [] } : p));
  }

  const todayISO = useMemo(() => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }, []);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setFields({});

    if (form.date && form.date < todayISO) {
      setFields({ date: ['Ngày hẹn xem nhà không thể ở quá khứ.'] });
      return;
    }

    startSending(async () => {
      const res = await actionSubmitPropertyInquiry({
        propertySlug,
        name: form.name,
        email: form.email,
        phone: form.phone,
        message: form.message || `Yêu cầu xem trực tiếp: ${propertyTitle}`,
        preferredViewingDate: form.date || null,
        locale,
        website,
      });

      if (!res.ok) {
        setError(res.message);
        setFields(res.fields ?? {});
        return;
      }

      setDone({ code: res.code });
      setForm(EMPTY);
      showToast(t('successTitle'), 'success');
    });
  }

  const err = (k: string) => fields[k]?.[0];

  return (
    <div id="enquiry-form" className="bg-white border border-line p-6 rounded-none shadow-lift">
      <div className="border-b border-line pb-4 mb-5">
        <span className="text-gold text-[10px] font-bold tracking-[0.2em] uppercase block mb-1">
          {t('eyebrow')}
        </span>
        <h3 className="text-[17px] text-navy font-display font-semibold leading-tight">
          {t('title')}
        </h3>
      </div>

      {done ? (
        <div className="bg-ivory border border-gold/40 text-navy p-6 rounded-none text-center animate-fade-in space-y-3">
          <div className="w-12 h-12 bg-gold text-navy rounded-none flex items-center justify-center mx-auto text-xl font-bold">
            ✓
          </div>
          <h4 className="font-display text-[18px] font-normal text-navy">{t('successTitle')}</h4>
          <p className="text-[13px] text-muted leading-relaxed">
            {t.rich('successBody', {
              code: () => <strong className="text-navy font-mono">{done.code}</strong>,
            })}
          </p>
          <div className="pt-2">
            <Link 
              href="/properties" 
              className="mt-4 block w-full border-2 border-navy text-navy hover:bg-navy hover:text-white transition-colors py-2.5 text-[11px] font-bold uppercase tracking-widest cursor-pointer text-center"
            >
              Explore More Properties
            </Link>
            <button
              type="button"
              onClick={() => setDone(null)}
              className="mt-4 text-muted hover:text-navy text-[11px] font-medium block mx-auto transition-colors cursor-pointer"
            >
              ← {t('successAgain')}
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={submit} className="space-y-4" noValidate>
          <div>
            <label className={LABEL} htmlFor="enq-name">
              {t('name')} *
            </label>
            <input
              id="enq-name"
              value={form.name}
              onChange={(e) => set('name', e.target.value)}
              required
              placeholder={t('namePlaceholder')}
              className={INPUT}
            />
            {err('name') ? <p className="mt-1 text-[11px] text-[#a33]">{err('name')}</p> : null}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={LABEL} htmlFor="enq-phone">
                {t('phone')} *
              </label>
              <input
                id="enq-phone"
                type="tel"
                value={form.phone}
                onChange={(e) => set('phone', e.target.value)}
                required
                placeholder={t('phonePlaceholder')}
                className={INPUT}
              />
              {err('phone') ? <p className="mt-1 text-[11px] text-[#a33]">{err('phone')}</p> : null}
            </div>
            <div>
              <label className={LABEL} htmlFor="enq-email">
                {t('email')} *
              </label>
              <input
                id="enq-email"
                type="email"
                value={form.email}
                onChange={(e) => set('email', e.target.value)}
                required
                placeholder={t('emailPlaceholder')}
                className={INPUT}
              />
              {err('email') ? <p className="mt-1 text-[11px] text-[#a33]">{err('email')}</p> : null}
            </div>
          </div>

          <div>
            <label className={LABEL} htmlFor="enq-date">
              {t('date')}
            </label>
            <input
              id="enq-date"
              type="date"
              min={todayISO}
              value={form.date}
              onChange={(e) => {
                const val = e.target.value;
                if (val && val < todayISO) {
                  setFields((p) => ({ ...p, date: ['Ngày hẹn xem nhà không thể ở quá khứ.'] }));
                  return;
                }
                set('date', val);
              }}
              className={INPUT}
            />
            {err('date') ? <p className="mt-1 text-[11px] text-[#a33]">{err('date')}</p> : null}
          </div>

          <div>
            <label className={LABEL} htmlFor="enq-message">
              {t('note')}
            </label>
            <textarea
              id="enq-message"
              rows={3}
              value={form.message}
              onChange={(e) => set('message', e.target.value)}
              placeholder={t('notePlaceholder')}
              className={`${INPUT} resize-none`}
            />
            {err('message') ? <p className="mt-1 text-[11px] text-[#a33]">{err('message')}</p> : null}
          </div>

          {/* Bẫy bot: ẩn với người dùng và với trình đọc màn hình. */}
          <input
            type="text"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            className="hidden"
          />

          {error ? (
            <p role="alert" className="rounded border border-[#e5b8b8] bg-[#fdf4f4] px-3 py-2 text-[12px] text-[#a33]">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={sending}
            className="w-full bg-gold hover:bg-gold-soft text-navy py-3.5 rounded-none text-[12px] font-bold uppercase tracking-[0.15em] transition-all shadow-md flex justify-center items-center gap-2 disabled:opacity-70 active:scale-98 cursor-pointer"
          >
            {sending ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4 text-navy" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                {t('sending')}
              </span>
            ) : (
              <>
                {t('submit')}
                <span aria-hidden>→</span>
              </>
            )}
          </button>

          <p className="text-[10.5px] text-muted text-center mt-3 flex items-center justify-center gap-1.5">
            <svg className="w-3.5 h-3.5 text-gold shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
            {t('privacy')}
          </p>
        </form>
      )}
    </div>
  );
}
