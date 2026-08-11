import { Card, CardHeader, CardTitle, CardContent } from '../../../_components/ui/card';

const activities = [
  { id: 1, action: 'Đã chỉnh sửa mô tả', admin: 'Jane Doe', date: '28/05/2024', time: '14:32' },
  { id: 2, action: 'Cập nhật thư viện ảnh', admin: 'Jane Doe', date: '27/05/2024', time: '09:15' },
  { id: 3, action: 'Cập nhật giá bán', admin: 'John Smith', date: '24/05/2024', time: '16:45' },
  { id: 4, action: 'Tạo mới bất động sản', admin: 'John Smith', date: '20/05/2024', time: '10:00' },
];

export function ActivityLog() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between w-full">
          <CardTitle>Lịch sử hoạt động</CardTitle>
          <button className="text-[12px] font-bold text-navy hover:text-gold transition-colors">
            Xem tất cả
          </button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative border-l border-line ml-3 space-y-6">
          {activities.map((act, i) => (
            <div key={act.id} className="relative pl-6">
              <div className="absolute -left-[5px] top-1 w-[9px] h-[9px] rounded-full bg-white border-[2px] border-gold"></div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <div>
                  <p className="text-[13px] text-navy font-medium">{act.action}</p>
                  <p className="text-[11px] text-muted">bởi <span className="font-medium text-navy">{act.admin}</span></p>
                </div>
                <div className="text-[11px] text-muted sm:text-right">
                  <p>{act.date}</p>
                  <p>{act.time}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
