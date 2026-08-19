'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';

import { ChevronDownIcon } from '@/components/ui/icons';
import { NAV_ITEMS } from '@/config/constants';
import { cn } from '@/lib/utils';

/** Hàng tab dưới của header.
 *  Menu xổ xuống chạy bằng `group-hover` + `group-focus-within` thuần CSS —
 *  không cần state nên component này không có hook nào, và bàn phím vẫn mở
 *  được submenu bằng Tab. */
export function PrimaryNav({ activeHref }: { activeHref: string }) {
  // Nhãn menu lấy từ file dịch; `NAV_ITEMS` chỉ giữ khoá và đường dẫn.
  const t = useTranslations('Nav');

  return (
    <nav aria-label={t('primaryNav')}>
      <ul className="flex items-center justify-center gap-1">
        {NAV_ITEMS.map((item) => {
          const children = 'children' in item ? item.children : undefined;
          const locations = 'locations' in item ? item.locations : undefined;
          const isActive = item.href === activeHref;

          return (
            <li key={item.labelKey} className="group relative">
              <Link
                href={item.href}
                aria-current={isActive ? 'true' : undefined}
                className={cn(
                  'relative flex items-center gap-1.5 px-5 py-3.5 text-[11.5px] font-bold tracking-[0.13em] uppercase transition-colors',
                  'after:bg-gold after:absolute after:inset-x-5 after:bottom-2.5 after:h-px after:origin-left after:transition-all after:duration-200',
                  isActive
                    ? 'text-gold after:scale-x-100 after:opacity-100'
                    : 'text-navy hover:text-gold after:scale-x-0 after:opacity-0 group-hover:after:scale-x-100 group-hover:after:opacity-100',
                )}
              >
                {t(item.labelKey)}
                {children || locations ? <ChevronDownIcon className="h-3 w-3" /> : null}
              </Link>

              {children || locations ? (
                <ul className="border-line shadow-lift invisible absolute top-full left-0 z-50 w-[220px] -translate-y-1 border bg-white py-1 opacity-0 transition-all duration-200 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                  {children?.map((child) => (
                    <li key={child.labelKey}>
                      <Link
                        href={child.href}
                        className="text-navy hover:bg-ivory hover:text-gold block px-4 py-2 text-[12.5px] transition-colors"
                      >
                        {t(child.labelKey)}
                      </Link>
                    </li>
                  ))}

                  {locations ? (
                    <>
                      <li className="my-1 border-t border-line/60" />
                      <li className="group/sub relative">
                        <div className="text-navy hover:bg-ivory hover:text-gold flex items-center justify-between px-4 py-2 text-[12.5px] font-semibold transition-colors cursor-pointer">
                          <span>{t('locations')}</span>
                          <span className="text-[9px] text-muted group-hover/sub:text-gold">▶</span>
                        </div>

                        {/* Nested Submenu for Locations */}
                        <ul className="border-line shadow-lift invisible absolute top-0 left-full z-50 w-[230px] -translate-x-1 border bg-white py-1 opacity-0 transition-all duration-200 group-hover/sub:visible group-hover/sub:translate-x-0 group-hover/sub:opacity-100 group-focus-within/sub:visible group-focus-within/sub:translate-x-0 group-focus-within/sub:opacity-100">
                          {locations.map((loc) => (
                            <li key={loc.label}>
                              <Link
                                href={loc.href}
                                className="text-navy hover:bg-ivory hover:text-gold block px-4 py-2 text-[12px] transition-colors"
                              >
                                {loc.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </li>
                    </>
                  ) : null}
                </ul>
              ) : null}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
