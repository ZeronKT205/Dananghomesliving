import { Card, CardContent } from './_components/ui/card';
import Link from 'next/link';

export default function AdminDashboard() {
  const recentActivities = [
    {
      id: 'ocean-estate-villa',
      name: 'Biệt thự Ocean Estate',
      type: 'Biệt thự',
      status: 'Đã xuất bản',
      statusColor: 'bg-green-100 text-green-800 border-green-200',
      time: '2 giờ trước',
      action: 'Cập nhật nội dung',
      user: 'Admin'
    },
    {
      id: 'luxury-apartment-a',
      name: 'Căn hộ River View',
      type: 'Căn hộ',
      status: 'Bản nháp',
      statusColor: 'bg-gray-100 text-gray-800 border-gray-200',
      time: '5 giờ trước',
      action: 'Tạo mới',
      user: 'Editor'
    },
    {
      id: 'penthouse-city-center',
      name: 'Penthouse The Summit',
      type: 'Penthouse',
      status: 'Đã xuất bản',
      statusColor: 'bg-green-100 text-green-800 border-green-200',
      time: '1 ngày trước',
      action: 'Cập nhật giá',
      user: 'Admin'
    }
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-navy leading-none mb-2 tracking-tight">Bảng Điều Khiển</h1>
          <p className="text-[13px] text-muted">Tổng quan tình hình kinh doanh và quản lý bất động sản.</p>
        </div>
        <Link 
          href="/admin/properties/new" 
          className="flex items-center gap-2 bg-[#C99224] hover:bg-[#b07f1d] text-white px-5 py-2.5 rounded shadow-sm text-[13px] font-bold uppercase tracking-wider transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
          Thêm BĐS Mới
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <Link href="/admin/properties" className="block group">
          <Card className="h-full hover:shadow-md transition-all duration-300 group-hover:-translate-y-1 border-line/60 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-navy/5 rounded-bl-full -mr-16 -mt-16 transition-transform group-hover:scale-110"></div>
            <CardContent className="p-6 relative z-10 flex flex-col justify-between h-full">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-navy/10 rounded-lg text-navy">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                </div>
                <span className="text-[11px] font-bold text-navy uppercase tracking-wider flex items-center gap-1 group-hover:text-gold transition-colors">
                  Xem tất cả
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </span>
              </div>
              <div>
                <p className="text-4xl font-bold text-navy mb-1 tracking-tight">124</p>
                <h3 className="text-[13px] font-bold text-muted uppercase tracking-wider">Tổng Bất Động Sản</h3>
              </div>
            </CardContent>
          </Card>
        </Link>
        
        <Link href="/admin/properties?status=published" className="block group">
          <Card className="h-full hover:shadow-md transition-all duration-300 group-hover:-translate-y-1 border-line/60 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#C99224]/10 rounded-bl-full -mr-16 -mt-16 transition-transform group-hover:scale-110"></div>
            <CardContent className="p-6 relative z-10 flex flex-col justify-between h-full">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-[#C99224]/10 rounded-lg text-[#C99224]">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                </div>
              </div>
              <div>
                <p className="text-4xl font-bold text-[#C99224] mb-1 tracking-tight">45</p>
                <h3 className="text-[13px] font-bold text-muted uppercase tracking-wider">Đang Mở Bán</h3>
              </div>
            </CardContent>
          </Card>
        </Link>
        
        <div className="block group cursor-default">
          <Card className="h-full border-line/60 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gray-100 rounded-bl-full -mr-16 -mt-16 transition-transform group-hover:scale-110"></div>
            <CardContent className="p-6 relative z-10 flex flex-col justify-between h-full">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-gray-100 rounded-lg text-muted">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                </div>
                <span className="text-[11px] font-bold text-green-600 bg-green-50 px-2 py-1 rounded flex items-center gap-1">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                  +12%
                </span>
              </div>
              <div>
                <p className="text-4xl font-bold text-navy mb-1 tracking-tight">12,450</p>
                <h3 className="text-[13px] font-bold text-muted uppercase tracking-wider">Lượt Xem (Tháng)</h3>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-navy">Bất Động Sản Vừa Cập Nhật</h2>
        <Link href="/admin/properties" className="text-[12px] font-bold text-navy hover:text-gold uppercase tracking-wider flex items-center gap-1 transition-colors">
          Xem lịch sử đầy đủ
        </Link>
      </div>
      
      <Card className="border-line/60 overflow-hidden">
        <CardContent className="p-0">
          <div className="divide-y divide-line">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="p-4 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between hover:bg-gray-50 transition-colors group">
                <div className="flex items-start gap-4 mb-3 sm:mb-0">
                  <div className="hidden sm:flex w-10 h-10 rounded-full bg-gray-100 items-center justify-center text-muted shrink-0 mt-1">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <Link href={`/admin/properties/${activity.id}`} className="text-[15px] font-bold text-navy group-hover:text-gold transition-colors">
                        {activity.name}
                      </Link>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${activity.statusColor}`}>
                        {activity.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-[12px] text-muted">
                      <span className="font-medium text-navy">{activity.type}</span>
                      <span className="w-1 h-1 rounded-full bg-line"></span>
                      <span>{activity.action} bởi <span className="font-medium text-navy">{activity.user}</span></span>
                      <span className="w-1 h-1 rounded-full bg-line"></span>
                      <span>{activity.time}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Link 
                    href={`/admin/properties/${activity.id}`} 
                    className="flex-1 sm:flex-none text-center px-4 py-2 text-[12px] font-bold text-navy bg-white border border-line hover:border-navy hover:bg-gray-50 rounded transition-colors"
                  >
                    Chỉnh sửa
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
