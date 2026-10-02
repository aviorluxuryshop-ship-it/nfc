import { createStorageStore } from './storage-store'

export type ConsentCategory = 'functional' | 'analytics' | 'marketing'

export type Consent = Record<ConsentCategory, boolean> & {
  necessary: true
  updatedAt: string
  version: number
}

/** Bump when the cookie categories change so everyone is asked again. */
const VERSION = 1

export const consentCategories: { key: 'necessary' | ConsentCategory; title: string; text: string }[] = [
  {
    key: 'necessary',
    title: 'Zorunlu çerezler',
    text: 'Sepetinizin hatırlanması, ödeme adımları ve güvenlik gibi sitenin çalışması için gereklidir. Kapatılamaz.',
  },
  {
    key: 'functional',
    title: 'İşlevsel çerezler',
    text: 'Tercihlerinizi hatırlayarak size daha rahat bir alışveriş deneyimi sunar.',
  },
  {
    key: 'analytics',
    title: 'Analitik çerezler',
    text: 'Sitenin nasıl kullanıldığını anonim olarak ölçmemize ve siteyi geliştirmemize yardımcı olur.',
  },
  {
    key: 'marketing',
    title: 'Pazarlama çerezleri',
    text: 'İlgilenebileceğiniz kampanyaları size başka sitelerde de gösterebilmemizi sağlar.',
  },
]

export function makeConsent(choice: Record<ConsentCategory, boolean>): Consent {
  return { necessary: true, ...choice, updatedAt: new Date().toISOString(), version: VERSION }
}

/**
 * `null` = not decided yet (show the banner). The server renders
 * 'pending' so the banner never flashes for someone who already chose.
 *
 * Analytics / marketing tags must only load once `consent.analytics` /
 * `consent.marketing` is true — read it with `useConsent()`.
 */
export const consentStore = createStorageStore<Consent | null, 'pending'>({
  key: 'velmo-cookie-consent',
  fallback: null,
  serverValue: 'pending',
  parse(raw) {
    const c = raw as Partial<Consent> | null
    if (!c || c.version !== VERSION) return null
    return makeConsent({ functional: !!c.functional, analytics: !!c.analytics, marketing: !!c.marketing })
  },
})
