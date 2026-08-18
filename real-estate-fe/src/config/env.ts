import { z } from 'zod';

// Biến CÔNG KHAI — an toàn để import ở Client Component.
// Secret phía server nằm ở `env.server.ts` (có `server-only`), TUYỆT ĐỐI không
// khai ở đây: mọi thứ trong file này đều bị nhúng vào bundle gửi ra trình duyệt.
const PublicEnvSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z.string().url().default('http://localhost:3000'),

  // Host công khai của bucket R2 (r2.dev hoặc custom domain) để <Image> trỏ tới.
  // Chưa cấu hình xong thì để trống, code phải chịu được `undefined`.
  NEXT_PUBLIC_R2_PUBLIC_URL: z.string().url().optional(),
});

// Phải liệt kê TỪNG biến một. Next chỉ thay thế các tham chiếu tĩnh dạng
// `process.env.NEXT_PUBLIC_X` lúc build — truyền cả object `process.env` vào
// thì phía client sẽ nhận object rỗng và schema âm thầm rơi về default.
export const env = PublicEnvSchema.parse({
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  NEXT_PUBLIC_R2_PUBLIC_URL: process.env.NEXT_PUBLIC_R2_PUBLIC_URL,
});

export type PublicEnv = z.infer<typeof PublicEnvSchema>;
