'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../../_components/ui/card';

const initialPlaces = [
  { id: 1, name: 'Bãi biển Mỹ Khê', time: '5 phút' },
  { id: 2, name: 'Sân bay Quốc tế Đà Nẵng', time: '10 phút' },
  { id: 3, name: 'Sông Hàn & Trung tâm TP', time: '15 phút' },
  { id: 4, name: 'Sân Golf ĐN', time: '3 phút' },
  { id: 5, name: 'Trường Quốc tế', time: '2 phút' },
];

export function LocationEditor() {
  const [places, setPlaces] = useState(initialPlaces);
  const [nextId, setNextId] = useState(6);

  const addPlace = () => {
    setPlaces([...places, { id: nextId, name: 'Địa điểm mới', time: '0 phút' }]);
    setNextId(nextId + 1);
  };

  const removePlace = (id: number) => {
    setPlaces(places.filter(p => p.id !== id));
  };

  const updatePlace = (id: number, field: 'name' | 'time', value: string) => {
    setPlaces(places.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Vị trí</CardTitle>
      </CardHeader>
      <CardContent>
        
        <div className="grid grid-cols-2 gap-6 mb-8">
          <div className="col-span-2">
            <label className="block text-[12px] font-bold text-navy uppercase tracking-wider mb-2">Địa chỉ</label>
            <input 
              type="text" 
              defaultValue="Hòa Hải, Ngũ Hành Sơn, Đà Nẵng"
              className="w-full px-4 py-2.5 border border-line rounded-md text-[14px] text-navy focus:outline-navy focus:border-navy"
            />
          </div>

          <div>
            <label className="block text-[12px] font-bold text-navy uppercase tracking-wider mb-2">Phường / Xã</label>
            <input type="text" defaultValue="Hòa Hải" className="w-full px-4 py-2.5 border border-line rounded-md text-[14px] text-navy focus:outline-navy focus:border-navy" />
          </div>
          <div>
            <label className="block text-[12px] font-bold text-navy uppercase tracking-wider mb-2">Quận / Huyện</label>
            <input type="text" defaultValue="Ngũ Hành Sơn" className="w-full px-4 py-2.5 border border-line rounded-md text-[14px] text-navy focus:outline-navy focus:border-navy" />
          </div>
          <div>
            <label className="block text-[12px] font-bold text-navy uppercase tracking-wider mb-2">Tỉnh / Thành phố</label>
            <input type="text" defaultValue="Đà Nẵng" className="w-full px-4 py-2.5 border border-line rounded-md text-[14px] text-navy focus:outline-navy focus:border-navy" />
          </div>
          
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-[12px] font-bold text-navy uppercase tracking-wider mb-2">Vĩ độ</label>
              <input type="text" defaultValue="16.0028" className="w-full px-4 py-2.5 border border-line rounded-md text-[14px] text-navy focus:outline-navy focus:border-navy" />
            </div>
            <div className="flex-1">
              <label className="block text-[12px] font-bold text-navy uppercase tracking-wider mb-2">Kinh độ</label>
              <input type="text" defaultValue="108.2612" className="w-full px-4 py-2.5 border border-line rounded-md text-[14px] text-navy focus:outline-navy focus:border-navy" />
            </div>
          </div>
        </div>

        {/* Map Preview Placeholder */}
        <div className="mb-8">
          <div className="w-full h-[240px] bg-gray-100 border border-line rounded-md relative overflow-hidden flex flex-col items-center justify-center">
            {/* Visual map placeholder */}
            <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' viewBox=\'0 0 20 20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M0 0h20v20H0V0zm10 17a7 7 0 1 0 0-14 7 7 0 0 0 0 14zm0-2a5 5 0 1 1 0-10 5 5 0 0 1 0 10z\' fill=\'%23061D36\' fill-opacity=\'0.2\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")', backgroundSize: '40px 40px' }}></div>
            <div className="relative z-10 w-8 h-8 text-navy drop-shadow-md">
              <svg fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 010-5 2.5 2.5 0 010 5z" /></svg>
            </div>
            <div className="relative z-10 mt-3 flex gap-2">
              <button className="bg-white border border-line text-[11px] font-bold px-3 py-1.5 rounded shadow-sm hover:text-gold transition-all active:scale-[0.95] active:bg-gray-50">Ghim Vị Trí</button>
              <button className="bg-white border border-line text-[11px] font-bold px-3 py-1.5 rounded shadow-sm hover:text-gold transition-all active:scale-[0.95] active:bg-gray-50">Sử Dụng Tọa Độ Này</button>
            </div>
          </div>
        </div>

        {/* Nearby Places */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[13px] font-bold text-navy uppercase tracking-wider">Địa điểm lân cận</h3>
            <button onClick={addPlace} className="text-[11px] font-bold text-navy hover:text-gold px-3 py-1.5 border border-line rounded transition-all active:scale-[0.95] active:bg-gray-50 bg-white shadow-sm flex items-center gap-1.5">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
              Thêm Địa Điểm
            </button>
          </div>

          <div className="border border-line rounded-md divide-y divide-line">
            {places.map((place) => (
              <div key={place.id} className="flex items-center gap-4 p-3 hover:bg-gray-50 transition-colors cursor-move">
                <svg className="w-4 h-4 text-muted shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                <input 
                  type="text" 
                  value={place.name} 
                  onChange={(e) => updatePlace(place.id, 'name', e.target.value)}
                  className="flex-1 bg-transparent border-none text-[13px] text-navy focus:outline-none focus:ring-1 focus:ring-line rounded px-2 py-1" 
                />
                <div className="flex items-center gap-2">
                  <input 
                    type="text" 
                    value={place.time} 
                    onChange={(e) => updatePlace(place.id, 'time', e.target.value)}
                    className="w-16 bg-transparent border-none text-[13px] text-navy focus:outline-none focus:ring-1 focus:ring-line rounded px-2 py-1 text-right" 
                  />
                  <button onClick={() => removePlace(place.id)} className="p-1.5 text-muted hover:text-red-500 hover:bg-red-50 rounded transition-all active:scale-[0.90]">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>
              </div>
            ))}
            {places.length === 0 && (
              <div className="p-4 text-center text-[13px] text-muted">Chưa có địa điểm lân cận. Hãy thêm mới.</div>
            )}
          </div>
        </div>

      </CardContent>
    </Card>
  );
}
