'use client';

import { formatUsd, type AdminProperty } from '../../_data/view-models';

import { AdminMap } from './admin-map';

/**
 * Chuyển dữ liệu bất động sản sang dạng bản đồ cần.
 *
 * Chỉ đưa lên bản đồ những tin ĐÃ CÓ toạ độ. Trước đây thiếu toạ độ thì
 * component tự bịa bằng `16.0544 + (Math.random() - 0.5) * 0.05` — ghim nhảy
 * chỗ sau mỗi lần tải trang và không cái nào đúng vị trí thật, mà nhìn vào thì
 * tưởng bản đồ đang chạy tốt. Thà thiếu ghim còn hơn ghim sai.
 */
export function AdminMapWrapper({ properties }: { properties: AdminProperty[] }) {
  const located = properties.filter(
    (p): p is AdminProperty & { lat: number; lng: number } => p.lat !== null && p.lng !== null,
  );

  const missing = properties.length - located.length;

  const mapProperties = located.map((p) => ({
    id: p.id,
    title: p.title,
    address: p.address || p.district,
    price: formatUsd(p.priceUsd) + (p.perMonth ? '/tháng' : ''),
    image: p.cover,
    lat: p.lat,
    lng: p.lng,
    status: p.state === 'published' ? 'Đang mở bán' : 'Chưa xuất bản',
    categoryName: p.district,
  }));

  return (
    <div className="flex flex-col gap-3">
      {missing > 0 ? (
        <p className="border-line bg-ivory/60 text-muted rounded-md border px-3.5 py-2 text-[12px]">
          <strong className="text-navy">{missing}</strong> bất động sản chưa có toạ độ nên không hiện trên bản đồ. Mở
          từng tin và ghim vị trí trên bản đồ để chúng xuất hiện ở đây.
        </p>
      ) : null}

      <div className="flex flex-col gap-5 bg-white p-5 rounded-xl border border-line shadow-sm h-[500px]">
        <AdminMap properties={mapProperties} />
      </div>
    </div>
  );
}
