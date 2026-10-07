import Link from 'next/link'

import { restaurant } from '@/data/yemek'

import { Logo } from './Logo'

export function Footer() {
  return (
    <footer className="border-t border-ink/10 bg-white">
      <div className="container grid gap-10 py-12 md:grid-cols-[1.2fr_1fr_1fr]">
        <div>
          <Logo className="h-14" />
          <p className="mt-5 max-w-xs text-sm text-ink-soft">{restaurant.tagline} Merter&apos;e kapıda ödemeli teslimat.</p>
        </div>
        <nav aria-label="Alt menü" className="space-y-2 text-sm font-semibold">
          <p className="mb-3 font-display text-lg font-bold">Sayfalar</p>
          <Link href="/urunler" className="block hover:text-marmara">Ürünler</Link>
          <Link href="/hakkimizda" className="block hover:text-marmara">Hakkımızda</Link>
          <Link href="/iletisim" className="block hover:text-marmara">İletişim</Link>
        </nav>
        <div className="space-y-2 text-sm">
          <p className="mb-3 font-display text-lg font-bold">İletişim</p>
          <a href={`tel:${restaurant.phoneDisplay.replace(/\s/g, '')}`} className="block font-semibold hover:text-marmara">{restaurant.phoneDisplay}</a>
          <p className="text-ink-soft">{restaurant.address}</p>
          <p className="text-ink-soft">{restaurant.hours}</p>
        </div>
      </div>
      <div className="border-t border-ink/10 py-4 text-center text-xs text-ink-mute">© {new Date().getFullYear()} {restaurant.name}</div>
    </footer>
  )
}
