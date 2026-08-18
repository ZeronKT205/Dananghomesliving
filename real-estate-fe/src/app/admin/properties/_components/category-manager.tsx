'use client';

import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';

import { actionDeleteCategory, actionSaveCategory } from '@/server/actions/admin-actions';

import { IcEdit, IcLayers, IcPlus, IcTrash } from '../../_components/icons';
import { Pill } from '../../_components/ui';

export interface GroupRow {
  id: string;
  slug: string;
  name: string;
  nameEn: string;
  onHome: boolean;
  order: number;
  count: number;
}

/**
 * Quản lý nhóm bất động sản.
 *
 * Bản trước chỉ hiển thị thẻ đọc-thôi và một nút "Thêm nhóm" bị disable. Ở đây
 * thêm đủ tạo / sửa / xoá — CMS mà không sửa được phân loại thì mỗi lần đổi
 * danh mục lại phải nhờ dev deploy.
 */
export function CategoryManager({ groups }: { groups: GroupRow[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [editing, setEditing] = useState<GroupRow | null>(null);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const homeCount = groups.filter((g) => g.onHome).length;

  function save(form: FormData, id: string | null) {
    setError(null);
    startTransition(async () => {
      const res = await actionSaveCategory(id, {
        name: String(form.get('name') ?? '').trim(),
        nameEn: String(form.get('nameEn') ?? '').trim(),
        showOnHome: form.get('showOnHome') === 'on',
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
      const res = await actionDeleteCategory(id);
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
          <b className="text-navy">{groups.length}</b> nhóm ·{' '}
          <b className="text-navy">{homeCount}</b> hiển thị ở trang chủ
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
          Thêm nhóm
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
          className="border-gold/50 grid gap-3 rounded-[10px] border bg-white p-4 sm:grid-cols-2"
        >
          <div className="sm:col-span-2">
            <label className="text-navy mb-1.5 block text-[11px] font-bold tracking-wider uppercase">
              Tên nhóm (tiếng Việt)
            </label>
            <input name="name" required defaultValue={editing?.name ?? ''} className={inputClass} />
          </div>
          <div>
            <label className="text-navy mb-1.5 block text-[11px] font-bold tracking-wider uppercase">
              Tên tiếng Anh
            </label>
            <input name="nameEn" defaultValue={editing?.nameEn ?? ''} className={inputClass} />
            <p className="text-muted mt-1 text-[11px]">Dùng để sinh đường dẫn (slug).</p>
          </div>
          <div>
            <label className="text-navy mb-1.5 block text-[11px] font-bold tracking-wider uppercase">
              Thứ tự
            </label>
            <input
              name="order"
              type="number"
              min={0}
              defaultValue={editing?.order ?? groups.length + 1}
              className={inputClass}
            />
          </div>
          <label className="flex cursor-pointer items-center gap-2.5 sm:col-span-2">
            <input
              type="checkbox"
              name="showOnHome"
              defaultChecked={editing?.onHome ?? false}
              className="accent-gold h-4 w-4"
            />
            <span className="text-navy text-[13px]">Hiển thị ở trang chủ</span>
          </label>

          <div className="flex gap-2 sm:col-span-2">
            <button
              type="submit"
              disabled={pending}
              className="bg-navy hover:bg-gold h-9 rounded-md px-4 text-[12.5px] font-bold text-white transition-colors disabled:opacity-60"
            >
              {pending ? 'Đang lưu…' : editing ? 'Cập nhật' : 'Tạo nhóm'}
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
        {groups.map((group) => (
          <article
            key={group.id}
            className="border-line hover:border-gold flex flex-col gap-2 rounded-[10px] border bg-white p-4 transition-colors"
          >
            <div className="flex items-start justify-between gap-2">
              <span className="bg-navy/6 text-navy grid h-9 w-9 shrink-0 place-items-center rounded-md">
                <IcLayers size={16} />
              </span>
              {group.onHome ? <Pill tone="ok">Trang chủ</Pill> : <Pill>Không</Pill>}
            </div>
            <h3 className="text-navy mt-1 text-[14px] font-extrabold">{group.name}</h3>
            <p className="text-muted text-[11.5px]">{group.nameEn}</p>

            <div className="border-line-soft mt-auto flex items-center justify-between border-t pt-2.5">
              <p className="text-muted text-[11.5px]">
                <b className="text-navy tabular-nums">{group.count}</b> BĐS · thứ tự{' '}
                <b className="text-navy tabular-nums">{group.order}</b>
              </p>
              <span className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    setEditing(group);
                    setCreating(false);
                  }}
                  aria-label="Sửa nhóm"
                  className="border-line text-navy hover:border-gold hover:text-gold grid h-7 w-7 place-items-center rounded-md border transition-colors"
                >
                  <IcEdit size={13} />
                </button>
                <button
                  type="button"
                  onClick={() => remove(group.id)}
                  disabled={pending}
                  aria-label="Xoá nhóm"
                  title={group.count > 0 ? `Còn ${group.count} BĐS thuộc nhóm này` : 'Xoá nhóm'}
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
