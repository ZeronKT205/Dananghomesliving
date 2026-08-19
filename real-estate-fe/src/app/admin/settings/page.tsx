import { LANGUAGES } from '@/config/constants';
import { getSettings } from '@/lib/db/repositories/settings-repo';
import { SOCIAL_PLATFORMS, type SiteSettingsInput } from '@/lib/validations/settings';

import { PageHead, Panel, Pill } from '../_components/ui';

import { SettingsForm } from './_components/settings-form';

// Cài đặt phải hiện đúng thứ vừa lưu — không cache.
export const dynamic = 'force-dynamic';

export default async function AdminSettingsPage() {
  const doc = await getSettings();

  // Luôn dựng đủ 5 dòng mạng xã hội, kể cả kênh chưa từng lưu, để form hiện đủ
  // ô cho người vận hành điền.
  const byPlatform = new Map(doc.social.map((s) => [s.platform, s]));
  const initial: SiteSettingsInput = {
    brand: doc.brand,
    contact: doc.contact,
    social: SOCIAL_PLATFORMS.map((platform) => ({
      platform,
      href: byPlatform.get(platform)?.href ?? '',
      enabled: byPlatform.get(platform)?.enabled ?? false,
    })),
    author: {
      name: doc.author.name,
      role: doc.author.role,
      avatarUrl: doc.author.avatarUrl ?? '',
      avatarId: doc.author.avatarId?.toHexString() ?? '',
    },
  };

  return (
    <>
      <PageHead title="Cài đặt" desc="Thông tin thương hiệu, liên hệ, mạng xã hội và tác giả bài viết." />

      <SettingsForm initial={initial} />

      {/*
        Ngôn ngữ CỐ TÌNH chỉ để xem, không sửa được: thêm/bớt ngôn ngữ phải đụng
        tới cấu trúc route `/[locale]/...` và toàn bộ file dịch. Cho sửa từ CMS
        chỉ tạo ra trạng thái hỏng mà không ai gỡ được.
      */}
      <Panel title="Ngôn ngữ website" desc="Bốn ngôn ngữ theo hợp đồng — cấu hình trong mã nguồn">
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
      </Panel>
    </>
  );
}
