'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Lỗi khu vực quản trị (Admin Error):', error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-6">
      <div className="max-w-xl w-full bg-white rounded-xl border border-line p-8 shadow-sm text-center">
        <div className="w-14 h-14 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
          ⚠️
        </div>
        <h2 className="text-xl font-bold text-navy mb-2">Đã xảy ra sự cố trong trang quản trị</h2>
        <p className="text-sm text-muted mb-6">
          Hệ thống gặp lỗi khi tải trang này. Bạn có thể thử lại hoặc quay về trang chủ quản trị.
        </p>

        <div className="text-left bg-slate-50 border border-slate-200 rounded p-3 mb-6 font-mono text-xs text-slate-700 overflow-x-auto">
          <p className="font-bold text-red-600 mb-1">{error.name}: {error.message}</p>
          {error.digest && <p className="text-slate-400">Digest: {error.digest}</p>}
        </div>

        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => reset()}
            className="px-4 py-2 bg-navy text-white text-sm font-medium rounded-md hover:bg-navy/90 transition-colors"
          >
            Thử lại
          </button>
          <Link
            href="/admin"
            className="px-4 py-2 bg-slate-100 text-slate-700 text-sm font-medium rounded-md hover:bg-slate-200 transition-colors"
          >
            Về Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
