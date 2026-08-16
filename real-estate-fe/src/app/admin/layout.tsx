import '../globals.css';
import { AdminShell } from './_components/admin-shell';

import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Quản trị',
  // Trang quản trị không được lọt vào kết quả tìm kiếm.
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="vi">
      <body className="bg-paper text-ink min-h-screen overflow-x-hidden antialiased">
        <AdminShell>{children}</AdminShell>
      </body>
    </html>
  );
}
