import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true, // ← allows all external image URLs, bypassing domain checks
  },
};

export default nextConfig;