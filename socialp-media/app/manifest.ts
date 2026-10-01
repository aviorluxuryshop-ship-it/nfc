import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Socialp Media',
    short_name: 'Socialp',
    description: 'Sosyal medya yönetimi, web tasarım ve Meta & Google reklamları — İstanbul.',
    start_url: '/',
    display: 'minimal-ui',
    background_color: '#0b0b0c',
    theme_color: '#0b0b0c',
    lang: 'tr',
    icons: [
      { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
      { src: '/icon.svg', sizes: 'any', type: 'image/svg+xml' },
    ],
  }
}
