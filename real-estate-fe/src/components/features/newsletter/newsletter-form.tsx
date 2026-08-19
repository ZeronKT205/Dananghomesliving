'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';

/** ⚠️ Chưa gửi đi đâu cả — mới chỉ xác nhận phía client.
 *  Khi có backend: chuyển sang Server Action trong `src/server/actions/`,
 *  validate email bằng Zod NGAY đầu hàm rồi mới gọi service. */
export function NewsletterForm() {
  const t = useTranslations('Footer');

  const [status, setStatus] = useState('');

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        setStatus('Thank you — you are on the list.');
        event.currentTarget.reset();
      }}
    >
      <div className="focus-within:border-gold-soft flex border-b border-white/35">
        <input
          type="email"
          required
          placeholder={t('emailPlaceholderFull')}
          aria-label={t('emailLabel')}
          className="min-w-0 flex-1 bg-transparent py-3 text-white placeholder:text-white/45 focus:outline-none"
        />
        <button
          type="submit"
          aria-label={t('subscribe')}
          className="text-gold-soft focus-visible:outline-gold cursor-pointer px-2 text-lg transition-transform hover:translate-x-1 focus-visible:outline-2"
        >
          <span aria-hidden>→</span>
        </button>
      </div>
      <p aria-live="polite" className="text-gold-soft mt-2.5 min-h-[18px] text-[12px]">
        {status}
      </p>
    </form>
  );
}
