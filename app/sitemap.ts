import type { MetadataRoute } from 'next'

import { legalHref, legalPages } from '@/data/legal'
import { products } from '@/data/products'
import { site } from '@/data/site'

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    '/',
    '/urunler',
    ...products.map((p) => `/urunler/${p.slug}`),
    '/nasil-kullanilir',
    '/sss',
    '/iletisim',
    '/yasal',
    ...legalPages.map((p) => legalHref(p.slug)),
  ]
  return paths.map((path) => ({ url: `${site.url}${path}` }))
}
