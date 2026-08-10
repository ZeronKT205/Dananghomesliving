'use client';

import { useEffect, useState } from 'react';

type InquiryModalFormProps = {
  propertyTitle: string;
  propertyPrice: string;
  propertyLocation: string;
  isOpen: boolean;
  onClose: () => void;
};

export function InquiryModalForm({
  propertyTitle,
  propertyPrice,
  propertyLocation,
  isOpen,
  onClose,
}: InquiryModalFormProps) {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    preferredDate: '',
    notes: '',
  });

  useEffect(() => {
    if (!isOpen) {
      setSubmitted(false);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-200 bg-navy/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative bg-white border border-line shadow-2xl w-full max-w-lg p-6 sm:p-8 my-8 text-navy animate-pop-in">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close form"
          className="absolute top-4 right-4 text-muted hover:text-navy text-2xl font-normal w-8 h-8 flex items-center justify-center border border-line cursor-pointer transition-colors"
        >
          ✕
        </button>

        {submitted ? (
          <div className="py-8 text-center space-y-4 animate-fade-in">
            <div className="w-14 h-14 bg-gold/20 text-gold border border-gold/40 rounded-full flex items-center justify-center text-2xl mx-auto font-bold animate-checkmark">
              ✓
            </div>
            <h3 className="font-display text-navy text-[26px]">Inquiry Received</h3>
            <p className="text-muted text-[14px] leading-relaxed max-w-sm mx-auto">
              Thank you, <strong className="text-navy">{formData.fullName || 'Valued Client'}</strong>. Our bilingual advisor will send the detailed dossier for <strong className="text-navy">{propertyTitle}</strong> shortly.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="mt-4 bg-navy text-white px-6 py-2.5 text-[12px] font-bold uppercase tracking-wider hover:bg-gold hover:text-navy transition-colors cursor-pointer"
            >
              Close Window
            </button>
          </div>
        ) : (
          <div>
            <span className="text-gold text-[10px] font-bold tracking-[0.2em] uppercase block mb-1">
              Private Consultation
            </span>

            <h3 className="font-display text-navy text-[24px] sm:text-[28px] font-normal mb-1">
              Request Dossier &amp; Viewing
            </h3>

            <p className="text-muted text-[13px] mb-5 border-b border-line/60 pb-3">
              Residence: <strong className="text-navy">{propertyTitle}</strong> ({propertyLocation}) · <span className="text-gold font-bold">{propertyPrice}</span>
            </p>

            <form onSubmit={handleSubmit} className="space-y-4 text-left">
              <div>
                <label className="text-navy text-[11px] font-bold uppercase tracking-wider block mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="e.g. Alexander Wright"
                  className="w-full bg-paper border border-line px-3.5 py-2.5 text-[13.5px] text-navy focus:border-gold focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-navy text-[11px] font-bold uppercase tracking-wider block mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="alexander@example.com"
                    className="w-full bg-paper border border-line px-3.5 py-2.5 text-[13.5px] text-navy focus:border-gold focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-navy text-[11px] font-bold uppercase tracking-wider block mb-1">
                    Phone / WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+84 905 123 456"
                    className="w-full bg-paper border border-line px-3.5 py-2.5 text-[13.5px] text-navy focus:border-gold focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-navy text-[11px] font-bold uppercase tracking-wider block mb-1">
                  Preferred Date or Specific Requirements
                </label>
                <textarea
                  rows={3}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="e.g. Interested in floor plans, requesting virtual viewing date..."
                  className="w-full bg-paper border border-line px-3.5 py-2 text-[13.5px] text-navy focus:border-gold focus:outline-none resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gold hover:bg-[#b07f1d] text-navy font-bold text-[12px] uppercase tracking-wider py-3.5 transition-colors cursor-pointer shadow-sm mt-2"
              >
                Submit Private Request →
              </button>

              <p className="text-[11px] text-muted text-center pt-1">
                🔒 Your privacy is strictly protected. We never share your personal data.
              </p>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
