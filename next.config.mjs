/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Don't let `next dev` drop AGENTS.md / CLAUDE.md into the repo.
  agentRules: false,
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  // /indir/<file>.mp4 serves the same film file as /video/ but as a download
  // (one tap on a phone saves it instead of opening the player).
  async rewrites() {
    return [{ source: '/indir/:file(velmo-(?:tr|en)-(?:16x9|9x16)\\.mp4)', destination: '/video/:file' }]
  },
  async headers() {
    return [
      {
        source: '/indir/:file',
        headers: [
          { key: 'Content-Disposition', value: 'attachment' },
          { key: 'X-Robots-Tag', value: 'noindex' },
        ],
      },
    ]
  },
  experimental: {
    // Two root layouts (TR at /, EN at /en) each own their <html lang>, so an
    // unmatched URL has no single layout to render a 404 inside.
    globalNotFound: true,
  },
}

export default nextConfig
