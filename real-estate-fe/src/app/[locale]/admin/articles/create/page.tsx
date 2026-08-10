'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card } from '../../_components/ui/card';

const TEMPLATES = {
  template1: {
    title: '[Tin tức] Phân tích toàn cảnh thị trường BĐS Quý 3/2024: Cơ hội và Thách thức',
    shortDescription: 'Báo cáo chi tiết về biến động giá cả, nguồn cung mới và sự dịch chuyển nhu cầu đầu tư trong quý 3/2024. Phân tích chuyên sâu từ các chuyên gia hàng đầu.',
    content: '## 1. Tổng quan thị trường Quý 3/2024\n\nTrong quý vừa qua, thị trường bất động sản chứng kiến những tín hiệu phục hồi rõ rệt. Nguồn cung mới được cải thiện nhờ các chính sách tháo gỡ khó khăn về pháp lý từ Chính phủ. Đặc biệt, phân khúc căn hộ chung cư phục vụ nhu cầu ở thực tiếp tục là điểm sáng dẫn dắt toàn thị trường.\n\n### 1.1 Về nguồn cung\n\n- **Khu vực phía Bắc:** Ghi nhận thêm 4.500 căn hộ mới, tập trung chủ yếu ở phân khúc trung và cao cấp.\n- **Khu vực phía Nam:** Nguồn cung cải thiện nhẹ nhưng vẫn còn khan hiếm các dự án nhà ở xã hội.\n\n### 1.2 Về thanh khoản\n\nTỷ lệ hấp thụ toàn thị trường đạt 35%, tăng trưởng 10% so với cùng kỳ năm ngoái.\n\n## 2. Phân tích diễn biến các phân khúc\n\n### Đất nền ven đô\nPhân khúc này đang có dấu hiệu chững lại về giá nhưng lượng giao dịch thực tế lại tăng ở những khu vực có quy hoạch hạ tầng rõ ràng (đường vành đai, cao tốc mới).\n\n### Căn hộ chung cư cao cấp\nGiá bán sơ cấp tiếp tục neo ở mức cao. Các chủ đầu tư đẩy mạnh chính sách ân hạn nợ gốc và miễn phí quản lý để thu hút khách hàng.\n\n### Bất động sản nghỉ dưỡng\nĐây vẫn là phân khúc gặp nhiều thách thức nhất. Lượng hàng tồn kho cao và thanh khoản diễn ra khá chậm chạp.\n\n## 3. Dự báo xu hướng Quý 4/2024\n\n1. Lãi suất ngân hàng duy trì ở mức thấp sẽ tiếp tục kích thích dòng tiền nhàn rỗi chảy vào BĐS.\n2. Luật Đất đai mới bắt đầu thẩm thấu, tạo hành lang pháp lý minh bạch hơn.\n3. Dòng vốn FDI đổ vào các khu công nghiệp sẽ kéo theo sự phát triển của BĐS khu công nghiệp và nhà ở chuyên gia.\n\n*Nguồn dữ liệu: Hiệp hội Môi giới Bất động sản Việt Nam (VARS)*',
    category: 'Tin tức thị trường',
    tags: 'thị trường, xu hướng, báo cáo, 2024'
  },
  template2: {
    title: 'Giới thiệu siêu dự án [Tên dự án] - Tâm điểm đầu tư mới tại [Khu vực]',
    shortDescription: 'Khám phá dự án đẳng cấp với quy mô khổng lồ, hệ thống tiện ích 5 sao mang tầm quốc tế và tiềm năng sinh lời vượt trội trong tương lai.',
    content: '## 1. Thông tin Tổng quan Dự án\n\n- **Tên thương mại:** [Tên dự án]\n- **Chủ đầu tư:** Tập đoàn [Tên CĐT]\n- **Vị trí:** [Địa chỉ cụ thể, Phường, Quận, Thành phố]\n- **Tổng diện tích:** [Số ha] ha\n- **Quy mô:** Bao gồm [Số] tòa tháp cao [Số] tầng, [Số] căn biệt thự và shophouse.\n- **Mật độ xây dựng:** Chỉ [Số]%\n- **Thời gian bàn giao dự kiến:** Quý [Số]/[Năm]\n\n## 2. Vị trí "Kim Cương" đắc địa\n\nTọa lạc tại quỹ đất vàng cuối cùng của khu vực, [Tên dự án] sở hữu khả năng kết nối giao thông hoàn hảo:\n\n1. **3 phút** đến trung tâm thương mại lớn nhất khu vực.\n2. **5 phút** đến hệ thống trường học quốc tế và bệnh viện đa khoa.\n3. **15 phút** di chuyển nhanh chóng đến Sân bay quốc tế.\n\n## 3. Chuỗi Tiện ích Đặc quyền Tôn vinh Đẳng cấp\n\nChủ đầu tư đã dành hơn 60% diện tích cho không gian xanh và mặt nước, kiến tạo nên môi trường sống như một resort nghỉ dưỡng giữa lòng phố thị:\n\n- **Hồ bơi vô cực Panorama:** Nằm ở độ cao 100m, mang đến tầm nhìn tuyệt mỹ.\n- **Khu Vườn thượng uyển trên không:** Không gian thư giãn với các loài cây quý hiếm.\n- **Trung tâm thương mại & Giải trí đa năng:** Tích hợp đầy đủ các thương hiệu thời trang và ẩm thực nổi tiếng.\n- **Hệ thống an ninh thông minh 24/7:** Sử dụng công nghệ FaceID kết hợp AI để đảm bảo an toàn tuyệt đối.\n\n## 4. Chính sách Bán hàng & Ưu đãi (Cập nhật tháng [Tháng])\n\n- **Chiết khấu thanh toán nhanh:** Nhận ngay ưu đãi lên đến [Số]% giá trị căn hộ.\n- **Hỗ trợ tài chính:** Ngân hàng hỗ trợ vay vốn [Số]%, ân hạn nợ gốc và miễn lãi trong [Số] tháng.\n- **Quà tặng đặc biệt:** Tặng ngay gói nội thất trị giá [Số] triệu đồng cho 50 khách hàng đầu tiên ký HĐMB.\n\n> Liên hệ ngay Hotline: **[Số điện thoại]** để được tư vấn chi tiết và chọn căn vị trí đẹp nhất!',
    category: 'Cẩm nang bất động sản',
    tags: 'dự án mới, đầu tư, cao cấp, ra mắt'
  },
  template3: {
    title: '5 Lời khuyên "Vàng" khi đầu tư Nhà phố Thương mại (Shophouse) năm 2024',
    shortDescription: 'Tổng hợp những lưu ý cốt lõi và kinh nghiệm thực chiến giúp nhà đầu tư tối ưu hóa lợi nhuận, đồng thời hạn chế rủi ro khi quyết định xuống tiền mua Shophouse.',
    content: 'Shophouse (Nhà phố thương mại) luôn là một trong những phân khúc đầu tư hấp dẫn nhất nhờ khả năng sinh lời kép: Vừa tăng giá vốn, vừa có thể cho thuê tạo dòng tiền đều đặn. Tuy nhiên, không phải dự án nào cũng mang lại hiệu quả như kỳ vọng. Dưới đây là 5 nguyên tắc sống còn bạn cần nằm lòng trước khi đầu tư.\n\n## 1. Đánh giá vị trí và lưu lượng khách hàng tiềm năng\n\nYếu tố quyết định sự thành bại của một căn Shophouse chính là vị trí. Một Shophouse tốt phải nằm ở những khu vực có mật độ dân cư đông đúc, mặt đường lớn, dễ dàng đỗ xe và có khả năng tiếp cận khách hàng tự nhiên cao.\n\n- **Tip:** Hãy khảo sát thực tế vào nhiều khung giờ khác nhau trong ngày để đánh giá chính xác lưu lượng người qua lại.\n\n## 2. Ước tính tỷ suất lợi nhuận cho thuê thực tế\n\nNhiều nhà đầu tư bị mờ mắt bởi những cam kết lợi nhuận từ Chủ đầu tư. Bạn cần tự mình làm bài toán tính toán tỷ suất sinh lời thực tế.\n\nCông thức cơ bản: **Tỷ suất lợi nhuận = (Giá thuê 1 năm / Tổng giá trị căn Shophouse) x 100%**\n\n> Mức tỷ suất lý tưởng và an toàn thường dao động từ **8% - 12%/năm**.\n\n## 3. Xem xét thiết kế và công năng sử dụng\n\nThiết kế của Shophouse phải phù hợp với đa dạng mô hình kinh doanh (F&B, thời trang, spa, văn phòng đại diện). Các yếu tố cần lưu ý bao gồm:\n- Chiều rộng mặt tiền (tối thiểu nên từ 5m trở lên).\n- Chỗ đỗ xe cho khách hàng.\n- Lối đi riêng biệt giữa khu vực kinh doanh và không gian ở.\n\n## 4. Tính minh bạch về mặt pháp lý\n\nHiện nay, Shophouse thường có 2 loại hình sở hữu:\n- **Sở hữu lâu dài:** Thường là các Shophouse nằm ngoài khu vực tháp chung cư (dạng nhà phố liên kế).\n- **Sở hữu 50 năm:** Thường là phần khối đế của các tòa nhà chung cư cao tầng.\n\nHãy yêu cầu Chủ đầu tư cung cấp đầy đủ giấy phép xây dựng, hợp đồng mua bán và kiểm tra kỹ thời hạn sở hữu.\n\n## 5. Lựa chọn Chủ đầu tư uy tín và năng lực vận hành\n\nMột khu Shophouse chỉ thực sự sầm uất khi có Ban quản lý vận hành chuyên nghiệp, biết cách tổ chức các sự kiện thu hút khách hàng và duy trì an ninh trật tự. Hãy nhìn vào những dự án trước đó của Chủ đầu tư để đánh giá năng lực thực tế của họ.',
    category: 'Tư vấn đầu tư',
    tags: 'shophouse, kinh nghiệm đầu tư, lời khuyên'
  }
};

