import { fileURLToPath } from 'node:url';

import { defineConfig } from 'vitest/config';

// `new URL(...).pathname` trả về '/D:/…' và giữ nguyên %20 cho dấu cách, nên
// alias hỏng trên Windows ở thư mục có dấu cách. `fileURLToPath` trả đường dẫn
// thật của hệ điều hành.
const fromRoot = (p: string) => fileURLToPath(new URL(p, import.meta.url));

export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
  resolve: {
    alias: {
      '@': fromRoot('./src'),
      // `server-only` ném lỗi ngay khi nạp ngoài Server Component nên vitest
      // không import nổi service nào. Thay bằng module rỗng — mã thật vẫn giữ
      // `import 'server-only'`, đó mới là lớp chặn lúc build.
      'server-only': fromRoot('./src/test/server-only-stub.ts'),
    },
  },
});
