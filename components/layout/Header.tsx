'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronRight, Menu, ShoppingBag } from 'lucide-react'
import { useState } from 'react'

import { LogoLink } from '@/components/brand/Logo'
import { useCart } from '@/components/cart/CartProvider'
import { ScentEmblem } from '@/components/product/ScentArt'
import { Dialog } from '@/components/ui/Dialog'
import { company, isPlaceholder } from '@/data/company'
import { products } from '@/data/products'
import { mainNav } from '@/data/site'
import { scentTheme } from '@/lib/scents'

/**
 * Every control is labelled with a word, not only an icon: "Menü",
 * "Sepetim". Nobody should have to guess what a symbol means.
 */
export function Header() {
  const pathname = usePathname()
  const { count, openCart } = useCart()
  const [menuOpen, setMenuOpen] = useState(false)

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`)

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
            <span>Menü</span>
          </button>
        </div>

        <LogoLink />

        <nav aria-label="Ana menü" className="hidden justify-center lg:flex">
          <ul className="flex items-center gap-1">
            {mainNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive(item.href) ? 'page' : undefined}
                  className={`inline-flex h-11 items-center rounded-full px-4 text-[0.9375rem] font-semibold transition ${
                    isActive(item.href) ? 'bg-paper-cream text-ink' : 'text-ink-soft hover:text-ink'
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={openCart}
            aria-haspopup="dialog"
            className="-mr-1 inline-flex h-11 items-center gap-2 rounded-full border border-line-strong bg-white pl-3.5 pr-2 text-[0.9375rem] font-semibold transition hover:border-ink"
          >
            <ShoppingBag className="h-5 w-5" aria-hidden="true" />
            <span>
              Sepet<span className="hidden sm:inline">im</span>
            </span>
            <span
              className={`inline-flex h-7 min-w-7 items-center justify-center rounded-full px-1.5 text-sm tabular-nums ${count > 0 ? 'bg-ink text-white' : 'bg-paper-cream text-ink-mute'}`}
            >
              <span className="sr-only">Sepette </span>
              {count}
              <span className="sr-only"> ürün</span>
            </span>
          </button>
        </div>
      </div>

      <Dialog open={menuOpen} onClose={() => setMenuOpen(false)} variant="menu" title="Menü" labelledBy="menu-title">
        <nav aria-label="Mobil menü" className="px-3 py-3">
          <ul>
            <li>
              <Link href="/" onClick={() => setMenuOpen(false)} className="flex items-center justify-between rounded-2xl px-3 py-3.5 text-lg font-semibold hover:bg-ink/5">
                Ana Sayfa <ChevronRight className="h-5 w-5 text-ink-mute" aria-hidden="true" />
              </Link>
            </li>
            {mainNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  aria-current={isActive(item.href) ? 'page' : undefined}
                  className="flex items-center justify-between rounded-2xl px-3 py-3.5 text-lg font-semibold hover:bg-ink/5"
                >
                  {item.label} <ChevronRight className="h-5 w-5 text-ink-mute" aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>

          <p className="eyebrow mt-6 px-3">Kokular</p>
          <ul className="mt-2 grid gap-2 px-1">
            {products.map((p) => (
              <li key={p.slug}>
                <Link
                  href={`/urunler/${p.slug}`}
                  onClick={() => setMenuOpen(false)}
                  className={`flex items-center gap-3 rounded-2xl px-3 py-2.5 ${scentTheme[p.slug].panel}`}
                >
                  <ScentEmblem scent={p.slug} className="h-10 w-10" />
                  <span className="font-semibold">{p.scent}</span>
                </Link>
              </li>
            ))}
          </ul>

          {!isPlaceholder(company.phone) && (
            <p className="mt-6 px-3 text-[0.9375rem] text-ink-soft">
              Yardım için: <a href={`tel:${company.phone.replace(/\s/g, '')}`} className="link">{company.phone}</a>
            </p>
          )}
        </nav>
      </Dialog>
    </header>
  )
}
