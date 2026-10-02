import Link from 'next/link'
import { AlertTriangle, Clock, RotateCcw, ShieldCheck, Truck } from 'lucide-react'

import { BuyBox } from '@/components/product/BuyBox'
import { DosageGuide } from '@/components/product/DosageGuide'
import { Highlights } from '@/components/product/Highlights'
import { ProductCard } from '@/components/product/ProductCard'
import { ProductGallery } from '@/components/product/ProductGallery'
import { UsageSteps } from '@/components/product/UsageSteps'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { productFacts, productText, products, type Product } from '@/data/products'
import { site } from '@/data/site'
import { formatPrice } from '@/lib/format'
import type { Locale } from '@/lib/i18n/config'
import { getI18n } from '@/lib/i18n'
import { scentTheme } from '@/lib/scents'

export function ProductView({ product, locale }: { product: Product; locale: Locale }) {
  const { t, paths } = getI18n(locale)
  const pt = t.product
  const line = productText[locale]
  const text = product.text[locale]
  const theme = scentTheme[product.slug]
  const others = products.filter((p) => p.slug !== product.slug)
  const { commerce } = site
  const [dispatchStrong, dispatchRest] = pt.dispatch(commerce.dispatchDays)
  const [freeStrong, freeRest] = pt.freeShipping(formatPrice(commerce.freeShippingThreshold), formatPrice(commerce.shippingFee))

  const facts: [string, string][] = [
    [pt.table.product, line.fullName],
    [pt.table.scent, text.scent],
    [pt.table.content, pt.table.contentValue],
    [pt.table.weight, `${productFacts.netWeightGrams} g`],
    [pt.table.size, '11 × 28 cm'],
    [pt.table.use, pt.table.useValue],
    [pt.table.origin, line.origin],
    [pt.table.sku, product.sku],
  ]

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: `${line.fullName} — ${text.scent}`,
    description: text.description,
    sku: product.sku,
    brand: { '@type': 'Brand', name: 'VELMO' },
    weight: { '@type': 'QuantitativeValue', value: productFacts.netWeightGrams, unitCode: 'GRM' },
    offers: {
      '@type': 'Offer',
      url: `${site.url}${paths.product(product.slug)}`,
      priceCurrency: 'TRY',
      price: (product.price / 100).toFixed(2),
      availability: product.inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
    },
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="container pb-16 pt-6 lg:pb-24">
        <Breadcrumbs
          label={t.common.breadcrumb}
          items={[{ label: t.common.home, href: paths.home }, { label: t.meta.products, href: paths.products }, { label: text.scent }]}
        />

        <div className="mt-6 grid gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <ProductGallery product={product} />
          </div>

          <div>
            <p className="text-[0.9375rem] font-semibold text-ink-mute">{line.fullName}</p>
            <h1 className="mt-2 font-display text-[clamp(2.5rem,5vw,3.5rem)] font-medium leading-[1.02] tracking-[-0.01em]">
              <span className={theme.text}>{text.scent}</span>
              <span className="mt-1 block text-[0.55em] text-ink">{line.titleSuffix}</span>
            </h1>
            <p className="mt-4 text-lg text-ink-soft">{text.description}</p>

            <ul className="mt-6 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
              {[
                [`${productFacts.sheets}`, pt.facts.sheets],
                [`${productFacts.washes}`, pt.facts.washes],
                [`${productFacts.netWeightGrams} g`, pt.facts.weight],
                [pt.facts.colour, pt.facts.colourNote],
              ].map(([big, small]) => (
                <li key={small} className={`rounded-2xl px-4 py-3.5 ${theme.panel}`}>
                  <span className={`block text-xl font-bold ${theme.deepText}`}>{big}</span>
                  <span className="text-sm text-ink-soft">{small}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8">
              <BuyBox product={product} />
            </div>

            <ul className="mt-8 divide-y divide-line rounded-2xl border border-line bg-white text-[0.9375rem]">
              <li className="flex gap-3 px-5 py-4">
                <Clock className="mt-0.5 h-5 w-5 shrink-0 text-lavanta" aria-hidden="true" />
                <span>
                  <strong className="font-semibold">{dispatchStrong}</strong>
                  {dispatchRest}
                </span>
              </li>
              <li className="flex gap-3 px-5 py-4">
                <Truck className="mt-0.5 h-5 w-5 shrink-0 text-narenciye" aria-hidden="true" />
                <span>
                  <strong className="font-semibold">{freeStrong}</strong>
                  {freeRest}
                </span>
              </li>
              <li className="flex gap-3 px-5 py-4">
                <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-leaf" aria-hidden="true" />
                <span>{pt.securePayment}</span>
              </li>
              <li className="flex gap-3 px-5 py-4">
                <RotateCcw className="mt-0.5 h-5 w-5 shrink-0 text-[#3C7FC2]" aria-hidden="true" />
                <span>
                  {pt.returns}{' '}
                  <Link href={paths.legalDoc('iptal-ve-iade')} className="link font-medium">
                    {pt.returnsLink}
                  </Link>
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <section aria-labelledby="kullanim" className="border-t border-line bg-paper-cream py-16 lg:py-24">
        <div className="container">
          <h2 id="kullanim" className="font-display text-[clamp(1.875rem,3.5vw,2.5rem)] font-medium">
            {pt.howToTitle}
          </h2>
          <div className="mt-8">
            <UsageSteps locale={locale} idPrefix="product-usage" />
          </div>
          <div className="mt-6">
            <DosageGuide locale={locale} />
          </div>
        </div>
      </section>

      <section aria-labelledby="bilgiler" className="py-16 lg:py-24">
        <div className="container grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <h2 id="bilgiler" className="font-display text-[clamp(1.875rem,3.5vw,2.5rem)] font-medium">
              {pt.infoTitle}
            </h2>
            <dl className="mt-6 divide-y divide-line rounded-2xl border border-line bg-white">
              {facts.map(([k, v]) => (
                <div key={k} className="grid grid-cols-[9rem_1fr] gap-4 px-5 py-3.5 text-[0.9375rem] sm:grid-cols-[11rem_1fr]">
                  <dt className="text-ink-mute">{k}</dt>
                  <dd className="font-medium">{v}</dd>
                </div>
              ))}
            </dl>

            <h3 className="mt-10 text-xl font-semibold">{pt.highlightsTitle}</h3>
            <div className="mt-4">
              <Highlights locale={locale} variant="grid" />
            </div>
          </div>

          <div className="space-y-10">
            <div>
              <h2 className="font-display text-[clamp(1.875rem,3.5vw,2.5rem)] font-medium">{pt.ingredientsTitle}</h2>
              <ul className="mt-6 space-y-2 rounded-2xl border border-line bg-white p-5 text-[0.9375rem] text-ink-soft">
                {line.ingredients.map((i) => (
                  <li key={i}>{i}</li>
                ))}
              </ul>
              <p className="mt-2 text-sm text-ink-mute">{pt.ingredientsNote}</p>
            </div>

            <div>
              <h2 className="font-display text-[clamp(1.875rem,3.5vw,2.5rem)] font-medium">{pt.warningsTitle}</h2>
              <ul className="mt-6 space-y-3 rounded-2xl border border-notice/20 bg-notice-soft p-5 text-[0.9375rem]">
                {line.warnings.map((w) => (
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

      <section aria-labelledby="diger" className="border-t border-line bg-lavanta-soft/50 py-16 lg:py-24">
        <div className="container">
          <h2 id="diger" className="font-display text-[clamp(1.875rem,3.5vw,2.5rem)] font-medium">
            {pt.othersTitle}
          </h2>
          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {others.map((p) => (
              <ProductCard key={p.slug} product={p} locale={locale} />
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
