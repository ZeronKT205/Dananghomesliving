'use client';

import { Card } from '../_components/ui/card';

const mockUsers = [
  { id: 1, name: 'Admin', email: 'admin@da-nang-homes.com', role: 'Quản trị viên', status: 'active', avatar: 'AD' },
  { id: 2, name: 'Nguyễn Kinh Doanh', email: 'sales1@da-nang-homes.com', role: 'Nhân viên Kinh doanh', status: 'active', avatar: 'NK' },
  { id: 3, name: 'Trần Content', email: 'content@da-nang-homes.com', role: 'Biên tập viên', status: 'inactive', avatar: 'TC' },
];

export default function UsersPage() {
  const handleAction = () => {
    import('../_components/ui/toast').then(m => m.toast('Thao tác thành công!', 'success'));
  };

  return (
    <div className="p-8 max-w-[1400px] mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-navy leading-none mb-2 tracking-tight">Người Dùng</h1>
          <p className="text-[13px] text-muted">Quản lý tài khoản và phân quyền quản trị.</p>
        </div>
        <button onClick={handleAction} className="flex items-center gap-2 bg-[#C99224] hover:bg-[#b07f1d] text-white px-5 py-2.5 rounded shadow-sm text-[13px] font-bold uppercase tracking-wider transition-all active:scale-[0.98]">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
          Thêm Tài Khoản
        </button>
      </div>

      <Card className="border-line/60">
        <div className="p-4 border-b border-line flex flex-col sm:flex-row items-center justify-between gap-4 bg-gray-50/50">
          <div className="relative w-full sm:w-64">
            <input 
              type="text" 
              placeholder="Tìm kiếm người dùng..." 
              className="w-full pl-9 pr-4 py-2 border border-line rounded text-[13px] text-navy focus:outline-navy"
            />
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-line text-[11px] font-bold text-muted uppercase tracking-wider bg-gray-50/80">
                <th className="p-4 pl-6 font-bold w-12"><input type="checkbox" className="rounded border-line" /></th>
                <th className="p-4 font-bold">Người Dùng</th>
                <th className="p-4 font-bold">Email</th>
                <th className="p-4 font-bold">Vai Trò</th>
                <th className="p-4 font-bold">Trạng Thái</th>
                <th className="p-4 pr-6 font-bold text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {mockUsers.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="p-4 pl-6"><input type="checkbox" className="rounded border-line" /></td>
                  <td className="p-4 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-navy text-white flex items-center justify-center text-[12px] font-bold">
                      {item.avatar}
                    </div>
                    <div className="text-[14px] font-bold text-navy">{item.name}</div>
                  </td>
                  <td className="p-4 text-[13px] text-muted">{item.email}</td>
                  <td className="p-4 text-[13px] text-navy font-medium">{item.role}</td>
                  <td className="p-4">
                    {item.status === 'active' 
                      ? <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-green-100 text-green-800 border border-green-200">Hoạt động</span>
                      : <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-gray-100 text-gray-800 border border-gray-200">Bị khóa</span>
                    }
                  </td>
                  <td className="p-4 pr-6 text-right">
                    <button onClick={handleAction} className="p-1.5 text-muted hover:text-navy hover:bg-gray-100 rounded transition-all active:scale-[0.90] mr-1" title="Chỉnh sửa">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                    </button>
                    {item.id !== 1 && (
                      <button onClick={handleAction} className="p-1.5 text-muted hover:text-red-600 hover:bg-red-50 rounded transition-all active:scale-[0.90]" title="Xóa">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
