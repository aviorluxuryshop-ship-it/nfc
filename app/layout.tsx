import type { Metadata } from 'next'
import { Manrope, Sora } from 'next/font/google'

import { Header } from '@/components/Header'
import { siteConfig } from '@/data/site'

import './globals.css'

// Sora for headings — geometric and a little more distinctive than the
// default system stack, without tipping into novelty. Manrope for body
// copy: warmer and slightly more characterful than Inter at small sizes.
const sora = Sora({ subsets: ['latin'], variable: '--font-display', weight: ['600', '700', '800'], display: 'swap' })
const manrope = Manrope({ subsets: ['latin'], variable: '--font-sans', display: 'swap' })

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: { default: `${siteConfig.name} — ${siteConfig.tagline}`, template: `%s — ${siteConfig.name}` },
  description: siteConfig.description,
  openGraph: {
    type: 'website',
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
  },
  twitter: {
    card: 'summary_large_image',
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" className={`${sora.variable} ${manrope.variable}`}>
      <body>
        <Header />
        <main>{children}</main>
      </body>
    </html>
  )
}
