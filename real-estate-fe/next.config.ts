import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Bật standalone output để Docker image gọn (dùng cho deploy production).
  output: 'standalone',
};

export default nextConfig;
