import Link from 'next/link';

export function AdminSidebar() {
  return (
    <aside className="w-64 bg-navy text-white flex-shrink-0 flex flex-col hidden md:flex">
      <div className="h-[76px] flex items-center px-6 border-b border-white/10">
        <Link href="/admin" className="text-lg font-bold tracking-wider">
          ĐN<span className="text-gold">HOMES</span> CMS
        </Link>
      </div>
      
      <div className="flex-1 py-6 px-4 overflow-y-auto">
        <nav className="space-y-1">
          <Link href="/admin/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-md text-white/70 hover:text-white hover:bg-white/5 transition-colors">
            <span className="text-sm font-semibold">Dashboard</span>
          </Link>
          <Link href="/admin/properties" className="flex items-center gap-3 px-4 py-3 rounded-md bg-gold/10 text-gold font-bold">
            <span className="text-sm">Bất động sản</span>
          </Link>
          <Link href="/admin/users" className="flex items-center gap-3 px-4 py-3 rounded-md text-white/70 hover:text-white hover:bg-white/5 transition-colors">
            <span className="text-sm font-semibold">Người dùng</span>
          </Link>
          <Link href="/admin/settings" className="flex items-center gap-3 px-4 py-3 rounded-md text-white/70 hover:text-white hover:bg-white/5 transition-colors">
            <span className="text-sm font-semibold">Cài đặt</span>
          </Link>
        </nav>
      </div>
      
      <div className="p-4 border-t border-white/10">
        <div className="flex items-center gap-3 px-4 py-3 rounded-md text-white/70 hover:text-white hover:bg-white/5 cursor-pointer transition-colors">
          <span className="text-sm font-semibold">Đăng xuất</span>
        </div>
      </div>
    </aside>
  );
}
