import type { MetadataRoute } from 'next'

import { categories } from '@/data/yemek'

const base = process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : 'http://localhost:3000'

export default function sitemap(): MetadataRoute.Sitemap {
  return ['', '/urunler', ...categories.map((c) => `/urunler/${c.slug}`), '/hakkimizda', '/iletisim'].map((path) => ({ url: `${base}${path}`, lastModified: new Date() }))
}
