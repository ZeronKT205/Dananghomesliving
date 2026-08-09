'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

import { cn } from '@/lib/utils';

const SLIDES = [
  { src: '/images/hero/living-01.webp', alt: 'Bright premium residence living room' },
  { src: '/images/hero/living-02.webp', alt: 'Warm contemporary apartment living room' },
  { src: '/images/hero/living-03.webp', alt: 'Modern apartment with large windows' },
] as const;

const SIDE_SHOTS = [
  { src: '/images/hero/bedroom.webp', alt: 'Premium bedroom', caption: 'Private retreats' },
  { src: '/images/hero/bathroom.webp', alt: 'Luxury bathroom', caption: 'Refined details' },
] as const;

const INTERVAL_MS = 5200;

/** Carousel tự chạy. Chỉ phần này cần client — phần chữ của hero vẫn là
 *  Server Component. Ảnh đầu tiên là LCP nên đánh `priority`. */
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
    <div className="grid h-[380px] grid-cols-1 gap-3 sm:h-[460px] sm:grid-cols-[1.35fr_0.65fr] sm:grid-rows-2 lg:h-[560px]">
      <figure className="bg-sand relative row-span-2 overflow-hidden">
        {SLIDES.map((slide, index) => (
          <Image
            key={slide.src}
            src={slide.src}
            alt={slide.alt}
            fill
            priority={index === 0}
            sizes="(max-width: 640px) 100vw, (max-width: 1100px) 60vw, 45vw"
            className={cn(
              'object-cover transition-opacity duration-700',
              index === current ? 'opacity-100' : 'opacity-0',
            )}
          />
        ))}
        <span
          aria-hidden
          className="from-navy/30 absolute inset-0 bg-gradient-to-t to-transparent to-45%"
        />

        <div className="absolute top-4 left-4 z-10 flex gap-1.5">
          {SLIDES.map((slide, index) => (
            <button
              key={slide.src}
              type="button"
              onClick={() => setCurrent(index)}
              aria-label={`Show image ${index + 1}`}
              aria-current={index === current}
              className={cn(
                'focus-visible:outline-gold h-[3px] w-6 cursor-pointer transition-colors focus-visible:outline-2 focus-visible:outline-offset-4',
                index === current ? 'bg-gold' : 'bg-white/46 hover:bg-white/70',
              )}
            />
          ))}
        </div>

        <figcaption className="absolute inset-x-4 bottom-4 z-10 flex items-end justify-between gap-3 text-white">
          <strong className="font-display text-[19px] font-normal">
            Live beautifully in Da Nang
          </strong>
          <span className="text-[8.5px] tracking-[0.14em] uppercase opacity-90">
            Curated collection
          </span>
        </figcaption>
      </figure>

      {SIDE_SHOTS.map((shot) => (
        <figure key={shot.src} className="bg-sand relative hidden overflow-hidden sm:block">
          <Image
            src={shot.src}
            alt={shot.alt}
            fill
            sizes="(max-width: 1100px) 30vw, 22vw"
            className="object-cover"
          />
          <span
            aria-hidden
            className="from-navy/35 absolute inset-0 bg-gradient-to-t to-transparent to-50%"
          />
          <figcaption className="font-display absolute inset-x-4 bottom-3 z-10 text-[15px] text-white">
            {shot.caption}
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
