'use client';

import { useState } from 'react';
import { useToast } from '@/components/ui/toast-provider';

export function EnquiryForm() {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');
  const { showToast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setTimeout(() => {
      setStatus('success');
      showToast('Yêu cầu lịch xem nhà đã được gửi thành công!', 'success');
    }, 1200);
  };

  return (
    <div id="enquiry-form" className="bg-white border border-line p-6 rounded-none shadow-lift">
      <div className="border-b border-line pb-4 mb-5">
        <span className="text-gold text-[10px] font-bold tracking-[0.2em] uppercase block mb-1">
          Lịch trình riêng tư
        </span>
        <h3 className="text-[17px] text-navy font-display font-semibold leading-tight">
          Đăng ký xem biệt thự trực tiếp
        </h3>
      </div>
      
      {status === 'success' ? (
        <div className="bg-ivory border border-gold/40 text-navy p-6 rounded-none text-center animate-fade-in space-y-3">
          <div className="w-12 h-12 bg-gold text-navy rounded-none flex items-center justify-center mx-auto text-xl font-bold">
            ✓
          </div>
          <h4 className="font-display text-[18px] font-normal text-navy">
            Yêu cầu đã được xác nhận
          </h4>
          <p className="text-[13px] text-muted leading-relaxed">
            Cảm ơn bạn. Chuyên gia Trần Đức Giáp sẽ liên hệ lại trực tiếp qua số điện thoại để sắp xếp xe đón &amp; thời gian xem nhà phù hợp.
          </p>
          <button 
            type="button"
            onClick={() => setStatus('idle')}
            className="mt-2 text-gold hover:underline text-[12px] font-bold tracking-wider uppercase block mx-auto"
          >
            ← Đăng ký lịch xem khác
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[10.5px] font-bold text-navy uppercase tracking-wider mb-1.5">
              Họ và tên *
            </label>
            <input 
              type="text" 
              required 
              placeholder="Nguyễn Văn A" 
              className="w-full px-3.5 py-2.5 border border-line bg-paper text-navy rounded-none text-[13px] focus:border-gold focus:ring-2 focus:ring-gold/20 focus:outline-none transition-all" 
            />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10.5px] font-bold text-navy uppercase tracking-wider mb-1.5">
                Số điện thoại *
              </label>
              <input 
                type="tel" 
                required 
                placeholder="0909 123 456" 
                className="w-full px-3.5 py-2.5 border border-line bg-paper text-navy rounded-none text-[13px] focus:border-gold focus:ring-2 focus:ring-gold/20 focus:outline-none transition-all" 
              />
            </div>
            <div>
              <label className="block text-[10.5px] font-bold text-navy uppercase tracking-wider mb-1.5">
                Email *
              </label>
              <input 
                type="email" 
                required 
                placeholder="name@example.com" 
                className="w-full px-3.5 py-2.5 border border-line bg-paper text-navy rounded-none text-[13px] focus:border-gold focus:ring-2 focus:ring-gold/20 focus:outline-none transition-all" 
              />
            </div>
          </div>

          <div>
            <label className="block text-[10.5px] font-bold text-navy uppercase tracking-wider mb-1.5">
              Ngày xem mong muốn
            </label>
            <input 
              type="date" 
              className="w-full px-3.5 py-2.5 border border-line bg-paper text-navy rounded-none text-[13px] focus:border-gold focus:ring-2 focus:ring-gold/20 focus:outline-none transition-all" 
            />
          </div>

          <div>
            <label className="block text-[10.5px] font-bold text-navy uppercase tracking-wider mb-1.5">
              Ghi chú thêm
            </label>
            <textarea 
              rows={3} 
              placeholder="Yêu cầu cụ thể về giờ đón, số lượng người xem..." 
              className="w-full px-3.5 py-2.5 border border-line bg-paper text-navy rounded-none text-[13px] focus:border-gold focus:ring-2 focus:ring-gold/20 focus:outline-none resize-none transition-all"
            ></textarea>
          </div>

          <button 
            type="submit" 
            disabled={status === 'submitting'}
            className="w-full bg-gold hover:bg-gold-soft text-navy py-3.5 rounded-none text-[12px] font-bold uppercase tracking-[0.15em] transition-all shadow-md flex justify-center items-center gap-2 disabled:opacity-70 active:scale-98 cursor-pointer"
          >
            {status === 'submitting' ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4 text-navy" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                </svg>
                Đang xác nhận...
              </span>
            ) : (
              <>
                Xác nhận đặt lịch xem
                <span aria-hidden>→</span>
              </>
            )}
          </button>
          
          <p className="text-[10.5px] text-muted text-center mt-3 flex items-center justify-center gap-1.5">
            <svg className="w-3.5 h-3.5 text-gold shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
            Bảo mật thông tin 100% theo tiêu chuẩn riêng tư.
          </p>
        </form>
      )}
    </div>
  );
}
