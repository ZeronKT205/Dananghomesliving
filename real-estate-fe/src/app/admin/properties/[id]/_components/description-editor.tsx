import { Card, CardHeader, CardTitle, CardContent } from '../../../_components/ui/card';

export function DescriptionEditor() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Mô tả bất động sản</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        
        <div>
          <div className="flex justify-between mb-2">
            <label className="block text-[12px] font-bold text-navy uppercase tracking-wider">Mô tả ngắn</label>
            <span className="text-[11px] text-muted font-medium">135 / 300</span>
          </div>
          <textarea 
            rows={3}
            defaultValue="Nằm trong khu vực đắc địa tại Hòa Hải, Biệt thự Ocean Estate mang đến không gian sống rộng rãi, nội thất cao cấp và sự giao thoa hoàn hảo giữa không gian trong nhà và ngoài trời."
            className="w-full px-4 py-3 border border-line rounded-md text-[14px] text-navy focus:outline-navy focus:border-navy resize-y bg-white"
          />
          <p className="text-[11px] text-muted mt-1.5">Sẽ hiển thị trên các thẻ bất động sản (cards) và trong kết quả tìm kiếm.</p>
        </div>

        <div>
          <label className="block text-[12px] font-bold text-navy uppercase tracking-wider mb-2">Mô tả chi tiết</label>
          
          <div className="border border-line rounded-md overflow-hidden bg-white">
            {/* Toolbar Placeholder */}
            <div className="bg-gray-50 border-b border-line px-3 py-2 flex flex-wrap gap-2 items-center">
              <button className="p-1.5 text-navy hover:bg-gray-200 rounded" title="In đậm">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 12h8a4 4 0 100-8H6v8zm0 0h9a4 4 0 110 8H6v-8z" /></svg>
              </button>
              <button className="p-1.5 text-navy hover:bg-gray-200 rounded" title="In nghiêng">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
              </button>
              <div className="w-px h-4 bg-line mx-1"></div>
              <button className="p-1.5 text-navy hover:bg-gray-200 rounded" title="Tiêu đề">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" /></svg>
              </button>
              <div className="w-px h-4 bg-line mx-1"></div>
              <button className="p-1.5 text-navy hover:bg-gray-200 rounded" title="Danh sách dạng điểm">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
              </button>
              <button className="p-1.5 text-navy hover:bg-gray-200 rounded" title="Danh sách có số">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h14M7 12h14M7 16h14M3 8h.01M3 12h.01M3 16h.01" /></svg>
              </button>
              <div className="w-px h-4 bg-line mx-1"></div>
              <button className="p-1.5 text-navy hover:bg-gray-200 rounded" title="Chèn liên kết">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
              </button>
              <div className="flex-1"></div>
              <button className="p-1.5 text-muted hover:text-navy rounded" title="Hoàn tác">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" /></svg>
              </button>
              <button className="p-1.5 text-muted hover:text-navy rounded" title="Làm lại">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10h-10a8 8 0 00-8 8v2M21 10l-6 6m6-6l-6-6" /></svg>
              </button>
            </div>
            
            <textarea 
              rows={12}
              defaultValue="Ocean Estate Villa là một căn biệt thự 3 phòng ngủ tuyệt đẹp tọa lạc tại khu vực cao cấp Hòa Hải, Quận Ngũ Hành Sơn.&#10;&#10;Được thiết kế cho lối sống hiện đại, biệt thự cung cấp không gian nội thất rộng rãi, các trang thiết bị cao cấp cùng sự kết nối liền mạch với không gian ngoài trời, bể bơi riêng tư và khu vườn xanh mát."
              className="w-full px-4 py-4 border-none text-[14px] text-navy focus:outline-none resize-y"
            />
          </div>
        </div>

      </CardContent>
    </Card>
  );
}
