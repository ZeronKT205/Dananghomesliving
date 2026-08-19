'use client';

import { useState, useTransition } from 'react';

import { actionDraftProperty, actionTranslateProperty } from '@/server/actions/admin-actions';

export interface PropertyTextValue {
  title: string;
  summary: string;
  description: string[];
}

/** Toàn bộ dữ liệu AI rút được — form tự quyết định ghi đè trường nào. */
export interface PropertyDraftValue extends PropertyTextValue {
  deal: 'sale' | 'rent';
  priceUsd: number | null;
  priceNote: string | null;
  pricePeriod: 'total' | 'month';
  negotiable: boolean;
  specs: Record<string, number | string | null>;
  location: { address: string | null; ward: string | null; district: string | null };
  amenityIds: string[];
  createdAmenities: Array<{ id: string; name: string; group: string }>;
  translations: Record<string, PropertyTextValue>;
  failedLocales: string[];
}

/**
 * Trợ lý AI cho tin bất động sản: dựng nội dung từ ghi chú, và dịch sang ba
 * ngôn ngữ còn lại.
 *
 * Gộp hai việc vào MỘT khối thay vì hai panel như bên tin tức: tin BĐS chỉ có
 * ba trường chữ, tách ra thành hai khu vực riêng chỉ làm form vốn đã dài thêm
 * rối.
 */
