import 'server-only';

import {
  APP_DESCRIPTION,
  APP_NAME,
  APP_TAGLINE,
  CONTACT_CITY,
  CONTACT_EMAIL,
  CONTACT_HOURS,
  CONTACT_PHONE,
  OFFICE_ADDRESS,
} from '@/config/constants';
import { SETTINGS_KEY, settingsCol } from '@/lib/db/collections';
import type { BaseDoc, SettingsDoc } from '@/lib/db/collections';
import { SOCIAL_PLATFORMS } from '@/lib/validations/settings';
import type { SiteSettingsInput } from '@/lib/validations/settings';

import { baseCreateFields, baseUpdateFields, toObjectId } from './base';


/**
 * Kho cài đặt website. Luôn đúng MỘT document.
 *
 * `getSettings()` không bao giờ trả null: chưa có gì trong DB thì dựng bản mặc
 * định từ `config/constants.ts`. Nhờ vậy trang public không phải viết nhánh
 * "chưa cấu hình", và ngày đầu chạy site vẫn hiện đủ thông tin.
 */

function defaults(): Omit<SettingsDoc, keyof BaseDoc | 'key'> {
  return {
    brand: { name: APP_NAME, tagline: APP_TAGLINE, description: APP_DESCRIPTION },
    contact: {
      email: CONTACT_EMAIL,
      phone: CONTACT_PHONE,
      address: OFFICE_ADDRESS,
      city: CONTACT_CITY,
      hours: CONTACT_HOURS,
    },
    // Liệt kê đủ 5 nền tảng nhưng để trống href: form cài đặt hiện đủ 5 dòng
    // cho người vận hành điền, còn ngoài web thì dòng trống không hiện icon.
    social: SOCIAL_PLATFORMS.map((platform) => ({ platform, href: '', enabled: false })),
    author: { name: 'Ban biên tập', role: 'Da Nang Homes & Living', avatarUrl: null, avatarId: null },
  };
}

export async function getSettings(): Promise<SettingsDoc> {
  const col = await settingsCol();
  const found = await col.findOne({ key: SETTINGS_KEY });
  if (found) return found;

  // Chưa có thì tạo luôn bản mặc định, để lần sau đọc là có ngay và người vận
  // hành mở trang Cài đặt thấy sẵn dữ liệu để sửa thay vì các ô trống.
  const doc = { key: SETTINGS_KEY, ...defaults(), ...baseCreateFields(null) } as SettingsDoc;
  await col.insertOne(doc);
  return doc;
}

export async function saveSettings(input: SiteSettingsInput, actorId?: string | null): Promise<SettingsDoc> {
  const col = await settingsCol();

  const next = {
    brand: input.brand,
    contact: input.contact,
    social: input.social.map((s) => ({ platform: s.platform, href: s.href.trim(), enabled: s.enabled })),
    author: {
      name: input.author.name,
      role: input.author.role,
      avatarUrl: input.author.avatarUrl || null,
      avatarId: toObjectId(input.author.avatarId || null),
    },
  };

  /*
   * `$setOnInsert` KHÔNG được chứa trường nào đã có trong `$set`.
   *
   * `baseCreateFields` và `baseUpdateFields` đều sinh `updatedAt`/`updatedBy`,
   * và MongoDB từ chối cả lệnh với "Updating the path 'updatedAt' would create
   * a conflict at 'updatedAt'" — lưu cài đặt hỏng hoàn toàn. Chỉ giữ lại phần
   * thật sự chỉ dùng lúc tạo mới.
   */
  const created = baseCreateFields(actorId);

  const res = await col.findOneAndUpdate(
    { key: SETTINGS_KEY },
    {
      $set: { ...next, ...baseUpdateFields(actorId) },
      // Bản ghi có thể chưa tồn tại nếu chưa ai mở trang Cài đặt lần nào.
      $setOnInsert: {
        key: SETTINGS_KEY,
        createdAt: created.createdAt,
        createdBy: created.createdBy,
        deletedAt: null,
      },
    },
    { upsert: true, returnDocument: 'after' },
  );

  return res!;
}
