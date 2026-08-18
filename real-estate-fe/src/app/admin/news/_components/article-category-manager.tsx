'use client';

import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';

import { actionDeleteArticleCategory, actionSaveArticleCategory } from '@/server/actions/admin-actions';

import { IcEdit, IcNews, IcPlus, IcTrash } from '../../_components/icons';

export interface ArticleCategoryRow {
  id: string;
  slug: string;
  name: string;
  nameEn: string;
  order: number;
  count: number;
}

/**
 * Quản lý chuyên mục bài viết ngay trong trang Tin tức.
 *
 * Trước đây chuyên mục hardcode trong `NEWS_CATEGORIES`, muốn thêm một mục
 * phải nhờ dev sửa code rồi deploy. Đặt tab ở đây (thay vì một trang riêng)
 * để biên tập viên tạo chuyên mục xong quay lại chọn ngay khi đang viết bài.
 */
export function ArticleCategoryManager({ rows }: { rows: ArticleCategoryRow[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [editing, setEditing] = useState<ArticleCategoryRow | null>(null);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function save(form: FormData, id: string | null) {
    setError(null);
    startTransition(async () => {
      const res = await actionSaveArticleCategory(id, {
        name: String(form.get('name') ?? '').trim(),
        nameEn: String(form.get('nameEn') ?? '').trim(),
        order: Number(form.get('order') ?? 0),
      });
      if (res.ok) {
        setEditing(null);
        setCreating(false);
        router.refresh();
      } else {
        setError(res.message);
      }
    });
  }

  function remove(id: string) {
    setError(null);
    startTransition(async () => {
      const res = await actionDeleteArticleCategory(id);
      if (res.ok) router.refresh();
      else setError(res.message);
    });
  }

  const inputClass =
    'border-line focus:border-navy focus:outline-navy w-full rounded-md border px-3 py-2 text-[13px]';

  return (
    <>
      <div className="border-line flex flex-wrap items-center justify-between gap-2 rounded-[10px] border bg-white p-2.5">
        <p className="text-muted text-[12px]">
          <b className="text-navy">{rows.length}</b> chuyên mục
        </p>
        <button
          type="button"
          onClick={() => {
            setCreating(true);
            setEditing(null);
          }}
          className="bg-navy text-white hover:bg-gold inline-flex h-9 shrink-0 items-center gap-2 rounded-md px-4 text-[12.5px] font-bold transition-colors"
        >
          <IcPlus size={14} />
          Thêm chuyên mục
        </button>
      </div>

      {error ? (
        <p className="rounded-md border border-[#e5b8b8] bg-[#fdf4f4] px-3.5 py-2.5 text-[12.5px] text-[#a33]">
          {error}
        </p>
      ) : null}

      {creating || editing ? (
        <form
          action={(fd) => save(fd, editing?.id ?? null)}
          className="border-gold/50 grid gap-3 rounded-[10px] border bg-white p-4 sm:grid-cols-3"
        >
          <div className="sm:col-span-2">
            <label className="text-navy mb-1.5 block text-[11px] font-bold tracking-wider uppercase">
              Tên chuyên mục
            </label>
            <input name="name" required defaultValue={editing?.name ?? ''} className={inputClass} />
          </div>
          <div>
            <label className="text-navy mb-1.5 block text-[11px] font-bold tracking-wider uppercase">
              Thứ tự
            </label>
            <input
              name="order"
              type="number"
              min={0}
              defaultValue={editing?.order ?? rows.length + 1}
              className={inputClass}
            />
          </div>
          <div className="sm:col-span-3">
            <label className="text-navy mb-1.5 block text-[11px] font-bold tracking-wider uppercase">
              Tên tiếng Anh
            </label>
            <input name="nameEn" defaultValue={editing?.nameEn ?? ''} className={inputClass} />
            <p className="text-muted mt-1 text-[11px]">Dùng để sinh đường dẫn. Bỏ trống thì lấy theo tên tiếng Việt.</p>
          </div>

          <div className="flex gap-2 sm:col-span-3">
            <button
              type="submit"
              disabled={pending}
              className="bg-navy hover:bg-gold h-9 rounded-md px-4 text-[12.5px] font-bold text-white transition-colors disabled:opacity-60"
            >
              {pending ? 'Đang lưu…' : editing ? 'Cập nhật' : 'Tạo chuyên mục'}
            </button>
            <button
              type="button"
              onClick={() => {
                setCreating(false);
                setEditing(null);
                setError(null);
              }}
              className="border-line text-navy h-9 rounded-md border px-4 text-[12.5px] font-bold"
            >
              Huỷ
            </button>
          </div>
        </form>
      ) : null}

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {rows.map((row) => (
          <article
            key={row.id}
            className="border-line hover:border-gold flex flex-col gap-2 rounded-[10px] border bg-white p-4 transition-colors"
          >
            <span className="bg-navy/6 text-navy grid h-9 w-9 place-items-center rounded-md">
              <IcNews size={16} />
            </span>
            <h3 className="text-navy mt-1 text-[14px] font-extrabold">{row.name}</h3>
            <p className="text-muted text-[11.5px]">{row.nameEn}</p>

            <div className="border-line-soft mt-auto flex items-center justify-between border-t pt-2.5">
              <p className="text-muted text-[11.5px]">
                <b className="text-navy tabular-nums">{row.count}</b> bài · thứ tự{' '}
                <b className="text-navy tabular-nums">{row.order}</b>
              </p>
              <span className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    setEditing(row);
                    setCreating(false);
                  }}
                  aria-label="Sửa chuyên mục"
                  className="border-line text-navy hover:border-gold hover:text-gold grid h-7 w-7 place-items-center rounded-md border transition-colors"
                >
                  <IcEdit size={13} />
                </button>
                <button
                  type="button"
                  onClick={() => remove(row.id)}
                  disabled={pending}
                  aria-label="Xoá chuyên mục"
                  title={row.count > 0 ? `Còn ${row.count} bài thuộc chuyên mục này` : 'Xoá chuyên mục'}
                  className="grid h-7 w-7 place-items-center rounded-md border border-[#e5d3d3] text-[#8a4038] transition-colors hover:bg-[#fdf4f4] disabled:opacity-50"
                >
                  <IcTrash size={13} />
                </button>
              </span>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
