import 'server-only';

import bcrypt from 'bcryptjs';

/**
 * Băm mật khẩu. CHỈ chạy được ở Node runtime (route handler / server action),
 * không dùng trong middleware — bcrypt tốn CPU và Edge có giới hạn thời gian.
 *
 * cost 12: ~250ms trên phần cứng thường. Đủ chậm để brute-force offline không
 * kinh tế, đủ nhanh để đăng nhập không thấy lag.
 */
const COST = 12;

export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, COST);
}

export async function verifyPassword(plain: string, hash: string): Promise<boolean> {
  try {
    return await bcrypt.compare(plain, hash);
  } catch {
    return false;
  }
}

/**
 * So sánh giả khi không tìm thấy user.
 *
 * Không có bước này thì thời gian phản hồi của "email không tồn tại" (nhanh)
 * khác hẳn "email đúng, mật khẩu sai" (chậm vì phải bcrypt), và kẻ tấn công
 * dò được email nào có thật chỉ bằng cách đo thời gian.
 */
/** Hash THẬT (cost 12) của một chuỗi vô nghĩa. Phải là hash hợp lệ: hash bịa
 *  sẽ được bcrypt loại sớm và thời gian lại lệch, đúng thứ ta đang muốn tránh. */
const DUMMY_HASH = '$2b$12$loUyO.KyOOvZ.sTzupHVIui582YW755CAxYd2ErVyKfB4PpkxMXYK';

export async function fakeVerifyDelay(): Promise<void> {
  await bcrypt.compare('dummy-password-for-timing', DUMMY_HASH).catch(() => false);
}
