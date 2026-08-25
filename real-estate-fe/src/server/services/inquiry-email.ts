import 'server-only';

import type { InquiryDoc } from '@/lib/db/collections';
import { VN_TIMEZONE } from '@/lib/vn-date';

import { sendMail } from './mailer';


/**
 * Email báo có yêu cầu tư vấn mới.
 *
 * Viết HTML bằng tay thay vì dùng thư viện template: email client là môi
 * trường render tệ nhất còn tồn tại — Outlook không hiểu flexbox, Gmail cắt
 * `<style>` trong `<head>`. Bảng lồng nhau và style nội tuyến là thứ duy nhất
 * chạy được ở mọi nơi, và thêm một dependency cũng không thay đổi điều đó.
 */

const BRAND = '#0b2545';
const GOLD = '#c9922e';
const LINE = '#e5e1d8';
const MUTED = '#6b7280';

const SOURCE_LABEL: Record<string, string> = {
  quote_form: 'Form tư vấn chung',
  property_form: 'Form đặt lịch xem nhà',
};

const SERVICE_LABEL: Record<string, string> = {
  buy: 'Mua bất động sản',
  rent: 'Thuê dài hạn',
  invest: 'Tư vấn đầu tư',
  valuation: 'Định giá tài sản',
  other: 'Nhu cầu khác',
};

/** Escape trước khi ghép vào HTML — mọi trường dưới đây đều do khách nhập. */
function esc(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function formatTime(d: Date): string {
  return new Intl.DateTimeFormat('vi-VN', {
    timeZone: VN_TIMEZONE,
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d);
}

/** Một dòng trong bảng thông tin. `href` biến giá trị thành link bấm được. */
function row(label: string, value: string, href?: string): string {
  const inner = href
    ? `<a href="${esc(href)}" style="color:${BRAND};text-decoration:none;font-weight:600">${esc(value)}</a>`
    : `<span style="color:${BRAND};font-weight:600">${esc(value)}</span>`;

  return `
    <tr>
      <td style="padding:10px 0;border-bottom:1px solid ${LINE};width:150px;color:${MUTED};font-size:13px;vertical-align:top">${esc(label)}</td>
      <td style="padding:10px 0;border-bottom:1px solid ${LINE};font-size:14px;vertical-align:top">${inner}</td>
    </tr>`;
}

export interface InquiryMailResult {
  sent: boolean;
}

export async function sendNewInquiryEmail(doc: InquiryDoc): Promise<InquiryMailResult> {
  const phone = doc.phone ?? '';
  const property = doc.propertySnapshot;

  const rows = [
    row('Mã yêu cầu', doc.code),
    row('Họ và tên', doc.name),
    doc.email ? row('Email', doc.email, `mailto:${doc.email}`) : '',
    phone ? row('Điện thoại', phone, `tel:${phone.replace(/[^\d+]/g, '')}`) : '',
    doc.service ? row('Nhu cầu', SERVICE_LABEL[doc.service] ?? doc.service) : '',
    property ? row('Bất động sản', property.title) : '',
    doc.preferredViewingDate
      ? row('Ngày muốn xem', new Intl.DateTimeFormat('vi-VN', { timeZone: VN_TIMEZONE }).format(doc.preferredViewingDate))
      : '',
    row('Nguồn', SOURCE_LABEL[doc.source] ?? doc.source),
    row('Thời gian', formatTime(doc.createdAt)),
  ]
    .filter(Boolean)
    .join('');

  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000').replace(/\/+$/, '');

  const html = `<!doctype html>
<html lang="vi">
<body style="margin:0;padding:0;background:#f4f2ec;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif">
  <!-- Dòng xem trước trong hộp thư: ẩn khỏi nội dung nhưng hiện cạnh tiêu đề. -->
  <div style="display:none;max-height:0;overflow:hidden;opacity:0">
    ${esc(doc.name)} · ${esc(phone || doc.email || 'Khách hàng')}${property ? ` · ${esc(property.title)}` : ''}
  </div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f2ec;padding:28px 12px">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border:1px solid ${LINE}">

          <tr>
            <td style="background:${BRAND};padding:22px 26px">
              <div style="color:${GOLD};font-size:10px;letter-spacing:2px;text-transform:uppercase;font-weight:700">
                Da Nang Homes &amp; Living
              </div>
              <div style="color:#ffffff;font-size:19px;font-weight:600;margin-top:6px">
                Có yêu cầu tư vấn mới
              </div>
            </td>
          </tr>

          <tr>
            <td style="padding:24px 26px 8px">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${rows}</table>
            </td>
          </tr>

          <tr>
            <td style="padding:16px 26px 4px">
              <div style="color:${MUTED};font-size:12px;margin-bottom:6px">Nội dung khách gửi</div>
              <div style="background:#faf9f5;border:1px solid ${LINE};border-left:3px solid ${GOLD};padding:14px 16px;font-size:14px;line-height:1.65;color:${BRAND};white-space:pre-line">${esc(doc.message)}</div>
            </td>
          </tr>

          <tr>
            <td style="padding:22px 26px 26px">
              <!-- Nút bằng bảng: Outlook bỏ qua padding trên thẻ <a>. -->
              <table role="presentation" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background:${GOLD}">
                    <a href="${siteUrl}/admin/inquiries" style="display:inline-block;padding:12px 22px;color:${BRAND};font-size:13px;font-weight:700;text-decoration:none">
                      Mở trong CMS →
                    </a>
                  </td>
                </tr>
              </table>
              ${phone ? `<div style="margin-top:12px;font-size:13px;color:${MUTED}">Hoặc gọi ngay: <a href="tel:${esc(phone.replace(/[^\d+]/g, ''))}" style="color:${BRAND};font-weight:600;text-decoration:none">${esc(phone)}</a></div>` : ''}
            </td>
          </tr>

          <tr>
            <td style="background:#faf9f5;border-top:1px solid ${LINE};padding:14px 26px;color:${MUTED};font-size:11px;line-height:1.6">
              Email tự động từ website Da Nang Homes &amp; Living. Bấm “Trả lời” để soạn thư thẳng cho khách.
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const text = [
    'DANANG HOMES LIVING — có yêu cầu tư vấn mới',
    '',
    `Mã yêu cầu: ${doc.code}`,
    `Họ và tên: ${doc.name}`,
    doc.email ? `Email: ${doc.email}` : '',
    phone ? `Điện thoại: ${phone}` : '',
    doc.service ? `Nhu cầu: ${SERVICE_LABEL[doc.service] ?? doc.service}` : '',
    property ? `Bất động sản: ${property.title}` : '',
    `Nguồn: ${SOURCE_LABEL[doc.source] ?? doc.source}`,
    `Thời gian: ${formatTime(doc.createdAt)}`,
    '',
    'Nội dung khách gửi:',
    doc.message,
    '',
    `Mở trong CMS: ${siteUrl}/admin/inquiries`,
  ]
    .filter((line) => line !== '')
    .join('\n');

  // 1. Gửi email thông báo cho Admin / Đội tư vấn
  const adminSent = await sendMail({
    to: process.env.INQUIRY_NOTIFY_TO || process.env.SMTP_USER,
    subject: `[YÊU CẦU MỚI ${doc.code}] ${doc.name} — ${property ? property.title : 'Tư vấn BĐS'}`,
    html,
    text,
    ...(doc.email ? { replyTo: doc.email } : {}),
  });

  return { sent: adminSent };
}
