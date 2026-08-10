'use client';

import { Card } from '../_components/ui/card';

const mockAmenities = [
  { id: 1, name: 'Hồ bơi riêng', icon: 'swimming-pool' },
  { id: 2, name: 'View biển', icon: 'ocean-view' },
  { id: 3, name: 'Phòng Gym', icon: 'dumbbell' },
  { id: 4, name: 'Sân Golf', icon: 'golf' },
  { id: 5, name: 'Bảo vệ 24/7', icon: 'shield' },
];

export default function AmenitiesPage() {
  const handleAction = () => {
    import('../_components/ui/toast').then(m => m.toast('Thao tác thành công!', 'success'));
  };

  return (
    <div className="p-8 max-w-[1400px] mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-navy leading-none mb-2 tracking-tight">Tiện Ích</h1>
          <p className="text-[13px] text-muted">Quản lý các tiện ích nổi bật cho bất động sản.</p>
        </div>
        <button onClick={handleAction} className="flex items-center gap-2 bg-[#C99224] hover:bg-[#b07f1d] text-white px-5 py-2.5 rounded shadow-sm text-[13px] font-bold uppercase tracking-wider transition-all active:scale-[0.98]">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
          Thêm Tiện Ích
        </button>
      </div>

      <Card className="border-line/60">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-line text-[11px] font-bold text-muted uppercase tracking-wider bg-gray-50/80">
                <th className="p-4 pl-6 font-bold w-12"><input type="checkbox" className="rounded border-line" /></th>
                <th className="p-4 font-bold">Tên Tiện Ích</th>
                <th className="p-4 font-bold">Mã Icon</th>
                <th className="p-4 pr-6 font-bold text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {mockAmenities.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="p-4 pl-6"><input type="checkbox" className="rounded border-line" /></td>
                  <td className="p-4 text-[14px] font-bold text-navy">{item.name}</td>
                  <td className="p-4 text-[13px] text-muted font-mono bg-gray-50 px-2 py-1 inline-block mt-3 rounded">{item.icon}</td>
                  <td className="p-4 pr-6 text-right">
                    <button onClick={handleAction} className="p-1.5 text-muted hover:text-gold hover:bg-gold/10 rounded transition-all active:scale-[0.90] mr-1" title="Chỉnh sửa">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                    </button>
                    <button onClick={handleAction} className="p-1.5 text-muted hover:text-red-600 hover:bg-red-50 rounded transition-all active:scale-[0.90]" title="Xóa">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
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
