import { DosageGuide } from '@/components/product/DosageGuide'
import { ProductCard } from '@/components/product/ProductCard'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { products, samePriceForAll } from '@/data/products'
import type { Locale } from '@/lib/i18n/config'
import { getI18n } from '@/lib/i18n'

export function ProductsView({ locale }: { locale: Locale }) {
  const { t, paths } = getI18n(locale)
  return (
    <div className="container pb-20 pt-6 lg:pb-28">
      <Breadcrumbs label={t.common.breadcrumb} items={[{ label: t.common.home, href: paths.home }, { label: t.meta.products }]} />
      <header className="mt-8 max-w-2xl">
        <h1 className="font-display text-[clamp(2.5rem,5vw,3.75rem)] font-medium leading-[1.04] tracking-[-0.01em]">{t.productsPage.title}</h1>
        <p className="mt-4 text-lg text-ink-soft">{t.productsPage.lead(samePriceForAll)}</p>
      </header>

      <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {products.map((p) => (
          <ProductCard key={p.slug} product={p} locale={locale} headingLevel="h2" />
        ))}
      </div>

      <section aria-labelledby="dozaj" className="mt-16 rounded-3xl bg-bahar-soft p-6 sm:p-8">
        <h2 id="dozaj" className="font-display text-2xl font-medium text-bahar-deep">
          {t.productsPage.dosageTitle}
        </h2>
        <div className="mt-5">
          <DosageGuide locale={locale} />
        </div>
      </section>
    </div>
  )
}
