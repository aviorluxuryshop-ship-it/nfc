import type { MetadataRoute } from 'next'

import { legalSlugs } from '@/data/legal'
import { products } from '@/data/products'
import { site } from '@/data/site'
import { pathsFor, switchPath } from '@/lib/i18n/config'

export default function sitemap(): MetadataRoute.Sitemap {
  const tr = pathsFor('tr')
  const paths = [
    tr.home,
    tr.products,
    ...products.map((p) => tr.product(p.slug)),
    tr.howTo,
    tr.faq,
    tr.contact,
    tr.legal,
    ...legalSlugs.map((s) => tr.legalDoc(s)),
  ]
  // One entry per page, listing both language versions as alternates.
  return paths.flatMap((path) => {
    const languages = { tr: `${site.url}${path}`, en: `${site.url}${switchPath(path, 'en')}` }
    return [
      { url: languages.tr, alternates: { languages } },
      { url: languages.en, alternates: { languages } },
    ]
  })
}
