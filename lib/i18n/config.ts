import type { LegalSlug } from '@/data/legal'
import type { ScentSlug } from '@/data/products'

export const locales = ['tr', 'en'] as const
export type Locale = (typeof locales)[number]
export const defaultLocale: Locale = 'tr'

/** BCP-47 tags for Intl formatting and <html lang>. */
export const htmlLang: Record<Locale, string> = { tr: 'tr', en: 'en' }

/**
 * Every page has its own address in each language. Turkish lives at the
 * root (the store's home market), English under /en with English slugs.
 * Internal ids (product `slug`, legal `slug`) never change; only the URL
 * segment does.
 */
const productSegment: Record<Locale, Record<ScentSlug, string>> = {
  tr: { lavanta: 'lavanta', bahar: 'bahar', narenciye: 'narenciye' },
  en: { lavanta: 'lavender', bahar: 'spring', narenciye: 'citrus' },
}

const legalSegment: Record<Locale, Record<LegalSlug, string>> = {
  tr: {
    'kvkk-aydinlatma-metni': 'kvkk-aydinlatma-metni',
    'gizlilik-politikasi': 'gizlilik-politikasi',
    'cerez-politikasi': 'cerez-politikasi',
    'cerez-tercihleri': 'cerez-tercihleri',
    'mesafeli-satis-sozlesmesi': 'mesafeli-satis-sozlesmesi',
    'on-bilgilendirme-formu': 'on-bilgilendirme-formu',
    'iptal-ve-iade': 'iptal-ve-iade',
    'teslimat-ve-kargo': 'teslimat-ve-kargo',
    'kullanim-kosullari': 'kullanim-kosullari',
  },
  en: {
    'kvkk-aydinlatma-metni': 'privacy-notice',
    'gizlilik-politikasi': 'privacy-policy',
    'cerez-politikasi': 'cookie-policy',
    'cerez-tercihleri': 'cookie-preferences',
    'mesafeli-satis-sozlesmesi': 'distance-sales-agreement',
    'on-bilgilendirme-formu': 'pre-information-form',
    'iptal-ve-iade': 'cancellation-and-returns',
    'teslimat-ve-kargo': 'delivery-and-shipping',
    'kullanim-kosullari': 'terms-of-use',
  },
}

const staticPaths = {
  home: { tr: '/', en: '/en' },
  products: { tr: '/urunler', en: '/en/products' },
  howTo: { tr: '/nasil-kullanilir', en: '/en/how-to-use' },
  faq: { tr: '/sss', en: '/en/faq' },
  contact: { tr: '/iletisim', en: '/en/contact' },
  cart: { tr: '/sepet', en: '/en/cart' },
  checkout: { tr: '/odeme', en: '/en/checkout' },
  orderReceived: { tr: '/siparis-alindi', en: '/en/order-received' },
  legal: { tr: '/yasal', en: '/en/legal' },
} as const

export type StaticPage = keyof typeof staticPaths

export function pathsFor(locale: Locale) {
  return {
    ...(Object.fromEntries(Object.entries(staticPaths).map(([k, v]) => [k, v[locale]])) as Record<StaticPage, string>),
    product: (slug: ScentSlug) => `${staticPaths.products[locale]}/${productSegment[locale][slug]}`,
    legalDoc: (slug: LegalSlug) => `${staticPaths.legal[locale]}/${legalSegment[locale][slug]}`,
  }
}

export type Paths = ReturnType<typeof pathsFor>

export function productSlugFromSegment(locale: Locale, segment: string): ScentSlug | undefined {
  return (Object.entries(productSegment[locale]) as [ScentSlug, string][]).find(([, s]) => s === segment)?.[0]
}

export function legalSlugFromSegment(locale: Locale, segment: string): LegalSlug | undefined {
  return (Object.entries(legalSegment[locale]) as [LegalSlug, string][]).find(([, s]) => s === segment)?.[0]
}

export function productSegments(locale: Locale) {
  return Object.values(productSegment[locale])
}

export function legalSegments(locale: Locale) {
  return Object.values(legalSegment[locale])
}

export function localeFromPath(pathname: string): Locale {
  return pathname === '/en' || pathname.startsWith('/en/') ? 'en' : 'tr'
}

/**
 * The same page in the other language, for the language switch and for
 * hreflang links. Falls back to that language's home page.
 */
export function switchPath(pathname: string, to: Locale): string {
  const from = localeFromPath(pathname)
  const target = pathsFor(to)
  const clean = pathname.replace(/\/+$/, '') || '/'

  for (const key of Object.keys(staticPaths) as StaticPage[]) {
    if (staticPaths[key][from] === clean) return target[key]
  }

  const productsBase = staticPaths.products[from]
  if (clean.startsWith(`${productsBase}/`)) {
    const slug = productSlugFromSegment(from, clean.slice(productsBase.length + 1))
    if (slug) return target.product(slug)
  }

  const legalBase = staticPaths.legal[from]
  if (clean.startsWith(`${legalBase}/`)) {
    const slug = legalSlugFromSegment(from, clean.slice(legalBase.length + 1))
    if (slug) return target.legalDoc(slug)
  }

  return target.home
}
