'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronRight, Globe, Menu, ShoppingBag } from 'lucide-react'
import { useState } from 'react'

import { LogoLink } from '@/components/brand/Logo'
import { useCart } from '@/components/cart/CartProvider'
import { ScentEmblem } from '@/components/product/ScentArt'
import { Dialog } from '@/components/ui/Dialog'
import { company, isPlaceholder } from '@/data/company'
import { products } from '@/data/products'
import { switchPath } from '@/lib/i18n/config'
import { useI18n } from '@/lib/i18n/client'
import { scentTheme } from '@/lib/scents'

/**
 * Every control is labelled with a word, not only an icon: "Menü",
 * "Sepetim", "EN". Nobody should have to guess what a symbol means.
 */
export function Header() {
  const pathname = usePathname()
  const { locale, t, paths } = useI18n()
  const { count, openCart } = useCart()
  const [menuOpen, setMenuOpen] = useState(false)

  const nav = [
    { label: t.nav.items.products, href: paths.products },
    { label: t.nav.items.howTo, href: paths.howTo },
    { label: t.nav.items.faq, href: paths.faq },
    { label: t.nav.items.contact, href: paths.contact },
  ]
  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`)
  const otherLocale = locale === 'tr' ? 'en' : 'tr'
  // A plain <a>: the other language has its own root layout, so this is a
  // full page load by design.
  const switchHref = switchPath(pathname, otherLocale)

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-paper">
      <div className="container grid h-[4.5rem] grid-cols-[1fr_auto_1fr] items-center gap-4 lg:grid-cols-[auto_1fr_auto]">
        <div className="lg:hidden">
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            className="-ml-2 inline-flex h-11 items-center gap-2 rounded-full px-2.5 text-[0.9375rem] font-semibold transition hover:bg-ink/5"
            aria-haspopup="dialog"
          >
            <Menu className="h-6 w-6" aria-hidden="true" />
            <span>{t.nav.menu}</span>
          </button>
        </div>

        <LogoLink href={paths.home} label={t.nav.homeAria} />

        <nav aria-label={t.nav.label} className="hidden justify-center lg:flex">
          <ul className="flex items-center gap-1">
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive(item.href) ? 'page' : undefined}
                  className={`inline-flex h-11 items-center rounded-full px-4 text-[0.9375rem] font-semibold transition ${
                    isActive(item.href) ? 'bg-lavanta-soft text-lavanta-deep' : 'text-ink-soft hover:text-ink'
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center justify-end gap-2">
          <a
            href={switchHref}
            hrefLang={otherLocale}
            lang={otherLocale}
            aria-label={t.nav.switchAria}
            className="hidden h-11 items-center gap-1.5 rounded-full px-3 text-[0.9375rem] font-semibold text-ink-soft transition hover:bg-ink/5 hover:text-ink sm:inline-flex"
          >
            <Globe className="h-[1.1rem] w-[1.1rem]" aria-hidden="true" />
            {t.nav.switchShort}
          </a>
          <button
            type="button"
            onClick={openCart}
            aria-haspopup="dialog"
            className="-mr-1 inline-flex h-11 items-center gap-2 rounded-full border border-line-strong bg-white pl-3.5 pr-2 text-[0.9375rem] font-semibold transition hover:border-ink"
          >
            <ShoppingBag className="h-5 w-5" aria-hidden="true" />
            <span>
              <span className="sm:hidden">{t.nav.cartShort}</span>
              <span className="hidden sm:inline">{t.nav.cartLong}</span>
            </span>
            <span
              className={`inline-flex h-7 min-w-7 items-center justify-center rounded-full px-1.5 text-sm tabular-nums ${count > 0 ? 'bg-ink text-white' : 'bg-paper-cream text-ink-mute'}`}
            >
              <span className="sr-only">{t.nav.inCart} </span>
              {count}
              <span className="sr-only"> {t.nav.items_}</span>
            </span>
          </button>
        </div>
      </div>

      <Dialog open={menuOpen} onClose={() => setMenuOpen(false)} variant="menu" title={t.nav.menu} labelledBy="menu-title">
        <nav aria-label={t.nav.mobileLabel} className="px-3 py-3">
          <ul>
            {[{ label: t.common.home, href: paths.home }, ...nav].map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  aria-current={pathname === item.href ? 'page' : undefined}
                  className="flex items-center justify-between rounded-2xl px-3 py-3.5 text-lg font-semibold hover:bg-ink/5"
                >
                  {item.label} <ChevronRight className="h-5 w-5 text-ink-mute" aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>

          <p className="eyebrow mt-6 px-3">{t.nav.scents}</p>
          <ul className="mt-2 grid gap-2 px-1">
            {products.map((p) => (
              <li key={p.slug}>
                <Link
                  href={paths.product(p.slug)}
                  onClick={() => setMenuOpen(false)}
                  className={`flex items-center gap-3 rounded-2xl px-3 py-2.5 ${scentTheme[p.slug].panel}`}
                >
                  <ScentEmblem scent={p.slug} className="h-10 w-10" />
                  <span className="font-semibold">{p.text[locale].scent}</span>
                </Link>
              </li>
            ))}
          </ul>

          <a
            href={switchHref}
            hrefLang={otherLocale}
            lang={otherLocale}
            className="mx-1 mt-6 flex items-center gap-3 rounded-2xl border border-line px-3 py-3.5 font-semibold"
          >
            <Globe className="h-5 w-5" aria-hidden="true" />
            {t.nav.switchTo}
          </a>

          {!isPlaceholder(company.phone) && (
            <p className="mt-6 px-3 text-[0.9375rem] text-ink-soft">
              {t.nav.help}{' '}
              <a href={`tel:${company.phone.replace(/\s/g, '')}`} className="link">
                {company.phone}
              </a>
            </p>
          )}
        </nav>
      </Dialog>
    </header>
  )
}
