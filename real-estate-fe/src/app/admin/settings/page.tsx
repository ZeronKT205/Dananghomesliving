import {
  APP_NAME,
  APP_TAGLINE,
  CONTACT_CITY,
  CONTACT_EMAIL,
  CONTACT_PHONE,
  LANGUAGES,
  SOCIAL_LINKS,
} from '@/config/constants';

import { IcLayers } from '../_components/icons';
import { Avatar, Field, PageHead, Panel, PendingButton, Pill } from '../_components/ui';

export default function AdminSettingsPage() {
  return (
    <>
      <PageHead
        title="Cài đặt"
        desc="Thông tin thương hiệu, liên hệ, ngôn ngữ và tài khoản quản trị."
        actions={<PendingButton>Lưu thay đổi</PendingButton>}
      />

      <div className="grid gap-4 xl:grid-cols-2">
        <Panel title="Thông tin doanh nghiệp" desc="Hiển thị ở header, footer và khối liên hệ">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Tên thương hiệu" value={APP_NAME} full />
            <Field label="Khẩu hiệu" value={APP_TAGLINE} hint="Hiển thị cạnh logo" full />
            <Field label="Hotline" value={CONTACT_PHONE} hint="Dùng cho nút gọi nhanh và mã QR" />
            <Field label="Email liên hệ" value={CONTACT_EMAIL} />
            <Field label="Địa chỉ trụ sở" value={CONTACT_CITY} full />
            <Field label="Giờ làm việc" value="Thứ 2 – Thứ 7 · 08:30 – 18:00" full />
          </div>
        </Panel>

        <Panel title="Ngôn ngữ website" desc="Bốn ngôn ngữ theo hợp đồng">
          <ul className="grid gap-2.5">
            {LANGUAGES.map((language) => (
              <li
                key={language.code}
                className="border-line-soft flex items-center gap-3 border-b pb-2.5 last:border-b-0 last:pb-0"
              >
                <span className="bg-ivory text-navy rounded px-2 py-1 text-[10.5px] font-extrabold">
                  {language.short}
                </span>
                <span className="text-navy flex-1 text-[13px] font-medium">{language.label}</span>
                {language.code === 'vi' ? <Pill tone="ok">Mặc định</Pill> : null}
              </li>
            ))}
          </ul>
          <p className="text-muted mt-4 text-[11.5px]">
            Nội dung từng ngôn ngữ sẽ dịch trực tiếp trong CMS sau khi dựng xong hệ thống đa ngữ.
          </p>
        </Panel>

        <Panel title="Kênh mạng xã hội" desc="Hiển thị ở góc phải header và trong footer">
          <ul className="grid gap-2.5">
            {SOCIAL_LINKS.map((social) => (
              <li
                key={social.name}
                className="border-line-soft flex items-center gap-3 border-b pb-2.5 last:border-b-0 last:pb-0"
              >
                <span className="text-navy w-24 shrink-0 text-[12.5px] font-bold">
                  {social.name}
                </span>
                <span className="text-muted min-w-0 flex-1 truncate text-[12px]">
                  {social.href}
                </span>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel title="Tài khoản quản trị">
          <div className="border-line flex items-center gap-3 rounded-[10px] border p-3.5">
            <Avatar name="Quản trị viên" size="lg" />
            <div className="min-w-0 flex-1">
              <p className="text-navy text-[14px] font-extrabold">Quản trị viên</p>
              <p className="text-muted text-[12px]">Chủ sở hữu</p>
            </div>
            <Pill tone="brand">Đang đăng nhập</Pill>
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Field label="Tên hiển thị" value="Quản trị viên" />
            <Field label="Email đăng nhập" value={CONTACT_EMAIL} />
          </div>

          <div className="border-line mt-4 flex flex-wrap items-center justify-between gap-3 rounded-md border border-dashed p-3.5">
            <span className="text-muted text-[12px]">
              Nên đổi mật khẩu định kỳ để bảo vệ trang quản trị.
            </span>
            <PendingButton>Đổi mật khẩu</PendingButton>
          </div>
        </Panel>

        <Panel title="Trạng thái hệ thống" className="xl:col-span-2">
          <div className="grid gap-3 sm:grid-cols-3">
            <StatusRow label="Nguồn dữ liệu" value="Dữ liệu mẫu" tone="warn" />
            <StatusRow label="Kết nối CMS" value="Chưa cấu hình" />
            <StatusRow label="Đa ngôn ngữ" value="Chưa bật" />
          </div>
          <p className="text-muted border-line-soft mt-4 flex items-start gap-2 border-t pt-4 text-[11.5px]">
            <IcLayers size={14} className="mt-0.5 shrink-0" />
            Toàn bộ số liệu trong CMS hiện là dữ liệu mẫu. Mọi thao tác lưu chưa có tác dụng cho tới
            khi nối Payload CMS và MongoDB.
          </p>
        </Panel>
      </div>
    </>
  );
}

function StatusRow({
  label,
  value,
  tone = 'neutral',
}: {
  label: string;
  value: string;
  tone?: 'neutral' | 'warn';
}) {
  return (
    <div className="border-line flex items-center justify-between gap-3 rounded-md border px-3.5 py-3">
      <span className="text-navy text-[12.5px] font-bold">{label}</span>
      <Pill tone={tone}>{value}</Pill>
    </div>
  );
}