export function PropertyAiPanel({
  locale,
  enabled,
  modelName,
  current,
  onDrafted,
  onTranslated,
}: {
  locale: string;
  /** Có khoá AI hay không. */
  enabled: boolean;
  modelName: string;
  /** Nội dung đang có ở ngôn ngữ hiện tại — nguồn để dịch. */
  current: PropertyTextValue;
  onDrafted: (draft: PropertyDraftValue) => void;
  onTranslated: (translations: Record<string, PropertyTextValue>, failed: string[]) => void;
}) {
  const [open, setOpen] = useState(false);
  const [raw, setRaw] = useState('');
  const [busy, startBusy] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  if (!enabled) return null;

  const chars = raw.trim().length;
  const hasContent = Boolean(current.title.trim() || current.description.length);

  function draft() {
    setError(null);
    setMessage(null);

    if (
      hasContent &&
      !window.confirm(
        'Tin này đã có nội dung. AI sẽ GHI ĐÈ tiêu đề, tóm tắt, mô tả và các thông số đọc được từ ghi chú. Tiếp tục?',
      )
    ) {
      return;
    }

    startBusy(async () => {
      const res = await actionDraftProperty(raw, locale, true);
      if (!res.ok) {
        setError(res.message);
        return;
      }

      onDrafted(res.draft);
      setRaw('');
      setOpen(false);

      // Nói rõ ĐÃ ĐIỀN GÌ. Người dùng cần biết trường nào máy điền để soát lại,
      // nhất là giá — quy đổi sai tỷ giá thì nhìn con số USD không thấy được.
      const filled: string[] = [];
      if (res.draft.priceUsd) filled.push(`giá ${res.draft.priceUsd.toLocaleString('en-US')} USD`);
      if (res.draft.specs.bedrooms) filled.push(`${res.draft.specs.bedrooms} PN`);
      if (res.draft.specs.bathrooms) filled.push(`${res.draft.specs.bathrooms} WC`);
      if (res.draft.amenityIds.length) filled.push(`${res.draft.amenityIds.length} tiện ích`);

      const langs = Object.keys(res.draft.translations).length;
      const failed = res.draft.failedLocales.length
        ? ` Chưa dịch được: ${res.draft.failedLocales.join(', ')}.`
        : '';

      setMessage(
        `Đã điền ${filled.join(', ') || 'nội dung'}${langs ? ` và ${langs} bản dịch` : ''}.` +
          (res.draft.priceNote ? ` Giá gốc trong ghi chú: ${res.draft.priceNote}.` : '') +
          failed +
          ' Kiểm tra lại rồi bấm Lưu.',
      );
    });
  }

  function translate() {
    setError(null);
    setMessage(null);

    if (!hasContent) {
      setError('Viết xong bản gốc rồi mới dịch được.');
      return;
    }

    startBusy(async () => {
      const res = await actionTranslateProperty(current, locale);
      if (!res.ok) {
        setError(res.message);
        return;
      }

      onTranslated(res.translations, res.failed);

      const done = Object.keys(res.translations).length;
      setMessage(
        res.failed.length
          ? `Đã dịch ${done} ngôn ngữ. Chưa dịch được: ${res.failed.join(', ')} — bấm Dịch lại.`
          : `Đã dịch xong ${done} ngôn ngữ — kiểm tra lại rồi bấm Lưu.`,
      );
    });
  }

  return (
    <div className="border-gold/50 bg-gold/5 rounded-md border p-3.5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-navy text-[13px] font-bold">✨ Trợ lý AI</p>
          <p className="text-muted mt-0.5 text-[11.5px]">
            Dán ghi chú khảo sát — AI viết nội dung, điền giá, thông số, địa chỉ, tick tiện ích và dịch sang
            ba ngôn ngữ còn lại. Ảnh và vị trí bản đồ vẫn phải tự làm.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setOpen((p) => !p)}
            disabled={busy}
            className="border-navy text-navy hover:bg-navy h-8 cursor-pointer rounded-md border px-3 text-[12px] font-bold transition-colors hover:text-white disabled:opacity-50"
          >
            {open ? 'Đóng' : 'Điền từ ghi chú'}
          </button>
          <button
            type="button"
            onClick={translate}
            disabled={busy || !hasContent}
            title={hasContent ? undefined : 'Cần có nội dung ở ngôn ngữ hiện tại trước'}
            className="bg-navy hover:bg-gold h-8 cursor-pointer rounded-md px-3 text-[12px] font-bold text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50"
          >
            {busy ? 'Đang chạy…' : 'Dịch 3 ngôn ngữ'}
          </button>
        </div>
      </div>

      {open ? (
        <div className="mt-2.5">
          <textarea
            rows={5}
            value={raw}
            onChange={(e) => setRaw(e.target.value)}
            placeholder={
              'Dán ghi chú khảo sát vào đây…\n\nVí dụ: Căn 2PN tầng 11 An Thượng, 96m2 thông thuỷ, ban công 8m2 nhìn biển Mỹ Khê cách 350m, giá 3.596.000.000, phí quản lý 12k/m2, nội thất Hafele, hồ bơi tràn 16m tầng 5.'
            }
            className="border-line focus:border-navy focus:outline-navy w-full rounded-md border bg-white px-3 py-2 text-[13px] leading-relaxed"
          />
          <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
            <span className={chars > 0 && chars < 40 ? 'text-[11.5px] text-[#a33]' : 'text-muted text-[11.5px]'}>
              {chars === 0
                ? 'Cần ít nhất 40 ký tự'
                : chars < 40
                  ? `${chars} ký tự — còn quá ngắn`
                  : `${chars.toLocaleString('vi-VN')} ký tự`}
            </span>
            <button
              type="button"
              onClick={draft}
              disabled={busy || chars < 40}
              className="bg-navy hover:bg-gold h-8 cursor-pointer rounded-md px-3.5 text-[12px] font-bold text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50"
            >
              {busy ? 'AI đang đọc và điền…' : 'Điền toàn bộ + dịch'}
            </button>
          </div>
        </div>
      ) : null}

      {error ? (
        <p role="alert" className="mt-2 rounded border border-[#e5b8b8] bg-[#fdf4f4] px-3 py-2 text-[12px] text-[#a33]">
          {error}
        </p>
      ) : null}
      {message && !error ? <p className="text-muted mt-2 text-[12px]">{message}</p> : null}

      <p className="text-muted/70 mt-2 text-[10.5px]">Model: {modelName}</p>
    </div>
  );
}
