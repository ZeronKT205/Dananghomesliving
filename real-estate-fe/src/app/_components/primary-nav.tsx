import Link from 'next/link';

import { ChevronDownIcon } from '@/components/ui/icons';
import { NAV_ITEMS } from '@/config/constants';
import { cn } from '@/lib/utils';

/** Hàng tab dưới của header.
 *  Menu xổ xuống chạy bằng `group-hover` + `group-focus-within` thuần CSS —
 *  không cần state nên component này không có hook nào, và bàn phím vẫn mở
 *  được submenu bằng Tab. */
export function PrimaryNav({ activeHref }: { activeHref: string }) {
  return (
    <nav aria-label="Primary">
      <ul className="flex items-center justify-center gap-1">
        {NAV_ITEMS.map((item) => {
          const children = 'children' in item ? item.children : undefined;
          const isActive = item.href === activeHref;

          return (
            <li key={item.label} className="group relative">
              <Link
                href={item.href}
                aria-current={isActive ? 'true' : undefined}
                className={cn(
                  'relative flex items-center gap-1.5 px-4 py-3.5 text-[11.5px] font-bold tracking-[0.13em] uppercase transition-colors',
                  // Gạch chân: đổi cả opacity chứ không chỉ scale-x. Chỉ scale-x-0
                  // vẫn để lại một chấm sub-pixel thấy rõ ở đầu chữ.
                  'after:bg-gold after:absolute after:inset-x-4 after:bottom-2.5 after:h-px after:origin-left after:transition-all after:duration-200',
                  isActive
                    ? 'text-gold after:scale-x-100 after:opacity-100'
                    : 'text-navy hover:text-gold after:scale-x-0 after:opacity-0 group-hover:after:scale-x-100 group-hover:after:opacity-100',
                )}
              >
                {item.label}
                {children ? <ChevronDownIcon className="h-3 w-3" /> : null}
              </Link>

              {children ? (
                <ul className="border-line shadow-lift invisible absolute top-full left-0 z-50 w-[190px] -translate-y-1 border bg-white py-1 opacity-0 transition-all duration-200 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                  {children.map((child) => (
                    <li key={child.label}>
                      <Link
                        href={child.href}
                        className="text-navy hover:bg-ivory hover:text-gold block px-4 py-2 text-[12.5px] transition-colors"
                      >
                        {child.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : null}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
