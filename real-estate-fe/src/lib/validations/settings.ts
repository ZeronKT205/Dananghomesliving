import { z } from 'zod';

/**
 * Cài đặt website — nguồn sự thật cho những thứ trước đây hardcode trong
 * `src/config/constants.ts`.
 *
 * Chỉ đưa vào đây thứ mà người vận hành THẬT SỰ cần đổi được: tên thương hiệu,
 * liên hệ, link mạng xã hội, và danh tính tác giả bài viết. Những thứ đụng tới
 * cấu trúc route (danh sách ngôn ngữ, menu) vẫn nằm trong code — đổi được từ
 * CMS chỉ tổ tạo ra trạng thái hỏng mà không ai sửa được.
 */

export const SOCIAL_PLATFORMS = ['whatsapp', 'facebook', 'instagram', 'tiktok', 'youtube'] as const;
export type SocialPlatform = (typeof SOCIAL_PLATFORMS)[number];

export const SOCIAL_LABEL: Record<SocialPlatform, string> = {
  whatsapp: 'WhatsApp',
  facebook: 'Facebook',
  instagram: 'Instagram',
  tiktok: 'TikTok',
  youtube: 'YouTube',
};

/**
 * Link mạng xã hội.
 *
 * `href` cho phép rỗng: bỏ trống nghĩa là "chưa có kênh này", và icon sẽ không
 * hiện ra ngoài web. Bắt buộc điền đủ 5 kênh thì người vận hành sẽ điền bừa
 * `https://facebook.com` cho xong — tệ hơn là để trống.
 */
const zSocialLink = z.object({
  platform: z.enum(SOCIAL_PLATFORMS),
  href: z
    .string()
    .trim()
    .max(500)
    .refine((v) => v === '' || /^https?:\/\/.+/i.test(v), {
      message: 'Link phải bắt đầu bằng http:// hoặc https://',
    }),
  enabled: z.boolean(),
});

export const zSiteSettings = z.object({
  brand: z.object({
    name: z.string().trim().min(1, 'Chưa nhập tên thương hiệu').max(120),
    tagline: z.string().trim().max(160),
    description: z.string().trim().max(400),
  }),

  contact: z.object({
    email: z.string().trim().email('Email không hợp lệ').max(160),
    // Không dùng regex chặt cho số điện thoại: khách quốc tế nhập đủ kiểu
    // (+84, 0084, có dấu cách, có dấu chấm) và chặn nhầm thì phiền hơn là lợi.
    phone: z.string().trim().min(6, 'Số điện thoại quá ngắn').max(40),
    address: z.string().trim().max(240),
    city: z.string().trim().max(120),
    hours: z.string().trim().max(120),
  }),

  social: z.array(zSocialLink).max(SOCIAL_PLATFORMS.length),

  /**
   * Tác giả mặc định hiện trên bài viết.
   *
   * Hiện chỉ một người đăng bài nên không cần bảng tác giả riêng; khi nào có
   * nhiều biên tập viên thì chuyển sang lấy theo `article.author`.
   */
  author: z.object({
    name: z.string().trim().min(1, 'Chưa nhập tên tác giả').max(120),
    role: z.string().trim().max(120),
    avatarUrl: z.string().trim().max(500),
    avatarId: z.string().trim().max(40),
  }),
});

export type SiteSettingsInput = z.infer<typeof zSiteSettings>;
