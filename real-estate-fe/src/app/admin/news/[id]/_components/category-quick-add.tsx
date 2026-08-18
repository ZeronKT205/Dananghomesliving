'use client';

import { useState, useTransition } from 'react';

import { actionSaveArticleCategory } from '@/server/actions/admin-actions';

/**
 * Tạo chuyên mục ngay trong trang soạn bài.
 *
 * Trước đây chỗ này là một liên kết sang trang quản lý chuyên mục. Bấm vào là
 * rời trang, và toàn bộ nội dung đang soạn — kể cả bài AI vừa dựng mất cả phút
 * — bay sạch vì form chỉ giữ trong state. Tạo tại chỗ thì không có gì để mất.
 */
export function CategoryQuickAdd({
  onCreated,
}: {
  /** Gọi khi tạo xong, để nơi gọi thêm vào ô chọn và chọn luôn. */
  onCreated: (category: { id: string; name: string }) => void;
}) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [busy, startBusy] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function create() {
    const vi = name.trim();
    if (!vi) return;

    setError(null);
    startBusy(async () => {
      const res = await actionSaveArticleCategory(null, { name: vi, nameEn: nameEn.trim(), order: 99 });

      if (!res.ok || !res.id) {
        setError(res.ok ? 'Không tạo được chuyên mục' : res.message);
        return;
      }

      onCreated({ id: res.id, name: vi });
      setName('');
      setNameEn('');
      setOpen(false);
    });
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="text-gold hover:text-navy mt-1.5 inline-block cursor-pointer text-[11px] font-bold transition-colors"
      >
        + Thêm chuyên mục mới
      </button>
    );
  }

  return (
    <div className="border-line mt-2 rounded-md border bg-white p-2.5">
      <p className="text-navy mb-1.5 text-[11.5px] font-bold">Chuyên mục mới</p>

      <input
        autoFocus
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') create();
          if (e.key === 'Escape') setOpen(false);
        }}
        placeholder="Tên tiếng Việt, vd: Kinh nghiệm thuê"
        className="border-line focus:border-navy focus:outline-navy w-full rounded border px-2.5 py-1.5 text-[12.5px]"
      />

      <input
        value={nameEn}
        onChange={(e) => setNameEn(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') create();
          if (e.key === 'Escape') setOpen(false);
        }}
        placeholder="Tên tiếng Anh (không bắt buộc)"
        className="border-line focus:border-navy focus:outline-navy mt-1.5 w-full rounded border px-2.5 py-1.5 text-[12.5px]"
      />

      {/* Tên tiếng Anh dùng để sinh slug; bỏ trống thì slug lấy từ tên tiếng Việt. */}
      <div className="mt-2 flex items-center gap-2">
        <button
          type="button"
          onClick={create}
          disabled={busy || !name.trim()}
          className="bg-navy hover:bg-gold h-8 cursor-pointer rounded px-3 text-[12px] font-bold text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50"
        >
          {busy ? 'Đang tạo…' : 'Tạo'}
        </button>
        <button
          type="button"
          onClick={() => {
            setOpen(false);
            setError(null);
          }}
          className="text-muted hover:text-navy cursor-pointer text-[12px]"
        >
          Huỷ
        </button>
      </div>

      {error ? (
        <p role="alert" className="mt-2 rounded border border-[#e5b8b8] bg-[#fdf4f4] px-2.5 py-1.5 text-[11.5px] text-[#a33]">
          {error}
        </p>
      ) : null}
    </div>
  );
}
