import type { MetadataRoute } from 'next'

import { ALL_PAGES, href, SITE_URL } from '@/lib/site'

export default function sitemap(): MetadataRoute.Sitemap {
  return ALL_PAGES.map((page) => ({
    url: `${SITE_URL}${href('tr', page)}`,
    changeFrequency: 'monthly',
    priority: page === 'home' ? 1 : 0.8,
    alternates: {
      languages: {
        tr: `${SITE_URL}${href('tr', page)}`,
        en: `${SITE_URL}${href('en', page)}`,
      },
    },
  }))
}
