'use client';

import { useState, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../../_components/ui/card';
import { MapPicker } from '@/components/ui/map-picker';

const initialPlaces = [
  { id: 1, name: 'Bãi biển Mỹ Khê', time: '5 phút' },
  { id: 2, name: 'Sân bay Quốc tế Đà Nẵng', time: '10 phút' },
  { id: 3, name: 'Sông Hàn & Trung tâm TP', time: '15 phút' },
  { id: 4, name: 'Sân Golf ĐN', time: '3 phút' },
  { id: 5, name: 'Trường Quốc tế', time: '2 phút' },
];

export function LocationEditor({ isNew }: { isNew?: boolean }) {
  const [places, setPlaces] = useState(isNew ? [] : initialPlaces);
  const [nextId, setNextId] = useState(isNew ? 1 : 6);
  const [latitude, setLatitude] = useState<number | null>(isNew ? 16.0544 : 16.0544);
  const [longitude, setLongitude] = useState<number | null>(isNew ? 108.2022 : 108.2022);
  const [address, setAddress] = useState(isNew ? '' : 'Hòa Hải, Đà Nẵng');
  const [ward, setWard] = useState(isNew ? '' : 'Hòa Hải');
  const [city, setCity] = useState(isNew ? '' : 'Đà Nẵng');
  const [isSearching, setIsSearching] = useState(false);

  const searchLocation = async () => {
    if (!address) return;
    setIsSearching(true);
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&addressdetails=1&accept-language=vi`);
      const data = await res.json();
      if (data && data.length > 0) {
        const item = data[0];
        setLatitude(parseFloat(item.lat));
        setLongitude(parseFloat(item.lon));
        
        if (item.address) {
          const addr = item.address;
          setWard(addr.quarter || addr.neighbourhood || addr.suburb || addr.village || addr.hamlet || ward);
          setCity(addr.city || addr.province || addr.state || addr.region || city);
        }
      } else {
        alert('Không tìm thấy tọa độ cho địa chỉ này.');
      }
    } catch (error) {
      console.error('Lỗi khi tìm vị trí:', error);
      alert('Lỗi kết nối khi tìm vị trí.');
    } finally {
      setIsSearching(false);
    }
  };

  const reverseGeocode = useCallback(async (lat: number, lng: number) => {
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1&accept-language=vi`);
      const data = await res.json();
      if (data && data.address) {
        const addr = data.address;
        
        // Cải thiện logic lấy địa chỉ cho Việt Nam
        // Phường / Xã
        const newWard = addr.quarter || addr.neighbourhood || addr.suburb || addr.village || addr.hamlet || '';
        // Tỉnh / Thành phố
        const newCity = addr.city || addr.province || addr.state || addr.region || '';
        
        if (newWard) setWard(newWard);
        if (newCity) setCity(newCity);
        
        // Build short address
        const parts = [];
        if (addr.house_number) parts.push(addr.house_number);
        if (addr.road) parts.push(addr.road);
        
        // Nếu đã có số nhà, đường thì thêm phường, tỉnh
        if (newWard) parts.push(newWard);
        if (newCity) parts.push(newCity);
        
        if (parts.length > 0) {
          setAddress(parts.join(', '));
        } else {
          setAddress(data.display_name);
        }
      }
    } catch (error) {
      console.error('Lỗi reverse geocoding:', error);
    }
  }, []);

  const handleLocationChange = (lat: number, lng: number) => {
    setLatitude(lat);
    setLongitude(lng);
    reverseGeocode(lat, lng);
  };

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
            <label className="block text-[12px] font-bold text-navy uppercase tracking-wider mb-2">Địa chỉ chi tiết</label>
            <div className="flex gap-2">
              <input 
                type="text" 
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); searchLocation(); } }}
                placeholder="VD: 123 Đường Nguyễn Văn Linh..."
                className="flex-1 px-4 py-2.5 border border-line rounded-md text-[14px] text-navy focus:outline-navy focus:border-navy"
              />
              <button 
                type="button"
                onClick={searchLocation}
                disabled={isSearching}
                className="bg-navy text-white px-4 py-2.5 rounded-md text-[13px] font-bold hover:bg-navy/90 transition-colors disabled:opacity-50 whitespace-nowrap"
              >
                {isSearching ? 'Đang tìm...' : 'Tìm trên bản đồ'}
              </button>
            </div>
            <p className="text-[11px] text-muted mt-1.5">Bạn có thể nhập địa chỉ chi tiết (Đường, Tổ...) hoặc click trên bản đồ.</p>
          </div>

          <div>
            <label className="block text-[12px] font-bold text-navy uppercase tracking-wider mb-2">Phường / Xã</label>
            <input 
              type="text" 
              value={ward}
              onChange={(e) => setWard(e.target.value)}
              placeholder="VD: Hòa Hải" 
              className="w-full px-4 py-2.5 border border-line rounded-md text-[14px] text-navy focus:outline-navy focus:border-navy" 
            />
          </div>
          <div>
            <label className="block text-[12px] font-bold text-navy uppercase tracking-wider mb-2">Tỉnh / Thành phố</label>
            <input 
              type="text" 
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="VD: Đà Nẵng" 
              className="w-full px-4 py-2.5 border border-line rounded-md text-[14px] text-navy focus:outline-navy focus:border-navy" 
            />
          </div>

          
          <div className="flex gap-4 col-span-2">
            <div className="flex-1">
              <label className="block text-[12px] font-bold text-navy uppercase tracking-wider mb-2">Vĩ độ</label>
              <input 
                type="text" 
                value={latitude ?? ''} 
                onChange={(e) => setLatitude(Number(e.target.value))}
                className="w-full px-4 py-2.5 border border-line rounded-md text-[14px] text-navy focus:outline-navy focus:border-navy bg-gray-50" 
                readOnly
              />
            </div>
            <div className="flex-1">
              <label className="block text-[12px] font-bold text-navy uppercase tracking-wider mb-2">Kinh độ</label>
              <input 
                type="text" 
                value={longitude ?? ''} 
                onChange={(e) => setLongitude(Number(e.target.value))}
                className="w-full px-4 py-2.5 border border-line rounded-md text-[14px] text-navy focus:outline-navy focus:border-navy bg-gray-50" 
                readOnly
              />
            </div>
          </div>
        </div>

        {/* Map Preview Placeholder */}
        <div className="mb-8">
          <MapPicker 
            latitude={latitude}
            longitude={longitude}
            onChangeLocation={handleLocationChange}
          />
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
