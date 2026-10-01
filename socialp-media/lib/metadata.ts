import type { Metadata } from 'next'

import { getDictionary } from '@/lib/content'
import { href, SITE_URL, type Locale, type PageKey } from '@/lib/site'

// Child metadata replaces the parent's openGraph object wholesale, so every
// page carries the share image explicitly.
const OG_IMAGE = { url: '/og.jpg', width: 1200, height: 630, alt: 'Socialp Media' }

/** Shared root-layout metadata for one language. */
export function rootMetadata(locale: Locale): Metadata {
  const t = getDictionary(locale)
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: t.meta.homeTitle, template: '%s — Socialp Media' },
    description: t.meta.homeDescription,
    applicationName: 'Socialp Media',
    openGraph: {
      type: 'website',
      siteName: 'Socialp Media',
      locale: locale === 'tr' ? 'tr_TR' : 'en_US',
      title: t.meta.homeTitle,
      description: t.meta.homeDescription,
      images: [OG_IMAGE],
    },
    twitter: { card: 'summary_large_image', images: [OG_IMAGE.url] },
    formatDetection: { telephone: false },
  }
}

/** Per-page metadata with canonical + hreflang alternates. */
export function pageMetadata(locale: Locale, page: PageKey, title: string, description: string, absoluteTitle = false): Metadata {
  const url = href(locale, page)
  const fullTitle = absoluteTitle ? title : `${title} — Socialp Media`
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: {
      canonical: url,
      languages: { tr: href('tr', page), en: href('en', page), 'x-default': href('tr', page) },
    },
    openGraph: {
      type: 'website',
      siteName: 'Socialp Media',
      locale: locale === 'tr' ? 'tr_TR' : 'en_US',
      url,
      title: fullTitle,
      description,
      images: [OG_IMAGE],
    },
    twitter: { card: 'summary_large_image', title: fullTitle, description, images: [OG_IMAGE.url] },
  }
}
