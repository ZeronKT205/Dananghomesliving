'use client';

import Link from 'next/link';
import { useState } from 'react';

export function PageHeader({ isNew }: { isNew?: boolean }) {
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2000);
    }, 800);
  };

  return (
    <div className="bg-white border-b border-line sticky top-0 z-30 px-8 py-5 flex items-center justify-between shadow-sm">
      <div className="flex gap-4 items-start">
        <Link href="/admin/properties" className="mt-1.5 p-2 hover:bg-gray-100 rounded-md transition-colors text-muted hover:text-navy">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </Link>
        <div>
          <div className="flex items-center gap-3 mb-1">
            <span className="text-[11px] font-bold tracking-widest uppercase text-muted">
              {isNew ? 'Thêm mới' : 'Chỉnh sửa'}
            </span>
            {!isNew && (
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-green-100 text-green-800 border border-green-200">
                Đã xuất bản
              </span>
            )}
          </div>
          <h1 className="font-bold text-navy text-[24px] leading-none tracking-tight">
            {isNew ? 'Bất động sản mới' : 'Biệt thự Ocean Estate'}
          </h1>
          {!isNew && (
            <div className="flex items-center gap-4 mt-2 text-[12px] text-muted">
              <span>Mã BĐS: DHV-240523</span>
              <span className="w-1 h-1 rounded-full bg-line"></span>
              <span>Cập nhật: 2 ngày trước</span>
              <span className="w-1 h-1 rounded-full bg-line"></span>
              <span>Ngày tạo: 20/05/2024</span>
            </div>
          )}
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        {!isNew && (
          <Link href="#" className="px-4 py-2 text-[13px] font-medium text-navy hover:bg-gray-50 border border-transparent rounded transition-all active:scale-[0.98] active:bg-gray-100">
            Xem trước
          </Link>
        )}
        <button className="px-4 py-2 text-[13px] font-medium text-navy hover:bg-gray-50 border border-line rounded transition-all active:scale-[0.98] active:bg-gray-100 flex items-center gap-2">
          Thao tác khác
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className={`px-6 py-2.5 text-[13px] font-bold uppercase tracking-wider text-white rounded shadow-sm ml-2 flex items-center gap-2 transition-all active:scale-[0.98] ${
            isSaved ? 'bg-green-600 hover:bg-green-700' : 'bg-[#C99224] hover:bg-[#b07f1d]'
          } ${isSaving ? 'cursor-not-allowed opacity-90' : ''}`}
        >
          {isSaving ? (
            <>
              <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Đang lưu...
            </>
          ) : isSaved ? (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              Đã lưu
            </>
          ) : (
            isNew ? 'Tạo bất động sản' : 'Lưu thay đổi'
          )}
        </button>
      </div>
    </div>
  );
}
