import type { Locale } from '@/lib/i18n/config'

// Prices stay in Turkish notation (₺1.234,50) in both languages: the store
// sells in Türkiye and every invoice will look like this.
const priceFormatter = new Intl.NumberFormat('tr-TR', {
  style: 'currency',
  currency: 'TRY',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

/** 29990 → "₺299,90". All prices in the store are integers in kuruş. */
export function formatPrice(kurus: number) {
  return priceFormatter.format(kurus / 100)
}

export function formatDate(date: Date | string, locale: Locale) {
  return new Intl.DateTimeFormat(locale === 'en' ? 'en-GB' : 'tr-TR', { dateStyle: 'long', timeStyle: 'short' }).format(new Date(date))
}
