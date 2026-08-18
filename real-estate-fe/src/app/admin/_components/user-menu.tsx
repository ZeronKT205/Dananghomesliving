'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

const ROLE_LABEL: Record<string, string> = {
  admin: 'Quản trị viên',
  editor: 'Biên tập viên',
  viewer: 'Chỉ xem',
};

export function UserMenu({ user }: { user: { name: string; email: string; role: string } | null }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  if (!user) return null;

  const initials = user.name
    .split(' ')
    .filter(Boolean)
    .slice(-2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('');

  async function handleLogout() {
    setBusy(true);
    await fetch('/api/auth/logout', { method: 'POST' }).catch(() => null);
    router.replace('/admin/login');
    router.refresh();
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="border-line hover:border-gold focus-visible:outline-gold flex h-9 items-center gap-2 rounded-md border pr-2.5 pl-1.5 transition-all duration-200 focus-visible:outline-2 hover:shadow-[0_2px_8px_rgb(201_146_46/0.12)]"
      >
        <span className="bg-navy grid h-6 w-6 place-items-center rounded-full text-[10px] font-bold text-white transition-transform duration-200 group-hover:scale-105">
          {initials || '?'}
        </span>
        <span className="text-navy hidden max-w-[110px] truncate text-[12px] font-bold sm:inline">
          {user.name}
        </span>
      </button>

      {open ? (
        <div
          role="menu"
          className="admin-fade-in-scale border-line absolute right-0 z-50 mt-1.5 w-[220px] origin-top-right rounded-md border bg-white py-1.5 shadow-[0_4px_16px_rgb(7_29_54/0.12)]"
        >
          <div className="border-line-soft border-b px-3.5 pt-1 pb-2.5">
            <p className="text-navy truncate text-[13px] font-bold">{user.name}</p>
            <p className="text-muted truncate text-[11.5px]">{user.email}</p>
            <p className="text-gold mt-1 text-[10.5px] font-bold tracking-wider uppercase">
              {ROLE_LABEL[user.role] ?? user.role}
            </p>
          </div>

          <a
            href="/admin/settings"
            role="menuitem"
            className="text-navy hover:bg-ivory relative block px-3.5 py-2 text-[12.5px] transition-all duration-200 hover:pl-5"
          >
            Cài đặt tài khoản
          </a>

          <button
            type="button"
            role="menuitem"
            onClick={handleLogout}
            disabled={busy}
            className="block w-full px-3.5 py-2 text-left text-[12.5px] text-[#a33] transition-all duration-200 hover:bg-[#fdf4f4] hover:pl-5 disabled:opacity-60"
          >
            {busy ? 'Đang đăng xuất…' : 'Đăng xuất'}
          </button>
        </div>
      ) : null}
    </div>
  );
}
