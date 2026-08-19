import 'server-only';

import nodemailer, { type Transporter } from 'nodemailer';

/**
 * Gửi email qua SMTP.
 *
 * Transporter giữ trên `globalThis`: mỗi `createTransport` là một pool kết nối
 * mới, mà trên serverless module bị nạp lại rất thường xuyên.
 *
 * KHÔNG cấu hình SMTP thì mọi hàm ở đây im lặng bỏ qua. Có chủ đích: thiếu
 * email không được phép làm hỏng việc nhận yêu cầu tư vấn — khách đã gửi form
 * thì yêu cầu phải vào CMS, còn thông báo chỉ là tiện ích thêm.
 */

const KEY = Symbol.for('dhl.mailer');
type GlobalWithMailer = typeof globalThis & { [KEY]?: Transporter };

export function isMailConfigured(): boolean {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASSWORD);
}

function transporter(): Transporter {
  const g = globalThis as GlobalWithMailer;

  const port = Number(process.env.SMTP_PORT) || 587;

  g[KEY] ??= nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    /*
     * Dùng cổng 587 + STARTTLS, KHÔNG dùng 465.
     *
     * Đã đo trên chính máy này: cổng 465 luôn hỏng với
     * `ECONNREFUSED 2404:6800:...::6c:465` — nodemailer phân giải
     * smtp.gmail.com ra IPv6 trong khi mạng không có đường IPv6 ra ngoài, và
     * `family: 4` không sửa được vì nó có bộ phân giải riêng. Cổng 587 kết nối
     * bình thường. 587 cũng là cổng gửi thư Google khuyến nghị.
     *
     * `secure` chỉ bật ở 465 (TLS ngay từ đầu); 587 bắt tay rồi mới nâng cấp
     * TLS qua STARTTLS, nên `requireTLS` để chắc chắn không gửi thư trần.
     */
    secure: port === 465,
    requireTLS: port !== 465,
    connectionTimeout: 15_000,
    greetingTimeout: 15_000,
    auth: {
      user: process.env.SMTP_USER,
      // Gmail đòi "App password" 16 ký tự, thường được chép kèm dấu cách.
      // Nodemailer không tự bỏ nên phải lược ở đây, nếu không luôn báo sai mật khẩu.
      pass: (process.env.SMTP_PASSWORD ?? '').replace(/\s+/g, ''),
    },
  });

  return g[KEY];
}

export interface MailInput {
  to?: string;
  subject: string;
  html: string;
  /** Bản chữ thuần cho trình đọc không hiển thị HTML, và để lọc spam bớt nghi ngờ. */
  text: string;
  replyTo?: string;
}

/**
 * Gửi một email. Trả về `false` khi chưa cấu hình hoặc gửi lỗi — KHÔNG ném.
 *
 * Nơi gọi là luồng khách gửi form; ném lỗi ở đây sẽ biến "gửi email hỏng"
 * thành "khách không gửi được yêu cầu".
 */
export async function sendMail({ to, subject, html, text, replyTo }: MailInput): Promise<boolean> {
  if (!isMailConfigured()) return false;

  const recipient = to || process.env.INQUIRY_NOTIFY_TO || process.env.SMTP_USER;
  if (!recipient) return false;

  try {
    await transporter().sendMail({
      // Tên hiển thị để hộp thư nhận ra ngay, địa chỉ vẫn phải là tài khoản
      // SMTP — Gmail từ chối gửi hộ địa chỉ khác.
      from: `"Da Nang Homes & Living" <${process.env.SMTP_USER}>`,
      to: recipient,
      subject,
      text,
      html,
      // Bấm "Trả lời" là soạn thẳng cho khách, không phải cho chính hộp thư mình.
      ...(replyTo ? { replyTo } : {}),
    });
    return true;
  } catch (err) {
    console.error('[mailer] gui that bai:', err);
    return false;
  }
}
