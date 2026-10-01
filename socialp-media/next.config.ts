import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // This app lives in a subfolder of a repo that has its own lockfile.
  turbopack: { root: process.cwd() },
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  experimental: {
    // Two root layouts (TR at /, EN at /en) each own their <html lang>, so an
    // unmatched URL has no single layout to render a 404 inside.
    globalNotFound: true,
  },
}

export default nextConfig
