'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

interface PropertyGalleryProps {
  images: string[];
  badges: string[];
}

export function PropertyGallery({ images, badges }: PropertyGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const mainImage = images[currentIndex] || '';
  const thumbnails = images.slice(0, 5);

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  // Keyboard navigation for Lightbox
  useEffect(() => {
    if (!isLightboxOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') setCurrentIndex((prev) => (prev + 1) % images.length);
      if (e.key === 'ArrowLeft') setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
      if (e.key === 'Escape') setIsLightboxOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLightboxOpen, images.length]);

  return (
    <div className="w-full" id="gallery">
      {/* Main Large Image - Sharp Boxy Architectural Frame */}
      <div 
        onClick={() => setIsLightboxOpen(true)}
        className="relative aspect-[16/9] w-full rounded-none overflow-hidden mb-3 group bg-sand cursor-pointer border border-line shadow-xs"
      >
        {mainImage && (
          <Image
            src={mainImage}
            alt="Property Gallery View"
            fill
            sizes="(min-width: 1024px) 880px, 100vw"
            priority
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
          />
        )}
        
        {/* Badges - Sharp Boxy Badges */}
        <div className="absolute top-4 left-4 flex gap-2 z-10">
          {badges.map((badge, i) => (
            <span key={i} className={`${i === 0 ? 'bg-gold text-navy font-bold' : 'bg-navy text-white'} text-[10px] font-semibold uppercase tracking-[0.15em] px-3 py-1.5 rounded-none shadow-xs border border-white/20`}>
              {badge}
            </span>
          ))}
        </div>

        {/* Navigation Arrows - Sharp Square Controls */}
        <button 
          type="button"
          onClick={handlePrev}
          aria-label="Previous photo"
          className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/95 text-navy rounded-none flex items-center justify-center opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all hover:bg-gold hover:text-navy shadow-md z-10 active:scale-95 border border-line"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        </button>
        <button 
          type="button"
          onClick={handleNext}
          aria-label="Next photo"
          className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/95 text-navy rounded-none flex items-center justify-center opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all hover:bg-gold hover:text-navy shadow-md z-10 active:scale-95 border border-line"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
        </button>

        {/* Image Counter & Expand Prompt */}
        <div className="absolute bottom-4 left-4 flex items-center gap-2 z-10">
          <span className="bg-navy/90 backdrop-blur-sm text-white text-[11px] font-semibold tracking-wider px-3 py-1 rounded-none uppercase border border-white/20">
            {currentIndex + 1} / {images.length}
          </span>
          <span className="bg-gold text-navy text-[10px] font-bold tracking-widest px-2.5 py-1 rounded-none uppercase hidden sm:inline-block">
            🔍 Xem toàn màn hình
          </span>
        </div>
      </div>

      {/* Thumbnails - Sharp Boxy Gallery Grid */}
      <div className="flex sm:grid sm:grid-cols-5 gap-2 sm:gap-3 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-2 sm:pb-0">
        {thumbnails.map((src, i) => (
          <div 
            key={i} 
            onClick={() => setCurrentIndex(i)}
            className="relative w-24 sm:w-auto shrink-0 aspect-[4/3] rounded-none overflow-hidden cursor-pointer bg-sand border border-line snap-center"
          >
            <Image src={src} alt="Thumbnail" fill sizes="(min-width: 640px) 180px, 96px" className={`object-cover hover:scale-105 transition-transform duration-300 ${currentIndex !== i && 'opacity-60 hover:opacity-100'}`} />
            {currentIndex === i && <div className="absolute inset-0 border-2 border-gold rounded-none pointer-events-none z-10"></div>}
          </div>
        ))}
        {images.length > 5 && (
          <div 
            onClick={() => setIsLightboxOpen(true)}
            className="relative w-24 sm:w-auto shrink-0 aspect-[4/3] rounded-none border border-line flex items-center justify-center cursor-pointer hover:bg-ivory transition-colors bg-white group snap-center"
          >
            <span className="font-bold text-navy text-[12px] tracking-wider uppercase group-hover:text-gold transition-colors">+{images.length - 5} Ảnh</span>
          </div>
        )}
      </div>

      {/* Fullscreen Lightbox Modal - Sharp Geometric Frame */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-9999 bg-navy/98 backdrop-blur-md flex flex-col justify-between p-4 sm:p-8 animate-fade-in text-white">
          {/* Top Bar */}
          <div className="flex items-center justify-between border-b border-white/10 pb-4 z-10">
            <span className="text-[14px] font-medium tracking-wide text-white/90">
              Ảnh {currentIndex + 1} / {images.length}
            </span>
            <button
              type="button"
              onClick={() => setIsLightboxOpen(false)}
              className="px-4 py-2 bg-white/10 hover:bg-gold hover:text-navy text-white rounded-none text-xs font-bold tracking-widest uppercase transition-colors border border-white/20"
            >
              ✕ Đóng (Esc)
            </button>
          </div>

          {/* Main Display Image */}
          <div className="relative flex-1 my-4 flex items-center justify-center">
            {mainImage && (
              <Image
                src={mainImage}
                alt="Full View"
                fill
                sizes="100vw"
                className="object-contain animate-image-swap"
              />
            )}
            
            {/* Modal Navigation Arrows */}
            <button
              type="button"
              onClick={handlePrev}
              className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-gold hover:text-navy text-white rounded-none flex items-center justify-center text-xl transition-all border border-white/20"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-gold hover:text-navy text-white rounded-none flex items-center justify-center text-xl transition-all border border-white/20"
            >
              ›
            </button>
          </div>

          {/* Bottom Thumbnails Navigation */}
          <div className="flex justify-center gap-2 overflow-x-auto py-2 z-10">
            {images.map((src, idx) => (
              <div
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`relative w-16 h-12 rounded-none overflow-hidden cursor-pointer border-2 transition-all ${
                  currentIndex === idx ? 'border-gold scale-105' : 'border-transparent opacity-50 hover:opacity-100'
                }`}
              >
                <Image src={src} alt="" fill sizes="64px" className="object-cover" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
