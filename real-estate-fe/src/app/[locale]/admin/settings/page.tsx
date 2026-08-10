'use client';

import { Card, CardHeader, CardTitle, CardContent } from '../_components/ui/card';
import { useState } from 'react';

export default function SettingsPage() {
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      import('../_components/ui/toast').then(m => m.toast('Đã lưu cấu hình thành công!', 'success'));
    }, 1000);
  };

  return (
    <div className="p-8 max-w-[1000px] mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-navy leading-none mb-2 tracking-tight">Cài Đặt Website</h1>
          <p className="text-[13px] text-muted">Cấu hình các thông tin chung, SEO và liên hệ của hệ thống.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className={`flex items-center gap-2 bg-[#C99224] hover:bg-[#b07f1d] text-white px-6 py-2.5 rounded shadow-sm text-[13px] font-bold uppercase tracking-wider transition-all active:scale-[0.98] ${isSaving ? 'opacity-90 cursor-not-allowed' : ''}`}
        >
          {isSaving ? (
            <>
              <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Đang lưu...
            </>
          ) : (
            'Lưu Thay Đổi'
          )}
        </button>
      </div>

      <div className="space-y-6">
        <Card className="border-line/60">
          <CardHeader>
            <CardTitle>Thông Tin Chung</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-[12px] font-bold text-navy uppercase tracking-wider mb-2">Tên Website</label>
              <input type="text" defaultValue="Đà Nẵng Homes & Living" className="w-full px-4 py-2 border border-line rounded text-[14px] text-navy focus:outline-navy" />
            </div>
            <div>
              <label className="block text-[12px] font-bold text-navy uppercase tracking-wider mb-2">Khẩu hiệu (Slogan)</label>
              <input type="text" defaultValue="Bất động sản cao cấp tại Đà Nẵng" className="w-full px-4 py-2 border border-line rounded text-[14px] text-navy focus:outline-navy" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-line/60">
          <CardHeader>
            <CardTitle>Cấu Hình SEO Mặc Định</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-[12px] font-bold text-navy uppercase tracking-wider mb-2">Tiêu đề (Meta Title)</label>
              <input type="text" defaultValue="Đà Nẵng Homes - Mua bán & Cho thuê Bất động sản" className="w-full px-4 py-2 border border-line rounded text-[14px] text-navy focus:outline-navy" />
            </div>
            <div>
              <label className="block text-[12px] font-bold text-navy uppercase tracking-wider mb-2">Mô tả (Meta Description)</label>
              <textarea rows={3} defaultValue="Chuyên trang thông tin mua bán và cho thuê biệt thự, căn hộ cao cấp tại Đà Nẵng." className="w-full px-4 py-2 border border-line rounded text-[14px] text-navy focus:outline-navy"></textarea>
            </div>
          </CardContent>
        </Card>

        <Card className="border-line/60">
          <CardHeader>
            <CardTitle>Thông Tin Liên Hệ</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[12px] font-bold text-navy uppercase tracking-wider mb-2">Email hỗ trợ</label>
                <input type="email" defaultValue="support@da-nang-homes.com" className="w-full px-4 py-2 border border-line rounded text-[14px] text-navy focus:outline-navy" />
              </div>
              <div>
                <label className="block text-[12px] font-bold text-navy uppercase tracking-wider mb-2">Hotline</label>
                <input type="text" defaultValue="0905 123 456" className="w-full px-4 py-2 border border-line rounded text-[14px] text-navy focus:outline-navy" />
              </div>
            </div>
            <div>
              <label className="block text-[12px] font-bold text-navy uppercase tracking-wider mb-2">Địa chỉ văn phòng</label>
              <input type="text" defaultValue="Tầng 12, Tòa nhà ABC, Hải Châu, Đà Nẵng" className="w-full px-4 py-2 border border-line rounded text-[14px] text-navy focus:outline-navy" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
