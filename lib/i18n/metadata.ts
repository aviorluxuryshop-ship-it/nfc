import type { Metadata } from 'next'

import { site } from '@/data/site'

import { switchPath, type Locale } from './config'
import { getI18n } from './index'

/**
 * Title, description and hreflang links for one page. `path` is the page's
 * address in this language; the other language's address is derived.
 */
export function pageMetadata({
  locale,
  path,
  title,
  description,
  noindex,
}: {
  locale: Locale
  path: string
  title?: string
  description?: string
  noindex?: boolean
}): Metadata {
  const { t } = getI18n(locale)
  const other: Locale = locale === 'tr' ? 'en' : 'tr'
  return {
    // An explicit `title: undefined` would wipe the layout's default title (home page).
    ...(title ? { title } : {}),
    description: description ?? t.meta.description,
    alternates: {
      canonical: path,
      languages: { [locale]: path, [other]: switchPath(path, other), 'x-default': locale === 'tr' ? path : switchPath(path, 'tr') },
    },
    ...(noindex ? { robots: { index: false } } : {}),
  }
}

export function rootMetadata(locale: Locale): Metadata {
  const { t } = getI18n(locale)
  return {
    metadataBase: new URL(site.url),
    title: { default: `${t.meta.siteTitle} — ${t.meta.tagline}`, template: `%s | ${site.name}` },
    description: t.meta.description,
    openGraph: { type: 'website', locale: locale === 'tr' ? 'tr_TR' : 'en_GB', siteName: site.name },
  }
}
