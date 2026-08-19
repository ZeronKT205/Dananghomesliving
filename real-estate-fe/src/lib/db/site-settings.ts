import 'server-only';

import { cache } from 'react';

import { SOCIAL_LABEL, SOCIAL_PLATFORMS, type SocialPlatform } from '@/lib/validations/settings';

import { getSettings } from './repositories/settings-repo';

/**
 * Cài đặt website ở dạng đã sẵn sàng để render.
 *
 * Bọc trong `cache()` của React: header, footer và khối liên hệ đều cần cùng
 * một dữ liệu trong CÙNG một lần render trang. Không bọc thì mỗi component là
 * một vòng đi Atlas — trang nào cũng cõng thêm ba truy vấn giống hệt nhau.
 * Cache chỉ sống trong một request nên vừa lưu ở CMS là ngoài web thấy ngay.
 */

export interface SiteSocial {
  platform: SocialPlatform;
  label: string;
  href: string;
}

export interface SiteSettings {
  brand: { name: string; tagline: string; description: string };
  contact: {
    email: string;
    phone: string;
    /** `tel:` đã lược khoảng trắng và dấu — bấm gọi được trên di động. */
    phoneHref: string;
    address: string;
    city: string;
    hours: string;
  };
  /** CHỈ những kênh đã bật và có link. Trang public không phải tự lọc. */
  social: SiteSocial[];
  author: { name: string; role: string; avatarUrl: string | null };
}

function isPlatform(v: string): v is SocialPlatform {
  return (SOCIAL_PLATFORMS as readonly string[]).includes(v);
}

export const getSiteSettings = cache(async (): Promise<SiteSettings> => {
  const doc = await getSettings();

  return {
    brand: doc.brand,
    contact: {
      ...doc.contact,
      // Giữ dấu + đầu số quốc tế, bỏ mọi thứ còn lại.
      phoneHref: `tel:${doc.contact.phone.replace(/[^\d+]/g, '')}`,
    },
    social: doc.social
      .filter((s) => s.enabled && s.href.trim() && isPlatform(s.platform))
      .map((s) => ({
        platform: s.platform as SocialPlatform,
        label: SOCIAL_LABEL[s.platform as SocialPlatform],
        href: s.href.trim(),
      })),
    author: {
      name: doc.author.name,
      role: doc.author.role,
      avatarUrl: doc.author.avatarUrl,
    },
  };
});
