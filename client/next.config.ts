import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_URL: process.env.NEXT_PUBLIC_URL || "http://localhost:3001",
  },
  experimental: {
    serverComponentsExternalPackages: [],
  },
  // SSG 최적화 설정
  output: "standalone",
  // 정적 페이지 생성 최적화
  generateBuildId: async () => {
    return "build-" + Date.now();
  },
};

export default nextConfig;
