import { MapPicker } from '@/components/ui/map-picker';

interface PropertyLocationProps {
  address: string;
  nearby: { time: string; place: string }[];
  keyInfo: { label: string; value: string }[];
  latitude?: number;
  longitude?: number;
}

export function PropertyLocation({ address, nearby, keyInfo, latitude, longitude }: PropertyLocationProps) {
  return (
    <div id="location" className="space-y-10 pt-4">
      
      {/* Key Information */}
      {keyInfo && keyInfo.length > 0 && (
        <div>
          <h2 className="text-[20px] font-display font-medium text-navy mb-6">Thông tin chính</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-6 gap-x-4">
            {keyInfo.map((item, i) => (
              <div key={i} className="flex flex-col gap-1">
                <span className="text-[12px] text-muted uppercase tracking-wider font-bold">{item.label}</span>
                <span className="text-[15px] font-medium text-navy">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {keyInfo && keyInfo.length > 0 && <hr className="border-line" />}

      {/* Location Map and Nearby */}
      <div>
        <h2 className="text-[20px] font-display font-medium text-navy mb-2">Vị trí trên bản đồ</h2>
        <p className="text-[14px] text-muted mb-6 flex items-center gap-2">
          <svg className="w-4 h-4 shrink-0 text-navy" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
          {address}
        </p>
        
        <div className="w-full h-[350px] sm:h-[450px] rounded-xl overflow-hidden relative shadow-sm border border-line mb-6">
          <MapPicker 
            latitude={latitude || 16.0544} 
            longitude={longitude || 108.2022} 
            readOnly={true}
            className="!h-full !border-0 !rounded-none"
          />
        </div>
        
        {nearby && nearby.length > 0 && (
          <div className="bg-gray-50 rounded-xl p-5 sm:p-6 border border-line">
            <h3 className="text-[14px] font-bold text-navy mb-5 uppercase tracking-wider">Các địa điểm lân cận</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {nearby.map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-white shadow-sm border border-line flex items-center justify-center shrink-0 text-navy">
                    <svg className="w-4 h-4 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-navy text-[13px]">{item.time}</span>
                    <span className="text-muted text-[13px] line-clamp-1" title={item.place}>{item.place}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
