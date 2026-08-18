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
      
      {/* Key Information Table - Sharp Boxy Grid */}
      {keyInfo && keyInfo.length > 0 && (
        <div>
          <h2 className="text-[22px] font-display font-normal text-navy tracking-tight mb-6">
            Thông tin pháp lý &amp; Tổng quan
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-0 border border-line bg-white rounded-none divide-x divide-y divide-line">
            {keyInfo.map((item, i) => (
              <div key={i} className="p-4 flex flex-col gap-1">
                <span className="text-[10px] text-muted uppercase tracking-[0.15em] font-bold">{item.label}</span>
                <span className="text-[14px] font-semibold text-navy">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {keyInfo && keyInfo.length > 0 && <hr className="border-line" />}

      {/* Location Map and Nearby */}
      <div>
        <h2 className="text-[22px] font-display font-normal text-navy tracking-tight mb-2">
          Vị trí dự án trên bản đồ
        </h2>
        <p className="text-[13.5px] text-muted mb-6 flex items-center gap-2">
          <svg className="w-4 h-4 shrink-0 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
          {address}
        </p>
        
        {/* Sharp Map Container */}
        <div className="w-full h-[350px] sm:h-[450px] rounded-none overflow-hidden relative shadow-xs border border-line mb-6">
          <MapPicker 
            latitude={latitude || 16.0544} 
            longitude={longitude || 108.2022} 
            readOnly={true}
            zoom={11.5}
            className="!h-full !border-0 !rounded-none"
          />
        </div>
        
        {/* Nearby Highlights - Sharp Container */}
        {nearby && nearby.length > 0 && (
          <div className="bg-paper rounded-none p-6 border border-line">
            <h3 className="text-[11px] font-bold text-navy mb-5 uppercase tracking-[0.18em]">
              Khoảng cách di chuyển &amp; Tiện ích lân cận
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {nearby.map((item, i) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-white border border-line rounded-none">
                  <div className="w-8 h-8 rounded-none bg-gold/10 text-gold border border-gold/30 flex items-center justify-center shrink-0">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="font-bold text-navy text-[12.5px]">{item.time}</span>
                    <span className="text-muted text-[12.5px] truncate" title={item.place}>{item.place}</span>
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
