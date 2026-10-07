import type { Metadata } from 'next'
import Link from 'next/link'

import { restaurant } from '@/data/yemek'

export const metadata: Metadata = { title: `Hakkımızda — ${restaurant.name}` }

export default function Hakkimizda() {
  return (
    <div className="container max-w-2xl py-12">
      <h1 className="font-display text-3xl font-extrabold text-marmara">Hakkımızda</h1>
      <p className="mt-4 text-lg text-ink-soft">
        {restaurant.name}, Merter&apos;de taze ve paketli kahvaltılık ürünleri evinize ve iş yerinize kadar getiren
        yerel bir işletmedir. Peynir, zeytin, tatlı, salata, sıcak ürün ve unlu mamüller; istediğiniz paket kadar
        seçin, biz hazırlayıp kuryemizle teslim edelim.
      </p>
      <ul className="mt-6 space-y-2 text-ink-soft">
        <li>✅ Minimum sipariş {restaurant.minOrder} ₺</li>
        <li>✅ Ödeme kapıda, nakit veya kartla</li>
        <li>✅ {restaurant.serviceArea}</li>
      </ul>
      <Link href="/" className="mt-8 inline-block rounded-full bg-marmara px-6 py-3 font-bold text-white">
        Ürünlere göz at
      </Link>
    </div>
  )
}
