import type { MetadataRoute } from 'next'

import { site } from '@/data/site'
import { pathsFor } from '@/lib/i18n/config'

export default function robots(): MetadataRoute.Robots {
  const tr = pathsFor('tr')
  const en = pathsFor('en')
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [tr.cart, tr.checkout, tr.orderReceived, en.cart, en.checkout, en.orderReceived],
    },
    sitemap: `${site.url}/sitemap.xml`,
  }
}
