'use client';

import Image from 'next/image';
import { useState } from 'react';

interface PropertyGalleryProps {
  images: string[];
  badges: string[];
}

export function PropertyGallery({ images, badges }: PropertyGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSaved, setIsSaved] = useState(false);

  const mainImage = images[currentIndex] || '';
  
  // Show up to 5 thumbnails (including the one being viewed)
  const thumbnails = images.slice(0, 5);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="w-full" id="gallery">
      {/* Main Large Image */}
      <div className="relative aspect-[16/9] w-full rounded-lg overflow-hidden mb-3 group bg-gray-100">
        {mainImage && (
          <Image 
            src={mainImage} 
            alt="Property Cover" 
            fill 
            className="object-cover transition-opacity duration-300"
          />
        )}
        
        {/* Badges */}
        <div className="absolute top-4 left-4 flex gap-2">
          {badges.map((badge, i) => (
            <span key={i} className={`${i === 0 ? 'bg-[#C99224]' : 'bg-navy'} text-white text-[11px] font-bold uppercase tracking-wider px-3 py-1.5 rounded shadow-sm`}>
              {badge}
            </span>
          ))}
        </div>

        {/* Favorite Icon */}
        <button 
          onClick={() => setIsSaved(!isSaved)}
          className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center text-navy hover:text-red-500 hover:bg-gray-50 transition-colors shadow-sm z-10"
        >
          <svg className="w-5 h-5" fill={isSaved ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>

        {/* Navigation Arrows */}
        <button 
          onClick={handlePrev}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 bg-white/90 rounded-full flex items-center justify-center text-navy opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity hover:bg-white shadow-sm z-10 active:scale-95"
        >
          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        </button>
        <button 
          onClick={handleNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 bg-white/90 rounded-full flex items-center justify-center text-navy opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity hover:bg-white shadow-sm z-10 active:scale-95"
        >
          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
        </button>

        {/* Image Counter */}
        <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-sm text-white text-[12px] font-bold px-3 py-1 rounded">
          {currentIndex + 1} / {images.length}
        </div>
      </div>

      {/* Thumbnails */}
      <div className="flex sm:grid sm:grid-cols-5 gap-2 sm:gap-3 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-2 sm:pb-0">
        {thumbnails.map((src, i) => (
          <div 
            key={i} 
            onClick={() => setCurrentIndex(i)}
            className="relative w-24 sm:w-auto shrink-0 aspect-[4/3] rounded overflow-hidden cursor-pointer bg-gray-100 snap-center"
          >
            <Image src={src} alt="Thumbnail" fill className={`object-cover hover:scale-105 transition-transform duration-300 ${currentIndex !== i && 'opacity-60 hover:opacity-100'}`} />
            {currentIndex === i && <div className="absolute inset-0 border-2 border-[#C99224] rounded pointer-events-none z-10"></div>}
          </div>
        ))}
        {images.length > 5 && (
          <div 
            onClick={() => setCurrentIndex(5)}
            className="relative w-24 sm:w-auto shrink-0 aspect-[4/3] rounded border border-line flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors bg-white group snap-center"
          >
            <span className="font-bold text-navy text-[13px] group-hover:text-[#C99224] transition-colors">+{images.length - 5}</span>
          </div>
        )}
      </div>
    </div>
  );
}
