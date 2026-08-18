'use client';

/**
 * Select lọc — phải là Client Component vì có `onChange`.
 * `ui.tsx` là Server Component (các trang admin import nó ở tầng server), nên
 * không gắn được event handler ở đó; tách riêng rồi re-export.
 *
 * `options` nhận cả chuỗi lẫn cặp {value,label}: giá trị gửi lên server là slug
 * còn chữ hiển thị là tiếng Việt có dấu.
 */
export function FilterSelect({
  label,
  options,
  name,
  defaultValue,
  submitOnChange = true,
}: {
  label: string;
  options: readonly (string | { value: string; label: string })[];
  name?: string;
  defaultValue?: string;
  submitOnChange?: boolean;
}) {
  const normalized = options.map((o) => (typeof o === 'string' ? { value: o, label: o } : o));

  return (
    <select
      aria-label={label}
      name={name}
      defaultValue={defaultValue ?? normalized[0]?.value}
      // Không có nút "Lọc" riêng — đổi lựa chọn là áp dụng ngay, đỡ một cú bấm.
      onChange={submitOnChange ? (e) => e.currentTarget.form?.requestSubmit() : undefined}
      className="admin-input-glow border-line text-navy focus-visible:outline-gold focus-visible:border-gold h-9 cursor-pointer rounded-md border bg-white px-3 text-[12.5px] font-medium focus-visible:outline-2 transition-all duration-200"
    >
      {normalized.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
