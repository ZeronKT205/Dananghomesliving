'use client';

import { useState, useEffect } from 'react';

import { Card, CardHeader, CardTitle, CardContent } from '../../../_components/ui/card';

const initialAmenities = [
  { label: 'Hướng Biển', checked: true },
  { label: 'Hồ Bơi Riêng', checked: true },
  { label: 'Sân Vườn', checked: true },
  { label: 'Đầy Đủ Nội Thất', checked: true },
  { label: 'Bếp Hiện Đại', checked: true },
  { label: 'Nhà Thông Minh', checked: true },
  { label: '2 Chỗ Đậu Xe', checked: true },
  { label: 'Bảo Vệ 24/7', checked: true },
  { label: 'Phòng Gym', checked: false },
  { label: 'Thang Máy', checked: false },
  { label: 'Ban Công', checked: false },
  { label: 'Khu Vực BBQ', checked: false },
  { label: 'Nuôi Thú Cưng', checked: false },
  { label: 'Phòng Giúp Việc', checked: false },
];

export function AmenitiesSelector({ isNew }: { isNew?: boolean }) {
  const [amenities, setAmenities] = useState(() => {
    if (isNew) {
      return initialAmenities.map(a => ({ ...a, checked: false }));
    }
    return initialAmenities;
  });

  const toggleAmenity = (index: number) => {
    const newAmenities = [...amenities];
    newAmenities[index].checked = !newAmenities[index].checked;
    setAmenities(newAmenities);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between w-full">
          <CardTitle>Tiện ích</CardTitle>
          <button className="text-[12px] font-medium text-white bg-navy hover:bg-[#041124] px-4 py-1.5 rounded shadow-sm flex items-center gap-1.5 transition-all active:scale-[0.98]">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            Thêm Tiện Ích
          </button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          {amenities.map((item, index) => (
            <label key={item.label} className="flex items-center gap-3 cursor-pointer group">
              <div className="relative flex items-center justify-center">
                <input 
                  type="checkbox" 
                  checked={item.checked}
                  onChange={() => toggleAmenity(index)}
                  className="w-4 h-4 border border-line bg-white rounded focus:ring-gold appearance-none checked:bg-gold checked:border-gold transition-colors cursor-pointer" 
                />
                <svg className="absolute w-3 h-3 text-white pointer-events-none opacity-0 peer-checked:opacity-100" style={{ opacity: item.checked ? 1 : 0 }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
              </div>
              <span className="text-[13px] text-navy group-hover:text-gold transition-colors select-none">{item.label}</span>
            </label>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
