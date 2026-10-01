import type { Metadata } from 'next'

import { getDictionary } from '@/lib/content'
import { href, SERVICE_IDS, SITE_URL, type Locale, type PageKey, type ServiceId } from '@/lib/site'

// Child metadata replaces the parent's openGraph object wholesale, so every
// page carries the share image explicitly. Service pages share their own
// card (the service's tray photo); the rest use the brand card. Both exist in
// each language — rendered from the site's fonts into public/og/.
//
// The image URL is absolute and must point wherever this build is live: until
// the domain moves over, www.socialpmedia.com still serves the old site. On a
// Vercel production build that is the project's production domain (which
// becomes www.socialpmedia.com once the domain is connected).
const vercelHost = process.env.VERCEL_ENV === 'production' ? process.env.VERCEL_PROJECT_PRODUCTION_URL : undefined
const ASSET_ORIGIN = vercelHost ? `https://${vercelHost}` : SITE_URL

function ogImage(locale: Locale, page: PageKey = 'home') {
  const isService = (SERVICE_IDS as PageKey[]).includes(page)
  const t = getDictionary(locale)
  return {
    url: `${ASSET_ORIGIN}/og/${isService ? page : 'home'}-${locale}.jpg`,
    width: 1200,
    height: 630,
    alt: isService ? `${t.services[page as ServiceId].title} — Socialp Media` : 'Socialp Media',
  }
}

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
      images: [ogImage(locale)],
    },
    twitter: { card: 'summary_large_image', images: [ogImage(locale).url] },
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
      images: [ogImage(locale, page)],
    },
    twitter: { card: 'summary_large_image', title: fullTitle, description, images: [ogImage(locale, page).url] },
  }
}
