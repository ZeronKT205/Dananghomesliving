'use client';

import { useState, useTransition } from 'react';

import { actionComposeArticle } from '@/server/actions/admin-actions';

export interface ComposedPayload {
  article: { title: string; excerpt: string; content: string; tags: string[] };
  translations: Record<string, { title: string; excerpt: string; content: string }>;
  failedLocales: Array<{ locale: string; message: string }>;
  stats: { words: number; headings: number; callouts: number };
}

/**
 * Dán nội dung thô → AI dựng thành bài hoàn chỉnh, tuỳ chọn dịch luôn.
 *
 * Đóng mặc định: phần lớn lần mở form là để sửa bài cũ, không phải dựng bài
 * mới, nên không chiếm chỗ của trình soạn thảo.
 */
export function ComposePanel({
  locale,
  localeLabel,
  hasContent,
  canTranslate,
  onComposed,
}: {
  locale: string;
  localeLabel: string;
  /** Đang có nội dung → cảnh báo trước khi ghi đè. */
  hasContent: boolean;
  canTranslate: boolean;
  onComposed: (r: ComposedPayload) => void;
}) {
  const [open, setOpen] = useState(false);
  const [raw, setRaw] = useState('');
  const [alsoTranslate, setAlsoTranslate] = useState(true);
  const [busy, startBusy] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const chars = raw.trim().length;
  const tooShort = chars > 0 && chars < 80;
  const willTranslate = canTranslate && alsoTranslate;

  function run() {
    setError(null);

    if (
      hasContent &&
      !window.confirm(
        'Bài này đã có nội dung. Dựng lại sẽ GHI ĐÈ tiêu đề, mô tả và toàn bộ nội dung. Tiếp tục?',
      )
    ) {
      return;
    }

    startBusy(async () => {
      const res = await actionComposeArticle(raw, locale, willTranslate);
      if (!res.ok) {
        setError(res.message);
        return;
      }
      onComposed({
        article: res.article,
        translations: res.translations,
        failedLocales: res.failedLocales,
        stats: res.stats,
      });
      setRaw('');
      setOpen(false);
    });
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="border-gold/60 bg-gold/6 text-navy hover:bg-gold/12 flex w-full items-center justify-center gap-2 rounded-md border border-dashed py-2.5 text-[12.5px] font-bold transition-colors"
      >
        ✨ Dán nội dung thô — AI dựng thành bài hoàn chỉnh
      </button>
    );
  }

  return (
    <div className="admin-expand-down border-gold/50 bg-gold/4 rounded-md border p-3.5">
      <div className="mb-2 flex items-start justify-between gap-3">
        <div>
          <p className="text-navy text-[13px] font-bold">Dựng bài từ nội dung thô</p>
          <p className="text-muted mt-0.5 text-[11.5px]">
            Dán ghi chú, bản nháp hay nội dung copy từ nơi khác. AI viết thành bài 800–1200 từ có tiêu đề mục, hộp ghi
            nhớ, danh sách và in đậm số liệu — bằng {localeLabel}.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setOpen(false);
            setError(null);
          }}
          aria-label="Đóng"
          className="text-muted hover:text-navy shrink-0 px-1 text-[15px] leading-none"
        >
          ×
        </button>
      </div>

      <textarea
        rows={7}
        value={raw}
        onChange={(e) => setRaw(e.target.value)}
        placeholder={
          'Dán nội dung vào đây…\n\nVí dụ: ghi chú buổi khảo sát, thông tin dự án, bài đăng Facebook cũ, bản dịch thô…'
        }
        className="admin-input-glow border-line focus:border-gold focus:outline-none w-full rounded-md border bg-white px-3 py-2 text-[13px] leading-relaxed transition-all duration-200"
      />

      {canTranslate ? (
        <label className="text-navy mt-2 flex cursor-pointer items-center gap-2.5 text-[12.5px]">
          <input
            type="checkbox"
            checked={alsoTranslate}
            onChange={(e) => setAlsoTranslate(e.target.checked)}
            className="accent-gold h-4 w-4"
          />
          Dịch luôn sang 3 ngôn ngữ còn lại
          <span className="text-muted">— chậm thêm khoảng 10 giây</span>
        </label>
      ) : null}

      <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
        <span className={tooShort ? 'text-[11.5px] text-[#a33]' : 'text-muted text-[11.5px]'}>
          {chars === 0
            ? 'Cần ít nhất 80 ký tự'
            : tooShort
              ? `${chars} ký tự — còn quá ngắn, cần ít nhất 80`
              : `${chars.toLocaleString('vi-VN')} ký tự`}
        </span>

        <button
          type="button"
          onClick={run}
          disabled={busy || chars < 80}
          className="bg-navy hover:bg-gold hover:admin-btn-glow h-9 rounded-md px-4 text-[12.5px] font-bold text-white transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {busy
            ? willTranslate
              ? 'AI đang dựng bài và dịch…'
              : 'AI đang dựng bài…'
            : willTranslate
              ? 'Dựng bài + dịch 4 ngôn ngữ'
              : 'Dựng bài'}
        </button>
      </div>

      {error ? (
        <p role="alert" className="mt-2 rounded border border-[#e5b8b8] bg-[#fdf4f4] px-3 py-2 text-[12px] text-[#a33]">
          {error}
        </p>
      ) : null}
    </div>
  );
}
