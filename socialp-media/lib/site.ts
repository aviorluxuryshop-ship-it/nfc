// Brand facts used across both languages. Everything here comes from the
// brand's current site (socialpmedia.com) — nothing is invented.

export const SITE_URL = 'https://www.socialpmedia.com'

export const contact = {
  tr: {
    phone: '+90 (540) 034 69 69',
    phoneHref: 'tel:+905400346969',
    email: 'hello@socialpmedia.com',
  },
  intl: {
    // Line the brand lists for the US, Canada, UK, Australia and Germany.
    phone: '+1 437 231 1432',
    phoneHref: 'tel:+14372311432',
    email: 'business@socialpmedia.com',
  },
  // The TR line is a mobile number; the current site runs a WhatsApp chat
  // widget, so the floating button points there.
  whatsappHref: 'https://wa.me/905400346969',
  instagram: {
    handle: '@socialp.media',
    href: 'https://www.instagram.com/socialp.media/',
  },
  address: {
    street: 'Zuhuratbaba, İncirli Cd. No:69',
    postalCode: '34147',
    district: 'Bakırköy',
    city: 'İstanbul',
    mapsHref:
      'https://www.google.com/maps/search/?api=1&query=Zuhuratbaba%2C+%C4%B0ncirli+Cd.+No%3A69%2C+34147+Bak%C4%B1rk%C3%B6y%2F%C4%B0stanbul',
  },
} as const

export const FOUNDED = 2021

export type Locale = 'tr' | 'en'
export type ServiceId = 'social' | 'web' | 'ads'
export type PageKey = 'home' | 'about' | 'contact' | ServiceId

export const SERVICE_IDS: ServiceId[] = ['social', 'web', 'ads']

export const serviceSlugs: Record<Locale, Record<ServiceId, string>> = {
  tr: {
    social: 'sosyal-medya-yonetimi',
    web: 'web-tasarim-kurulum',
    ads: 'meta-google-reklamlari',
  },
  en: {
    social: 'social-media-management',
    web: 'web-design-development',
    ads: 'meta-google-ads',
  },
}

const base: Record<Locale, string> = { tr: '', en: '/en' }
const servicesDir: Record<Locale, string> = { tr: 'hizmetler', en: 'services' }
const aboutSlug: Record<Locale, string> = { tr: 'hakkimizda', en: 'about' }
const contactSlug: Record<Locale, string> = { tr: 'iletisim', en: 'contact' }

export function href(locale: Locale, page: PageKey): string {
  switch (page) {
    case 'home':
      return base[locale] || '/'
    case 'about':
      return `${base[locale]}/${aboutSlug[locale]}`
    case 'contact':
      return `${base[locale]}/${contactSlug[locale]}`
    default:
      return `${base[locale]}/${servicesDir[locale]}/${serviceSlugs[locale][page]}`
  }
}

/** Link to a section on the home page, e.g. anchor('en', 'sahadan') → /en#sahadan */
export function anchor(locale: Locale, id: string): string {
  return `${base[locale] || '/'}#${id}`
}

export const ALL_PAGES: PageKey[] =['home', 'social', 'web', 'ads', 'about', 'contact']

/** Maps a pathname to the same page in the other language (for the switcher). */
export function alternatePath(pathname: string, target: Locale): string {
  const clean = pathname.replace(/\/$/, '') || '/'
  for (const locale of ['tr', 'en'] as Locale[]) {
    for (const page of ALL_PAGES) {
      if (href(locale, page) === clean) return href(target, page)
    }
  }
  return href(target, 'home')
}

export function serviceFromSlug(locale: Locale, slug: string): ServiceId | undefined {
  return SERVICE_IDS.find((id) => serviceSlugs[locale][id] === slug)
}

/** hreflang alternates for a page, for the Metadata API. */
export function languageAlternates(page: PageKey) {
  return {
    canonical: undefined as string | undefined,
    languages: {
      tr: href('tr', page),
      en: href('en', page),
      'x-default': href('tr', page),
    },
  }
}
