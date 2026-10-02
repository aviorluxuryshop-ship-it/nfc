/**
 * VELMO Çamaşır Deterjanı Yaprağı — one product, three scents. Every
 * scent is its own page and cart line so the customer always sees exactly
 * which scent they are buying.
 *
 * Facts (sheet count, weight, size, dosage, ingredients, warnings) are
 * transcribed from the packaging. Prices are EXAMPLE values (ÖRNEK) —
 * replace them with the real ones.
 */
import type { Locale } from '@/lib/i18n/config'

export type ScentSlug = 'lavanta' | 'bahar' | 'narenciye'

type ScentText = {
  /** Scent name as the customer reads it. */
  scent: string
  /** One-line description of the smell. */
  note: string
  description: string
}

export type Product = {
  /** Internal id — also used in the cart. URLs come from lib/i18n/config. */
  slug: ScentSlug
  /** Scent name as printed on the box. */
  boxScent: string
  text: Record<Locale, ScentText>
  /** Price in kuruş, KDV dahil. */
  price: number
  /** Optional struck-through price, in kuruş. */
  compareAtPrice?: number
  sku: string
  inStock: boolean
  /**
   * Real product photos (paths under /public). When empty, the drawn
   * pack shot is shown instead — drop studio photos in here when ready.
   */
  photos: string[]
}

export const productFacts = {
  sheets: 30,
  washes: 30,
  netWeightGrams: 120,
  sheetSize: { widthMm: 110, heightMm: 280 },
} as const

/** Shared by every scent — read off the box. */
export const productText = {
  tr: {
    name: 'VELMO Deterjan Yaprağı',
    fullName: 'VELMO Çamaşır Deterjanı Yaprağı',
    titleSuffix: 'Deterjan Yaprağı',
    category: 'Renkli çamaşırlar için',
    origin: 'Türkiye',
    dosage: [
      { load: '1–2 kg', label: 'Az çamaşır', amount: '½ yaprak', fraction: 0.5 },
      { load: '3–5 kg', label: 'Normal yıkama', amount: '1 yaprak', fraction: 1 },
    ],
    highlights: [
      { key: 'eco', title: 'Çevre dostu formül', text: 'Güçlü temizlik, hafif ve çevre dostu bir formda.' },
      { key: 'dissolve', title: 'Hızlı çözünür', text: 'Suyla temas edince hızla çözünür.' },
      { key: 'colour', title: 'Renkleri canlı tutar', text: 'Çamaşırlarınızı taze, canlı ve temiz tutar.' },
      { key: 'plastic', title: 'Plastik içermeyen ambalaj', text: 'Plastik şişe ya da bidon yok; daha az plastik atık.' },
    ],
    ingredients: [
      '%30 ve üzeri: Anyonik yüzey aktif maddeler',
      '%5–15: Noniyonik yüzey aktif maddeler',
      '%5’ten az: Enzimler, Parfüm',
      'Alpha-Isomethyl Ionone, Amyl Salicylate, Benzyl Benzoate, Coumarin, Cinnamyl Alcohol, Linalool, Rose Ketones, Tetramethyl Acetyloctahydronaphthalenes',
    ],
    warnings: [
      'Çocukların ulaşamayacağı yerde saklayın.',
      'Gözle temasından kaçının.',
      'Göze temas ederse bol suyla dikkatlice durulayın.',
      'Yutmayın.',
      'Elde yıkama için uygun değildir.',
    ],
  },
  en: {
    name: 'VELMO Detergent Sheets',
    fullName: 'VELMO Laundry Detergent Sheets',
    titleSuffix: 'Detergent Sheets',
    category: 'For coloured laundry',
    origin: 'Türkiye',
    dosage: [
      { load: '1–2 kg', label: 'Small load', amount: '½ sheet', fraction: 0.5 },
      { load: '3–5 kg', label: 'Normal load', amount: '1 sheet', fraction: 1 },
    ],
    highlights: [
      { key: 'eco', title: 'Eco-friendly formula', text: 'Powerful cleaning in a light, eco-friendly form.' },
      { key: 'dissolve', title: 'Dissolves quickly', text: 'Dissolves fast as soon as it meets water.' },
      { key: 'colour', title: 'Keeps colours bright', text: 'Keeps your laundry fresh, vibrant and clean.' },
      { key: 'plastic', title: 'Plastic-free packaging', text: 'No plastic bottles or jugs — less plastic waste.' },
    ],
    ingredients: [
      '>30%: Anionic surfactants',
      '5–15%: Non-ionic surfactants',
      '<5%: Enzymes, Perfume',
      'Alpha-Isomethyl Ionone, Amyl Salicylate, Benzyl Benzoate, Coumarin, Cinnamyl Alcohol, Linalool, Rose Ketones, Tetramethyl Acetyloctahydronaphthalenes',
    ],
    warnings: [
      'Keep out of reach of children.',
      'Avoid contact with eyes.',
      'If product gets into eyes, rinse thoroughly with water.',
      'Do not swallow.',
      'Not suitable for hand washing.',
    ],
  },
} satisfies Record<Locale, unknown>

export const products: Product[] = [
  {
    slug: 'lavanta',
    boxScent: 'LAVENDER',
    text: {
      tr: {
        scent: 'Lavanta',
        note: 'Uzun süre kalıcı ferahlık',
        description: 'Lavantanın sakin, temiz kokusu. Çamaşırlarınız makineden taze ve ferah çıkar, ferahlık uzun süre kalır.',
      },
      en: {
        scent: 'Lavender',
        note: 'Long-lasting freshness',
        description: 'The calm, clean scent of lavender. Your laundry comes out of the machine fresh, and the freshness lasts.',
      },
    },
    price: 29990,
    sku: 'VLM-30-LAV',
    inStock: true,
    photos: [],
  },
  {
    slug: 'bahar',
    boxScent: 'SPRING',
    text: {
      tr: {
        scent: 'Bahar',
        note: 'Beyaz çiçeklerin hafif kokusu',
        description: 'Beyaz çiçeklerin hafif ve aydınlık kokusu. Ağır gelmeyen, her gün kullanıma uygun temiz bir ferahlık.',
      },
      en: {
        scent: 'Spring',
        note: 'A light white-flower scent',
        description: 'The light, bright scent of white flowers. A clean freshness that never feels heavy — made for every day.',
      },
    },
    price: 29990,
    sku: 'VLM-30-SPR',
    inStock: true,
    photos: [],
  },
  {
    slug: 'narenciye',
    boxScent: 'CITRUS',
    text: {
      tr: {
        scent: 'Narenciye',
        note: 'Canlı portakal ferahlığı',
        description: 'Taze kesilmiş portakalın canlı, enerjik kokusu. Çamaşırlarınıza neşeli ve temiz bir koku bırakır.',
      },
      en: {
        scent: 'Citrus',
        note: 'Zesty orange freshness',
        description: 'The lively scent of freshly cut orange. Leaves your laundry smelling bright, cheerful and clean.',
      },
    },
    price: 29990,
    sku: 'VLM-30-CIT',
    inStock: true,
    photos: [],
  },
]

export function getProduct(slug: string) {
  return products.find((p) => p.slug === slug)
}

/** Price per wash, in kuruş. */
export function pricePerWash(p: Product) {
  return Math.round(p.price / productFacts.washes)
}

/** Unit price per kilogram, in kuruş — required on Turkish price labels. */
export function pricePerKg(p: Product) {
  return Math.round((p.price / productFacts.netWeightGrams) * 1000)
}

/** True when every scent costs the same — lets the copy say so. */
export const samePriceForAll = products.every((p) => p.price === products[0].price)
