import { z } from 'zod';

import { zObjectId } from './common';

export const USER_ROLES = ['admin', 'editor', 'viewer'] as const;
export const zUserRole = z.enum(USER_ROLES);
export type UserRole = (typeof USER_ROLES)[number];

export const zLoginInput = z.object({
  email: z.string().trim().toLowerCase().email('Email không hợp lệ'),
  password: z.string().min(1, 'Vui lòng nhập mật khẩu').max(200),
  remember: z.boolean().default(false),
});

/**
 * Mật khẩu: tối thiểu 12 ký tự, bắt buộc có chữ và số.
 * Không ép ký tự đặc biệt — NIST 800-63B khuyến nghị ưu tiên ĐỘ DÀI hơn là
 * quy tắc phức tạp, vì quy tắc phức tạp đẩy người dùng tới "Password1!".
 */
export const zPassword = z
  .string()
  .min(12, 'Mật khẩu tối thiểu 12 ký tự')
  .max(200)
  .regex(/[a-zA-Z]/, 'Mật khẩu phải có ít nhất một chữ cái')
  .regex(/\d/, 'Mật khẩu phải có ít nhất một chữ số');

export const zUserCreate = z.object({
  email: z.string().trim().toLowerCase().email().max(200),
  password: zPassword,
  name: z.string().trim().min(1).max(160),
  role: zUserRole.default('editor'),
  avatarId: zObjectId.nullable().default(null),
});

export const zUserUpdate = z.object({
  name: z.string().trim().min(1).max(160).optional(),
  role: zUserRole.optional(),
  isActive: z.boolean().optional(),
  avatarId: zObjectId.nullable().optional(),
});

export const zPasswordChange = z
  .object({
    currentPassword: z.string().min(1),
    newPassword: zPassword,
    confirmPassword: z.string(),
  })
  .refine((v) => v.newPassword === v.confirmPassword, {
    message: 'Xác nhận mật khẩu không khớp',
    path: ['confirmPassword'],
  })
  .refine((v) => v.newPassword !== v.currentPassword, {
    message: 'Mật khẩu mới phải khác mật khẩu cũ',
    path: ['newPassword'],
  });

/** Nội dung nhét vào access token. Giữ tối thiểu — token nằm ở cookie client. */
export const zAccessTokenClaims = z.object({
  sub: z.string(), // userId
  email: z.string(),
  name: z.string(),
  role: zUserRole,
  typ: z.literal('access'),
});

export const zRefreshTokenClaims = z.object({
  sub: z.string(),
  sid: z.string(), // sessionId — để thu hồi đúng phiên
  typ: z.literal('refresh'),
});

export type LoginInput = z.infer<typeof zLoginInput>;
export type UserCreateInput = z.infer<typeof zUserCreate>;
export type AccessTokenClaims = z.infer<typeof zAccessTokenClaims>;
export type RefreshTokenClaims = z.infer<typeof zRefreshTokenClaims>;

/** Quyền theo vai trò. Một chỗ duy nhất, đừng rải if/else khắp nơi. */
export const ROLE_PERMISSIONS = {
  admin: ['content:read', 'content:write', 'inquiry:read', 'inquiry:write', 'user:manage', 'media:write'],
  editor: ['content:read', 'content:write', 'inquiry:read', 'inquiry:write', 'media:write'],
  viewer: ['content:read', 'inquiry:read'],
} as const satisfies Record<UserRole, readonly string[]>;

export type Permission = (typeof ROLE_PERMISSIONS)[UserRole][number];

export function hasPermission(role: UserRole, permission: Permission): boolean {
  return (ROLE_PERMISSIONS[role] as readonly string[]).includes(permission);
}
