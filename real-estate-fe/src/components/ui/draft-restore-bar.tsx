'use client';

/**
 * Thanh mời khôi phục bản nháp chưa lưu.
 *
 * Hiện ngay đầu trang chứ KHÔNG phải hộp thoại tự bật: hộp thoại bắt trả lời
 * trước khi làm gì khác, mà biên tập cần nhìn nội dung hiện có rồi mới quyết
 * được có nên khôi phục hay không.
 *
 * Dùng chung cho trang soạn tin tức, trang bất động sản và trang cài đặt —
 * ba form dài nhất trong CMS, cùng một kiểu mất dữ liệu.
 */
export function DraftRestoreBar({
  savedAt,
  label = 'Tìm thấy bản nháp chưa lưu',
  onRestore,
  onDiscard,
}: {
  savedAt: Date;
  label?: string;
  onRestore: () => void;
  onDiscard: () => void;
}) {
  return (
    <div className="border-gold/60 bg-gold/10 flex flex-wrap items-center justify-between gap-3 rounded-md border px-4 py-3">
      <p className="text-navy text-[12.5px]">
        {label} lúc{' '}
        <strong>
          {savedAt.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}{' '}
          {savedAt.toLocaleDateString('vi-VN')}
        </strong>
        . Khôi phục lại nội dung đang soạn dở?
      </p>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onRestore}
          className="bg-navy hover:bg-gold h-8 cursor-pointer rounded px-3.5 text-[12px] font-bold text-white transition-colors"
        >
          Khôi phục
        </button>
        <button
          type="button"
          onClick={onDiscard}
          className="text-muted hover:text-navy cursor-pointer text-[12px] font-bold"
        >
          Bỏ nháp
        </button>
      </div>
    </div>
  );
}
