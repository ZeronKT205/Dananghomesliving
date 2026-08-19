'use client';

import { useTranslations } from 'next-intl';
import { useState, useEffect } from 'react';

export function PropertyTabs() {
  const t = useTranslations('Property');

  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['overview', 'features', 'location'];
      const scrollPosition = window.scrollY + 120; // Offset for header

      for (let i = sections.length - 1; i >= 0; i--) {
        const secId = sections[i];
        if (!secId) continue;
        const section = document.getElementById(secId);
        if (section) {
          const sectionTop = section.offsetTop;
          if (scrollPosition >= sectionTop) {
            setActiveTab(secId);
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
    <div className="sticky top-[76px] bg-white/90 backdrop-blur-md z-20 py-3 border-b border-line">
      <div className="flex gap-0 border border-line bg-paper rounded-none w-fit">
        <button 
          onClick={() => scrollToSection('overview')}
          className={`px-5 py-2.5 text-[12px] font-bold uppercase tracking-wider rounded-none transition-all ${
            activeTab === 'overview' 
              ? 'bg-navy text-white shadow-xs' 
              : 'text-muted hover:text-navy hover:bg-white'
          }`}
        >
          {t('tabOverviewFull')}
        </button>
        <button 
          onClick={() => scrollToSection('features')}
          className={`px-5 py-2.5 text-[12px] font-bold uppercase tracking-wider rounded-none transition-all border-l border-line ${
            activeTab === 'features' 
              ? 'bg-navy text-white shadow-xs' 
              : 'text-muted hover:text-navy hover:bg-white'
          }`}
        >
          {t('tabFeaturesFull')}
        </button>
        <button 
          onClick={() => scrollToSection('location')}
          className={`px-5 py-2.5 text-[12px] font-bold uppercase tracking-wider rounded-none transition-all border-l border-line ${
            activeTab === 'location' 
              ? 'bg-navy text-white shadow-xs' 
              : 'text-muted hover:text-navy hover:bg-white'
          }`}
        >
          {t('tabLocationFull')}
        </button>
      </div>
    </div>
  );
}
