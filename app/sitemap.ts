import type { MetadataRoute } from 'next'

import { categories } from '@/data/yemek'
import { siteUrl } from '@/lib/site'

export default function sitemap(): MetadataRoute.Sitemap {
  return ['', '/urunler', ...categories.map((c) => `/urunler/${c.slug}`), '/hakkimizda', '/iletisim'].map((path) => ({ url: `${siteUrl}${path}`, lastModified: new Date() }))
}
