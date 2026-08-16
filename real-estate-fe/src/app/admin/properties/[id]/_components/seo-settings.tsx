import Image from 'next/image';
import { Card, CardHeader, CardTitle, CardContent } from '../../../_components/ui/card';

export function SeoSettings({ isNew }: { isNew?: boolean }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tối ưu hóa SEO</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        
        <div>
          <div className="flex justify-between mb-1.5">
            <label className="block text-[11px] font-bold text-navy uppercase tracking-wider">Tiêu đề SEO</label>
            <span className="text-[10px] text-muted font-medium">51 / 60</span>
          </div>
          <input 
            type="text" 
            defaultValue={isNew ? '' : "Biệt thự Ocean Estate | Da Nang Homes & Living"}
            className="w-full px-3 py-2 border border-line rounded-md text-[13px] text-navy focus:outline-navy focus:border-navy"
          />
        </div>

        <div>
          <div className="flex justify-between mb-1.5">
            <label className="block text-[11px] font-bold text-navy uppercase tracking-wider">Mô tả Meta</label>
            <span className="text-[10px] text-muted font-medium">155 / 160</span>
          </div>
          <textarea 
            rows={3}
            defaultValue={isNew ? '' : "Biệt thự 3 phòng ngủ sang trọng tại Hòa Hải, Đà Nẵng. Sở hữu hồ bơi riêng, sân vườn xanh mát và bếp hiện đại. Lựa chọn hoàn hảo cho lối sống đẳng cấp."}
            className="w-full px-3 py-2 border border-line rounded-md text-[13px] text-navy focus:outline-navy focus:border-navy resize-y"
          />
        </div>

        <div>
          <label className="block text-[11px] font-bold text-navy uppercase tracking-wider mb-1.5">Đường dẫn tĩnh (Slug)</label>
          <div className="flex items-center text-[13px]">
            <span className="text-muted bg-gray-50 border border-line border-r-0 px-2 py-2 rounded-l-md select-none">/vi/mua/</span>
            <input 
              type="text" 
              defaultValue={isNew ? '' : "biet-thu-ocean-estate"}
              className="flex-1 px-3 py-2 border border-line rounded-r-md text-navy focus:outline-navy focus:border-navy"
            />
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-navy uppercase tracking-wider mb-1.5">Từ khóa chính</label>
          <input 
            type="text" 
            defaultValue={isNew ? '' : "biệt thự biển đà nẵng"}
            className="w-full px-3 py-2 border border-line rounded-md text-[13px] text-navy focus:outline-navy focus:border-navy"
          />
        </div>

        <div>
          <label className="block text-[11px] font-bold text-navy uppercase tracking-wider mb-2">Ảnh chia sẻ MXH (Open Graph)</label>
          {isNew ? (
            <div className="w-full rounded border border-line border-dashed bg-gray-50 text-muted p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors">
              <svg className="w-6 h-6 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              <span className="text-[12px] font-medium">Tải ảnh lên</span>
            </div>
          ) : (
            <div className="relative aspect-video w-full rounded border border-line overflow-hidden">
              <Image src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&q=80" alt="Social Share" fill className="object-cover" />
              <button className="absolute inset-0 w-full h-full bg-black/40 text-white text-[12px] font-medium flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                Thay đổi ảnh
              </button>
            </div>
          )}
        </div>

        <div className="pt-2 border-t border-line">
          <label className="flex items-center justify-between cursor-pointer group">
            <div>
              <p className="text-[12px] font-bold text-navy uppercase tracking-wider">Lập chỉ mục tìm kiếm</p>
              <p className="text-[11px] text-muted">Cho phép Google lập chỉ mục trang này.</p>
            </div>
            <div className="relative inline-block w-8 h-4 bg-[#C99224] rounded-full transition-colors">
              <span className="absolute left-[18px] top-0.5 w-3 h-3 bg-white rounded-full transition-all"></span>
            </div>
          </label>
        </div>

      </CardContent>
    </Card>
  );
}
