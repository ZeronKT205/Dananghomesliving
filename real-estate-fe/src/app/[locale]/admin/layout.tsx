import { ReactNode } from 'react';
import { AdminSidebar } from './_components/sidebar';
import { AdminHeader } from './_components/header';
import { ToastContainer } from './_components/ui/toast';

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#F9FAFB] font-sans antialiased text-ink">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <AdminHeader />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
      <ToastContainer />
    </div>
  );
}
