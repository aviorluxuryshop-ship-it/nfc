'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef } from 'react'
import { ArrowRight } from 'lucide-react'

import { categories } from '@/data/yemek'

import { CategoryIcon } from './CategoryIcon'

const items = [{ slug: 'tumu', name: 'Tüm Ürünler', href: '/urunler' }, ...categories.map((c) => ({ slug: c.slug, name: c.name, href: `/urunler/${c.slug}` }))]

export function CategorySidebar() {
  const pathname = usePathname()
  const chips = useRef<HTMLElement>(null)

  // Mobilde aktif kategori çipini görünür alana ortala.
  useEffect(() => {
    const nav = chips.current
    const el = nav?.querySelector<HTMLElement>('[aria-current="page"]')
    if (nav && el) nav.scrollTo({ left: el.offsetLeft - (nav.clientWidth - el.offsetWidth) / 2 })
  }, [pathname])

  return (
    <>
      {/* Masaüstü: sol menü */}
      <nav aria-label="Kategoriler" className="hidden lg:sticky lg:top-6 lg:block lg:self-start">
        <ul className="space-y-2.5">
          {items.map((i) => {
            const active = pathname === i.href
            return (
              <li key={i.slug}>
                <Link
                  href={i.href}
                  aria-current={active ? 'page' : undefined}
                  className={`flex items-center gap-4 rounded-2xl px-5 py-4 font-semibold transition ${active ? 'bg-marmara text-white shadow-card' : 'bg-paper-raised text-ink hover:bg-marmara-50 hover:text-marmara'}`}
                >
                  <CategoryIcon slug={i.slug} size={26} />
                  <span className="flex-1">{i.name}</span>
                  {active && <ArrowRight size={18} />}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Mobil: yatay kaydırmalı butonlar */}
      <nav ref={chips} aria-label="Kategoriler (mobil)" className="no-scrollbar relative -mx-5 flex gap-2 overflow-x-auto px-5 pb-2 lg:hidden">
        {items.map((i) => {
          const active = pathname === i.href
          return (
            <Link
              key={i.slug}
              href={i.href}
              aria-current={active ? 'page' : undefined}
              className={`flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full px-4 py-2.5 text-sm font-semibold transition ${active ? 'bg-marmara text-white' : 'bg-paper-raised text-ink ring-1 ring-ink/5'}`}
            >
              <CategoryIcon slug={i.slug} size={16} />
              {i.name}
            </Link>
          )
        })}
      </nav>
    </>
  )
}
