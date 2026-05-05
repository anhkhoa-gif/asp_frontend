import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    // Thêm dòng này để bỏ qua lỗi type check khi build
    ignoreBuildErrors: true,
  },
  eslint: {
    // Thêm dòng này nếu bạn cũng muốn bỏ qua lỗi ESLint khi build
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;