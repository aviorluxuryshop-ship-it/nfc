/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Don't let `next dev` drop AGENTS.md / CLAUDE.md into the repo.
  agentRules: false,
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
