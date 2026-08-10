import type { NextConfig } from 'next';

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
    ],
  },
};

export default nextConfig;
