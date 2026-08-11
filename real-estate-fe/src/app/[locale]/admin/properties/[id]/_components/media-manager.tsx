'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../../_components/ui/card';

const initialImages = [
  { id: 1, src: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80' },
  { id: 2, src: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80' },
  { id: 3, src: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80' },
];

export function MediaManager() {
  const [images, setImages] = useState(initialImages);
  const [coverDeleted, setCoverDeleted] = useState(false);

  const removeImage = (id: number) => {
    setImages(images.filter(img => img.id !== id));
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between w-full">
          <CardTitle>Hình ảnh & Media</CardTitle>
          <span className="text-[12px] font-bold text-muted bg-gray-100 px-2.5 py-1 rounded-full">
            {images.length + (coverDeleted ? 0 : 1)} Ảnh
          </span>
        </div>
      </CardHeader>
      <CardContent>
        
        {/* Main Cover Image */}
        {!coverDeleted && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[13px] font-bold text-navy uppercase tracking-wider">Ảnh bìa chính</h3>
              <div className="flex items-center gap-2">
                <button className="text-[12px] font-medium text-navy hover:text-gold px-3 py-1.5 border border-line rounded bg-white shadow-sm transition-all active:scale-[0.95] active:bg-gray-50">
                  Thay ảnh
                </button>
                <button className="text-[12px] font-medium text-navy hover:text-gold px-3 py-1.5 border border-line rounded bg-white shadow-sm transition-all active:scale-[0.95] active:bg-gray-50">
                  Cắt ảnh
                </button>
                <button onClick={() => setCoverDeleted(true)} className="text-[12px] font-medium text-red-600 hover:text-red-700 px-3 py-1.5 border border-line rounded bg-white shadow-sm transition-all active:scale-[0.95] active:bg-red-50">
                  Xóa
                </button>
              </div>
            </div>
            
            <div className="relative aspect-video w-full rounded-md overflow-hidden border border-line group">
              <Image 
                src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80" 
                alt="Ocean Estate Villa Cover" 
                fill 
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button className="bg-white/90 text-navy px-4 py-2 rounded font-medium text-[13px] flex items-center gap-2 transition-all hover:bg-white active:scale-[0.95]">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                  Chỉnh sửa
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Photo Gallery */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[13px] font-bold text-navy uppercase tracking-wider">Thư viện ảnh</h3>
            <button className="text-[12px] font-medium text-white bg-navy hover:bg-[#041124] px-4 py-1.5 rounded shadow-sm flex items-center gap-1.5 transition-all active:scale-[0.95]">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
              Thêm ảnh
            </button>
          </div>
          
          <div className="border-2 border-dashed border-line/80 rounded-lg p-6 bg-[#fcfcfc]">
            <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-5 gap-4">
              
              {images.map((img, i) => (
                <div key={img.id} className="relative aspect-[4/3] rounded border border-line overflow-hidden group cursor-move bg-white">
                  <Image src={img.src} alt="Gallery" fill className="object-cover" />
                  <div className="absolute top-1.5 left-1.5 bg-black/60 text-white text-[10px] font-bold px-1.5 py-0.5 rounded backdrop-blur-sm">{i + 1}</div>
                  
                  <div className="absolute inset-0 bg-navy/80 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                    <button className="text-white text-[11px] font-medium hover:text-gold transition-colors">Đặt làm ảnh bìa</button>
                    <button className="text-white text-[11px] font-medium hover:text-gold transition-colors">Sửa alt text</button>
                    <button onClick={() => removeImage(img.id)} className="text-red-400 text-[11px] font-medium hover:text-red-300 transition-colors">Xóa</button>
                  </div>
                </div>
              ))}

              {/* Upload Dropzone Placeholder */}
              <button className="relative aspect-[4/3] rounded border border-line flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 bg-white transition-all active:scale-[0.98]">
                <svg className="w-6 h-6 text-muted mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                <span className="text-[11px] text-muted font-medium">Kéo thả hoặc</span>
                <span className="text-[11px] text-navy font-bold underline">tải ảnh lên</span>
              </button>

            </div>
          </div>
          <p className="text-[11px] text-muted mt-2">Kéo thả ảnh để thay đổi thứ tự. Ảnh đầu tiên mặc định sẽ được dùng làm ảnh bìa.</p>
        </div>
        
      </CardContent>
    </Card>
  );
}
