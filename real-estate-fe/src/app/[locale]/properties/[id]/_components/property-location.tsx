interface PropertyLocationProps {
  address: string;
  nearby: { time: string; place: string }[];
  keyInfo: { label: string; value: string }[];
}

export function PropertyLocation({ address, nearby, keyInfo }: PropertyLocationProps) {
  return (
    <div id="location" className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8">
      {/* Location Map and Nearby */}
      <div>
        <h2 className="text-[20px] font-display font-medium text-navy mb-4">Vị trí</h2>
        <p className="text-[13px] font-medium text-navy mb-4">{address}</p>
        
        <div className="flex gap-4">
          <div className="w-[180px] h-[180px] bg-gray-100 rounded border border-line relative overflow-hidden shrink-0 flex items-center justify-center">
            {/* Visual map placeholder */}
            <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' viewBox=\'0 0 20 20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M0 0h20v20H0V0zm10 17a7 7 0 1 0 0-14 7 7 0 0 0 0 14zm0-2a5 5 0 1 1 0-10 5 5 0 0 1 0 10z\' fill=\'%23061D36\' fill-opacity=\'0.2\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")', backgroundSize: '40px 40px' }}></div>
            <div className="relative z-10 w-8 h-8 text-navy drop-shadow-md">
              <svg fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 010-5 2.5 2.5 0 010 5z" /></svg>
            </div>
            <button className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-navy text-white text-[10px] font-bold uppercase px-3 py-1.5 rounded shadow-sm hover:bg-[#041124] whitespace-nowrap">
              Xem trên bản đồ
            </button>
          </div>
          
          <div className="flex-1 space-y-3">
            {nearby.map((item, i) => (
              <div key={i} className="flex items-center gap-3 text-[12px]">
                <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                  <svg className="w-3 h-3 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <span className="font-bold text-navy w-14 shrink-0">{item.time}</span>
                <span className="text-muted">đến {item.place}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Key Information */}
      <div>
        <h2 className="text-[20px] font-display font-medium text-navy mb-4">Thông tin chính</h2>
        <div className="space-y-3">
          {keyInfo.map((item, i) => (
            <div key={i} className="flex justify-between items-center py-2 border-b border-line last:border-0">
              <span className="text-[13px] text-muted">{item.label}</span>
              <span className="text-[13px] font-medium text-navy">{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
