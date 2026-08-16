import { Card, CardHeader, CardTitle, CardContent } from '../../../_components/ui/card';

const specFields = [
  { label: 'Phòng ngủ', defaultValue: '3' },
  { label: 'Phòng tắm', defaultValue: '3' },
  { label: 'Diện tích trong nhà (m²)', defaultValue: '917' },
  { label: 'Diện tích đất (m²)', defaultValue: '450' },
  { label: 'Diện tích xây dựng (m²)', defaultValue: '450' },
  { label: 'Số tầng', defaultValue: '2' },
  { label: 'Năm xây dựng', defaultValue: '2022' },
  { label: 'Chỗ đỗ xe', defaultValue: '2' },
];

export function Specifications({ isNew }: { isNew?: boolean }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Thông số kỹ thuật</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-5">
          {specFields.map((field) => (
            <div key={field.label}>
              <label className="block text-[11px] font-bold text-muted uppercase tracking-wider mb-2">{field.label}</label>
              <input 
                type="text" 
                defaultValue={isNew ? '' : field.defaultValue}
                className="w-full px-3 py-2 border border-line rounded-md text-[13px] text-navy focus:outline-navy focus:border-navy"
              />
            </div>
          ))}
          
          <div>
            <label className="block text-[11px] font-bold text-muted uppercase tracking-wider mb-2">Nội thất</label>
            <div className="relative">
              <select className="w-full appearance-none px-3 py-2 border border-line rounded-md text-[13px] text-navy focus:outline-navy focus:border-navy bg-white">
                <option>Đầy đủ nội thất</option>
                <option>Nội thất cơ bản</option>
                <option>Nhà trống</option>
              </select>
              <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                <svg className="w-3 h-3 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </div>
            </div>
          </div>
          
          <div>
            <label className="block text-[11px] font-bold text-muted uppercase tracking-wider mb-2">Sở hữu</label>
            <div className="relative">
              <select className="w-full appearance-none px-3 py-2 border border-line rounded-md text-[13px] text-navy focus:outline-navy focus:border-navy bg-white" defaultValue={isNew ? 'freehold' : 'freehold'}>
                <option value="freehold">Lâu dài</option>
                <option value="leasehold">Có thời hạn (50 năm)</option>
              </select>
              <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                <svg className="w-3 h-3 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-muted uppercase tracking-wider mb-2">Tình trạng</label>
            <div className="relative">
              <select className="w-full appearance-none px-3 py-2 border border-line rounded-md text-[13px] text-navy focus:outline-navy focus:border-navy bg-white">
                <option>Đang trống</option>
                <option>Sắp trống</option>
                <option>Đã bán</option>
                <option>Đã cho thuê</option>
              </select>
              <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                <svg className="w-3 h-3 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </div>
            </div>
          </div>

        </div>
        
        <div className="mt-6 pt-6 border-t border-line">
          <button className="text-[13px] font-medium text-gold hover:text-navy transition-colors flex items-center gap-1.5">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            Thêm thông số khác
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
