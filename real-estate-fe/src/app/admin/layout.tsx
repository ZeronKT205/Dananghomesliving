import '../globals.css';

import { ToastProvider } from '@/components/ui/toast-provider';
import { getCurrentUser } from '@/lib/auth/session';
import { countPendingInquiries } from '@/server/services/inquiry-service';

import { AdminShell } from './_components/admin-shell';

import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Quản trị',
  // Trang quản trị không được lọt vào kết quả tìm kiếm.
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: ReactNode }) {
  // Middleware đã chặn người chưa đăng nhập, nhưng layout vẫn đọc lại để lấy
  // tên hiển thị. Không chạm DB — chỉ giải mã chữ ký cookie.
  const user = await getCurrentUser();

  // Badge số yêu cầu chưa xử lý. Bọc try/catch vì layout render ở MỌI trang
  // admin: DB trục trặc thì hiện badge 0 chứ không được làm sập cả CMS.
  let pendingInquiries = 0;
  if (user) {
    try {
      pendingInquiries = await countPendingInquiries();
    } catch {
      pendingInquiries = 0;
    }
  }

  return (
    <html lang="vi" suppressHydrationWarning>
      <body className="bg-paper text-ink min-h-screen overflow-x-hidden antialiased">
        <ToastProvider>
          <AdminShell
            pendingInquiries={pendingInquiries}
            currentUser={user ? { name: user.name, email: user.email, role: user.role } : null}
          >
            {children}
          </AdminShell>
        </ToastProvider>
      </body>
    </html>
  );
}
