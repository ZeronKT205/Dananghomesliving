'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';

import { DraftRestoreBar } from '@/components/ui/draft-restore-bar';
import { ImageDropZone } from '@/components/ui/image-drop-zone';
import { useDraftBackup } from '@/hooks/use-draft-backup';
import { useLeaveGuard } from '@/hooks/use-leave-guard';
import { SOCIAL_LABEL, SOCIAL_PLATFORMS, type SiteSettingsInput } from '@/lib/validations/settings';
import { actionSaveSettings } from '@/server/actions/admin-actions';

import { Field, FormCard, SaveBar, Toggle, inputClass } from '../../_components/form-kit';

/**
 * Form cài đặt website.
 *
 * Trước đây trang này chỉ hiện hằng số trong `config/constants.ts` và nút Lưu
 * không làm gì — nhìn như sửa được nhưng không lưu được gì cả, kiểu UI tệ nhất.
 * Giờ đọc và ghi thật vào collection `settings`.
 */

const PLACEHOLDER: Record<string, string> = {
  whatsapp: 'https://wa.me/84236xxxxxxx',
  facebook: 'https://facebook.com/trang-cua-ban',
  instagram: 'https://instagram.com/tai-khoan',
  tiktok: 'https://tiktok.com/@tai-khoan',
  youtube: 'https://youtube.com/@kenh',
};

