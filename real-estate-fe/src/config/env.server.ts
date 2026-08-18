import 'server-only';

import { z } from 'zod';

/**
 * Secret phía server. `server-only` khiến build FAIL ngay nếu file này lỡ bị
 * import vào Client Component — đó là hàng rào, đừng gỡ.
 *
 * Validate một lần lúc khởi động: thiếu biến thì chết ngay khi deploy, chứ
 * không phải chết giữa production lúc user đang thao tác.
 */
const ServerEnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),

  // ---------- MongoDB Atlas ----------
  MONGODB_URI: z
    .string()
    .min(1)
    .refine((v) => v.startsWith('mongodb+srv://') || v.startsWith('mongodb://'), {
      message: 'MONGODB_URI phải bắt đầu bằng mongodb:// hoặc mongodb+srv://',
    }),
  MONGODB_DB: z.string().min(1),

  // ---------- Auth / JWT ----------
  // Độ dài tối thiểu 32 ký tự: ngắn hơn thì HS256 dễ bị brute-force offline.
  JWT_SECRET: z.string().min(32),
  JWT_REFRESH_SECRET: z.string().min(32),
  JWT_ACCESS_TTL: z.string().default('15m'),
  JWT_REFRESH_TTL: z.string().default('30d'),
  AUTH_SECRET: z.string().min(32),

  // ---------- Cloudflare R2 (S3-compatible) ----------
  R2_ACCOUNT_ID: z.string().min(1),
  R2_ACCESS_KEY_ID: z.string().min(1),
  R2_SECRET_ACCESS_KEY: z.string().min(1),
  R2_BUCKET: z.string().min(1),
  R2_ENDPOINT: z.string().url(),
  // Token API Cloudflare — chỉ cần khi gọi REST API của Cloudflare (tạo bucket,
  // sửa CORS…). Thao tác upload/download thường ngày dùng cặp access key ở trên.
  CLOUDFLARE_API_TOKEN: z.string().optional(),

  // ---------- Origin được phép gọi API ----------
  // Danh sách origin, phân tách bằng dấu phẩy. Dùng cho CORS ở route handler
  // và để kiểm tra Origin/Referer khi chống CSRF.
  // KHÁC với NEXT_PUBLIC_SITE_URL (một URL chính tắc của môi trường hiện tại)
  // và KHÁC với NEXT_PUBLIC_R2_PUBLIC_URL (host của bucket R2).
  ALLOWED_ORIGINS: z
    .string()
    .default('http://localhost:3000')
    .transform((s) =>
      s
        .split(',')
        .map((o) => o.trim().replace(/\/$/, ''))
        .filter(Boolean),
    ),

  // ---------- Khác ----------
  // Dùng cho webhook revalidate on-demand: /api/revalidate?secret=...
  REVALIDATE_SECRET: z.string().min(16),
  // Khoá AES-256 dạng hex (64 ký tự) cho dữ liệu cần mã hoá khi lưu.
  ENCRYPTION_KEY: z.string().length(64).optional(),
});

const parsed = ServerEnvSchema.safeParse(process.env);

if (!parsed.success) {
  // In ra TÊN biến sai, không in giá trị — log không được rò secret.
  const issues = parsed.error.issues
    .map((i) => `  - ${i.path.join('.')}: ${i.message}`)
    .join('\n');
  throw new Error(`Biến môi trường phía server không hợp lệ:\n${issues}`);
}

export const serverEnv = parsed.data;

export type ServerEnv = z.infer<typeof ServerEnvSchema>;

/**
 * So khớp origin CHÍNH XÁC, không dùng `startsWith`/`includes`.
 * `origin.startsWith('https://dananghomesliving.com')` sẽ cho qua cả
 * `https://dananghomesliving.com.attacker.net` — đó là lỗ hổng kinh điển.
 */
export function isAllowedOrigin(origin: string | null | undefined): boolean {
  if (!origin) return false;
  return serverEnv.ALLOWED_ORIGINS.includes(origin.replace(/\/$/, ''));
}
