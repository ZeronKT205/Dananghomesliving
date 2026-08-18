'use client';

import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';

import type { ActionResult } from '@/server/actions/admin-actions';

import { IcEdit, IcTrash } from './icons';
import { IconButton } from './ui';


/**
 * Nút Sửa / Xoá dùng chung cho thẻ BĐS và thẻ bài viết.
 *
 * Trước đây hai nút này chỉ là icon trang trí, bấm không làm gì. Giờ nút Sửa
 * điều hướng thật, nút Xoá gọi Server Action kèm xác nhận.
 */
export function RowActions({
  editHref,
  onDelete,
  deleteLabel = 'Xoá mục này?',
}: {
  editHref: string;
  onDelete: () => Promise<ActionResult>;
  deleteLabel?: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [confirming, setConfirming] = useState(false);

  function handleDelete() {
    if (!confirming) {
      // Xác nhận hai bước ngay tại chỗ thay vì window.confirm — không chặn
      // luồng, và tránh trường hợp bấm nhầm icon thùng rác là mất bài.
      setConfirming(true);
      setTimeout(() => setConfirming(false), 4000);
      return;
    }
    startTransition(async () => {
      const res = await onDelete();
      setConfirming(false);
      if (res.ok) router.refresh();
      else alert(res.message);
    });
  }

  return (
    <span className="flex shrink-0 items-center gap-1.5">
      <a
        href={editHref}
        aria-label="Sửa"
        title="Sửa"
        className="border-line text-navy hover:border-gold hover:text-gold focus-visible:outline-gold grid h-7 w-7 place-items-center rounded-md border transition-colors focus-visible:outline-2"
      >
        <IcEdit size={13} />
      </a>

      {confirming ? (
        <button
          type="button"
          onClick={handleDelete}
          disabled={pending}
          className="admin-confirm-expand h-7 rounded-md border border-[#e5b8b8] bg-[#fdf4f4] px-2 text-[11px] font-bold text-[#a33] transition-colors hover:bg-[#f9e9e9] disabled:opacity-60"
        >
          {pending ? 'Đang xoá…' : 'Xác nhận xoá'}
        </button>
      ) : (
        <IconButton label={deleteLabel} tone="danger" onClick={handleDelete}>
          <IcTrash size={13} />
        </IconButton>
      )}
    </span>
  );
}
