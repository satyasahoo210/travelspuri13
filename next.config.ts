import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'drive.google.com',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
    ],
  },
  allowedDevOrigins: ['192.168.1.8'],
  output: 'standalone',
  async rewrites() {
    const API_BASE =
      process.env.NEXT_PUBLIC_API_URL || process.env.API_URL

    if (!API_BASE) {
      throw new Error(
        'Missing API_BASE environment variable for rewrites (NEXT_PUBLIC_API_URL or API_URL)',
      )
    }

    return [
      {
        source: '/api/v1/:path*',
        destination: `${API_BASE}/:path*`,
      },
    ]
  },
}

export default nextConfig
