'use client';

import { useState, useEffect } from 'react';

export function PropertyTabs() {
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['overview', 'features', 'location'];
      const scrollPosition = window.scrollY + 120; // Offset for header

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = document.getElementById(sections[i]);
        if (section) {
          const sectionTop = section.offsetTop;
          if (scrollPosition >= sectionTop) {
            setActiveTab(sections[i]);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    setActiveTab(id);
    const element = document.getElementById(id);
    if (element) {
      const y = element.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <div className="sticky top-[76px] bg-white/80 backdrop-blur-md z-20 py-4 -mx-4 px-4 sm:mx-0 sm:px-0 border-b border-line sm:border-none">
      <div className="flex gap-2 p-1 bg-gray-100/80 rounded-full w-fit border border-line/50">
        <button 
          onClick={() => scrollToSection('overview')}
          className={`px-5 py-2 text-[13px] font-bold rounded-full transition-all duration-300 ${activeTab === 'overview' ? 'bg-white text-navy shadow-sm border border-line/50' : 'text-muted hover:text-navy'}`}
        >
          Tổng quan
        </button>
        <button 
          onClick={() => scrollToSection('features')}
          className={`px-5 py-2 text-[13px] font-bold rounded-full transition-all duration-300 ${activeTab === 'features' ? 'bg-white text-navy shadow-sm border border-line/50' : 'text-muted hover:text-navy'}`}
        >
          Tiện ích
        </button>
        <button 
          onClick={() => scrollToSection('location')}
          className={`px-5 py-2 text-[13px] font-bold rounded-full transition-all duration-300 ${activeTab === 'location' ? 'bg-white text-navy shadow-sm border border-line/50' : 'text-muted hover:text-navy'}`}
        >
          Vị trí
        </button>
      </div>
    </div>
  );
}
