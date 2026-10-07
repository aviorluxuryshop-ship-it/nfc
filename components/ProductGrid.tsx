'use client'

import { SearchX } from 'lucide-react'

import { categories, menu } from '@/data/yemek'

import { useCart } from './CartProvider'
import { ProductCard } from './ProductCard'

const norm = (s: string) => s.toLocaleLowerCase('tr-TR')
const grid = 'grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4'

// category verilirse yalnızca o kategori; verilmezse kategorilere ayrılmış tüm ürünler.
export function ProductGrid({ category }: { category?: string }) {
  const { query, setQuery } = useCart()
  const q = norm(query.trim())

  const groups = categories
    .filter((c) => !category || c.slug === category)
    .map((c) => ({
      c,
      items: menu.filter((m) => m.category === c.slug && (!q || norm(m.name).includes(q) || norm(c.name).includes(q))),
    }))
    .filter((g) => g.items.length)

  if (!groups.length) {
    return (
      <div className="flex flex-col items-center gap-3 py-16 text-center">
        <SearchX size={40} className="text-marmara" />
        <p className="text-lg font-semibold">&ldquo;{query}&rdquo; için ürün bulunamadı.</p>
        <button onClick={() => setQuery('')} className="rounded-full bg-marmara px-6 py-3 font-bold text-white">
          Aramayı temizle
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-12">
      {groups.map(({ c, items }) => (
        <section key={c.slug} aria-labelledby={`g-${c.slug}`}>
          {!category && <h2 id={`g-${c.slug}`} className="mb-5 font-display text-2xl font-bold sm:text-3xl">{c.name}</h2>}
          <div className={grid}>
            {items.map((m) => (
              <ProductCard key={m.id} item={m} />
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
