import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Clock, MapPin, Phone } from 'lucide-react'

import { SectionTitle } from '@/components/SectionTitle'
import { neighborhoods, restaurant } from '@/data/yemek'
import { tl } from '@/lib/format'

export const metadata: Metadata = {
  title: 'İletişim',
  description: 'Marmara Gıda Kahvaltı telefon, adres ve çalışma saatleri. Merter ve Güngören\'e kapıda ödemeli teslimat.',
}

export default function Iletisim() {
  const tel = restaurant.phoneDisplay.replace(/\s/g, '')
  const items = [
    { icon: Phone, label: 'Telefon', value: restaurant.phoneDisplay, href: `tel:${tel}` },
    { icon: MapPin, label: 'Adres', value: restaurant.address },
    { icon: Clock, label: 'Çalışma saatleri', value: restaurant.hours },
  ]
  return (
    <section className="container py-14 lg:py-20">
      <SectionTitle as="h1">İletişim</SectionTitle>
      <p className="mt-5 max-w-xl text-lg text-ink-soft">Sorun, önerin ya da özel isteğin varsa bize ulaş. Sipariş vermek için ürünler sayfasını kullanabilirsin.</p>

      <div className="mt-10 grid items-start gap-6 lg:grid-cols-2">
        <ul className="space-y-4">
          {items.map(({ icon: Icon, label, value, href }) => (
            <li key={label} className="flex items-center gap-4 rounded-2xl bg-white p-6 shadow-soft ring-1 ring-ink/10">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-marmara-50 text-marmara"><Icon size={22} aria-hidden /></span>
              <div>
                <p className="text-sm font-semibold text-ink-mute">{label}</p>
                {href ? <a href={href} className="text-lg font-bold hover:text-marmara">{value}</a> : <p className="text-lg font-bold">{value}</p>}
              </div>
            </li>
          ))}
        </ul>

        <div className="rounded-3xl bg-marmara p-8 text-white shadow-card">
          <h2 className="font-display text-2xl font-bold">Servis bölgemiz</h2>
          <p className="mt-3 text-white/85">Sadece Merter civarına, Güngören&apos;deki şu mahallelere teslimat yapıyoruz:</p>
          <ul className="mt-5 space-y-2.5">
            {neighborhoods.map((n) => (
              <li key={n.name} className="flex items-center gap-3 rounded-xl bg-white/10 px-4 py-3 font-semibold ring-1 ring-white/20">
                <MapPin size={18} aria-hidden /> {n.name} Mahallesi
              </li>
            ))}
          </ul>
          <p className="mt-5 text-sm text-white/85">Minimum sipariş {tl(restaurant.minOrder)} · Ödeme kapıda</p>
          <Link href="/urunler" className="mt-6 inline-flex items-center gap-3 rounded-xl bg-white px-7 py-4 font-bold text-marmara transition hover:bg-marmara-50">
            Sipariş ver <ArrowRight size={20} aria-hidden />
          </Link>
        </div>
      </div>
    </section>
  )
}
