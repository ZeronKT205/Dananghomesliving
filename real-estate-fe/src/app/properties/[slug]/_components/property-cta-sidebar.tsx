'use client';

import { useState } from 'react';

import { CONTACT_PHONE, CONTACT_PHONE_HREF } from '@/config/constants';

import { InquiryModalForm } from './inquiry-modal-form';

type PropertyCtaSidebarProps = {
  propertyTitle: string;
  propertyPrice: string;
  priceNote?: string;
  propertyLocation: string;
};

export function PropertyCtaSidebar({
  propertyTitle,
  propertyPrice,
  priceNote,
  propertyLocation,
}: PropertyCtaSidebarProps) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <div className="bg-navy text-white p-6 sm:p-7 border border-gold/30 sticky top-24 shadow-xl">
        <span className="text-gold text-[10px] font-bold tracking-[0.2em] uppercase block mb-1">
          Enquire About This Residence
        </span>

        <h3 className="font-display text-white text-[24px] font-normal mb-2">
          Schedule Private Viewing
        </h3>

        <p className="text-white/70 text-[13px] mb-5 leading-relaxed">
          Connect directly with our bilingual advisor for complete floor plans, lease terms, and viewing availability.
        </p>

        {/* Asking Price Display */}
        <div className="bg-white/10 p-4 border border-white/15 mb-6">
          <span className="text-gold text-[9px] font-bold tracking-[0.16em] uppercase block mb-0.5">Asking Price</span>
          <div className="font-display text-white text-[28px] leading-none">
            {propertyPrice}
            {priceNote && <span className="text-white/70 text-[12px] font-sans ml-1 font-normal">{priceNote}</span>}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="w-full text-center bg-gold hover:bg-[#b07f1d] text-navy font-bold text-[12px] uppercase tracking-wider py-3.5 transition-colors cursor-pointer shadow-sm block"
          >
            Request Detailed Dossier →
          </button>

          <a
            href={`https://wa.me/842363888888?text=${encodeURIComponent(`Hello, I am interested in ${propertyTitle}`)}`}
            target="_blank"
            rel="noreferrer"
            className="block text-center border border-white/30 hover:border-gold hover:text-gold text-white font-bold text-[12px] uppercase tracking-wider py-3 transition-colors cursor-pointer"
          >
            Chat via WhatsApp 💬
          </a>

          <a
            href={CONTACT_PHONE_HREF}
            className="block text-center text-white/80 hover:text-white text-[12px] font-medium py-1 transition-colors"
          >
            Direct Call: <strong>{CONTACT_PHONE}</strong>
          </a>
        </div>

        <div className="mt-6 pt-5 border-t border-white/15 text-[11px] text-white/60 text-center">
          Bilingual Support · EN / VI / ZH / KO
        </div>
      </div>

      {/* Interactive Popup Modal Form */}
      <InquiryModalForm
        propertyTitle={propertyTitle}
        propertyPrice={propertyPrice}
        propertyLocation={propertyLocation}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
}
