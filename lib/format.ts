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

export function formatDate(date: Date | string) {
  return new Intl.DateTimeFormat('tr-TR', { dateStyle: 'long', timeStyle: 'short' }).format(new Date(date))
}

/** "1 ürün" / "3 ürün" — Turkish doesn't pluralise after numbers. */
export function itemCount(n: number) {
  return `${n} ürün`
}
