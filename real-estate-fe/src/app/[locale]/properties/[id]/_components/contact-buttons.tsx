'use client';

interface ContactButtonsProps {
  id?: string;
  listedDate: string;
  updatedDate: string;
}

export function ContactButtons({ listedDate, updatedDate }: ContactButtonsProps) {
  return (
    <div className="bg-white border border-line p-6 rounded-none shadow-lift space-y-5">
      {/* Brand Advisory Header */}
      <div className="border-b border-line pb-4">
        <span className="text-gold text-[10px] font-bold uppercase tracking-[0.2em] block mb-1">
          Tư vấn trực tiếp
        </span>
        <h4 className="font-display text-navy text-[18px] font-normal leading-tight">
          Da Nang Homes Luxury Advisory
        </h4>
        <p className="text-emerald-700 text-[11px] font-medium mt-1 flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
          Đội ngũ cố vấn trực tuyến 24/7
        </p>
      </div>

      {/* Primary Action Buttons */}
      <div className="space-y-2.5">
        <a 
          href="#enquiry-form"
          className="w-full bg-gold hover:bg-gold-soft text-navy py-3.5 px-4 rounded-none text-[12px] font-bold uppercase tracking-[0.14em] flex items-center justify-center gap-2 transition-all shadow-md active:scale-98 cursor-pointer"
        >
          Đặt lịch xem nhà riêng tư
          <span aria-hidden>→</span>
        </a>

        <div className="grid grid-cols-2 gap-2">
          <a 
            href="tel:+842363888888"
            className="flex items-center justify-center gap-2 border border-navy bg-navy text-white hover:bg-navy-2 py-3 rounded-none text-[11px] font-bold uppercase tracking-wider transition-colors cursor-pointer"
          >
            <svg className="w-4 h-4 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            Hotline
          </a>

          <a 
            href="https://wa.me/842363888888" 
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 border border-line text-navy hover:bg-ivory py-3 rounded-none text-[11px] font-bold uppercase tracking-wider transition-colors cursor-pointer"
          >
            <svg className="w-4 h-4 text-emerald-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            WhatsApp
          </a>
        </div>
      </div>

      {/* Property Meta Info */}
      <div className="grid grid-cols-2 gap-2 pt-4 border-t border-line text-[11px] text-muted text-center">
        <div>
          <span className="block text-[9px] uppercase tracking-widest text-muted font-bold">Ngày đăng</span>
          <strong className="text-navy font-semibold text-[12px]">{listedDate}</strong>
        </div>
        <div>
          <span className="block text-[9px] uppercase tracking-widest text-muted font-bold">Cập nhật</span>
          <strong className="text-navy font-semibold text-[12px]">{updatedDate}</strong>
        </div>
      </div>
    </div>
  );
}
