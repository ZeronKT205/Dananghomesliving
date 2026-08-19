'use client';

import { createContext, useContext, type ReactNode } from 'react';

import type { SiteSettings } from '@/lib/db/site-settings';

/**
 * Đưa cài đặt website xuống các Client Component.
 *
 * Header là Client Component (menu xổ, trạng thái cuộn) nên không tự đọc DB
 * được, mà pages lại render `<SiteHeader />` không truyền prop nào. Nhồi prop
 * xuyên qua từng trang thì phải sửa mọi trang và trang nào quên là header hiện
 * dữ liệu rỗng.
 *
 * Layout `[locale]` đọc một lần rồi bơm xuống đây; Server Component (footer)
 * vẫn gọi thẳng `getSiteSettings()` vì nó đã được `cache()` trong một request.
 */

const SiteSettingsContext = createContext<SiteSettings | null>(null);

export function SiteSettingsProvider({ value, children }: { value: SiteSettings; children: ReactNode }) {
  return <SiteSettingsContext.Provider value={value}>{children}</SiteSettingsContext.Provider>;
}

/**
 * Trả `null` khi dùng ngoài provider thay vì ném lỗi.
 *
 * Có chủ đích: header/footer còn được dùng trong vài nhánh chưa bọc provider
 * (trang lỗi chẳng hạn), và thiếu icon mạng xã hội thì chấp nhận được, còn làm
 * trắng cả trang thì không.
 */
export function useSiteSettings(): SiteSettings | null {
  return useContext(SiteSettingsContext);
}
