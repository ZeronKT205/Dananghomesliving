'use client';

import { useState } from 'react';

export function EnquiryForm() {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setTimeout(() => {
      setStatus('success');
    }, 1500);
  };

  return (
    <div id="enquiry-form" className="bg-white border border-line rounded-lg p-6 shadow-sm">
      <h3 className="font-display text-[20px] text-navy font-medium mb-4">Yêu cầu thông tin về BĐS này</h3>
      
      {status === 'success' ? (
        <div className="bg-[#f0f9f4] border border-[#d2efe1] text-[#2e8257] p-4 rounded text-center">
          <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
          <p className="font-bold mb-1">Đã gửi yêu cầu thành công!</p>
          <p className="text-[13px]">Chúng tôi sẽ liên hệ lại với bạn trong thời gian sớm nhất.</p>
          <button 
            onClick={() => setStatus('idle')}
            className="mt-4 text-[#2e8257] underline text-[13px] font-medium"
          >
            Gửi yêu cầu khác
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-navy uppercase tracking-wider mb-1.5">Họ và tên</label>
              <input type="text" required placeholder="Tên của bạn" className="w-full px-3 py-2.5 border border-line rounded text-[13px] focus:outline-navy focus:border-navy transition-colors" />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-navy uppercase tracking-wider mb-1.5">Email</label>
              <input type="email" required placeholder="Email của bạn" className="w-full px-3 py-2.5 border border-line rounded text-[13px] focus:outline-navy focus:border-navy transition-colors" />
            </div>
          </div>
          
          <div>
            <label className="block text-[11px] font-bold text-navy uppercase tracking-wider mb-1.5">Số điện thoại</label>
            <input type="tel" required placeholder="Số điện thoại của bạn" className="w-full px-3 py-2.5 border border-line rounded text-[13px] focus:outline-navy focus:border-navy transition-colors" />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-navy uppercase tracking-wider mb-1.5">Ngày hẹn xem mong muốn</label>
            <div className="relative">
              <input type="date" className="w-full px-3 py-2.5 border border-line rounded text-[13px] text-navy focus:outline-navy focus:border-navy" />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-navy uppercase tracking-wider mb-1.5">Tin nhắn (tùy chọn)</label>
            <textarea 
              rows={3} 
              placeholder="Cho chúng tôi biết thêm về yêu cầu của bạn..." 
              className="w-full px-3 py-2.5 border border-line rounded text-[13px] focus:outline-navy focus:border-navy resize-none transition-colors"
            ></textarea>
          </div>

          <button 
            type="submit" 
            disabled={status === 'submitting'}
            className="w-full bg-[#C99224] hover:bg-[#b07f1d] text-white py-3.5 rounded text-[13px] font-bold uppercase tracking-wider transition-colors mt-2 flex justify-center items-center gap-2 disabled:opacity-70"
          >
            {status === 'submitting' ? (
              <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <>
                Gửi yêu cầu
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
              </>
            )}
          </button>
          
          <p className="text-[10px] text-muted text-center mt-4 flex items-center justify-center gap-1.5">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
            Thông tin của bạn được bảo mật và chỉ dùng để liên hệ về BĐS này.
          </p>
        </form>
      )}
    </div>
  );
}