export default function CreateArticlePage() {
  const [formData, setFormData] = useState({
    title: '',
    shortDescription: '',
    content: '',
    category: 'Tin tức thị trường',
    tags: ''
  });

  const handleTemplateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const templateKey = e.target.value as keyof typeof TEMPLATES;
    if (templateKey && TEMPLATES[templateKey]) {
      setFormData(TEMPLATES[templateKey]);
      import('../../_components/ui/toast').then(m => m.toast('Đã tải mẫu bài viết thành công!', 'success'));
    } else {
      setFormData({ title: '', shortDescription: '', content: '', category: 'Tin tức thị trường', tags: '' });
    }
  };
  const handleAction = (e: React.FormEvent) => {
    e.preventDefault();
    import('../../_components/ui/toast').then(m => m.toast('Đã xuất bản bài viết thành công!', 'success'));
  };

  return (
    <div className="p-8 max-w-[1200px] mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Link href="/admin/articles" className="text-muted hover:text-navy text-[13px] font-medium transition-colors">
              Tin tức / Bài viết
            </Link>
            <span className="text-muted text-[13px]">/</span>
            <span className="text-navy text-[13px] font-bold">Viết bài mới</span>
          </div>
          <h1 className="text-3xl font-bold text-navy leading-none tracking-tight">Tạo Bài Viết</h1>
        </div>
        <div className="flex gap-3">
          <Link href="/admin/articles" className="px-5 py-2.5 rounded shadow-sm text-[13px] font-bold uppercase tracking-wider bg-white text-navy border border-line hover:bg-gray-50 transition-all active:scale-[0.98]">
            Hủy Bỏ
          </Link>
          <button onClick={handleAction} className="px-5 py-2.5 rounded shadow-sm text-[13px] font-bold uppercase tracking-wider bg-navy hover:bg-navy/90 text-white transition-all active:scale-[0.98]">
            Lưu Bản Nháp
          </button>
          <button onClick={handleAction} className="px-5 py-2.5 rounded shadow-sm text-[13px] font-bold uppercase tracking-wider bg-[#C99224] hover:bg-[#b07f1d] text-white transition-all active:scale-[0.98]">
            Xuất Bản
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-8">
        <div className="col-span-2 space-y-6">
          <Card className="p-6 border-line/60">
            <div className="space-y-6">
              <div className="flex items-center gap-4 bg-navy/5 p-4 rounded border border-navy/10">
                <svg className="w-5 h-5 text-navy shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                <div className="flex-1">
                  <h4 className="text-[13px] font-bold text-navy mb-1">Sử Dụng Mẫu Có Sẵn</h4>
                  <p className="text-[11px] text-muted">Chọn một mẫu bài viết để điền nhanh bố cục và nội dung cơ bản.</p>
                </div>
                <select 
                  onChange={handleTemplateChange}
                  className="px-4 py-2 border border-line rounded bg-white text-[13px] font-medium text-navy focus:outline-none focus:border-navy cursor-pointer w-[250px]"
                >
                  <option value="">-- Trống (Tự viết) --</option>
                  <option value="template1">Mẫu Tin tức thị trường (Chuẩn SEO)</option>
                  <option value="template2">Mẫu Giới thiệu Dự án BĐS</option>
                  <option value="template3">Mẫu Cẩm nang & Lời khuyên đầu tư</option>
                </select>
              </div>

              <div>
                <label className="block text-[13px] font-bold text-navy uppercase tracking-wider mb-2">Tiêu Đề Bài Viết *</label>
                <input 
                  type="text" 
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="Nhập tiêu đề hấp dẫn cho bài viết..." 
                  className="w-full px-4 py-3 border border-line rounded bg-gray-50/50 focus:bg-white focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy transition-all"
                />
              </div>

              <div>
                <label className="block text-[13px] font-bold text-navy uppercase tracking-wider mb-2">Mô Tả Ngắn</label>
                <textarea 
                  value={formData.shortDescription}
                  onChange={(e) => setFormData({...formData, shortDescription: e.target.value})}
                  placeholder="Đoạn trích dẫn tóm tắt nội dung chính..." 
                  rows={3}
                  className="w-full px-4 py-3 border border-line rounded bg-gray-50/50 focus:bg-white focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy transition-all resize-none"
                />
              </div>

              <div>
                <label className="block text-[13px] font-bold text-navy uppercase tracking-wider mb-2">Nội Dung Bài Viết *</label>
                
                {/* Fake Rich Text Editor */}
                <div className="border border-line rounded overflow-hidden">
                  <div className="bg-gray-50 border-b border-line px-3 py-2 flex gap-1 flex-wrap">
                    <button className="p-1.5 rounded hover:bg-gray-200 text-muted hover:text-navy"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 4h8a4 4 0 014 4 4 4 0 01-4 4H6z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 12h9a4 4 0 014 4 4 4 0 01-4 4H6z" /></svg></button>
                    <button className="p-1.5 rounded hover:bg-gray-200 text-muted hover:text-navy"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg></button>
                    <button className="p-1.5 rounded hover:bg-gray-200 text-muted hover:text-navy"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" /></svg></button>
                    <div className="w-px h-6 bg-line mx-1 self-center"></div>
                    <button className="p-1.5 rounded hover:bg-gray-200 text-muted hover:text-navy"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg></button>
                    <button className="p-1.5 rounded hover:bg-gray-200 text-muted hover:text-navy"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg></button>
                  </div>
                  <textarea 
                    value={formData.content}
                    onChange={(e) => setFormData({...formData, content: e.target.value})}
                    placeholder="Bắt đầu viết nội dung ở đây..." 
                    rows={16}
                    className="w-full px-4 py-4 bg-white focus:outline-none resize-y"
                  />
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div className="col-span-1 space-y-6">
          <Card className="p-6 border-line/60">
            <h3 className="text-[13px] font-bold text-navy uppercase tracking-wider mb-4 border-b border-line pb-2">Phân Loại</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-[12px] text-muted font-bold mb-2">Chuyên mục</label>
                <select 
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full px-3 py-2.5 border border-line rounded bg-gray-50/50 focus:bg-white focus:outline-none focus:border-navy text-[14px]"
                >
                  <option>Tin tức thị trường</option>
                  <option>Cẩm nang bất động sản</option>
                  <option>Tư vấn đầu tư</option>
                  <option>Tin nội bộ</option>
                </select>
              </div>

              <div>
                <label className="block text-[12px] text-muted font-bold mb-2">Thẻ (Tags)</label>
                <input 
                  type="text" 
                  value={formData.tags}
                  onChange={(e) => setFormData({...formData, tags: e.target.value})}
                  placeholder="Ví dụ: đà nẵng, shophouse, đầu tư..." 
                  className="w-full px-3 py-2.5 border border-line rounded bg-gray-50/50 focus:bg-white focus:outline-none focus:border-navy text-[14px]"
                />
              </div>
            </div>
          </Card>

          <Card className="p-6 border-line/60">
            <h3 className="text-[13px] font-bold text-navy uppercase tracking-wider mb-4 border-b border-line pb-2">Ảnh Đại Diện</h3>
            
            <div className="border-2 border-dashed border-line rounded-lg bg-gray-50 flex flex-col items-center justify-center p-8 hover:bg-gray-100 hover:border-gold transition-colors cursor-pointer group">
              <div className="w-12 h-12 bg-white rounded-full shadow flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <svg className="w-5 h-5 text-navy" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
              </div>
              <p className="text-[13px] font-bold text-navy mb-1">Click để tải ảnh lên</p>
              <p className="text-[11px] text-muted text-center">Định dạng hỗ trợ: JPG, PNG, WEBP.<br/>Tối đa 2MB.</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
