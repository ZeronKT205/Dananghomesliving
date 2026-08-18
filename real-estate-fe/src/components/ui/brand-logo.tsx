import Image from 'next/image';
import React from 'react';

interface BrandLogoProps {
  className?: string;
  light?: boolean; // True for dark background (white text), false for light background (navy text)
  showTagline?: boolean;
}

export function BrandLogo({ className = '', light = false, showTagline = true }: BrandLogoProps) {
  const navyColor = light ? '#FFFFFF' : '#071D36';
  const goldColor = light ? '#E0B75F' : '#C9922E';

  return (
    <div className={`flex items-center gap-2.5 sm:gap-3.5 select-none ${className}`}>
      {/* 1. Original Round Logo Badge */}
      <Image
        src="/images/brand/logo.webp"
        alt="Da Nang Homes & Living Logo"
        width={112}
        height={112}
        priority
        className="ring-gold/50 h-10 w-10 sm:h-12 sm:w-12 lg:h-14 lg:w-14 rounded-full object-cover ring-1 shrink-0"
      />

      {/* 2. Brand Text: DANANG in Navy Blue + — HOMES & LIVING — in Gold */}
      <div className="flex flex-col justify-center">
        {/* Top Word: D A N A N G in Navy Blue */}
        <div
          className="flex items-center font-sans font-extrabold tracking-[0.14em] text-[20px] sm:text-[24px] lg:text-[27px] leading-none"
          style={{ color: navyColor }}
        >
          <span>D</span>

          {/* First A with 4-Pane Window */}
          <div className="relative inline-flex items-center justify-center mx-[0.5px]">
            <span>A</span>
            <div className="absolute bottom-[3px] sm:bottom-[3.5px] left-[50%] -translate-x-[50%] w-[6.5px] sm:w-[7.5px] h-[6.5px] sm:h-[7.5px] grid grid-cols-2 gap-[1px] p-[0.5px]">
              <div style={{ backgroundColor: navyColor }}></div>
              <div style={{ backgroundColor: navyColor }}></div>
              <div style={{ backgroundColor: navyColor }}></div>
              <div style={{ backgroundColor: navyColor }}></div>
            </div>
          </div>

          <span>N</span>

          {/* Second A with 4-Pane Window */}
          <div className="relative inline-flex items-center justify-center mx-[0.5px]">
            <span>A</span>
            <div className="absolute bottom-[3px] sm:bottom-[3.5px] left-[50%] -translate-x-[50%] w-[6.5px] sm:w-[7.5px] h-[6.5px] sm:h-[7.5px] grid grid-cols-2 gap-[1px] p-[0.5px]">
              <div style={{ backgroundColor: navyColor }}></div>
              <div style={{ backgroundColor: navyColor }}></div>
              <div style={{ backgroundColor: navyColor }}></div>
              <div style={{ backgroundColor: navyColor }}></div>
            </div>
          </div>

          <span>N</span>
          <span>G</span>
        </div>

        {/* Bottom Tagline: — HOMES & LIVING — in Gold */}
        {showTagline && (
          <div className="flex items-center gap-1.5 mt-1 w-full justify-between">
            <span className="h-[1.5px] min-w-[12px] flex-1 rounded-full" style={{ backgroundColor: goldColor }}></span>
            <span
              className="font-sans text-[8px] sm:text-[9.5px] lg:text-[10px] font-bold tracking-[0.24em] uppercase whitespace-nowrap"
              style={{ color: goldColor }}
            >
              HOMES &amp; LIVING
            </span>
            <span className="h-[1.5px] min-w-[12px] flex-1 rounded-full" style={{ backgroundColor: goldColor }}></span>
          </div>
        )}
      </div>
    </div>
  );
}
