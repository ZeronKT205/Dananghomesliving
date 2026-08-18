'use client';

import { useState, useTransition } from 'react';

import { actionComposeArticle } from '@/server/actions/admin-actions';

export interface ComposedResult {
  title: string;
  excerpt: string;
  content: string;
  tags: string[];
}

/**
 * Dán nội dung thô → AI dựng thành bài hoàn chỉnh.
 *
 * Đóng mặc định: phần lớn lần mở form là để sửa bài cũ, không phải dựng bài
 * mới, nên không chiếm chỗ của trình soạn thảo.
 */
export function ComposePanel({
  locale,
  localeLabel,
  hasContent,
  onComposed,
}: {
  locale: string;
  localeLabel: string;
  /** Đang có nội dung → cảnh báo trước khi ghi đè. */
  hasContent: boolean;
  onComposed: (r: ComposedResult) => void;
}) {
  const [open, setOpen] = useState(false);
  const [raw, setRaw] = useState('');
  const [busy, startBusy] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const chars = raw.trim().length;
  const tooShort = chars > 0 && chars < 80;

  function run() {
    setError(null);

    if (hasContent && !window.confirm('Bài này đã có nội dung. Dựng lại sẽ GHI ĐÈ tiêu đề, mô tả và toàn bộ nội dung. Tiếp tục?')) {
      return;
    }

    startBusy(async () => {
      const res = await actionComposeArticle(raw, locale);
      if (!res.ok) {
        setError(res.message);
        return;
      }
      onComposed(res.article);
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
    <div className="border-gold/50 bg-gold/4 rounded-md border p-3.5">
      <div className="mb-2 flex items-start justify-between gap-3">
        <div>
          <p className="text-navy text-[13px] font-bold">Dựng bài từ nội dung thô</p>
          <p className="text-muted mt-0.5 text-[11.5px]">
            Dán ghi chú, bản nháp hay nội dung copy từ nơi khác. AI cắt thành tiêu đề, mô tả, nội dung có định dạng và
            hashtag — viết bằng {localeLabel}.
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
        placeholder={'Dán nội dung vào đây…\n\nVí dụ: ghi chú buổi khảo sát, thông tin dự án, bài đăng Facebook cũ, bản dịch thô…'}
        className="border-line focus:border-navy focus:outline-navy w-full rounded-md border bg-white px-3 py-2 text-[13px] leading-relaxed"
      />

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
          className="bg-navy hover:bg-gold h-9 rounded-md px-4 text-[12.5px] font-bold text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50"
        >
          {busy ? 'AI đang dựng bài…' : 'Dựng bài'}
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
