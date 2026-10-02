import type { MetadataRoute } from 'next'

import { siteConfig } from '@/data/site'

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ['', '/katalog', '/nfc-kart-nedir', '/iletisim'].map((path) => ({
    url: `${siteConfig.url}${path}`,
    lastModified: new Date(),
  }))

  return staticRoutes
}
