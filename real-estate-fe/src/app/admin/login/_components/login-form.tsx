'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { BrandLogo } from '@/components/ui/brand-logo';

export function LoginForm({ next }: { next?: string }) {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const json = await res.json();

      if (!json.ok) {
        setError(json.error?.message ?? 'Tài khoản hoặc mật khẩu không chính xác');
        setBusy(false);
        return;
      }

      const target = next && next.startsWith('/admin') && !next.startsWith('//') ? next : '/admin';
      router.replace(target);
      router.refresh();
    } catch {
      setError('Không thể kết nối đến máy chủ xác thực');
      setBusy(false);
    }
  }

  const inputClass =
    'w-full bg-paper border border-line focus:border-gold focus:outline-none px-4 py-3 text-[13.5px] font-medium text-navy transition-all rounded-none placeholder:text-muted/60';

  return (
    <div className="w-full">
      {/* Brand Header */}
      <div className="mb-8 text-center flex flex-col items-center">
        <BrandLogo light={false} className="transform scale-105 mb-4" />
        <h2 className="font-display text-navy text-[24px] font-normal tracking-tight">
          Cổng Quản Trị Hệ Thống
        </h2>
        <p className="text-muted mt-1 text-[12px] font-medium tracking-wide">
          Vui lòng nhập thông tin xác thực để tiếp tục
        </p>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-5">
        {/* Email Input */}
        <div>
          <label htmlFor="email" className="text-navy mb-1.5 block text-[10px] font-bold tracking-[0.14em] uppercase">
            Địa chỉ Email Quản trị
          </label>
          <div className="relative">
            <input
              id="email"
              type="email"
              required
              autoComplete="username"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
              placeholder="admin@dananghomesliving.com"
            />
            <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted/50 pointer-events-none">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </span>
          </div>
        </div>

        {/* Password Input with Eye Toggle */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="password" className="text-navy block text-[10px] font-bold tracking-[0.14em] uppercase">
              Mật khẩu truy cập
            </label>
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-gold hover:text-navy text-[11px] font-bold uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-1"
            >
              {showPassword ? (
                <>
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858-5.908a8.18 8.18 0 013.682-.863c4.478 0 8.268 2.943 9.542 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21M3 3l18 18" /></svg>
                  Ẩn mật khẩu
                </>
              ) : (
                <>
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  Hiện mật khẩu
                </>
              )}
            </button>
          </div>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputClass}
              placeholder="••••••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted hover:text-navy transition-colors cursor-pointer p-1"
              title={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
            >
              {showPassword ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858-5.908a8.18 8.18 0 013.682-.863c4.478 0 8.268 2.943 9.542 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21M3 3l18 18" /></svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
              )}
            </button>
          </div>
        </div>

        {/* Options Row: Remember Me */}
        <div className="flex items-center text-[12px] pt-1">
          <label className="flex items-center gap-2 text-navy cursor-pointer select-none font-medium">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 accent-navy rounded-none cursor-pointer"
            />
            Ghi nhớ đăng nhập
          </label>
        </div>

        {/* Error Feedback Alert */}
        {error ? (
          <div
            role="alert"
            className="rounded-none border border-red-200 bg-red-50 p-3.5 text-[12.5px] text-red-800 flex items-start gap-2 animate-fade-in"
          >
            <svg className="w-4 h-4 text-red-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <span>{error}</span>
          </div>
        ) : null}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={busy}
          className="bg-navy hover:bg-gold text-white hover:text-navy w-full py-3.5 text-[11.5px] font-bold tracking-[0.18em] uppercase transition-all rounded-none cursor-pointer flex items-center justify-center gap-2 active:scale-98 disabled:opacity-60 disabled:cursor-not-allowed shadow-md mt-2"
        >
          {busy ? (
            <>
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Đang xác thực...
            </>
          ) : (
            <>
              Đăng nhập Quản Trị
              <span aria-hidden>→</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
