'use client';

import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';

import type { InquiryStatus } from '@/lib/db/collections';
import { actionAddInquiryNote, actionSetInquiryStatus } from '@/server/actions/admin-actions';

import { INQUIRY_STATUS } from '../_data/view-models';


/**
 * Đổi trạng thái và ghi chú cho một yêu cầu tư vấn.
 *
 * Trước đây chỗ này là một nút `disabled` ghi "Chức năng đổi trạng thái chưa
 * được xây dựng" — trong khi server action `actionSetInquiryStatus` đã có sẵn
 * từ lâu. Chỉ thiếu phần giao diện.
 *
 * Bốn trạng thái bày phẳng thành bốn nút chứ không gói vào menu xổ: đây là thao
 * tác làm nhiều lần mỗi ngày, thêm một cú bấm để mở menu là thêm hàng trăm cú
 * bấm mỗi tháng.
 */

const ORDER: InquiryStatus[] = ['new', 'contacted', 'done', 'cancelled'];

const TONE: Record<InquiryStatus, string> = {
  new: 'border-[#e0c48a] bg-[#fdf6e7] text-[#8f6614]',
  contacted: 'border-[#b9c9e4] bg-[#eef3fb] text-[#2c4f86]',
  done: 'border-[#b6ddc0] bg-[#eef8f1] text-[#2f6b40]',
  cancelled: 'border-[#e5b8b8] bg-[#fdf4f4] text-[#a33]',
};

export function InquiryActions({
  id,
  status,
  phone,
  onChanged,
}: {
  id: string;
  status: InquiryStatus;
  phone: string;
  /** Báo cho ngăn chi tiết biết để cập nhật ngay, không đợi router.refresh(). */
  onChanged: (next: InquiryStatus) => void;
}) {
  const router = useRouter();
  const [busy, startBusy] = useTransition();
  const [note, setNote] = useState('');
  const [noteOpen, setNoteOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);

  function setStatus(next: InquiryStatus) {
    if (next === status || busy) return;
    setError(null);
    setSaved(null);

    startBusy(async () => {
      const res = await actionSetInquiryStatus(id, next);
      if (!res.ok) {
        setError(res.message);
        return;
      }
      // Cập nhật tại chỗ TRƯỚC khi refresh: `router.refresh()` mất vài trăm ms
      // và trong lúc đó nút vẫn hiện trạng thái cũ, trông như bấm không ăn.
      onChanged(next);
      setSaved(`Đã chuyển sang "${INQUIRY_STATUS[next].label}"`);
      router.refresh();
    });
  }

  function addNote() {
    const text = note.trim();
    if (!text || busy) return;
    setError(null);
    setSaved(null);

    startBusy(async () => {
      const res = await actionAddInquiryNote(id, text);
      if (!res.ok) {
        setError(res.message);
        return;
      }
      setNote('');
      setNoteOpen(false);
      setSaved('Đã thêm ghi chú');
      router.refresh();
    });
  }

  return (
    <div className="border-line shrink-0 border-t">
      <div className="px-3 pt-3">
        <p className="text-muted mb-1.5 text-[11px]">Trạng thái xử lý</p>
        <div className="grid grid-cols-4 gap-1.5">
          {ORDER.map((s) => {
            const active = s === status;
            return (
              <button
                key={s}
                type="button"
                onClick={() => setStatus(s)}
                disabled={busy}
                aria-pressed={active}
                className={[
                  'h-8 cursor-pointer rounded-md border text-[11px] font-bold transition-colors disabled:cursor-not-allowed disabled:opacity-60',
                  active ? TONE[s] : 'border-line text-muted hover:border-navy hover:text-navy bg-white',
                ].join(' ')}
              >
                {INQUIRY_STATUS[s].label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="px-3 pt-2.5">
        {noteOpen ? (
          <div>
            <textarea
              autoFocus
              rows={2}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              onKeyDown={(e) => {
                // Ctrl/Cmd+Enter gửi — thói quen chung của ô ghi chú nhiều dòng.
                if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) addNote();
                if (e.key === 'Escape') setNoteOpen(false);
              }}
              placeholder="Ví dụ: đã gọi lúc 15:20, khách bận, hẹn gọi lại chiều mai."
              className="border-line focus:border-navy focus:outline-navy w-full rounded-md border px-2.5 py-2 text-[12px]"
            />
            <div className="mt-1.5 flex items-center gap-2">
              <button
                type="button"
                onClick={addNote}
                disabled={busy || !note.trim()}
                className="bg-navy hover:bg-gold h-8 cursor-pointer rounded-md px-3 text-[11.5px] font-bold text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50"
              >
                {busy ? 'Đang lưu…' : 'Lưu ghi chú'}
              </button>
              <button
                type="button"
                onClick={() => setNoteOpen(false)}
                className="text-muted hover:text-navy cursor-pointer text-[11.5px] font-bold"
              >
                Huỷ
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setNoteOpen(true)}
            className="text-muted hover:text-navy cursor-pointer text-[11.5px] font-bold"
          >
            + Thêm ghi chú xử lý
          </button>
        )}
      </div>

      {error ? (
        <p role="alert" className="mx-3 mt-2 rounded border border-[#e5b8b8] bg-[#fdf4f4] px-2.5 py-1.5 text-[11.5px] text-[#a33]">
          {error}
        </p>
      ) : null}
      {saved && !error ? <p className="text-muted mx-3 mt-2 text-[11.5px]">{saved}</p> : null}

      <div className="flex gap-2 p-3">
        <a
          href={`tel:${phone.replace(/\s/g, '')}`}
          className="bg-navy hover:bg-navy-2 focus-visible:outline-gold inline-flex h-9 flex-1 items-center justify-center gap-2 rounded-md text-[12px] font-bold text-white transition-colors focus-visible:outline-2"
        >
          Gọi ngay
        </a>
      </div>
    </div>
  );
}
