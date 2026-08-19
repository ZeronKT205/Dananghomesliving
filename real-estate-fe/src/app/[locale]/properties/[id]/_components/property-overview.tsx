interface PropertyOverviewProps {
  description: string[];
  /**
   * Tên tiện ích, lấy từ bảng `amenities` trong CMS.
   *
   * Trước đây nhận `{ icon, label }` với `icon` là chuỗi path SVG lưu kèm dữ
   * liệu. Bỏ đi: path SVG là tài sản giao diện, để nó trong DB nghĩa là đổi bộ
   * icon phải chạy migrate dữ liệu. Giờ dùng chung một dấu tích.
   */
  features: string[];
}

export function PropertyOverview({ description, features }: PropertyOverviewProps) {
  return (
    <div className="space-y-10 pb-10 border-b border-line">
      {/* Overview Description */}
      <div id="overview" className="space-y-4 text-[15px] text-ink leading-relaxed">
        <h2 className="text-[22px] font-display font-normal text-navy tracking-tight mb-4">
          Tổng quan dự án
        </h2>
        {description.map((paragraph, i) => (
          <p key={i} className="text-muted leading-relaxed">
            {paragraph}
          </p>
        ))}
      </div>

      {/* Features & Amenities Grid */}
      {features && features.length > 0 && (
        <div id="features" className="space-y-4 pt-4">
          <h2 className="text-[22px] font-display font-normal text-navy tracking-tight mb-4">
            Đặc điểm &amp; Tiện ích nổi bật
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {features.map((label) => (
              <div key={label} className="flex items-center gap-3 p-4 bg-paper border border-line rounded-none">
                <div className="h-8 w-8 rounded-none bg-gold/15 text-gold border border-gold/30 flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-[13px] font-semibold text-navy">{label}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
