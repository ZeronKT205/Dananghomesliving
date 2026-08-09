import { SOCIAL_ICONS } from '@/components/ui/icons';
import { SOCIAL_LINKS } from '@/config/constants';
import { cn } from '@/lib/utils';

/** Cụm icon mạng xã hội ở góc phải hàng trên của header. */
export function SocialLinks({ className }: { className?: string }) {
  return (
    <ul className={cn('flex items-center gap-1', className)}>
      {SOCIAL_LINKS.map((social) => {
        const Icon = SOCIAL_ICONS[social.icon];
        return (
          <li key={social.name}>
            <a
              href={social.href}
              target="_blank"
              rel="noreferrer noopener"
              aria-label={social.name}
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
