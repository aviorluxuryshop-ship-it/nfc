import type { Metadata } from 'next'
import Link from 'next/link'
import { Clock, MapPin, Phone, Truck } from 'lucide-react'

import { SectionTitle } from '@/components/SectionTitle'
import { restaurant } from '@/data/yemek'

export const metadata: Metadata = { title: 'İletişim' }

export default function Iletisim() {
  const tel = restaurant.phoneDisplay.replace(/\s/g, '')
  const items = [
    { icon: Phone, label: 'Telefon', value: restaurant.phoneDisplay, href: `tel:${tel}` },
    { icon: MapPin, label: 'Adres', value: restaurant.address },
    { icon: Clock, label: 'Çalışma saatleri', value: restaurant.hours },
    { icon: Truck, label: 'Servis bölgesi', value: restaurant.serviceArea },
  ]
  return (
    <section className="container max-w-4xl py-14 lg:py-20">
      <SectionTitle>İletişim</SectionTitle>
      <p className="mt-5 max-w-xl text-lg text-ink-soft">Sorun, önerin ya da özel isteğin varsa bize ulaş. Sipariş vermek için ürünler sayfasını kullanabilirsin.</p>
      <ul className="mt-10 grid gap-5 sm:grid-cols-2">
        {items.map(({ icon: Icon, label, value, href }) => (
          <li key={label} className="flex gap-4 rounded-2xl bg-white p-6 shadow-soft ring-1 ring-ink/10">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-marmara-50 text-marmara"><Icon size={22} /></span>
            <div>
              <p className="text-sm font-semibold text-ink-mute">{label}</p>
              {href ? <a href={href} className="text-lg font-bold hover:text-marmara">{value}</a> : <p className="font-semibold">{value}</p>}
            </div>
          </li>
        ))}
      </ul>
      <Link href="/#urunler" className="mt-10 inline-block rounded-xl bg-marmara px-7 py-4 font-bold text-white shadow-card transition hover:bg-marmara-dim">Sipariş ver</Link>
    </section>
  )
}
