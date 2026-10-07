import type { Metadata } from 'next'
import { Manrope, Playfair_Display } from 'next/font/google'

import { CartProvider } from '@/components/CartProvider'
import { CheckoutSheet } from '@/components/CheckoutSheet'
import { FloatingCart } from '@/components/FloatingCart'
import { Footer } from '@/components/Footer'
import { SiteHeader } from '@/components/SiteHeader'
import { restaurant } from '@/data/yemek'

import './globals.css'

const display = Playfair_Display({ subsets: ['latin', 'latin-ext'], variable: '--font-display', weight: ['600', '700', '800'], display: 'swap' })
const sans = Manrope({ subsets: ['latin', 'latin-ext'], variable: '--font-sans', display: 'swap' })

const siteUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : 'http://localhost:3000'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: `${restaurant.name} — Online Sipariş`, template: `%s — ${restaurant.name}` },
  description: `${restaurant.tagline} Peynir, zeytin, sıcak ürünler, tatlılar ve unlu mamüller; Merter'e kapıda ödemeli teslimat.`,
  openGraph: { type: 'website', title: restaurant.name, description: restaurant.tagline, images: ['/images/hero.webp'], locale: 'tr_TR' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" className={`${display.variable} ${sans.variable}`}>
      <body className="flex min-h-screen flex-col">
        <CartProvider>
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <Footer />
          <FloatingCart />
          <CheckoutSheet />
        </CartProvider>
      </body>
    </html>
  )
}
