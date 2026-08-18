import Image from 'next/image';
import React from 'react';

interface BrandLogoProps {
  className?: string;
  light?: boolean; // True for dark background (white text), false for light background (navy text)
  showTagline?: boolean;
  subtitle?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function BrandLogo({
  className = '',
  light = false,
  showTagline = true,
  subtitle,
  size = 'md',
}: BrandLogoProps) {
  const textColor = light ? '#FFFFFF' : '#071D36';
  const goldColor = light ? '#E0B75F' : '#C9922E';

  const imgSizes = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10 sm:h-12 sm:w-12 lg:h-14 lg:w-14',
    lg: 'h-12 w-12 sm:h-14 sm:w-14 lg:h-16 lg:w-16',
  };

  const textSizes = {
    sm: 'text-[16px]',
    md: 'text-[20px] sm:text-[24px] lg:text-[27px]',
    lg: 'text-[24px] sm:text-[28px] lg:text-[32px]',
  };

  const winSizes = {
    sm: 'bottom-[2px] w-[5px] h-[5px]',
    md: 'bottom-[3px] sm:bottom-[3.5px] w-[6.5px] sm:w-[7.5px] h-[6.5px] sm:h-[7.5px]',
    lg: 'bottom-[3.5px] sm:bottom-[4px] w-[7.5px] sm:w-[8.5px] h-[7.5px] sm:h-[8.5px]',
  };

  return (
    <div className={`flex items-center gap-2.5 sm:gap-3.5 select-none ${className}`}>
      {/* 1. Original Round Logo Badge */}
      <Image
        src="/images/brand/logo.webp"
        alt="Da Nang Homes & Living Logo"
        width={112}
        height={112}
        priority
        className={`ring-gold/50 rounded-full object-cover ring-1 shrink-0 ${imgSizes[size]}`}
      />

      {/* 2. Brand Text: DANANG in Navy/White + Tagline or Subtitle */}
      <div className="flex flex-col justify-center">
        {/* Top Word: D A N A N G */}
        <div
          className={`flex items-center font-sans font-extrabold tracking-[0.14em] leading-none ${textSizes[size]}`}
          style={{ color: textColor }}
        >
          <span>D</span>

          {/* First A with 4-Pane Window */}
          <div className="relative inline-flex items-center justify-center mx-[0.5px]">
            <span>A</span>
            <div className={`absolute left-[50%] -translate-x-[50%] grid grid-cols-2 gap-[1px] p-[0.5px] ${winSizes[size]}`}>
              <div style={{ backgroundColor: textColor }}></div>
              <div style={{ backgroundColor: textColor }}></div>
              <div style={{ backgroundColor: textColor }}></div>
              <div style={{ backgroundColor: textColor }}></div>
            </div>
          </div>

          <span>N</span>

          {/* Second A with 4-Pane Window */}
          <div className="relative inline-flex items-center justify-center mx-[0.5px]">
            <span>A</span>
            <div className={`absolute left-[50%] -translate-x-[50%] grid grid-cols-2 gap-[1px] p-[0.5px] ${winSizes[size]}`}>
              <div style={{ backgroundColor: textColor }}></div>
              <div style={{ backgroundColor: textColor }}></div>
              <div style={{ backgroundColor: textColor }}></div>
              <div style={{ backgroundColor: textColor }}></div>
            </div>
          </div>

          <span>N</span>
          <span>G</span>
        </div>

        {/* Subtitle if provided, or Bottom Tagline */}
        {subtitle ? (
          <span
            className="font-sans text-[9px] font-bold tracking-[0.22em] uppercase mt-0.5"
            style={{ color: goldColor }}
          >
            {subtitle}
          </span>
        ) : showTagline ? (
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
        ) : null}
      </div>
    </div>
  );
}
