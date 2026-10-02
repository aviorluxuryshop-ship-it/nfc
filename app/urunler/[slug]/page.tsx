import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { AlertTriangle, Clock, RotateCcw, ShieldCheck, Truck } from 'lucide-react'

import { BuyBox } from '@/components/product/BuyBox'
import { DosageGuide } from '@/components/product/DosageGuide'
import { Highlights } from '@/components/product/Highlights'
import { ProductCard } from '@/components/product/ProductCard'
import { ProductGallery } from '@/components/product/ProductGallery'
import { UsageSteps } from '@/components/product/UsageSteps'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { legalHref } from '@/data/legal'
import { getProduct, productLine, products } from '@/data/products'
import { site } from '@/data/site'
import { formatPrice } from '@/lib/format'
import { scentTheme } from '@/lib/scents'

export const dynamicParams = false

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const product = getProduct(slug)
  if (!product) return {}
  const title = `${product.scent} Deterjan Yaprağı — ${productLine.sheets} Yaprak`
  const description = `VELMO ${product.scent} kokulu çamaşır deterjanı yaprağı. ${productLine.sheets} yaprak, ${productLine.washes} yıkama, ${productLine.netWeightGrams} g. Renkli çamaşırlar için. ${formatPrice(product.price)}.`
  return { title, description, alternates: { canonical: `/urunler/${product.slug}` }, openGraph: { title, description } }
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const product = getProduct(slug)
  if (!product) notFound()

  const theme = scentTheme[product.slug]
  const others = products.filter((p) => p.slug !== product.slug)
  const { commerce } = site

  const facts: [string, string][] = [
    ['Ürün', productLine.fullName],
    ['Koku', product.scent],
    ['İçerik', `${productLine.sheets} yaprak (${productLine.washes} yıkama)`],
    ['Net ağırlık', `${productLine.netWeightGrams} g`],
    ['Yaprak ölçüsü', '11 × 28 cm'],
    ['Kullanım', 'Renkli çamaşırlar, çamaşır makinesi'],
    ['Üretim yeri', productLine.origin],
    ['Stok kodu', product.sku],
  ]

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: `${productLine.fullName} — ${product.scent}`,
    description: product.description,
    sku: product.sku,
    brand: { '@type': 'Brand', name: 'VELMO' },
    weight: { '@type': 'QuantitativeValue', value: productLine.netWeightGrams, unitCode: 'GRM' },
    offers: {
      '@type': 'Offer',
      url: `${site.url}/urunler/${product.slug}`,
      priceCurrency: 'TRY',
      price: (product.price / 100).toFixed(2),
      availability: product.inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
    },
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="container pb-16 pt-6 lg:pb-24">
        <Breadcrumbs items={[{ label: 'Ana Sayfa', href: '/' }, { label: 'Ürünler', href: '/urunler' }, { label: product.scent }]} />

        <div className="mt-6 grid gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <ProductGallery product={product} />
          </div>

          <div>
            <p className="text-[0.9375rem] font-semibold text-ink-mute">{productLine.fullName}</p>
            <h1 className="mt-2 font-display text-[clamp(2.5rem,5vw,3.5rem)] font-medium leading-[1.02] tracking-[-0.01em]">
              <span className={theme.text}>{product.scent}</span>
              <span className="mt-1 block text-[0.55em] text-ink">Deterjan Yaprağı</span>
            </h1>
            <p className="mt-4 text-lg text-ink-soft">{product.description}</p>

            <ul className="mt-6 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
              {[
                [`${productLine.sheets}`, 'yaprak'],
                [`${productLine.washes}`, 'yıkama'],
                [`${productLine.netWeightGrams} g`, 'net ağırlık'],
                ['Renkli', 'çamaşırlar için'],
              ].map(([big, small]) => (
                <li key={small} className="rounded-2xl bg-paper-cream px-4 py-3.5">
                  <span className="block text-xl font-bold">{big}</span>
                  <span className="text-sm text-ink-soft">{small}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8">
              <BuyBox product={product} />
            </div>

            <ul className="mt-8 divide-y divide-line rounded-2xl border border-line bg-white text-[0.9375rem]">
              <li className="flex gap-3 px-5 py-4">
                <Clock className="mt-0.5 h-5 w-5 shrink-0 text-ink-soft" aria-hidden="true" />
                <span>
                  <strong className="font-semibold">{commerce.dispatchDays} iş günü içinde</strong> kargoya verilir.
                </span>
              </li>
              <li className="flex gap-3 px-5 py-4">
                <Truck className="mt-0.5 h-5 w-5 shrink-0 text-ink-soft" aria-hidden="true" />
                <span>
                  <strong className="font-semibold">{formatPrice(commerce.freeShippingThreshold)}</strong> ve üzeri siparişlerde kargo ücretsiz. Altında{' '}
                  {formatPrice(commerce.shippingFee)}.
                </span>
              </li>
              <li className="flex gap-3 px-5 py-4">
                <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-ink-soft" aria-hidden="true" />
                <span>Kredi kartı, banka kartı ya da Havale / EFT ile güvenli ödeme.</span>
              </li>
              <li className="flex gap-3 px-5 py-4">
                <RotateCcw className="mt-0.5 h-5 w-5 shrink-0 text-ink-soft" aria-hidden="true" />
                <span>
                  Ambalajı açılmamış ürünlerde 14 gün içinde iade.{' '}
                  <Link href={legalHref('iptal-ve-iade')} className="link font-medium">
                    İade koşulları
                  </Link>
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Details */}
      <section aria-labelledby="kullanim" className="border-t border-line bg-paper-cream py-16 lg:py-24">
        <div className="container">
          <h2 id="kullanim" className="font-display text-[clamp(1.875rem,3.5vw,2.5rem)] font-medium">
            Nasıl kullanılır?
          </h2>
          <div className="mt-8">
            <UsageSteps accent={theme.hex.main} />
          </div>
          <div className="mt-6">
            <DosageGuide />
          </div>
        </div>
      </section>

      <section aria-labelledby="bilgiler" className="py-16 lg:py-24">
        <div className="container grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <h2 id="bilgiler" className="font-display text-[clamp(1.875rem,3.5vw,2.5rem)] font-medium">
              Ürün bilgileri
            </h2>
            <dl className="mt-6 divide-y divide-line rounded-2xl border border-line bg-white">
              {facts.map(([k, v]) => (
                <div key={k} className="grid grid-cols-[9rem_1fr] gap-4 px-5 py-3.5 text-[0.9375rem] sm:grid-cols-[11rem_1fr]">
                  <dt className="text-ink-mute">{k}</dt>
                  <dd className="font-medium">{v}</dd>
                </div>
              ))}
            </dl>

            <h3 className="mt-10 text-xl font-semibold">Öne çıkanlar</h3>
            <div className="mt-4">
              <Highlights variant="grid" />
            </div>
          </div>

          <div className="space-y-10">
            <div>
              <h2 className="font-display text-[clamp(1.875rem,3.5vw,2.5rem)] font-medium">İçindekiler</h2>
              <ul className="mt-6 space-y-2 rounded-2xl border border-line bg-white p-5 text-[0.9375rem] text-ink-soft">
                {productLine.ingredients.map((i) => (
                  <li key={i}>{i}</li>
                ))}
              </ul>
              <p className="mt-2 text-sm text-ink-mute">Ambalaj üzerindeki bilgiler esastır.</p>
            </div>

            <div>
              <h2 className="font-display text-[clamp(1.875rem,3.5vw,2.5rem)] font-medium">Güvenlik uyarıları</h2>
              <ul className="mt-6 space-y-3 rounded-2xl border border-notice/20 bg-notice-soft p-5 text-[0.9375rem]">
                {productLine.warnings.map((w) => (
                  <li key={w} className="flex gap-3">
                    <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-notice" aria-hidden="true" />
                    <span>{w}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="diger" className="border-t border-line py-16 lg:py-24">
        <div className="container">
          <h2 id="diger" className="font-display text-[clamp(1.875rem,3.5vw,2.5rem)] font-medium">
            Diğer kokular
          </h2>
          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {others.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
