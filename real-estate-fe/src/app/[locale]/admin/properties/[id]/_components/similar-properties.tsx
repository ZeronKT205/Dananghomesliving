import Image from 'next/image';
import { Card, CardHeader, CardTitle, CardContent } from '../../../_components/ui/card';

const similarProps = [
  { id: 1, name: 'Biệt thự Mặt biển', location: 'Hòa Hải, Ngũ Hành Sơn', price: '75.000.000.000', type: 'Biệt thự', beds: 3, area: '620 m²', img: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=300&q=80' },
  { id: 2, name: 'Biệt thự Trên không Sơn Trà', location: 'Sơn Trà', price: '85.500.000.000', type: 'Biệt thự', beds: 4, area: '780 m²', img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=300&q=80' },
  { id: 3, name: 'Tổ ấm Ven biển', location: 'Mỹ An, Ngũ Hành Sơn', price: '80.000.000.000', type: 'Biệt thự', beds: 3, area: '850 m²', img: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=300&q=80' },
  { id: 4, name: 'Biệt thự Chân trời Xanh', location: 'An Thượng, Ngũ Hành Sơn', price: '95.000.000.000', type: 'Biệt thự', beds: 4, area: '1.000 m²', img: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=300&q=80' },
];

export function SimilarProperties() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between w-full">
          <CardTitle>Bất động sản tương tự</CardTitle>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <span className="text-[12px] font-bold text-navy uppercase tracking-wider">Tự động đề xuất</span>
              <div className="relative inline-block w-8 h-4 bg-[#C99224] rounded-full transition-colors">
                <span className="absolute left-[18px] top-0.5 w-3 h-3 bg-white rounded-full transition-all"></span>
              </div>
            </label>
            <button className="text-[12px] font-medium text-white bg-navy hover:bg-[#041124] px-4 py-1.5 rounded transition-colors shadow-sm flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
              Thêm BĐS
            </button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          
          {similarProps.map((prop) => (
            <div key={prop.id} className="border border-line rounded-lg overflow-hidden group">
              <div className="relative aspect-[4/3] w-full">
                <Image src={prop.img} alt={prop.name} fill className="object-cover" />
                <button className="absolute top-2 right-2 w-6 h-6 bg-white/90 text-red-500 rounded flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white hover:text-red-600 shadow-sm">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
              <div className="p-3">
                <h4 className="font-bold text-[13px] text-navy mb-1 truncate">{prop.name}</h4>
                <p className="text-[11px] text-muted truncate mb-2">{prop.location}</p>
                <p className="text-[14px] text-[#C99224] font-bold mb-3">{prop.price} đ</p>
                
                <div className="flex items-center gap-3 border-t border-line pt-2 text-[11px] text-muted">
                  <span className="flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                    {prop.type}
                  </span>
                  <span className="flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
                    {prop.beds}
                  </span>
                  <span className="flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" /></svg>
                    {prop.area}
                  </span>
                </div>
              </div>
            </div>
          ))}

        </div>
      </CardContent>
    </Card>
  );
}
