import type { Metadata } from 'next'
import { Manrope, Sora } from 'next/font/google'
import Link from 'next/link'

import { restaurant } from '@/data/yemek'

import './globals.css'

const sora = Sora({ subsets: ['latin'], variable: '--font-display', weight: ['600', '700', '800'], display: 'swap' })
const manrope = Manrope({ subsets: ['latin'], variable: '--font-sans', display: 'swap' })

const siteUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : 'http://localhost:3000'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: `${restaurant.name} — Online Sipariş`, template: `%s — ${restaurant.name}` },
  description: restaurant.tagline,
}

const links = [
  { href: '/', label: 'Ürünler' },
  { href: '/hakkimizda', label: 'Hakkımızda' },
  { href: '/iletisim', label: 'İletişim' },
]

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" className={`${sora.variable} ${manrope.variable}`}>
      <body>
        <div className="bg-marmara px-4 py-2 text-center text-xs font-semibold text-white sm:text-sm">
          Sadece Merter civarına servis · Minimum sipariş {restaurant.minOrder} ₺ · Ödeme kapıda
        </div>
        <header className="sticky top-0 z-20 border-b border-ink/10 bg-white/95 backdrop-blur">
          <div className="container flex items-center justify-between gap-4 py-3">
            <Link href="/" className="font-display text-lg font-extrabold leading-tight text-marmara sm:text-xl">
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
        <main>{children}</main>
      </body>
    </html>
  )
}
