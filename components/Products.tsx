'use client'

import { SearchX } from 'lucide-react'

import { categories, menu } from '@/data/yemek'

import { useCart } from './CartProvider'
import { ProductCard } from './ProductCard'
import { SectionTitle } from './SectionTitle'

const norm = (s: string) => s.toLocaleLowerCase('tr-TR')

export function Products() {
  const { query, setQuery } = useCart()
  const q = norm(query.trim())

  const groups = categories
    .map((c) => ({
      c,
      items: menu.filter((m) => m.category === c.slug && (!q || norm(m.name).includes(q) || norm(c.name).includes(q))),
    }))
    .filter((g) => g.items.length)

  return (
    <section id="urunler" className="scroll-mt-4 pb-20">
      <div className="container pt-4">
        <SectionTitle>Tüm Ürünler</SectionTitle>
        <p className="mt-3 max-w-xl text-ink-soft">İstediğin ürünü, istediğin paket kadar seç. Sepetini doldur, sipariş fişini oluştur.</p>
      </div>

      <div className="sticky top-0 z-20 mt-6 border-y border-ink/10 bg-white/90 backdrop-blur">
        <div className="container no-scrollbar flex gap-2 overflow-x-auto py-3">
          {categories.map((c) => (
            <a
              key={c.slug}
              href={`#kategori-${c.slug}`}
              className="whitespace-nowrap rounded-full border border-marmara/25 px-4 py-2 text-sm font-semibold text-marmara transition hover:bg-marmara hover:text-white"
            >
              {c.name}
            </a>
          ))}
        </div>
      </div>

      <div className="container mt-10 space-y-14">
        {groups.map(({ c, items }) => (
          <div key={c.slug} id={`kategori-${c.slug}`} className="scroll-mt-20">
            <h3 className="font-display text-2xl font-bold sm:text-3xl">{c.name}</h3>
            <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {items.map((m) => (
                <ProductCard key={m.id} item={m} />
              ))}
            </div>
          </div>
        ))}

        {!groups.length && (
          <div className="flex flex-col items-center gap-3 py-16 text-center">
            <SearchX size={40} className="text-marmara" />
            <p className="text-lg font-semibold">&ldquo;{query}&rdquo; için ürün bulunamadı.</p>
            <button onClick={() => setQuery('')} className="rounded-full bg-marmara px-6 py-3 font-bold text-white">
              Tüm ürünleri göster
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
