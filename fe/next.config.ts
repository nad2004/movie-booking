import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  webpack: config => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
    }
    return config
  },
  experimental: {
    // @ts-expect-error - React Compiler is experimental
    reactCompiler: true,
  },
}

export default nextConfig
