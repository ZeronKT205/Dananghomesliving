'use client';

import { Card, CardContent } from '../_components/ui/card';
import Image from 'next/image';

const mockMedia = [
  { id: 1, src: 'https://images.unsplash.com/photo-1613490908592-fd5e23756318?q=80&w=400&auto=format&fit=crop', name: 'ocean-estate-front.jpg' },
  { id: 2, src: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=400&auto=format&fit=crop', name: 'living-room.jpg' },
  { id: 3, src: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=400&auto=format&fit=crop', name: 'pool-view.jpg' },
  { id: 4, src: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=400&auto=format&fit=crop', name: 'river-apartment.jpg' },
  { id: 5, src: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=400&auto=format&fit=crop', name: 'marina-shophouse.jpg' },
];

export default function MediaPage() {
  const handleAction = () => {
    import('../_components/ui/toast').then(m => m.toast('Thao tác thành công!', 'success'));
  };

  return (
    <div className="p-8 max-w-[1400px] mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-navy leading-none mb-2 tracking-tight">Thư Viện Media</h1>
          <p className="text-[13px] text-muted">Quản lý tất cả hình ảnh, tài liệu và video trên hệ thống.</p>
        </div>
        <button onClick={handleAction} className="flex items-center gap-2 bg-[#C99224] hover:bg-[#b07f1d] text-white px-5 py-2.5 rounded shadow-sm text-[13px] font-bold uppercase tracking-wider transition-all active:scale-[0.98]">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
          Tải Lên Mới
        </button>
      </div>

      <Card className="border-line/60">
        <div className="p-4 border-b border-line flex flex-col sm:flex-row items-center justify-between gap-4 bg-gray-50/50">
          <div className="flex items-center gap-4 text-[13px] text-muted">
            <span className="font-bold text-navy">5</span> mục đã chọn
            <button className="text-red-500 font-medium hover:underline">Xóa tất cả</button>
          </div>
          
          <div className="flex gap-4 w-full sm:w-auto">
            <select className="px-4 py-2 border border-line rounded text-[13px] text-navy focus:outline-navy bg-white">
              <option>Mọi loại file</option>
              <option>Hình ảnh</option>
              <option>Video</option>
              <option>Tài liệu</option>
            </select>
            <div className="relative w-full sm:w-64">
              <input 
                type="text" 
                placeholder="Tìm kiếm media..." 
                className="w-full pl-9 pr-4 py-2 border border-line rounded text-[13px] text-navy focus:outline-navy"
              />
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>
          </div>
        </div>

        <CardContent className="p-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {/* Upload Dropzone */}
            <button className="relative aspect-square rounded border-2 border-dashed border-line flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-all active:scale-[0.98] bg-gray-50/50">
              <svg className="w-8 h-8 text-muted mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" /></svg>
              <span className="text-[12px] text-navy font-bold">Thêm File</span>
            </button>

            {mockMedia.map((img) => (
              <div key={img.id} className="relative aspect-square rounded border border-line overflow-hidden group bg-white shadow-sm hover:shadow transition-all">
                <Image src={img.src} alt={img.name} fill className="object-cover" />
                <div className="absolute top-2 left-2">
                  <input type="checkbox" className="rounded border-line bg-white/80" />
                </div>
                <div className="absolute inset-0 bg-navy/80 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3">
                  <span className="text-[10px] text-white/80 px-2 text-center break-all">{img.name}</span>
                  <div className="flex gap-2">
                    <button onClick={handleAction} className="w-8 h-8 rounded-full bg-white text-navy flex items-center justify-center hover:bg-gray-200 transition-colors active:scale-90" title="Xem">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                    </button>
                    <button onClick={handleAction} className="w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors active:scale-90" title="Xóa">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
