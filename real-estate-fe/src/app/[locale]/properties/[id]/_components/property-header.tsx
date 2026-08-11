'use client';

import { useState } from 'react';

interface PropertyHeaderProps {
  title: string;
  location: string;
  price: { usd: string; vnd: string };
  stats: { bedrooms: number; bathrooms: number; internalArea: number; landArea: number };
}

export function PropertyHeader({ title, location, price, stats }: PropertyHeaderProps) {
  const [isSaved, setIsSaved] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex items-start gap-2 text-muted text-[11px] font-bold uppercase tracking-wider mb-2">
        <svg className="w-4 h-4 shrink-0 text-[#C99224]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
        {location}
      </div>
      
      <div className="flex items-start justify-between">
        <h1 className="font-display text-[32px] text-navy font-normal leading-tight m-0 p-0">
          {title}
        </h1>
        <button 
          onClick={() => setIsSaved(!isSaved)}
          className={`flex items-center gap-1.5 text-[13px] font-medium border px-3 py-1.5 rounded transition-colors shrink-0 mt-1 ${isSaved ? 'bg-navy text-white border-navy' : 'text-navy border-line hover:bg-gray-50'}`}
        >
          <svg className="w-4 h-4" fill={isSaved ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
          {isSaved ? 'Đã lưu' : 'Lưu'}
        </button>
      </div>

      <div className="pt-2">
        <p className="text-[28px] text-[#C99224] font-bold leading-none mb-1">${price.usd}</p>
        <p className="text-[13px] text-muted font-medium">≈ {price.vnd} VNĐ</p>
      </div>

      <div className="flex divide-x divide-line py-6 my-6 border-y border-line">
        <div className="flex-1 text-center px-2">
          <p className="text-[18px] text-navy font-bold">{stats.bedrooms}</p>
          <p className="text-[10px] uppercase tracking-wider text-muted font-bold mt-1">Phòng ngủ</p>
        </div>
        <div className="flex-1 text-center px-2">
          <p className="text-[18px] text-navy font-bold">{stats.bathrooms}</p>
          <p className="text-[10px] uppercase tracking-wider text-muted font-bold mt-1">Phòng tắm</p>
        </div>
        <div className="flex-1 text-center px-2">
          <p className="text-[18px] text-navy font-bold">{stats.internalArea} m²</p>
          <p className="text-[10px] uppercase tracking-wider text-muted font-bold mt-1">Diện tích trong</p>
        </div>
        <div className="flex-1 text-center px-2">
          <p className="text-[18px] text-navy font-bold">{stats.landArea} m²</p>
          <p className="text-[10px] uppercase tracking-wider text-muted font-bold mt-1">Diện tích đất</p>
        </div>
      </div>
    </div>
  );
}
