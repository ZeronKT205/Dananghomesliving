'use client';

import { useEffect, useState } from 'react';

import { BrandLogo } from './brand-logo';

export function InitialBrandLoader() {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // 1. Tăng tiến độ mượt mà từ 0% lên 100%
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        // Nhảy ngẫu nhiên mượt từ 10% đến 25% mỗi nhịp
        const step = Math.floor(Math.random() * 20) + 12;
        return Math.min(prev + step, 100);
      });
    }, 90);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (progress >= 100) {
      // 2. Khi đạt 100%, chờ 250ms rồi kích hoạt fadeOut mượt
      const timer1 = setTimeout(() => {
        setFadeOut(true);
      }, 250);

      // 3. Sau 900ms hiệu ứng mờ hoàn tất, hủy hẳn phần tử khỏi DOM
      const timer2 = setTimeout(() => {
        setLoading(false);
      }, 950);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    }
  }, [progress]);

  if (!loading) return null;

  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#071D36] text-white transition-all duration-700 ease-out select-none ${
        fadeOut ? 'opacity-0 pointer-events-none scale-102 blur-xs' : 'opacity-100 scale-100'
      }`}
    >
      {/* Visual Ambient Gold Glow Background */}
      <div className="absolute w-[360px] h-[360px] bg-gold/15 rounded-full blur-[120px] pointer-events-none animate-pulse" />

      <div className="relative z-10 flex flex-col items-center px-6 text-center">
        {/* Enlarged Brand Logo Component */}
        <div className="transform scale-110 sm:scale-125 mb-10 transition-transform duration-500 hover:scale-130">
          <BrandLogo light={true} />
        </div>

        {/* Progress Bar Container */}
        <div className="w-60 sm:w-72 bg-white/10 rounded-full h-1.5 p-0.5 border border-white/15 overflow-hidden shadow-inner backdrop-blur-md">
          <div
            className="h-full bg-gradient-to-r from-gold-soft via-gold to-amber-300 rounded-full transition-all duration-200 ease-out shadow-xs"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Progress Text & Status */}
        <div className="mt-3.5 flex items-center justify-between w-60 sm:w-72 text-[10.5px] font-semibold tracking-[0.2em] text-white/70 uppercase">
          <span className="text-gold animate-pulse">Đang tải trải nghiệm...</span>
          <span className="font-mono text-white font-bold">{progress}%</span>
        </div>
      </div>
    </div>
  );
}
