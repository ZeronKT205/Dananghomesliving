'use client';

import { useState, useEffect } from 'react';
import { BrandLogo } from '@/components/ui/brand-logo';

export function VoucherCtaBanner() {
  const [isOpen, setIsOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [busy, setBusy] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    propertyType: 'Biệt thự biển / Villa',
    preferredTime: 'Cuối tuần này',
    note: '',
  });

  // Lock body scroll when modal is open and handle ESC key
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);

    setTimeout(() => {
      setBusy(false);
      setSubmitted(true);
    }, 700);
  };

  const handleReset = () => {
    setSubmitted(false);
    setIsOpen(false);
    setFormData({
      name: '',
      phone: '',
      email: '',
      propertyType: 'Biệt thự biển / Villa',
      preferredTime: 'Cuối tuần này',
      note: '',
    });
  };

  return (
    <>
      {/* 🏢 Compact Luxury Advisory & Free Tour CTA Banner */}
      <section className="container-page mt-12 mb-8">
        <div className="bg-navy border border-gold/40 shadow-xl p-5 sm:p-7 rounded-none relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="bg-gold/10 absolute -top-24 -left-24 w-64 h-64 rounded-full blur-3xl pointer-events-none" />

          {/* Left Info */}
          <div className="relative z-10 flex items-center gap-4 text-left">
            <div className="bg-gold/15 text-gold border border-gold/40 h-12 w-12 sm:h-14 sm:w-14 rounded-none grid place-items-center shrink-0 shadow-sm">
              <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="bg-gold text-navy text-[9px] font-bold tracking-[0.2em] uppercase px-2 py-0.5 rounded-none">
                  DỊCH VỤ CỐ VẤN MIỄN PHÍ
                </span>
                <span className="text-gold text-[12px] font-bold">Hỗ trợ 24/7</span>
              </div>
              <h3 className="font-display text-white text-[18px] sm:text-[22px] font-normal leading-tight">
                Đặt Lịch Xem Bất Động Sản &amp; Tư Vấn Trực Tiếp
              </h3>
              <p className="text-white/70 text-[12.5px] mt-1 max-w-xl">
                Đội ngũ cố vấn Da Nang Homes &amp; Living hỗ trợ đưa đón tham quan thực tế và phân tích pháp lý BĐS hoàn toàn miễn phí.
              </p>
            </div>
          </div>

          {/* Right Action Button */}
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="relative z-10 bg-gold hover:bg-white text-navy px-7 py-3.5 text-[11.5px] font-bold tracking-[0.18em] uppercase transition-all duration-300 rounded-none cursor-pointer shrink-0 shadow-md hover:scale-102 flex items-center gap-2 border border-gold"
          >
            📅 Đặt Lịch Xem BĐS Miễn Phí
            <span aria-hidden>→</span>
          </button>
        </div>
      </section>

      {/* 🚀 Popup Lightbox Modal Form */}
      {isOpen && (
        <div className="fixed inset-0 z-[100000] flex items-center justify-center p-4 sm:p-6 bg-navy/85 backdrop-blur-md animate-fade-in overflow-y-auto">
          {/* Backdrop Click to Close */}
          <div className="fixed inset-0" onClick={() => setIsOpen(false)} />

          {/* Modal Content Box */}
          <div className="relative z-10 bg-white border border-gold/40 shadow-2xl w-full max-w-lg p-6 sm:p-8 rounded-none animate-scale-up my-auto">
            {/* Close (X) Button */}
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-muted hover:text-navy p-1.5 transition-colors cursor-pointer"
              aria-label="Đóng popup"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {!submitted ? (
              <>
                {/* Header */}
                <div className="text-center flex flex-col items-center mb-6 pt-2">
                  <BrandLogo light={false} className="transform scale-90 mb-3" />
                  <span className="text-gold text-[9px] font-bold tracking-[0.2em] uppercase bg-gold/10 px-2.5 py-1 mb-1.5 border border-gold/30">
                    Dịch Vụ Cố Vấn Cao Cấp
                  </span>
                  <h3 className="font-display text-navy text-[22px] font-normal leading-tight">
                    Đăng Ký Tư Vấn &amp; Đặt Lịch Xem BĐS
                  </h3>
                  <p className="text-muted text-[12px] mt-1 max-w-sm">
                    Vui lòng để lại thông tin, chuyên viên sẽ liên hệ sắp xếp lịch trình đưa đón xem thực tế hoàn toàn miễn phí.
                  </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-navy text-[10px] font-bold uppercase tracking-[0.14em] mb-1">
                      Họ và tên của bạn <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Ví dụ: Nguyễn Văn A"
                      className="w-full bg-paper border border-line focus:border-gold focus:outline-none px-3.5 py-2.5 text-[13px] font-medium text-navy rounded-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-navy text-[10px] font-bold uppercase tracking-[0.14em] mb-1">
                        Số điện thoại (Zalo) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="0905 xxx xxx"
                        className="w-full bg-paper border border-line focus:border-gold focus:outline-none px-3.5 py-2.5 text-[13px] font-medium text-navy rounded-none"
                      />
                    </div>

                    <div>
                      <label className="block text-navy text-[10px] font-bold uppercase tracking-[0.14em] mb-1">
                        Địa chỉ Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="youremail@example.com"
                        className="w-full bg-paper border border-line focus:border-gold focus:outline-none px-3.5 py-2.5 text-[13px] font-medium text-navy rounded-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-navy text-[10px] font-bold uppercase tracking-[0.14em] mb-1">
                        Loại hình BĐS quan tâm
                      </label>
                      <select
                        value={formData.propertyType}
                        onChange={(e) => setFormData({ ...formData, propertyType: e.target.value })}
                        className="w-full bg-paper border border-line focus:border-gold focus:outline-none px-3.5 py-2.5 text-[12.5px] font-semibold text-navy rounded-none cursor-pointer"
                      >
                        <option value="Biệt thự biển / Villa">Biệt thự biển / Villa</option>
                        <option value="Penthouse căn hộ cao cấp">Penthouse căn hộ cao cấp</option>
                        <option value="Căn hộ Studio / 1-2 PN">Căn hộ Studio / 1-2 PN</option>
                        <option value="Đất nền / Shophouse">Đất nền / Shophouse</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-navy text-[10px] font-bold uppercase tracking-[0.14em] mb-1">
                        Thời gian dự kiến xem
                      </label>
                      <select
                        value={formData.preferredTime}
                        onChange={(e) => setFormData({ ...formData, preferredTime: e.target.value })}
                        className="w-full bg-paper border border-line focus:border-gold focus:outline-none px-3.5 py-2.5 text-[12.5px] font-semibold text-navy rounded-none cursor-pointer"
                      >
                        <option value="Cuối tuần này">Cuối tuần này</option>
                        <option value="Trong 2-3 ngày tới">Trong 2-3 ngày tới</option>
                        <option value="Sáng mai">Sáng mai</option>
                        <option value="Lịch linh hoạt">Lịch linh hoạt</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-navy text-[10px] font-bold uppercase tracking-[0.14em] mb-1">
                      Yêu cầu chi tiết (Tùy chọn)
                    </label>
                    <textarea
                      rows={2}
                      value={formData.note}
                      onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                      placeholder="Ví dụ: Cần xem biệt thự hướng biển khu vực Ngũ Hành Sơn..."
                      className="w-full bg-paper border border-line focus:border-gold focus:outline-none px-3.5 py-2.5 text-[13px] font-medium text-navy rounded-none resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={busy}
                    className="w-full bg-navy hover:bg-gold text-white hover:text-navy py-3.5 text-[11.5px] font-bold tracking-[0.18em] uppercase transition-all rounded-none cursor-pointer flex items-center justify-center gap-2 shadow-md disabled:opacity-70 mt-2"
                  >
                    {busy ? (
                      <>
                        <svg className="w-4 h-4 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Đang đăng ký lịch xem...
                      </>
                    ) : (
                      <>
                        XÁC NHẬN ĐẶT LỊCH XEM BĐS MIỄN PHÍ →
                      </>
                    )}
                  </button>
                </form>
              </>
            ) : (
              /* Success State Preview */
              <div className="text-center py-6 animate-fade-in space-y-4">
                <div className="w-16 h-16 bg-gold/15 text-gold border border-gold/40 mx-auto rounded-none grid place-items-center">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>

                <h3 className="font-display text-navy text-[24px]">Đăng Ký Đặt Lịch Thành Công!</h3>

                <p className="text-muted text-[13px] max-w-sm mx-auto">
                  Cảm ơn <strong className="text-navy">{formData.name}</strong>! Chuyên viên cố vấn cao cấp Da Nang Homes &amp; Living sẽ liên hệ xác nhận thời gian đưa đón xem BĐS thực tế qua SĐT <strong>{formData.phone}</strong> trong 15 phút tới.
                </p>

                <button
                  type="button"
                  onClick={handleReset}
                  className="bg-navy hover:bg-gold text-white hover:text-navy px-8 py-3 text-[11px] font-bold tracking-[0.16em] uppercase transition-all rounded-none cursor-pointer mt-2"
                >
                  Hoàn thành &amp; Đóng
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
