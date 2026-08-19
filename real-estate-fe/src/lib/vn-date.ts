/**
 * Ngày theo giờ Việt Nam.
 *
 * Sinh ra vì một lỗi thật: biểu đồ 7 ngày ở trang tổng quan gom nhóm trong
 * Mongo theo `Asia/Ho_Chi_Minh` nhưng dựng khoá ngày ở phía Node bằng
 * `toISOString()` — tức theo UTC. Hai lịch khác nhau nên khoá không bao giờ
 * khớp: đã đo được ngày có 2 yêu cầu mà cột vẫn bằng 0, và dải ngày thiếu hẳn
 * hôm nay.
 *
 * Việt Nam không có giờ mùa hè nên lệch luôn cố định +07:00 — cộng trừ ngày
 * bằng mili-giây là an toàn, không cần thư viện timezone.
 */

export const VN_TIMEZONE = 'Asia/Ho_Chi_Minh';
export const VN_OFFSET = '+07:00';

const DAY_MS = 24 * 60 * 60 * 1000;

// 'en-CA' cho ra đúng dạng YYYY-MM-DD, khớp với `$dateToString` của Mongo.
const KEY_FORMAT = new Intl.DateTimeFormat('en-CA', {
  timeZone: VN_TIMEZONE,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});

/** `2026-08-18` — ngày của thời điểm này theo giờ Việt Nam. */
export function vnDateKey(at: Date): string {
  return KEY_FORMAT.format(at);
}

/** Thời điểm 00:00 giờ Việt Nam của ngày chứa `at`. */
export function vnStartOfDay(at: Date): Date {
  return new Date(`${vnDateKey(at)}T00:00:00${VN_OFFSET}`);
}

/**
 * Dải `days` ngày gần nhất tính theo giờ Việt Nam, ngày cuối là ngày chứa `at`.
 *
 * Trả về cả `since` để truy vấn và danh sách khoá để ghép kết quả — hai thứ
 * này PHẢI sinh ra từ cùng một chỗ, tách ra là lại lệch như lần trước.
 */
export function vnDayRange(days: number, at: Date = new Date()): { since: Date; keys: string[] } {
  const end = vnStartOfDay(at);
  const since = new Date(end.getTime() - (days - 1) * DAY_MS);

  const keys: string[] = [];
  for (let i = 0; i < days; i++) {
    keys.push(vnDateKey(new Date(since.getTime() + i * DAY_MS)));
  }

  return { since, keys };
}
