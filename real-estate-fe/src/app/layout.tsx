import type { ReactNode } from 'react';
import './globals.css';

// Root layout BẮT BUỘC phải tồn tại. Thiếu nó, Next tự chèn DefaultLayout
// (next/dist/client/components/builtin/layout.js) render <html><body> trần —
// và vì React 19 coi <html>/<body> là singleton, chính thẻ của DefaultLayout
// mới là thẻ được hydrate, khiến `suppressHydrationWarning` đặt ở các layout
// con bị bỏ qua hoàn toàn.
//
// Layout này chỉ pass-through: <html>/<body> thật do [locale]/layout.tsx và
// admin/layout.tsx render, vì chúng cần `lang` và font riêng theo từng nhánh.
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
