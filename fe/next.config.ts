import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // Cho phép mọi domain (dùng tạm khi dev)
      },
    ],
  },
  
};

export default nextConfig
