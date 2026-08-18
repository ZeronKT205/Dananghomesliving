import createNextIntlPlugin from 'next-intl/plugin';

import type { NextConfig } from 'next';

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Bật standalone output để Docker image gọn (dùng cho deploy production).
  // output: 'standalone',
  images: {
    // Mọi giá trị `quality` dùng trong <Image> phải khai ở đây.
    // Next 16 sẽ bắt buộc; khai sẵn để khỏi vỡ khi nâng cấp.
    qualities: [75, 90],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      // Ảnh upload lên Cloudflare R2. `pub-*.r2.dev` là host mặc định khi bật
      // Public Access; gắn custom domain rồi thì thêm host đó vào đây, nếu
      // không <Image> sẽ chặn với lỗi "hostname is not configured".
      {
        protocol: 'https',
        hostname: '**.r2.dev',
      },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default withNextIntl(nextConfig);
