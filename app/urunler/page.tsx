import type { Metadata } from 'next'

import { DosageGuide } from '@/components/product/DosageGuide'
import { ProductCard } from '@/components/product/ProductCard'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { productLine, products, samePriceForAll } from '@/data/products'

export const metadata: Metadata = {
  title: 'Ürünler',
  description: `VELMO çamaşır deterjanı yaprağı: Lavanta, Bahar ve Narenciye kokuları. Her kutuda ${productLine.sheets} yaprak, ${productLine.washes} yıkama.`,
  alternates: { canonical: '/urunler' },
}

export default function ProductsPage() {
  return (
    <div className="container pb-20 pt-6 lg:pb-28">
      <Breadcrumbs items={[{ label: 'Ana Sayfa', href: '/' }, { label: 'Ürünler' }]} />
      <header className="mt-8 max-w-2xl">
        <h1 className="font-display text-[clamp(2.5rem,5vw,3.75rem)] font-medium leading-[1.04] tracking-[-0.01em]">Deterjan Yaprağı</h1>
        <p className="mt-4 text-lg text-ink-soft">
          Renkli çamaşırlar için. Her kutuda {productLine.sheets} yaprak, yani {productLine.washes} yıkama var. Üç kokunun da kullanımı aynı
          {samePriceForAll ? ', fiyatı aynı' : ''}; yalnızca kokusu farklı.
        </p>
      </header>

      <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {products.map((p) => (
          <ProductCard key={p.slug} product={p} headingLevel="h2" />
        ))}
      </div>

      <section aria-labelledby="dozaj" className="mt-16 rounded-3xl bg-paper-cream p-6 sm:p-8">
        <h2 id="dozaj" className="font-display text-2xl font-medium">
          Kaç yaprak kullanmalıyım?
        </h2>
        <div className="mt-5">
          <DosageGuide />
        </div>
      </section>
    </div>
  )
}
