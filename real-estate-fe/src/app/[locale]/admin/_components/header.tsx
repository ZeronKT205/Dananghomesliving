import Link from 'next/link';

export function AdminHeader() {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-line flex items-center justify-between px-8 h-[76px]">
      <div className="flex items-center">
        {/* Breadcrumb */}
        <nav className="flex text-[13px] text-muted font-medium" aria-label="Breadcrumb">
          <Link href="/admin/properties" className="hover:text-navy transition-colors">Bất động sản</Link>
          <span className="mx-2 text-line">/</span>
          <Link href="/admin/properties" className="hover:text-navy transition-colors">Tất cả</Link>
          <span className="mx-2 text-line">/</span>
          <span className="text-navy">Biệt thự Ocean Estate</span>
        </nav>
      </div>
      
      <div className="flex items-center gap-6">
        <div className="relative">
          <svg className="w-4 h-4 text-muted absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input 
            type="text" 
            placeholder="Tìm kiếm..." 
            className="pl-9 pr-4 py-2 border border-line rounded-md text-[13px] w-64 focus:outline-navy focus:border-navy"
          />
        </div>
        
        <div className="w-px h-6 bg-line"></div>
        
        <button type="button" aria-label="Notifications" className="p-2 text-muted hover:text-navy hover:bg-gray-50 rounded-full transition-all active:scale-[0.95] relative">
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        </button>
        
        <div className="flex items-center gap-3">
          <button className="w-8 h-8 rounded-full bg-navy text-white flex items-center justify-center text-[12px] font-bold transition-transform active:scale-[0.95] ring-2 ring-transparent hover:ring-gray-200">
            AD
          </button>
        </div>
      </div>
    </header>
  );
}
