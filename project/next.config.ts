import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https', // Or 'http' if needed, but 'https' is recommended
        hostname: '**', // This wildcard allows images from any domain
      },
    ],
  },
};

module.exports = nextConfig;


export default nextConfig;
