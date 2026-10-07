import Link from 'next/link'

import { restaurant } from '@/data/yemek'

const links = [
  { href: '/yemek', label: 'Ürünler' },
  { href: '/yemek/hakkimizda', label: 'Hakkımızda' },
  { href: '/yemek/iletisim', label: 'İletişim' },
]

export default function YemekLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white">
      <div className="bg-marmara px-4 py-2 text-center text-xs font-semibold text-white sm:text-sm">
        Sadece Merter civarına servis · Minimum sipariş {restaurant.minOrder} ₺ · Ödeme kapıda
      </div>
      <header className="sticky top-0 z-20 border-b border-ink/10 bg-white/95 backdrop-blur">
        <div className="container flex items-center justify-between gap-4 py-3">
          <Link href="/yemek" className="font-display text-lg font-extrabold leading-tight text-marmara sm:text-xl">
            {restaurant.name}
          </Link>
          <nav className="flex gap-4 text-sm font-semibold text-ink sm:gap-6">
            {links.map((l) => (
              <Link key={l.href} href={l.href} className="hover:text-marmara">
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      {children}
    </div>
  )
}
