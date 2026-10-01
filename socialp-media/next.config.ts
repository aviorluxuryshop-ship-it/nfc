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
  // Addresses of the brand's previous (Wix) site, so links and search
  // results pointing at them land on the matching new page. Its legal pages
  // were unfilled Wix templates; they lead to the privacy policy.
  async redirects() {
    return [
      { source: '/about', destination: '/hakkimizda', permanent: true },
      { source: '/gallery', destination: '/iletisim', permanent: true },
      { source: '/blank', destination: '/#hizmetler', permanent: true },
      { source: '/blank-1', destination: '/hizmetler/sosyal-medya-yonetimi', permanent: true },
      { source: '/blank-2', destination: '/hizmetler/web-tasarim-kurulum', permanent: true },
      { source: '/blank-3', destination: '/hizmetler/meta-google-reklamlari', permanent: true },
      { source: '/book-online', destination: '/#sahadan', permanent: true },
      { source: '/:page(privacy-policy|terms-and-conditions|refund-policy|accessibility-statement)', destination: '/gizlilik-politikasi', permanent: true },
    ]
  },
  async headers() {
    return [
      {
        // Baseline hardening. Deliberately no X-Frame-Options / frame-ancestors:
        // the site may be embedded in the brand's Wix page.
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()' },
        ],
      },
      {
        // Photos, ring textures and the showcase video rarely change: let
        // browsers reuse them for a day, then revalidate in the background.
        source: '/:dir(images|ring|video|icons)/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=86400, stale-while-revalidate=604800' }],
      },
    ]
  },
}

export default nextConfig
