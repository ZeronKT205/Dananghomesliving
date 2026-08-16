'use client';

import { AdminMap } from './admin-map';

export function AdminMapWrapper({ properties }: { properties: any[] }) {
  // Convert mock properties to the format AdminMap expects
  const mapProperties = properties.map(p => ({
    id: p.id,
    title: p.title,
    address: p.location?.address || p.title,
    price: p.price?.vnd || 'Thỏa thuận',
    image: p.images?.[0] || 'https://via.placeholder.com/400x300',
    lat: p.lat || 16.0544 + (Math.random() - 0.5) * 0.05,
    lng: p.lng || 108.2022 + (Math.random() - 0.5) * 0.05,
    status: p.state === 'published' ? 'Đang mở bán' : 'Sắp mở bán',
    categoryName: p.type || 'Căn hộ chung cư'
  }));

  return (
    <div className="flex flex-col gap-5 bg-white p-5 rounded-xl border border-line shadow-sm h-[500px]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-[16px] font-bold text-navy">Bản đồ Phân bổ Bất động sản</h2>
          <p className="text-[13px] text-muted mt-1">
            Tổng quan mật độ bất động sản và vị trí chi tiết của {properties.length} mục tại Đà Nẵng.
          </p>
        </div>
      </div>

      <div className="relative w-full flex-1 rounded-lg overflow-hidden border border-line bg-gray-50 z-0">
        <AdminMap properties={mapProperties} />
      </div>
    </div>
  );
}
