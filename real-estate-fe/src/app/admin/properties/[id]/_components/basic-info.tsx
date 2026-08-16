import { Card, CardHeader, CardTitle, CardContent } from '../../../_components/ui/card';

export function BasicInfo({ isNew }: { isNew?: boolean }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Thông tin cơ bản</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-6">
        
        <div className="col-span-2">
          <label className="block text-[12px] font-bold text-navy uppercase tracking-wider mb-2">Tên bất động sản</label>
          <input 
            type="text" 
            defaultValue={isNew ? '' : 'Biệt thự Ocean Estate'}
            className="w-full px-4 py-2.5 border border-line rounded-md text-[14px] text-navy focus:outline-navy focus:border-navy"
          />
        </div>

        <div>
          <label className="block text-[12px] font-bold text-navy uppercase tracking-wider mb-2">Hình thức</label>
          <div className="relative">
            <select className="w-full appearance-none px-4 py-2.5 border border-line rounded-md text-[14px] text-navy focus:outline-navy focus:border-navy bg-white">
              <option value="sale">Bán</option>
              <option value="rent">Cho thuê</option>
            </select>
            <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
              <svg className="w-4 h-4 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-[12px] font-bold text-navy uppercase tracking-wider mb-2">Loại hình</label>
          <div className="relative">
            <select className="w-full appearance-none px-4 py-2.5 border border-line rounded-md text-[14px] text-navy focus:outline-navy focus:border-navy bg-white" defaultValue={isNew ? 'apartment' : 'villa'}>
              <option value="apartment">Căn hộ</option>
              <option value="villa">Biệt thự</option>
              <option value="penthouse">Penthouse</option>
            </select>
            <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
              <svg className="w-4 h-4 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-[12px] font-bold text-navy uppercase tracking-wider mb-2">Giá (USD)</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted">$</span>
            <input 
              type="text" 
              defaultValue={isNew ? '' : '3,596,000'}
              className="w-full pl-8 pr-4 py-2.5 border border-line rounded-md text-[14px] text-navy focus:outline-navy focus:border-navy"
            />
          </div>
        </div>

        <div>
          <label className="block text-[12px] font-bold text-navy uppercase tracking-wider mb-2">Giá (VND)</label>
          <div className="relative">
            <input 
              type="text" 
              defaultValue={isNew ? '' : '90,000,000,000'}
              className="w-full pr-12 pl-4 py-2.5 border border-line rounded-md text-[14px] text-navy focus:outline-navy focus:border-navy"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted text-[13px]">VND</span>
          </div>
        </div>

        <div className="col-span-2 pt-2 flex gap-8">
          <label className="flex items-center gap-3 cursor-pointer group">
            <div className="relative flex items-center justify-center">
              <input 
                type="checkbox" 
                defaultChecked={!isNew} 
                className="w-4 h-4 border border-line bg-white rounded focus:ring-gold appearance-none checked:bg-gold checked:border-gold transition-colors cursor-pointer" 
              />
              <svg className="absolute w-3 h-3 text-white pointer-events-none opacity-0 peer-checked:opacity-100" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
            </div>
            <span className="text-[14px] text-navy group-hover:text-gold transition-colors">BĐS Nổi bật</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer group">
            <div className="relative flex items-center justify-center">
              <input 
                type="checkbox" 
                defaultChecked={!isNew} 
                className="w-4 h-4 border border-line bg-white rounded focus:ring-gold appearance-none checked:bg-gold checked:border-gold transition-colors cursor-pointer" 
              />
              <svg className="absolute w-3 h-3 text-white pointer-events-none opacity-0 peer-checked:opacity-100" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
            </div>
            <span className="text-[14px] text-navy group-hover:text-gold transition-colors">Đã xác thực</span>
          </label>
        </div>

      </CardContent>
    </Card>
  );
}
