'use client';

import { useState } from 'react';

export function PropertyTabs() {
  const [activeTab, setActiveTab] = useState('overview');

  const scrollToSection = (id: string) => {
    setActiveTab(id);
    const element = document.getElementById(id);
    if (element) {
      // Tính toán offset để tránh bị che bởi header dính
      const y = element.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <div className="border-b border-line flex gap-8 sticky top-[76px] bg-white z-20 pt-4">
      <button 
        onClick={() => scrollToSection('overview')}
        className={`pb-3 text-[12px] font-bold uppercase tracking-wider transition-colors border-b-2 ${activeTab === 'overview' ? 'text-navy border-navy' : 'text-muted hover:text-navy border-transparent'}`}
      >
        Tổng quan
      </button>
      <button 
        onClick={() => scrollToSection('features')}
        className={`pb-3 text-[12px] font-bold uppercase tracking-wider transition-colors border-b-2 ${activeTab === 'features' ? 'text-navy border-navy' : 'text-muted hover:text-navy border-transparent'}`}
      >
        Tiện ích
      </button>
      <button 
        onClick={() => scrollToSection('location')}
        className={`pb-3 text-[12px] font-bold uppercase tracking-wider transition-colors border-b-2 ${activeTab === 'location' ? 'text-navy border-navy' : 'text-muted hover:text-navy border-transparent'}`}
      >
        Vị trí
      </button>
    </div>
  );
}
