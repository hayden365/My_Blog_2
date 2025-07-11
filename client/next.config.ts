import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_URL: process.env.NEXT_PUBLIC_URL || "http://localhost:3001",
  },
  experimental: {
    serverComponentsExternalPackages: [],
  },
};

export default nextConfig;
