'use client';

import { useState } from 'react';

import { useToast } from '@/components/ui/toast-provider';

/** Lá client nhỏ nhất: giữ trạng thái đã lưu + thông báo Toast trực quan. */
export function FavoriteButton({ title }: { title: string }) {
  const [saved, setSaved] = useState(false);
  const { showToast } = useToast();

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setSaved((prev) => {
      const next = !prev;
      if (next) {
        showToast(`Saved "${title}" to your favorites`, 'success');
      } else {
        showToast(`Removed from saved items`, 'info');
      }
      return next;
    });
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-pressed={saved}
      aria-label={saved ? `Remove ${title} from saved` : `Save ${title}`}
      className={`focus-visible:outline-gold absolute top-3 right-3 z-10 grid h-9 w-9 cursor-pointer place-items-center text-base rounded-full shadow-md transition-all focus-visible:outline-2 focus-visible:outline-offset-2 ${
        saved
          ? 'animate-heart-burst bg-gold text-navy shadow-gold/20'
          : 'text-navy bg-white/95 hover:bg-white hover:text-gold hover:scale-105'
      }`}
    >
      <span aria-hidden className="transition-transform duration-200">{saved ? '♥' : '♡'}</span>
    </button>
  );
}
