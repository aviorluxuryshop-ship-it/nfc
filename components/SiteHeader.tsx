'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import { ArrowRight, Search, ShoppingCart } from 'lucide-react'

import { restaurant } from '@/data/yemek'
import { tl } from '@/lib/format'

import { useCart } from './CartProvider'
import { Logo } from './Logo'

const links = [
  { href: '/urunler', label: 'Ürünler', match: '/urunler' },
  { href: '/hakkimizda', label: 'Hakkımızda', match: '/hakkimizda' },
  { href: '/iletisim', label: 'İletişim', match: '/iletisim' },
]

// Bilerek sticky değil: aşağı kaydırınca sayfayla birlikte kaybolur.
// Sepete erişim için sayfanın altında yüzen sepet butonu var.
export function SiteHeader() {
  const pathname = usePathname()
  const router = useRouter()
  const { count, subtotal, setOpen, query, setQuery } = useCart()

  // Arama her zaman "Tüm Ürünler" sayfasında sonuç gösterir; başka sayfaya geçilince temizlenir.
  const [prevPath, setPrevPath] = useState(pathname)
  if (pathname !== prevPath) {
    setPrevPath(pathname)
    if (pathname !== '/urunler') setQuery('')
  }

  const goAll = () => pathname !== '/urunler' && router.push('/urunler')
  const onSearch = (e: React.FormEvent) => {
    e.preventDefault()
    goAll()
  }

  const search = (cls: string) => (
    <form onSubmit={onSearch} role="search" className={cls}>
      <Search size={18} className="shrink-0 text-marmara" aria-hidden />
      <input
        value={query}
        onChange={(e) => {
          setQuery(e.target.value)
          if (e.target.value.trim()) goAll()
        }}
        type="search"
        enterKeyHint="search"
        placeholder="Ürün ara…"
        aria-label="Ürün ara"
        className="w-full bg-transparent text-base outline-none placeholder:text-ink-mute sm:text-sm"
      />
    </form>
  )

  return (
    <header className="bg-white">
      <div className="bg-marmara px-4 py-2 text-center text-xs font-semibold text-white sm:text-sm">
        <span className="sm:hidden">Merter · Min. {tl(restaurant.minOrder)} · Kapıda ödeme</span>
        <span className="hidden sm:inline">Sadece Merter civarına servis · Minimum sipariş {tl(restaurant.minOrder)} · Ödeme kapıda</span>
      </div>
      <div>
        <div className="container flex items-center justify-between gap-6 py-3 sm:py-4">
          <Link href="/" aria-label="Marmara Gıda Kahvaltı, ana sayfa">
            <Logo className="h-12 sm:h-16" />
          </Link>

          <nav className="hidden items-center gap-9 text-[0.95rem] font-semibold md:flex" aria-label="Ana menü">
            {links.map((l) => {
              const active = pathname === l.match || pathname.startsWith(`${l.match}/`)
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className={`border-b-2 py-2 transition ${active ? 'border-marmara text-marmara' : 'border-transparent hover:text-marmara'}`}
                >
                  {l.label}
                </Link>
              )
            })}
          </nav>

          {search('hidden w-72 items-center gap-2 rounded-full bg-paper-raised px-5 py-3 ring-1 ring-ink/10 focus-within:ring-2 focus-within:ring-marmara lg:flex')}

          <button
            onClick={() => setOpen(true)}
            className="flex items-center gap-4 rounded-xl bg-marmara px-4 py-2.5 text-left text-white shadow-soft transition hover:bg-marmara-dim"
            aria-label={`Sepetim, ${count} ürün, ${tl(subtotal)}`}
          >
            <span className="relative">
              <ShoppingCart size={26} aria-hidden />
              {count > 0 && (
                <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-white px-1 text-[0.7rem] font-extrabold text-marmara">
                  {count}
                </span>
              )}
            </span>
            <span className="hidden leading-tight sm:block">
              <span className="block text-xs font-semibold opacity-90">Sepetim</span>
              <span className="block text-base font-extrabold">{tl(subtotal)}</span>
            </span>
            <ArrowRight size={18} className="hidden sm:block" aria-hidden />
          </button>
        </div>

        <div className="container space-y-2 pb-4 lg:hidden">
          <nav className="flex justify-between text-sm font-semibold md:hidden" aria-label="Ana menü (mobil)">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`-mx-2 inline-flex min-h-10 items-center px-2 ${pathname === l.match || pathname.startsWith(`${l.match}/`) ? 'text-marmara' : ''}`}
              >
                {l.label}
              </Link>
            ))}
          </nav>
          {search('flex items-center gap-2 rounded-full bg-paper-raised px-4 py-3 ring-1 ring-ink/10 focus-within:ring-2 focus-within:ring-marmara')}
        </div>
      </div>
    </header>
  )
}
