import type { MetadataRoute } from 'next'

import { ALL_PAGES, href, SITE_URL, type Locale, type PageKey } from '@/lib/site'

const priority = (page: PageKey) => (page === 'home' ? 1 : page === 'privacy' ? 0.3 : 0.8)

// Both languages get their own entry, each listing the full set of alternates,
// as search engines expect for hreflang in sitemaps.
export default function sitemap(): MetadataRoute.Sitemap {
  return (['tr', 'en'] as Locale[]).flatMap((locale) =>
    ALL_PAGES.map((page) => ({
      url: `${SITE_URL}${href(locale, page)}`,
      changeFrequency: page === 'privacy' ? 'yearly' : 'monthly',
      priority: priority(page),
      alternates: {
        languages: {
          tr: `${SITE_URL}${href('tr', page)}`,
          en: `${SITE_URL}${href('en', page)}`,
        },
      },
    })),
  )
}
