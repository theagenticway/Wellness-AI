import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compiler: {
    styledComponents: true,
  },
  experimental: {
    optimizePackageImports: ['@radix-ui/react-icons'],
  },
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  output: 'standalone',
};

export default nextConfig;
