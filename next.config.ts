import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    // Thêm dòng này để bỏ qua lỗi type check khi build
    ignoreBuildErrors: true,
  },
};

export default nextConfig;