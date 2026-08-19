'use client';

import { useSiteSettings } from '@/components/site-settings-provider';
import { SOCIAL_ICONS } from '@/components/ui/icons';
import { cn } from '@/lib/utils';

/**
 * Cụm icon mạng xã hội ở góc phải hàng trên của header.
 *
 * Link lấy từ Cài đặt trong CMS, không còn hardcode. Kênh chưa điền link hoặc
 * đã tắt thì không có trong danh sách — không render icon dẫn tới trang chủ
 * facebook.com như trước, thứ chỉ làm khách bấm nhầm rồi thoát.
 */
export function SocialLinks({ className }: { className?: string }) {
  const settings = useSiteSettings();
  const links = settings?.social ?? [];

  if (links.length === 0) return null;

  return (
    <ul className={cn('flex items-center gap-1', className)}>
      {links.map((social) => {
        const Icon = SOCIAL_ICONS[social.platform];
        return (
          <li key={social.platform}>
            <a
              href={social.href}
              target="_blank"
              rel="noreferrer noopener"
              aria-label={social.label}
              className="border-line hover:border-gold hover:text-gold focus-visible:outline-gold grid h-8 w-8 place-items-center border transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              <Icon className="h-[14px] w-[14px]" />
            </a>
          </li>
        );
      })}
    </ul>
  );
}
