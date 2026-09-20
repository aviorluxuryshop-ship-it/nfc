import type { Metadata } from 'next'

import { ProductGridCard } from '@/components/ProductGridCard'
import { Reveal } from '@/components/Reveal'
import { products } from '@/data/products'
import { siteConfig } from '@/data/site'

export const metadata: Metadata = {
  title: 'Ürün Kataloğu',
  description: `${siteConfig.name} ürün kataloğu: Google Değerlendirme Kartı ve Instagram Takip Kartı, boyutları, fiyatları ve renk seçenekleri.`,
  alternates: { canonical: '/katalog' },
}

export default function CatalogPage() {
  return (
    <section className="bg-paper px-5 pb-20 pt-28 sm:pt-32">
      <div className="container">
        <Reveal>
          <h1 className="font-display text-3xl font-semibold text-ink sm:text-4xl">Ürün Kataloğu</h1>
          <p className="mt-3 max-w-xl text-ink-mute">
            Tüm kartlarımız aynı teknolojiyi taşır: telefon yaklaştırınca açılan bir NFC çip. Aradaki fark yüzey, renk
            ve yönlendirdiği platform.
          </p>
        </Reveal>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product, i) => (
            <Reveal key={product.slug} delay={i * 80}>
              <ProductGridCard product={product} />
            </Reveal>
          ))}
        </div>

        <p className="mt-10 text-sm text-ink-mute">
          Sipariş, fiyat ve teslimat detayları için bizimle iletişime geç — satışımız yerinde yapılır, kargo yoktur.
        </p>
      </div>
    </section>
  )
}
