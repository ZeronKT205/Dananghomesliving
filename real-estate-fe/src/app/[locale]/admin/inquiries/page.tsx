'use client';

import { Card } from '../_components/ui/card';

const mockInquiries = [
  { id: 1, name: 'Nguyễn Văn A', phone: '0901234567', email: 'nguyenvana@gmail.com', property: 'Biệt thự Ocean Estate', date: 'Vừa xong', status: 'new' },
  { id: 2, name: 'Trần Thị B', phone: '0987654321', email: 'tranthib@gmail.com', property: 'Penthouse The Summit', date: '2 giờ trước', status: 'processing' },
  { id: 3, name: 'Lê Văn C', phone: '0933445566', email: 'levanc@yahoo.com', property: 'Căn hộ River View', date: '1 ngày trước', status: 'completed' },
  { id: 4, name: 'Phạm Thị D', phone: '0911223344', email: 'phamthid@outlook.com', property: 'Shophouse Marina', date: '3 ngày trước', status: 'new' },
];

export default function InquiriesPage() {
  const handleAction = () => {
    import('../_components/ui/toast').then(m => m.toast('Thao tác thành công!', 'success'));
  };

  return (
    <div className="p-8 max-w-[1400px] mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-navy leading-none mb-2 tracking-tight">Yêu Cầu Tư Vấn</h1>
          <p className="text-[13px] text-muted">Quản lý và phản hồi các yêu cầu liên hệ từ khách hàng.</p>
        </div>
      </div>

      <Card className="border-line/60">
        <div className="p-4 border-b border-line flex flex-col sm:flex-row items-center justify-between gap-4 bg-gray-50/50">
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 rounded text-[13px] font-bold transition-all active:scale-[0.95] bg-navy text-white">Tất cả (4)</button>
            <button className="px-3 py-1.5 rounded text-[13px] font-bold transition-all active:scale-[0.95] text-navy hover:bg-gray-200/50">Mới (2)</button>
            <button className="px-3 py-1.5 rounded text-[13px] font-bold transition-all active:scale-[0.95] text-navy hover:bg-gray-200/50">Đang xử lý (1)</button>
          </div>
          
          <div className="relative w-full sm:w-64">
            <input 
              type="text" 
              placeholder="Tìm kiếm khách hàng..." 
              className="w-full pl-9 pr-4 py-2 border border-line rounded text-[13px] text-navy focus:outline-navy"
            />
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-line text-[11px] font-bold text-muted uppercase tracking-wider bg-gray-50/80">
                <th className="p-4 pl-6 font-bold w-12"><input type="checkbox" className="rounded border-line" /></th>
                <th className="p-4 font-bold">Khách Hàng</th>
                <th className="p-4 font-bold">Liên Hệ</th>
                <th className="p-4 font-bold">Bất Động Sản Quan Tâm</th>
                <th className="p-4 font-bold">Thời Gian</th>
                <th className="p-4 font-bold">Trạng Thái</th>
                <th className="p-4 pr-6 font-bold text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {mockInquiries.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="p-4 pl-6"><input type="checkbox" className="rounded border-line" /></td>
                  <td className="p-4">
                    <div className="text-[14px] font-bold text-navy">{item.name}</div>
                  </td>
                  <td className="p-4">
                    <div className="text-[13px] font-medium text-navy">{item.phone}</div>
                    <div className="text-[12px] text-muted">{item.email}</div>
                  </td>
                  <td className="p-4 text-[13px] text-navy font-medium hover:text-gold cursor-pointer transition-colors">{item.property}</td>
                  <td className="p-4 text-[13px] text-muted">{item.date}</td>
                  <td className="p-4">
                    {item.status === 'new' && <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-800 border border-blue-200">Mới</span>}
                    {item.status === 'processing' && <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-yellow-100 text-yellow-800 border border-yellow-200">Đang xử lý</span>}
                    {item.status === 'completed' && <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-green-100 text-green-800 border border-green-200">Đã xong</span>}
                  </td>
                  <td className="p-4 pr-6 text-right">
                    <button onClick={handleAction} className="text-[12px] font-medium text-navy hover:text-gold px-3 py-1 border border-line rounded bg-white shadow-sm transition-all active:scale-[0.95] active:bg-gray-50">
                      Xem Chi Tiết
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
