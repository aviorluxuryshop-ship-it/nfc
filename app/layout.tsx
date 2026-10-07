import type { Metadata } from 'next'
import { Manrope, Playfair_Display } from 'next/font/google'

import { CartProvider } from '@/components/CartProvider'
import { CartSheet } from '@/components/CartSheet'
import { CartSpacer, FloatingCart } from '@/components/FloatingCart'
import { Footer } from '@/components/Footer'
import { SiteHeader } from '@/components/SiteHeader'
import { restaurant } from '@/data/yemek'
import { siteUrl } from '@/lib/site'

import './globals.css'

const display = Playfair_Display({ subsets: ['latin', 'latin-ext'], variable: '--font-display', weight: ['600', '700', '800'], display: 'swap' })
const sans = Manrope({ subsets: ['latin', 'latin-ext'], variable: '--font-sans', display: 'swap' })

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: `Merter Kahvaltı Siparişi — ${restaurant.name}`, template: `%s — ${restaurant.name}` },
  description: `${restaurant.tagline} Peynir, zeytin, sıcak ürünler, tatlılar ve unlu mamüller; Merter ve Güngören'e kapıda ödemeli teslimat.`,
  alternates: { canonical: './' },
  openGraph: { type: 'website', siteName: restaurant.name, title: `Merter Kahvaltı Siparişi — ${restaurant.name}`, description: restaurant.tagline, locale: 'tr_TR' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" data-scroll-behavior="smooth" className={`${display.variable} ${sans.variable}`}>
      <body className="flex min-h-screen flex-col">
        <a href="#icerik" className="sr-only z-[60] rounded-b-lg bg-marmara px-4 py-3 font-bold text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-0">
          İçeriğe geç
        </a>
        <CartProvider>
          <SiteHeader />
          <main id="icerik" tabIndex={-1} className="flex-1 outline-none">{children}</main>
          <Footer />
          <CartSpacer />
          <FloatingCart />
          <CartSheet />
        </CartProvider>
      </body>
    </html>
  )
}
