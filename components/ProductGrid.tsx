'use client'

import { SearchX } from 'lucide-react'

import { categories, menu } from '@/data/yemek'
import { fold } from '@/lib/format'

import { useCart } from './CartProvider'
import { ProductCard } from './ProductCard'

const grid = 'grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4'

// category verilirse yalnızca o kategori; verilmezse kategorilere ayrılmış tüm ürünler.
// Arama her zaman tüm ürünlerde yapılır (kategori sayfasındayken de).
export function ProductGrid({ category }: { category?: string }) {
  const { query, setQuery } = useCart()
  const q = fold(query.trim())
  const scoped = q ? undefined : category

  const groups = categories
    .filter((c) => !scoped || c.slug === scoped)
    .map((c) => ({
      c,
      items: menu.filter((m) => m.category === c.slug && (!q || fold(m.name).includes(q) || fold(c.name).includes(q))),
    }))
    .filter((g) => g.items.length)

  if (!groups.length) {
    return (
      <div className="flex flex-col items-center gap-3 py-16 text-center" role="status">
        <SearchX size={40} className="text-marmara" aria-hidden />
        <p className="text-lg font-semibold">&ldquo;{query}&rdquo; için ürün bulunamadı.</p>
        <button onClick={() => setQuery('')} className="rounded-full bg-marmara px-6 py-3 font-bold text-white">
          Aramayı temizle
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-12">
      {q && (
        <p className="-mb-6 text-sm font-semibold text-ink-soft" role="status">
          &ldquo;{query.trim()}&rdquo; için {groups.reduce((n, g) => n + g.items.length, 0)} ürün
        </p>
      )}
      {groups.map(({ c, items }, gi) => (
        <section key={c.slug} aria-labelledby={`g-${c.slug}`}>
          {!scoped && <h2 id={`g-${c.slug}`} className="mb-5 font-display text-2xl font-bold sm:text-3xl">{c.name}</h2>}
          <div className={grid}>
            {items.map((m, i) => (
              // Kategori sayfasında ürün adları h2, listede h3 (başlık sırası bozulmasın).
              <ProductCard key={m.id} item={m} level={scoped ? 2 : 3} priority={gi === 0 && i < 4} />
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
