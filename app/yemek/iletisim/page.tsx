import type { Metadata } from 'next'

import { restaurant } from '@/data/yemek'

export const metadata: Metadata = { title: `İletişim — ${restaurant.name}` }

export default function Iletisim() {
  return (
    <div className="container max-w-2xl py-12">
      <h1 className="font-display text-3xl font-extrabold text-marmara">İletişim</h1>
      <dl className="mt-6 space-y-4 text-lg">
        <div><dt className="text-sm font-semibold text-ink-mute">Telefon</dt><dd><a className="font-bold" href={`tel:${restaurant.phoneDisplay.replace(/\s/g, '')}`}>{restaurant.phoneDisplay}</a></dd></div>
        <div><dt className="text-sm font-semibold text-ink-mute">Adres</dt><dd className="font-bold">{restaurant.address}</dd></div>
        <div><dt className="text-sm font-semibold text-ink-mute">Çalışma saatleri</dt><dd className="font-bold">{restaurant.hours}</dd></div>
        <div><dt className="text-sm font-semibold text-ink-mute">Servis bölgesi</dt><dd>{restaurant.serviceArea}</dd></div>
      </dl>
    </div>
  )
}
