/**
 * VELMO Çamaşır Deterjanı Yaprağı — one product, three scents. Every
 * scent is its own page and cart line so the customer always sees exactly
 * which scent they are buying.
 *
 * Facts (sheet count, weight, size, dosage, ingredients, warnings) are
 * transcribed from the packaging. Prices are EXAMPLE values (ÖRNEK) —
 * replace them with the real ones.
 */

export type ScentSlug = 'lavanta' | 'bahar' | 'narenciye'

export type Product = {
  slug: ScentSlug
  /** Scent name as the customer reads it. */
  scent: string
  /** Scent name as printed on the box. */
  boxScent: string
  /** One-line description of the smell. */
  note: string
  description: string
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

/** Shared by every scent — read off the box. */
export const productLine = {
  name: 'VELMO Deterjan Yaprağı',
  fullName: 'VELMO Çamaşır Deterjanı Yaprağı',
  category: 'Renkli çamaşırlar için',
  sheets: 30,
  washes: 30,
  netWeightGrams: 120,
  sheetSize: { widthMm: 110, heightMm: 280 },
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
} as const

export const products: Product[] = [
  {
    slug: 'lavanta',
    scent: 'Lavanta',
    boxScent: 'LAVENDER',
    note: 'Uzun süre kalıcı ferahlık',
    description:
      'Lavantanın sakin, temiz kokusu. Çamaşırlarınız makineden taze ve ferah çıkar, ferahlık uzun süre kalır.',
    price: 29990,
    sku: 'VLM-30-LAV',
    inStock: true,
    photos: [],
  },
  {
    slug: 'bahar',
    scent: 'Bahar',
    boxScent: 'SPRING',
    note: 'Beyaz çiçeklerin hafif kokusu',
    description:
      'Beyaz çiçeklerin hafif ve aydınlık kokusu. Ağır gelmeyen, her gün kullanıma uygun temiz bir ferahlık.',
    price: 29990,
    sku: 'VLM-30-SPR',
    inStock: true,
    photos: [],
  },
  {
    slug: 'narenciye',
    scent: 'Narenciye',
    boxScent: 'CITRUS',
    note: 'Canlı portakal ferahlığı',
    description:
      'Taze kesilmiş portakalın canlı, enerjik kokusu. Çamaşırlarınıza neşeli ve temiz bir koku bırakır.',
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
  return Math.round(p.price / productLine.washes)
}

/** Unit price per kilogram, in kuruş — required on Turkish price labels. */
export function pricePerKg(p: Product) {
  return Math.round((p.price / productLine.netWeightGrams) * 1000)
}

/** True when every scent costs the same — lets the copy say so. */
export const samePriceForAll = products.every((p) => p.price === products[0].price)
