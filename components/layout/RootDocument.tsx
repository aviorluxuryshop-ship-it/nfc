import type { Viewport } from 'next'

import { CartDrawer } from '@/components/cart/CartDrawer'
import { CartProvider } from '@/components/cart/CartProvider'
import { ConsentProvider } from '@/components/cookies/ConsentProvider'
import { AnnouncementBar } from '@/components/layout/AnnouncementBar'
import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'
import { fontVariables } from '@/lib/fonts'
import { htmlLang, type Locale } from '@/lib/i18n/config'
import { I18nProvider } from '@/lib/i18n/client'
import { getI18n } from '@/lib/i18n'

export const viewport: Viewport = {
  themeColor: '#FCFBF8',
}

/**
 * The <html> shell both language trees share. Each language has its own
 * root layout (so <html lang> is right and switching language is a clean
 * page load), and both render this.
 */
export function RootDocument({ locale, children }: { locale: Locale; children: React.ReactNode }) {
  const { t } = getI18n(locale)
  return (
    <html lang={htmlLang[locale]} className={fontVariables}>
      <body className="flex min-h-dvh flex-col">
        <a href="#icerik" className="sr-only z-50 rounded-full bg-ink px-5 py-3 font-semibold text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4">
          {t.common.skipToContent}
        </a>
        <I18nProvider locale={locale}>
          <ConsentProvider>
            <CartProvider>
              <AnnouncementBar locale={locale} />
              <Header />
              <main id="icerik" className="flex-1">
                {children}
              </main>
              <Footer locale={locale} />
              <CartDrawer />
            </CartProvider>
          </ConsentProvider>
        </I18nProvider>
      </body>
    </html>
  )
}
