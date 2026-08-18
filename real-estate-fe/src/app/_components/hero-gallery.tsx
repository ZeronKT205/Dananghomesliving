'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

import { cn } from '@/lib/utils';

const SLIDES = [
  { 
    src: '/images/hero/living-01.webp', 
    alt: 'Căn hộ sang trọng mặt biển Đà Nẵng với thiết kế nội thất hiện đại',
    title: 'Biệt thự & Căn hộ Hạng sang Đà Nẵng'
  },
  { 
    src: '/images/hero/living-02.webp', 
    alt: 'Phòng khách biệt thự cao cấp tại Quận Ngũ Hành Sơn Đà Nẵng',
    title: 'Không gian sống Đẳng cấp quốc tế'
  },
  { 
    src: '/images/hero/living-03.webp', 
    alt: 'Căn hộ Penthouse view biển Sơn Trà Đà Nẵng ngập tràn ánh sáng',
    title: 'Tầm nhìn Biển Sơn Trà Tuyệt đẹp'
  },
] as const;

const SIDE_SHOTS = [
  { 
    src: '/images/hero/bedroom.webp', 
    alt: 'Phòng ngủ biệt thự nghỉ dưỡng cao cấp Đà Nẵng', 
    caption: 'Private retreats' 
  },
  { 
    src: '/images/hero/bathroom.webp', 
    alt: 'Phòng tắm hiện đại vật liệu cao cấp tại căn hộ Đà Nẵng', 
    caption: 'Refined details' 
  },
] as const;

const INTERVAL_MS = 5000;

export function HeroGallery() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(
      () => setCurrent((index) => (index + 1) % SLIDES.length),
      INTERVAL_MS,
    );
    return () => clearInterval(timer);
  }, [current]);

  return (
    <div className="grid h-[340px] grid-cols-1 gap-3 sm:h-[420px] sm:grid-cols-[1.3fr_0.7fr] sm:grid-rows-2 lg:h-[460px] xl:h-[490px]">
      {/* Main Slider */}
      <figure className="bg-sand relative row-span-2 overflow-hidden rounded-2xl shadow-md group">
        {SLIDES.map((slide, index) => (
          <Image
            key={slide.src}
            src={slide.src}
            alt={slide.alt}
            fill
            priority={index === 0}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 60vw, 40vw"
            className={cn(
              'object-cover transition-all duration-1000 group-hover:scale-105',
              index === current ? 'opacity-100 scale-100' : 'opacity-0 scale-102',
            )}
          />
        ))}
        <span
          aria-hidden
          className="from-navy/60 via-navy/20 to-transparent absolute inset-0 bg-gradient-to-t to-50%"
        />

        {/* Carousel Indicators */}
        <div className="absolute top-4 left-4 z-10 flex gap-2 bg-navy/30 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20">
          {SLIDES.map((slide, index) => (
            <button
              key={slide.src}
              type="button"
              onClick={() => setCurrent(index)}
              aria-label={`Xem ảnh ${index + 1}: ${slide.title}`}
              aria-current={index === current}
              className={cn(
                'h-1.5 rounded-full cursor-pointer transition-all duration-300',
                index === current ? 'w-6 bg-gold' : 'w-2 bg-white/60 hover:bg-white'
              )}
            />
          ))}
        </div>

        <figcaption className="absolute inset-x-5 bottom-4 z-10 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-1 text-white">
          <div>
            <span className="text-[10px] font-bold tracking-[0.18em] uppercase text-gold block mb-0.5">
              Curated Collection
            </span>
            <strong className="font-display text-lg sm:text-xl font-normal leading-tight">
              Live beautifully in Da Nang
            </strong>
          </div>
        </figcaption>
      </figure>

      {/* Side Images */}
      {SIDE_SHOTS.map((shot) => (
        <figure key={shot.src} className="bg-sand relative hidden overflow-hidden rounded-xl shadow-xs group sm:block">
          <Image
            src={shot.src}
            alt={shot.alt}
            fill
            sizes="(max-width: 1024px) 30vw, 20vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <span
            aria-hidden
            className="from-navy/50 absolute inset-0 bg-gradient-to-t to-transparent to-60%"
          />
          <figcaption className="font-display absolute inset-x-4 bottom-3 z-10 text-[14px] font-medium text-white/95">
            {shot.caption}
          </figcaption>
        </figure>
      ))}
    </div>
  );
}

