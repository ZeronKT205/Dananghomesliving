'use client';

import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';

import { actionDeleteAmenity, actionSaveAmenity } from '@/server/actions/admin-actions';

import { inputClass } from '../../_components/form-kit';

export interface AmenityRow {
  id: string;
  name: string;
  nameEn: string;
  group: AmenityGroup;
  order: number;
  /** Số BĐS đang dùng tiện ích này — cảnh báo trước khi xoá. */
  usedBy: number;
}

type AmenityGroup = 'indoor' | 'outdoor' | 'security' | 'service';

const GROUPS: Array<{ value: AmenityGroup; label: string }> = [
  { value: 'indoor', label: 'Trong nhà' },
  { value: 'outdoor', label: 'Ngoài trời' },
  { value: 'security', label: 'An ninh' },
  { value: 'service', label: 'Dịch vụ' },
];

const GROUP_LABEL = Object.fromEntries(GROUPS.map((g) => [g.value, g.label])) as Record<AmenityGroup, string>;

/**
 * Quản lý danh sách tiện ích.
 *
 * `actionSaveAmenity` / `actionDeleteAmenity` đã có từ lâu nhưng chưa có giao
 * diện nào gọi tới — muốn thêm một tiện ích phải sửa thẳng trong Atlas. Đây là
 * phần còn thiếu, dựng theo đúng khuôn `CategoryManager` cho quen tay.
 */
export function AmenityManager({ amenities }: { amenities: AmenityRow[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [editing, setEditing] = useState<AmenityRow | null>(null);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function save(form: FormData, id: string | null) {
    setError(null);
    startTransition(async () => {
      const res = await actionSaveAmenity(id, {
        name: String(form.get('name') ?? '').trim(),
        nameEn: String(form.get('nameEn') ?? '').trim(),
        // Tên icon, KHÔNG phải chuỗi path SVG — path là tài sản giao diện,
        // để trong DB thì đổi bộ icon phải chạy migrate dữ liệu.
        icon: String(form.get('icon') ?? 'check').trim() || 'check',
        group: (String(form.get('group') ?? 'indoor') as AmenityGroup) || 'indoor',
        order: Number(form.get('order') ?? 0),
      });

      if (!res.ok) {
        setError(res.message);
        return;
      }
      setEditing(null);
      setCreating(false);
      router.refresh();
    });
  }

  function remove(row: AmenityRow) {
    if (
      !window.confirm(
        row.usedBy > 0
          ? `Còn ${row.usedBy} bất động sản đang gắn "${row.name}". Xoá thì chúng mất tiện ích này. Tiếp tục?`
          : `Xoá tiện ích "${row.name}"?`,
      )
    ) {
      return;
    }

    setError(null);
    startTransition(async () => {
      const res = await actionDeleteAmenity(row.id);
      if (res.ok) router.refresh();
      else setError(res.message);
    });
  }

  const byGroup = GROUPS.map((g) => ({
    ...g,
    items: amenities.filter((a) => a.group === g.value).sort((a, b) => a.order - b.order),
  }));

  return (
    <div className="border-line rounded-xl border bg-white p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-navy text-[15px] font-extrabold">Tiện ích</h2>
          <p className="text-muted mt-0.5 text-[12px]">
            Danh sách chọn khi soạn tin. Xoá một tiện ích sẽ gỡ nó khỏi mọi bất động sản đang gắn.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setCreating(true);
            setEditing(null);
          }}
          disabled={pending}
          className="bg-navy hover:bg-gold h-9 cursor-pointer rounded-md px-3.5 text-[12px] font-bold text-white transition-colors disabled:opacity-50"
        >
          + Thêm tiện ích
        </button>
      </div>

      {error ? (
        <p role="alert" className="mb-3 rounded border border-[#e5b8b8] bg-[#fdf4f4] px-3 py-2 text-[12px] text-[#a33]">
          {error}
        </p>
      ) : null}

      {creating ? <AmenityForm onSubmit={(f) => save(f, null)} onCancel={() => setCreating(false)} pending={pending} /> : null}

      <div className="grid gap-5 sm:grid-cols-2">
        {byGroup.map((group) => (
          <div key={group.value}>
            <p className="text-gold mb-2 text-[10.5px] font-bold tracking-wider uppercase">
              {group.label} ({group.items.length})
            </p>

            {group.items.length === 0 ? (
              <p className="border-line text-muted/70 rounded-md border border-dashed px-3 py-3 text-[11.5px]">
                Chưa có tiện ích nào
              </p>
            ) : (
              <ul className="grid gap-1.5">
                {group.items.map((row) =>
                  editing?.id === row.id ? (
                    <li key={row.id}>
                      <AmenityForm
                        initial={row}
                        onSubmit={(f) => save(f, row.id)}
                        onCancel={() => setEditing(null)}
                        pending={pending}
                      />
                    </li>
                  ) : (
                    <li
                      key={row.id}
                      className="border-line hover:border-gold flex items-center gap-2 rounded-md border px-3 py-2 transition-colors"
                    >
                      <span className="min-w-0 flex-1">
                        <span className="text-navy block truncate text-[12.5px] font-bold">{row.name}</span>
                        <span className="text-muted block truncate text-[11px]">
                          {row.nameEn} · {row.usedBy} BĐS
                        </span>
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setEditing(row);
                          setCreating(false);
                        }}
                        disabled={pending}
                        className="text-muted hover:text-navy shrink-0 cursor-pointer text-[11.5px] font-bold disabled:opacity-50"
                      >
                        Sửa
                      </button>
                      <button
                        type="button"
                        onClick={() => remove(row)}
                        disabled={pending}
                        aria-label={`Xoá ${row.name}`}
                        className="shrink-0 cursor-pointer text-[11.5px] font-bold text-[#a33] hover:underline disabled:opacity-50"
                      >
                        Xoá
                      </button>
                    </li>
                  ),
                )}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function AmenityForm({
  initial,
  onSubmit,
  onCancel,
  pending,
}: {
  initial?: AmenityRow;
  onSubmit: (form: FormData) => void;
  onCancel: () => void;
  pending: boolean;
}) {
  return (
    <form
      action={onSubmit}
      className="border-gold/50 bg-gold/5 mb-3 grid gap-2 rounded-md border p-3 sm:grid-cols-2"
    >
      <input
        name="name"
        defaultValue={initial?.name}
        required
        autoFocus
        placeholder="Tên tiếng Việt, vd: Hồ bơi riêng"
        className={inputClass}
      />
      <input
        name="nameEn"
        defaultValue={initial?.nameEn}
        placeholder="Tên tiếng Anh (dùng sinh slug)"
        className={inputClass}
      />
      <select name="group" defaultValue={initial?.group ?? 'indoor'} className={inputClass}>
        {GROUPS.map((g) => (
          <option key={g.value} value={g.value}>
            {GROUP_LABEL[g.value]}
          </option>
        ))}
      </select>
      <input
        name="order"
        type="number"
        defaultValue={initial?.order ?? 0}
        placeholder="Thứ tự hiển thị"
        className={inputClass}
      />

      <div className="flex items-center gap-2 sm:col-span-2">
        <button
          type="submit"
          disabled={pending}
          className="bg-navy hover:bg-gold h-8 cursor-pointer rounded-md px-3.5 text-[12px] font-bold text-white transition-colors disabled:opacity-50"
        >
          {pending ? 'Đang lưu…' : 'Lưu'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="text-muted hover:text-navy cursor-pointer text-[12px] font-bold"
        >
          Huỷ
        </button>
      </div>
    </form>
  );
}
