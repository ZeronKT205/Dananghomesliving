'use client';

import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';

type PropertyGalleryProps = {
  mainImage: string;
  imageAlt: string;
  gallery?: string[];
  title: string;
};

// Verified high-res luxury architectural photos
const VERIFIED_LUXURY_PHOTOS = [
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?q=80&w=1200&auto=format&fit=crop',
];

export function PropertyGallery({
  mainImage,
  imageAlt,
  gallery,
  title,
}: PropertyGalleryProps) {
  // Combine images into clean list of 6 photos
  const rawList = gallery && gallery.length > 0 ? gallery : [mainImage];
  const fullImages = Array.from(
    new Set([mainImage, ...rawList, ...VERIFIED_LUXURY_PHOTOS]),
  ).slice(0, 6);

  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const activePhoto = fullImages[activeIndex] || mainImage;

  const nextPhoto = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % fullImages.length);
  }, [fullImages.length]);

  const prevPhoto = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + fullImages.length) % fullImages.length);
  }, [fullImages.length]);

  // Handle keyboard arrow keys in Lightbox
  useEffect(() => {
    if (!lightboxOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxOpen(false);
      if (e.key === 'ArrowRight') nextPhoto();
      if (e.key === 'ArrowLeft') prevPhoto();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen, nextPhoto, prevPhoto]);

  // Max 4 visible thumbnails in 1 single row
  const visibleThumbnails = fullImages.slice(0, 4);
  const remainingCount = fullImages.length - 4;

  return (
    <div className="space-y-3">
      {/* ── Main Large Viewport Image ── */}
      <div className="group border-line relative h-[380px] sm:h-[480px] lg:h-[540px] w-full overflow-hidden border bg-sand shadow-xs">
        <Image
          key={activePhoto}
          src={activePhoto}
          alt={`${imageAlt} - Photo ${activeIndex + 1}`}
          fill
          priority
          sizes="(max-width: 1200px) 100vw, 1200px"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.015] cursor-pointer animate-image-swap"
          onClick={() => setLightboxOpen(true)}
        />

        {/* Counter Badge */}
        <div className="absolute top-4 right-4 z-10 bg-navy/90 text-white backdrop-blur-xs px-3 py-1.5 text-[11px] font-bold tracking-wider uppercase border border-white/20">
          Photo {activeIndex + 1} of {fullImages.length}
        </div>

        {/* Left Arrow Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            prevPhoto();
          }}
          aria-label="Previous photo"
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-navy/80 hover:bg-gold hover:text-navy text-white border border-white/20 w-11 h-11 flex items-center justify-center text-2xl shadow-lg transition-all duration-200 cursor-pointer rounded-full"
        >
          ‹
        </button>

        {/* Right Arrow Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            nextPhoto();
          }}
          aria-label="Next photo"
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-navy/80 hover:bg-gold hover:text-navy text-white border border-white/20 w-11 h-11 flex items-center justify-center text-2xl shadow-lg transition-all duration-200 cursor-pointer rounded-full"
        >
          ›
        </button>

        {/* View Fullscreen Button */}
        <button
          type="button"
          onClick={() => setLightboxOpen(true)}
          className="absolute bottom-4 right-4 z-10 bg-white/95 hover:bg-white text-navy hover:text-gold border border-line px-4 py-2 text-[11px] font-bold uppercase tracking-wider transition-colors shadow-md flex items-center gap-2 cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
          </svg>
          View Fullscreen ({fullImages.length})
        </button>
      </div>

      {/* ── Sub-Thumbnails Row: STRICTLY 1 ROW (4 slots max) ── */}
      <div className="grid grid-cols-4 gap-2.5 sm:gap-3">
        {visibleThumbnails.map((imgUrl, idx) => {
          const isLastSlotWithMore = idx === 3 && remainingCount > 0;

          return (
            <button
              key={idx}
              type="button"
              onClick={() => {
                if (isLastSlotWithMore) {
                  setLightboxOpen(true);
                } else {
                  setActiveIndex(idx);
                }
              }}
              className={`border-line relative h-20 sm:h-24 md:h-28 overflow-hidden border transition-all duration-200 cursor-pointer ${
                activeIndex === idx && !isLastSlotWithMore
                  ? 'ring-2 ring-gold border-gold opacity-100 shadow-xs'
                  : 'opacity-85 hover:opacity-100'
              }`}
            >
              <Image
                src={imgUrl}
                alt={`${title} thumbnail ${idx + 1}`}
                fill
                sizes="240px"
                className="object-cover"
              />

              {/* Active Golden Bottom Border */}
              {activeIndex === idx && !isLastSlotWithMore && (
                <span className="absolute bottom-0 inset-x-0 h-1 bg-gold z-10" />
              )}

              {/* Overlay +N photos on the last thumbnail slot */}
              {isLastSlotWithMore && (
                <div className="absolute inset-0 bg-navy/80 hover:bg-navy/70 backdrop-blur-xs flex flex-col items-center justify-center text-white transition-colors z-10">
                  <span className="text-[18px] sm:text-[22px] font-bold font-display text-gold">
                    +{remainingCount + 1}
                  </span>
                  <span className="text-[9px] uppercase tracking-wider font-bold text-white/90">
                    More Photos
                  </span>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* ── Fullscreen Lightbox Modal ── */}
      {lightboxOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-200 bg-black/95 backdrop-blur-md flex flex-col justify-between p-4 sm:p-8 text-white"
        >
          {/* Top Bar */}
          <div className="flex items-center justify-between z-10">
            <div className="text-[13px] text-white/80 font-medium">
              <span className="text-gold font-bold">{title}</span> — {activeIndex + 1} / {fullImages.length}
            </div>
            <button
              type="button"
              onClick={() => setLightboxOpen(false)}
              className="border border-white/30 hover:border-gold hover:text-gold w-10 h-10 flex items-center justify-center text-xl cursor-pointer transition-colors"
            >
              ✕
            </button>
          </div>

          {/* Main Image in Lightbox */}
          <div className="relative flex-1 my-4 flex items-center justify-center">
            <div className="relative w-full h-full max-w-6xl max-h-[80vh]">
              <Image
                src={activePhoto}
                alt={`${title} full view`}
                fill
                sizes="100vw"
                className="object-contain"
              />
            </div>

            {/* Prev / Next Arrows */}
            <button
              type="button"
              onClick={prevPhoto}
              aria-label="Previous image"
              className="absolute left-2 sm:left-6 border border-white/20 bg-black/50 hover:bg-gold hover:text-navy text-white w-12 h-12 flex items-center justify-center text-2xl cursor-pointer transition-colors rounded-full"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={nextPhoto}
              aria-label="Next photo"
              className="absolute right-2 sm:right-6 border border-white/20 bg-black/50 hover:bg-gold hover:text-navy text-white w-12 h-12 flex items-center justify-center text-2xl cursor-pointer transition-colors rounded-full"
            >
              ›
            </button>
          </div>

          {/* Bottom Thumbnails Strip in Lightbox */}
          <div className="flex justify-center gap-2 overflow-x-auto py-2 z-10">
            {fullImages.map((imgUrl, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveIndex(idx)}
                className={`relative w-16 h-12 border overflow-hidden shrink-0 cursor-pointer ${
                  activeIndex === idx ? 'border-gold ring-2 ring-gold' : 'border-white/20 opacity-50'
                }`}
              >
                <Image src={imgUrl} alt="" fill className="object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
