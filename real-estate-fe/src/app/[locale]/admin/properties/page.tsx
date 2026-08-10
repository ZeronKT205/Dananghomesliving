'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent } from '../_components/ui/card';
import { useState } from 'react';

const mockProperties = [
  {
    id: 'ocean-estate-villa',
    name: 'Biệt thự Ocean Estate',
    location: 'Ngũ Hành Sơn, Đà Nẵng',
    price: '90.000.000.000',
    type: 'Biệt thự',
    status: 'published',
    statusLabel: 'Đã xuất bản',
    statusColor: 'bg-green-100 text-green-800 border-green-200',
    image: 'https://images.unsplash.com/photo-1613490908592-fd5e23756318?q=80&w=400&auto=format&fit=crop',
    updatedAt: '2 giờ trước'
  },
  {
    id: 'luxury-apartment-a',
    name: 'Căn hộ River View',
    location: 'Sơn Trà, Đà Nẵng',
    price: '4.500.000.000',
    type: 'Căn hộ',
    status: 'draft',
    statusLabel: 'Bản nháp',
    statusColor: 'bg-gray-100 text-gray-800 border-gray-200',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=400&auto=format&fit=crop',
    updatedAt: '5 giờ trước'
  },
  {
    id: 'penthouse-city-center',
    name: 'Penthouse The Summit',
    location: 'Hải Châu, Đà Nẵng',
    price: '25.000.000.000',
    type: 'Penthouse',
    status: 'published',
    statusLabel: 'Đã xuất bản',
    statusColor: 'bg-green-100 text-green-800 border-green-200',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=400&auto=format&fit=crop',
    updatedAt: '1 ngày trước'
  },
  {
    id: 'shophouse-marina',
    name: 'Shophouse Marina',
    location: 'Sơn Trà, Đà Nẵng',
    price: '15.000.000.000',
    type: 'Nhà phố',
    status: 'archived',
    statusLabel: 'Lưu trữ',
    statusColor: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=400&auto=format&fit=crop',
    updatedAt: '1 tuần trước'
  }
];

