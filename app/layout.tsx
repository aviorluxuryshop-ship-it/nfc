import type { Metadata, Viewport } from 'next'
import { Figtree, Fraunces } from 'next/font/google'

import { CartDrawer } from '@/components/cart/CartDrawer'
import { CartProvider } from '@/components/cart/CartProvider'
import { ConsentProvider } from '@/components/cookies/ConsentProvider'
import { AnnouncementBar } from '@/components/layout/AnnouncementBar'
import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'
import { site } from '@/data/site'

import './globals.css'

// Fraunces (with its soft axis turned up) for headings: a warm serif that
// makes the store feel considered without tipping into luxury. Figtree for
// everything you read or tap — big x-height, very legible at 16px.
const fraunces = Fraunces({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-display',
  axes: ['SOFT', 'WONK', 'opsz'],
  display: 'swap',
})
const figtree = Figtree({ subsets: ['latin', 'latin-ext'], variable: '--font-sans', display: 'swap' })

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${site.title} — Bir yaprak, bir yıkama`, template: `%s | ${site.name}` },
  description: site.description,
  openGraph: { type: 'website', locale: site.locale, siteName: site.name },
}

export const viewport: Viewport = {
  themeColor: '#FCFBF8',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" className={`${fraunces.variable} ${figtree.variable}`}>
      <body className="flex min-h-dvh flex-col">
        <a href="#icerik" className="sr-only z-50 rounded-full bg-ink px-5 py-3 font-semibold text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4">
          İçeriğe geç
        </a>
        <ConsentProvider>
          <CartProvider>
            <AnnouncementBar />
            <Header />
            <main id="icerik" className="flex-1">
              {children}
            </main>
            <Footer />
            <CartDrawer />
          </CartProvider>
        </ConsentProvider>
      </body>
    </html>
  )
}
