import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { Banknote, Leaf, Truck } from 'lucide-react'

import { SectionTitle } from '@/components/SectionTitle'
import { restaurant } from '@/data/yemek'

export const metadata: Metadata = {
  title: 'Hakkımızda',
  description: 'Marmara Gıda Kahvaltı, Merter ve Güngören\'de aile sofraları için taze kahvaltılık ürünleri kapıya getirir.',
}

const values = [
  { icon: Leaf, title: 'Taze ürün', text: 'Peynirden zeytine, unlu mamüllerden sıcak ürünlere kadar her şey taze ve özenle hazırlanır.' },
  { icon: Truck, title: 'Kapına kadar', text: 'Siparişin hazırlanır, kuryemizle Merter ve çevresinde kapına getirilir.' },
  { icon: Banknote, title: 'Kapıda ödeme', text: 'Online ödeme yok. Siparişini teslim alırken nakit ya da kredi/banka kartıyla kapıda ödersin.' },
]

export default function Hakkimizda() {
  return (
    <>
      <section className="container grid items-center gap-10 py-14 lg:grid-cols-2 lg:py-20">
        <div>
          <SectionTitle as="h1">Hakkımızda</SectionTitle>
          <p className="mt-6 text-lg leading-relaxed text-ink-soft">
            {restaurant.name}, Merter&apos;de aile sofralarının kahvaltı ihtiyacını tek adreste karşılar. İstediğin ürünü, istediğin paket kadar seçersin; biz hazırlar, kuryemizle kapına getiririz.
          </p>
          <p className="mt-4 text-lg leading-relaxed text-ink-soft">
            Amacımız basit: sabah sofrası kolay, taze ve güvenilir olsun. Kalabalık bir kahvaltı da olsa, küçük bir atıştırmalık da olsa birkaç dokunuşla siparişin hazır.
          </p>
          <Link href="/urunler" className="mt-8 inline-block rounded-xl bg-marmara px-7 py-4 font-bold text-white shadow-card transition hover:bg-marmara-dim">
            Ürünlere göz at
          </Link>
        </div>
        <div className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-card">
          <Image src="/images/hakkimizda.webp" alt="Kahvaltı sofrası" fill sizes="(min-width:1024px) 50vw, 100vw" className="object-cover" />
        </div>
      </section>

      <section className="bg-marmara-50/60 py-14">
        <ul className="container grid gap-5 md:grid-cols-3">
          {values.map(({ icon: Icon, title, text }) => (
            <li key={title} className="rounded-2xl bg-white p-7 shadow-soft ring-1 ring-ink/5">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-marmara-50 text-marmara"><Icon size={22} /></span>
              <h3 className="mt-5 font-display text-xl font-bold">{title}</h3>
              <p className="mt-2 text-ink-soft">{text}</p>
            </li>
          ))}
        </ul>
      </section>
    </>
  )
}
