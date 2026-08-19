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

export function isMailConfigured(): boolean {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASSWORD);
}

function transporter(): Transporter {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = (process.env.SMTP_PASSWORD ?? '').replace(/\s+/g, '');
  const port = Number(process.env.SMTP_PORT) || 587;

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    requireTLS: port !== 465,
    connectionTimeout: 15_000,
    greetingTimeout: 15_000,
    family: 4,
    tls: {
      rejectUnauthorized: false,
    },
    auth: {
      user,
      pass,
    },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any);
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
  if (!isMailConfigured()) {
    console.warn('[mailer] Chưa cấu hình SMTP (thiếu SMTP_HOST, SMTP_USER hoặc SMTP_PASSWORD trong .env.local)');
    return false;
  }

  const recipient = to || process.env.INQUIRY_NOTIFY_TO || process.env.SMTP_USER;
  if (!recipient) {
    console.warn('[mailer] Không có địa chỉ nhận email');
    return false;
  }

  try {
    const info = await transporter().sendMail({
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
    console.log(`[mailer] ✓ Đã gửi email thành công tới [${recipient}]: "${subject}" (MessageID: ${info.messageId})`);
    return true;
  } catch (err) {
    console.error(`[mailer] ✗ Lỗi gửi email tới [${recipient}]:`, err);
    return false;
  }
}
