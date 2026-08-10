import { AdminShell } from './_components/admin-shell';

import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Quản trị',
  // Trang quản trị không được lọt vào kết quả tìm kiếm.
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <AdminShell>{children}</AdminShell>;
}