export default function PropertiesListPage() {
  const searchParams = useSearchParams();
  const statusFilter = searchParams?.get('status') || 'all';
  
  const filteredProperties = mockProperties.filter(prop => {
    if (statusFilter === 'all') return true;
    if (statusFilter === 'sale') return prop.status === 'published'; // Mock mapping
    if (statusFilter === 'rent') return false; // Mock empty
    if (statusFilter === 'draft') return prop.status === 'draft';
    return true;
  });

  const handleAction = (e: React.MouseEvent) => {
    e.preventDefault();
    import('../_components/ui/toast').then(m => m.toast('Thao tác thành công!', 'success'));
  };

  return (
    <div className="p-8 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-navy leading-none mb-2 tracking-tight">Bất Động Sản</h1>
          <p className="text-[13px] text-muted">Quản lý danh sách, cập nhật thông tin và trạng thái bất động sản.</p>
        </div>
        <Link 
          href="/admin/properties/ocean-estate-villa" 
          className="flex items-center gap-2 bg-[#C99224] hover:bg-[#b07f1d] text-white px-5 py-2.5 rounded shadow-sm text-[13px] font-bold uppercase tracking-wider transition-all active:scale-[0.98]"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
          Thêm BĐS Mới
        </Link>
      </div>

      <Card className="border-line/60">
        {/* Toolbar */}
        <div className="p-4 border-b border-line flex flex-col sm:flex-row items-center justify-between gap-4 bg-gray-50/50">
          <div className="flex items-center gap-2">
            <TabLink active={statusFilter === 'all'} href="/admin/properties">Tất cả</TabLink>
            <TabLink active={statusFilter === 'sale'} href="/admin/properties?status=sale">Đang bán</TabLink>
            <TabLink active={statusFilter === 'rent'} href="/admin/properties?status=rent">Cho thuê</TabLink>
            <TabLink active={statusFilter === 'draft'} href="/admin/properties?status=draft">Bản nháp</TabLink>
          </div>
          
          <div className="relative w-full sm:w-64">
            <input 
              type="text" 
              placeholder="Tìm kiếm BĐS..." 
              className="w-full pl-9 pr-4 py-2 border border-line rounded text-[13px] text-navy focus:outline-navy"
            />
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-line text-[11px] font-bold text-muted uppercase tracking-wider bg-gray-50/80">
                <th className="p-4 pl-6 font-bold w-12"><input type="checkbox" className="rounded border-line" /></th>
                <th className="p-4 font-bold">Bất Động Sản</th>
                <th className="p-4 font-bold">Loại Hình</th>
                <th className="p-4 font-bold">Giá</th>
                <th className="p-4 font-bold">Trạng Thái</th>
                <th className="p-4 font-bold">Cập Nhật</th>
                <th className="p-4 pr-6 font-bold text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {filteredProperties.length > 0 ? (
                filteredProperties.map((prop) => (
                  <tr key={prop.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="p-4 pl-6"><input type="checkbox" className="rounded border-line" /></td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img src={prop.image} alt={prop.name} className="w-12 h-12 rounded object-cover border border-line" />
                        <div>
                          <Link href={`/admin/properties/${prop.id}`} className="text-[14px] font-bold text-navy hover:text-gold block mb-0.5">{prop.name}</Link>
                          <span className="text-[12px] text-muted">{prop.location}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-[13px] text-navy">{prop.type}</td>
                    <td className="p-4 text-[13px] font-bold text-gold">{prop.price} đ</td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${prop.statusColor}`}>
                        {prop.statusLabel}
                      </span>
                    </td>
                    <td className="p-4 text-[12px] text-muted">{prop.updatedAt}</td>
                    <td className="p-4 pr-6 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={handleAction} className="p-1.5 text-muted hover:text-navy hover:bg-gray-100 rounded transition-all active:scale-[0.90]" title="Xem trước">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                        </button>
                        <Link href={`/admin/properties/${prop.id}`} className="p-1.5 text-muted hover:text-gold hover:bg-gold/10 rounded transition-all active:scale-[0.90]" title="Chỉnh sửa">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                        </Link>
                        <button onClick={handleAction} className="p-1.5 text-muted hover:text-red-600 hover:bg-red-50 rounded transition-all active:scale-[0.90]" title="Xóa">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-muted text-[14px]">
                    Không tìm thấy bất động sản nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="p-4 border-t border-line flex items-center justify-between text-[13px]">
          <span className="text-muted">Hiển thị <strong className="text-navy">1-{filteredProperties.length}</strong> trong <strong className="text-navy">{filteredProperties.length}</strong> kết quả</span>
          <div className="flex gap-1">
            <button className="px-3 py-1 border border-line rounded text-muted hover:bg-gray-50 disabled:opacity-50 transition-all active:scale-[0.95]" disabled>Trước</button>
            <button className="px-3 py-1 border border-navy bg-navy text-white rounded hover:bg-navy/90 transition-all active:scale-[0.95]">1</button>
            <button className="px-3 py-1 border border-line rounded text-navy hover:bg-gray-50 transition-all active:scale-[0.95]">2</button>
            <button className="px-3 py-1 border border-line rounded text-muted hover:bg-gray-50 transition-all active:scale-[0.95]">Sau</button>
          </div>
        </div>
      </Card>
    </div>
  );
}

function TabLink({ active, href, children }: { active: boolean; href: string; children: React.ReactNode }) {
  return (
    <Link 
      href={href}
      className={`px-3 py-1.5 rounded text-[13px] font-bold transition-colors ${
        active 
          ? 'bg-navy text-white' 
          : 'text-navy hover:bg-gray-200/50'
      }`}
    >
      {children}
    </Link>
  );
}
