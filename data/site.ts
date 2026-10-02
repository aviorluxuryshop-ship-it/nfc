/**
 * Store-wide settings. Everything a shop owner is likely to change lives
 * here or in `company.ts` / `products.ts` — nothing commercial is hard-coded
 * in the components.
 *
 * ⚠ The numbers under `commerce` are EXAMPLE values so the cart and
 * checkout can be tried end to end. Replace them with the real figures
 * before going live.
 */
export const site = {
  name: 'VELMO',
  title: 'VELMO Deterjan Yaprağı',
  description:
    'VELMO çamaşır deterjanı yaprağı: renkli çamaşırlar için, ölçmeden kullanılan, hızlı çözünen deterjan. 1 kutu = 30 yaprak = 30 yıkama. Lavanta, Bahar ve Narenciye kokuları.',
  // Packaging says www.velmo.com — confirm the real domain and change it here.
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.velmo.com',
  locale: 'tr_TR',

  /**
   * While true, the checkout says plainly that no payment is taken and
   * legal pages highlight the [placeholders] that still need real values.
   * Set to false once the payment provider and company details are in.
   */
  demoMode: true,

  commerce: {
    currency: 'TRY',
    /** Flat shipping fee in kuruş (ÖRNEK). */
    shippingFee: 5990,
    /** Orders at or above this subtotal ship free, in kuruş (ÖRNEK). */
    freeShippingThreshold: 50000,
    /** Shown as "… iş günü içinde kargoya verilir" (ÖRNEK). */
    dispatchDays: '1–3',
    /** Per-line cap so a mistyped quantity can't produce a 900-box order. */
    maxQuantity: 20,
    paymentMethods: {
      card: true,
      bankTransfer: true,
    },
  },
} as const

export type NavItem = { label: string; href: string }

export const mainNav: NavItem[] = [
  { label: 'Ürünler', href: '/urunler' },
  { label: 'Nasıl Kullanılır?', href: '/nasil-kullanilir' },
  { label: 'Sıkça Sorulanlar', href: '/sss' },
  { label: 'İletişim', href: '/iletisim' },
]
