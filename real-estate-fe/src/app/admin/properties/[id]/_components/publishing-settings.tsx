'use client';

import { useState } from 'react';

import { Card, CardHeader, CardTitle, CardContent } from '../../../_components/ui/card';

export function PublishingSettings({ isNew }: { isNew?: boolean }) {
  const [isPublic, setIsPublic] = useState(!isNew);
  const [isSaving, setIsSaving] = useState(false);
  const [status, setStatus] = useState(isNew ? 'draft' : 'published');

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
    }, 1000);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Xuất bản</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        
        <div>
          <label className="block text-[11px] font-bold text-navy uppercase tracking-wider mb-2">Trạng thái</label>
          <div className="relative">
            <select 
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full appearance-none px-3 py-2 border border-line rounded-md text-[13px] text-navy focus:outline-navy focus:border-navy bg-white font-medium"
            >
              <option value="draft">Bản nháp</option>
              <option value="published">Đã xuất bản</option>
              <option value="archived">Lưu trữ</option>
            </select>
            <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
              <svg className="w-3 h-3 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-navy uppercase tracking-wider mb-2">Hiển thị</label>
          <div 
            className="flex items-center justify-between p-3 border border-line rounded-md cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={() => setIsPublic(!isPublic)}
          >
            <div>
              <p className="text-[13px] font-medium text-navy">Công khai trên Website</p>
              <p className="text-[11px] text-muted">Mọi người đều có thể xem</p>
            </div>
            <div className={`relative inline-block w-8 h-4 rounded-full transition-colors ${isPublic ? 'bg-[#C99224]' : 'bg-gray-300'}`}>
              <span className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all pointer-events-none ${isPublic ? 'left-[18px]' : 'left-[2px]'}`}></span>
            </div>
          </div>
        </div>

        {!isNew && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-navy uppercase tracking-wider mb-1.5">Ngày đăng</label>
              <div className="text-[13px] text-navy px-3 py-2 bg-gray-50 border border-line rounded-md">20/05/2024</div>
            </div>
            <div>
              <label className="block text-[11px] font-bold text-navy uppercase tracking-wider mb-1.5">Cập nhật lần cuối</label>
              <div className="text-[13px] text-navy px-3 py-2 bg-gray-50 border border-line rounded-md">Vừa xong</div>
            </div>
          </div>
        )}

        <div className="pt-4 mt-2 border-t border-line">
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className={`w-full py-2.5 text-[13px] font-bold uppercase tracking-wider text-white bg-[#061D36] hover:bg-[#041124] rounded shadow-sm text-center disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all active:scale-[0.98] ${
              isSaving ? 'opacity-90' : ''
            }`}
          >
            {isSaving ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {isNew ? 'Đang tạo...' : 'Đang cập nhật...'}
              </>
            ) : (
              isNew ? 'Tạo Bất động sản' : 'Cập nhật Bất động sản'
            )}
          </button>
        </div>

      </CardContent>
    </Card>
  );
}
