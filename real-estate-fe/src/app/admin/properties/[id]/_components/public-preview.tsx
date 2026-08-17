import Image from 'next/image';

import { Card, CardHeader, CardTitle, CardContent } from '../../../_components/ui/card';

export function PublicPreview() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Bản xem trước</CardTitle>
      </CardHeader>
      <CardContent>
        
        <div className="border border-line rounded-lg overflow-hidden group mb-4">
          <div className="relative aspect-[4/3] w-full border-b border-line">
            <Image src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&q=80" alt="Preview" fill className="object-cover" />
            <div className="absolute top-2 left-2 flex gap-1">
              <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-[#C99224] text-white">Nổi bật</span>
            </div>
            <div className="absolute bottom-2 left-2">
              <span className="px-2 py-1 rounded bg-black/60 backdrop-blur-sm text-[10px] font-bold text-white flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                24
              </span>
            </div>
          </div>
          <div className="p-4 bg-white">
            <h4 className="font-bold text-[15px] text-navy mb-1">Biệt thự Ocean Estate</h4>
            <p className="text-[11px] text-muted mb-3 line-clamp-1">Hòa Hải, Ngũ Hành Sơn, Đà Nẵng</p>
            <p className="text-[16px] text-[#C99224] font-bold mb-4">90.000.000.000 đ</p>
            
            <div className="flex items-center gap-4 text-[11px] text-muted">
              <span className="flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 text-navy" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                Biệt thự
              </span>
              <span className="flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 text-navy" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
                3
              </span>
              <span className="flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 text-navy" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" /></svg>
                917 m²
              </span>
            </div>
          </div>
        </div>

        <button className="w-full py-2.5 text-[12px] font-bold uppercase tracking-wider text-navy bg-white hover:bg-gray-50 border border-line rounded transition-colors text-center flex items-center justify-center gap-2">
          Xem đầy đủ
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
        </button>

      </CardContent>
    </Card>
  );
}
