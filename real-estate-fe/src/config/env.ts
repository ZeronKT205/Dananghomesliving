import { z } from 'zod';

// Validate biến môi trường MỘT LẦN. Thiếu/ sai kiểu → app fail ngay lúc khởi động,
// không phải lúc runtime giữa production.
const EnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),

  // Public — lộ ra client (phải có tiền tố NEXT_PUBLIC_)
  NEXT_PUBLIC_SITE_URL: z.string().url().default('http://localhost:3000'),

  // Server-side secret — thêm tại đây, ví dụ:
  // DATABASE_URL: z.string().url(),
});

export const env = EnvSchema.parse(process.env);