export function SettingsForm({ initial }: { initial: SiteSettingsInput }) {
  const router = useRouter();
  const [v, setV] = useState<SiteSettingsInput>(initial);
  const [dirty, setDirty] = useState(false);
  const [saving, startSaving] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  // Cài đặt cũng là form dài, cũng mất dữ liệu y như trang soạn bài nếu lỡ tay.
  const draft = useDraftBackup<SiteSettingsInput>({ key: 'settings', value: v, enabled: dirty });

  // Chặn cả điều hướng nội bộ, không chỉ đóng tab — bấm nhầm một liên kết
  // trong CMS là mất sạch form mà không có cảnh báo nào.
  useLeaveGuard({ when: dirty, message: 'Cài đặt còn thay đổi chưa lưu. Bản nháp đã được giữ lại, nhưng bạn có chắc muốn rời trang?' });

  function patch(fn: (draft: SiteSettingsInput) => SiteSettingsInput) {
    setV((p) => fn(structuredClone(p)));
    setDirty(true);
    setMessage(null);
  }

  function save() {
    setError(null);
    setMessage(null);

    startSaving(async () => {
      const res = await actionSaveSettings(v);
      if (!res.ok) {
        const first = res.fields ? Object.entries(res.fields)[0] : null;
        setError(first ? `${first[0]}: ${first[1][0]}` : res.message);
        return;
      }
      setDirty(false);
      draft.clear();
      setMessage(res.message ?? 'Đã lưu');
      router.refresh();
    });
  }

  const socialByPlatform = new Map(v.social.map((s) => [s.platform, s]));

  return (
    <div className="flex flex-col gap-4">
      {draft.found ? (
        <DraftRestoreBar
          savedAt={draft.found.savedAt}
          label={'Tìm thấy cài đặt sửa dở chưa lưu'}
          onRestore={() => {
            setV(draft.found!.value);
            setDirty(true);
            draft.discard();
            setMessage('Đã khôi phục bản nháp — kiểm tra rồi bấm Lưu.');
          }}
          onDiscard={draft.discard}
        />
      ) : null}

      <div className="grid gap-4 xl:grid-cols-2">
        <FormCard title="Thông tin doanh nghiệp" desc="Hiển thị ở header, footer và khối liên hệ">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Tên thương hiệu" full>
              <input
                value={v.brand.name}
                onChange={(e) => patch((d) => ((d.brand.name = e.target.value), d))}
                className={inputClass}
              />
            </Field>
            <Field label="Khẩu hiệu" hint="Hiển thị cạnh logo" full>
              <input
                value={v.brand.tagline}
                onChange={(e) => patch((d) => ((d.brand.tagline = e.target.value), d))}
                className={inputClass}
              />
            </Field>
            <Field label="Mô tả website" hint="Dùng cho thẻ mô tả khi chia sẻ link" full>
              <textarea
                rows={2}
                value={v.brand.description}
                onChange={(e) => patch((d) => ((d.brand.description = e.target.value), d))}
                className={inputClass}
              />
            </Field>
          </div>
        </FormCard>

        <FormCard title="Liên hệ" desc="Dùng cho nút gọi nhanh, footer và trang liên hệ">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Hotline">
              <input
                value={v.contact.phone}
                onChange={(e) => patch((d) => ((d.contact.phone = e.target.value), d))}
                className={inputClass}
              />
            </Field>
            <Field label="Email liên hệ">
              <input
                type="email"
                value={v.contact.email}
                onChange={(e) => patch((d) => ((d.contact.email = e.target.value), d))}
                className={inputClass}
              />
            </Field>
            <Field label="Địa chỉ trụ sở" full>
              <input
                value={v.contact.address}
                onChange={(e) => patch((d) => ((d.contact.address = e.target.value), d))}
                className={inputClass}
              />
            </Field>
            <Field label="Thành phố">
              <input
                value={v.contact.city}
                onChange={(e) => patch((d) => ((d.contact.city = e.target.value), d))}
                className={inputClass}
              />
            </Field>
            <Field label="Giờ làm việc">
              <input
                value={v.contact.hours}
                onChange={(e) => patch((d) => ((d.contact.hours = e.target.value), d))}
                className={inputClass}
              />
            </Field>
          </div>
        </FormCard>

        <FormCard
          title="Kênh mạng xã hội"
          desc="Tắt hoặc để trống link thì icon không hiện ngoài website"
        >
          <ul className="grid gap-3">
            {SOCIAL_PLATFORMS.map((platform) => {
              const row = socialByPlatform.get(platform) ?? { platform, href: '', enabled: false };
              return (
                <li key={platform} className="border-line-soft border-b pb-3 last:border-b-0 last:pb-0">
                  <div className="mb-1.5 flex items-center justify-between gap-3">
                    <span className="text-navy text-[12.5px] font-bold">{SOCIAL_LABEL[platform]}</span>
                    <Toggle
                      checked={row.enabled}
                      onChange={(b) =>
                        patch((d) => {
                          const found = d.social.find((s) => s.platform === platform);
                          if (found) found.enabled = b;
                          else d.social.push({ platform, href: '', enabled: b });
                          return d;
                        })
                      }
                      label="Hiện"
                    />
                  </div>
                  <input
                    value={row.href}
                    placeholder={PLACEHOLDER[platform]}
                    onChange={(e) =>
                      patch((d) => {
                        const found = d.social.find((s) => s.platform === platform);
                        if (found) found.href = e.target.value;
                        else d.social.push({ platform, href: e.target.value, enabled: true });
                        return d;
                      })
                    }
                    className={inputClass}
                  />
                </li>
              );
            })}
          </ul>
        </FormCard>

        <FormCard
          title="Tác giả bài viết"
          desc="Tên và ảnh hiện dưới mỗi bài trên website. Hiện chỉ một người đăng bài nên dùng chung."
        >
          <div className="mb-4 flex items-center gap-3">
            <div className="bg-ivory border-line relative h-16 w-16 shrink-0 overflow-hidden rounded-full border">
              {v.author.avatarUrl ? (
                <Image src={v.author.avatarUrl} alt="" fill sizes="64px" className="object-cover" />
              ) : (
                <span className="text-muted grid h-full w-full place-items-center text-[10px]">Chưa có</span>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <ImageDropZone
                compact
                ownerType="site"
                label={v.author.avatarUrl ? 'Đổi ảnh đại diện' : 'Tải ảnh đại diện lên'}
                hint="Ảnh vuông cho đẹp. Tải lên Cloudflare R2."
                onUploaded={(img) =>
                  patch((d) => ((d.author.avatarUrl = img.url), (d.author.avatarId = img.id), d))
                }
              />
              {v.author.avatarUrl ? (
                <button
                  type="button"
                  onClick={() => patch((d) => ((d.author.avatarUrl = ''), (d.author.avatarId = ''), d))}
                  className="text-muted hover:text-navy mt-1.5 cursor-pointer text-[11px] font-bold"
                >
                  Gỡ ảnh
                </button>
              ) : null}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Tên hiển thị">
              <input
                value={v.author.name}
                onChange={(e) => patch((d) => ((d.author.name = e.target.value), d))}
                className={inputClass}
              />
            </Field>
            <Field label="Chức danh" hint="Ví dụ: Ban biên tập">
              <input
                value={v.author.role}
                onChange={(e) => patch((d) => ((d.author.role = e.target.value), d))}
                className={inputClass}
              />
            </Field>
          </div>
        </FormCard>
      </div>

      <SaveBar
        saving={saving}
        dirty={dirty}
        onSave={save}
        saveLabel="Lưu cài đặt"
        error={error}
        message={message}
      />
    </div>
  );
}
