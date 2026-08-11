'use client';

import { useState } from 'react';

/** Lá client nhỏ nhất: chỉ giữ trạng thái đã lưu của một tin.
 *  Chưa gắn lưu trữ — sau này nối vào `savedListing` phía server. */
export function FavoriteButton({ title }: { title: string }) {
  const [saved, setSaved] = useState(false);

  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        setSaved((value) => !value);
      }}
      aria-pressed={saved}
      aria-label={saved ? `Remove ${title} from saved` : `Save ${title}`}
      className={`focus-visible:outline-gold absolute top-3 right-3 z-10 grid h-9 w-9 cursor-pointer place-items-center text-base transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 ${
        saved ? 'bg-gold text-navy' : 'text-navy bg-white/92 hover:bg-white'
      }`}
    >
      <span aria-hidden>{saved ? '♥' : '♡'}</span>
    </button>
  );
}
