import { cn } from '@/lib/utils';

/* Biểu đồ vẽ tay bằng div và SVG — không kéo thêm thư viện chart nào.
   Với hai dạng đơn giản thế này thì một thư viện 40 KB là thừa. */

/** Cột: số yêu cầu tư vấn theo từng ngày. */
export function BarChart({
  data,
}: {
  data: readonly { label: string; date: string; count: number }[];
}) {
  const max = Math.max(1, ...data.map((d) => d.count));
  const ticks = [max, Math.round(max / 2), 0];

  return (
    <div className="relative pt-1 pl-7">
      <div className="absolute inset-x-0 top-1 bottom-8 left-7">
        {ticks.map((tick, index) => (
          <span
            key={`tick-${index}-${tick}`}
            className="border-line absolute inset-x-0 border-t border-dashed"
            style={{ bottom: `${(1 - index / (ticks.length - 1)) * 100}%` }}
          >
            <i className="text-muted absolute -top-2 -left-7 text-[10px] not-italic tabular-nums">
              {tick}
            </i>
          </span>
        ))}
      </div>

      <div className="relative flex h-[188px] items-end gap-1.5">
        {data.map((day, index) => {
          const isToday = index === data.length - 1;
          return (
            <div key={day.date} className="flex h-full flex-1 flex-col justify-end gap-2">
              <div className="flex h-full items-end pb-8">
                <div
                  className={cn(
                    'admin-bar-grow relative w-full rounded-t-[3px]',
                    isToday ? 'bg-gold' : 'bg-navy/25',
                  )}
                  style={{
                    height: `${Math.max((day.count / max) * 100, day.count > 0 ? 4 : 1)}%`,
                    animationDelay: `${index * 0.08}s`,
                  }}
                  title={`${day.count} yêu cầu ngày ${day.date}`}
                >
                  <span className="text-navy absolute inset-x-0 -top-5 text-center text-[10.5px] font-bold tabular-nums">
                    {day.count}
                  </span>
                </div>
              </div>
              <span className="text-muted absolute bottom-0 flex flex-col items-center gap-0.5 text-[10px]">
                <b className="text-navy font-bold">{day.label}</b>
                <i className="not-italic tabular-nums">{day.date}</i>
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const DONUT_COLORS = ['#c9922e', '#071d36', '#5b7c9d', '#a8b8c8', '#dfe5eb'];

/** Tròn: tỉ lệ lượt bấm xem chi tiết theo từng bất động sản.
 *  Vẽ bằng stroke-dasharray trên một circle — nhẹ hơn nhiều so với path cung. */
export function DonutChart({
  data,
  totalLabel,
}: {
  data: readonly { name: string; value: number }[];
  totalLabel: string;
}) {
  const total = data.reduce((sum, item) => sum + item.value, 0) || 1;
  const radius = 54;
  const circumference = 2 * Math.PI * radius;

  let offset = 0;
  const segments = data.map((item, index) => {
    const fraction = item.value / total;
    const segment = {
      ...item,
      color: DONUT_COLORS[index % DONUT_COLORS.length] as string,
      percent: Math.round(fraction * 100),
      dash: fraction * circumference,
      offset,
    };
    offset += fraction * circumference;
    return segment;
  });

  return (
    <div className="flex flex-wrap items-center justify-center gap-6">
      <div className="relative shrink-0">
        <svg width="150" height="150" viewBox="0 0 150 150" role="img" aria-label={totalLabel}>
          <g transform="rotate(-90 75 75)">
            {/* `index` dùng cho độ trễ hiệu ứng bên dưới — thiếu nó là lỗi biên dịch. */}
            {segments.map((segment, index) => (
              <circle
                key={segment.name}
                cx="75"
                cy="75"
                r={radius}
                fill="none"
                stroke={segment.color}
                strokeWidth="20"
                strokeDasharray={`${segment.dash} ${circumference - segment.dash}`}
                strokeDashoffset={-segment.offset}
                style={{
                  animation: `adminBarGrow 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards`,
                  animationDelay: `${index * 0.12}s`,
                  opacity: 0,
                }}
              />
            ))}
          </g>
        </svg>
        <div className="pointer-events-none absolute inset-0 grid place-content-center text-center">
          <span className="text-navy text-[22px] leading-none font-extrabold tabular-nums">
            {total.toLocaleString('vi-VN')}
          </span>
          <span className="text-muted mt-1 text-[10px]">lượt xem</span>
        </div>
      </div>

      <ul className="flex min-w-[170px] flex-1 flex-col gap-2">
        {segments.map((segment) => (
          <li key={segment.name} className="flex items-center gap-2.5 text-[12px] min-w-0">
            <span
              aria-hidden
              className="h-2.5 w-2.5 shrink-0 rounded-sm"
              style={{ background: segment.color }}
            />
            <span className="text-navy min-w-0 flex-1 truncate font-medium" title={segment.name}>{segment.name}</span>
            <span className="text-muted shrink-0 tabular-nums">{segment.percent}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
