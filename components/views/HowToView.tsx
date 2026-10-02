import Link from 'next/link'
import { AlertTriangle, ArrowRight, Check } from 'lucide-react'

import { DosageGuide } from '@/components/product/DosageGuide'
import { SheetDiagram } from '@/components/product/SheetDiagram'
import { UsageSteps } from '@/components/product/UsageSteps'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { productText } from '@/data/products'
import type { Locale } from '@/lib/i18n/config'
import { getI18n } from '@/lib/i18n'

export function HowToView({ locale }: { locale: Locale }) {
  const { t, paths } = getI18n(locale)
  const p = t.howToPage
  return (
    <>
      <div className="container pt-6">
        <Breadcrumbs label={t.common.breadcrumb} items={[{ label: t.common.home, href: paths.home }, { label: t.meta.howTo }]} />
        <header className="mt-8 max-w-2xl">
          <h1 className="font-display text-[clamp(2.5rem,5vw,3.75rem)] font-medium leading-[1.04] tracking-[-0.01em]">{p.title}</h1>
          <p className="mt-4 text-lg text-ink-soft">{p.lead}</p>
        </header>
        <div className="mt-10">
          <UsageSteps locale={locale} idPrefix="howto-usage" />
        </div>
      </div>

      <section aria-labelledby="dozaj" className="container mt-16 grid items-center gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
        <div className="flex justify-center rounded-[2rem] bg-lavanta-soft px-6 py-10">
          <SheetDiagram className="h-80 w-auto" label={t.usage.sheetAria} halfLabel={t.usage.halfSheet} />
        </div>
        <div>
          <h2 id="dozaj" className="font-display text-[clamp(1.875rem,3.5vw,2.5rem)] font-medium">
            {p.dosageTitle}
          </h2>
          <p className="mt-3 text-lg text-ink-soft">{p.dosageLead}</p>
          <div className="mt-6">
            <DosageGuide locale={locale} compact />
          </div>
        </div>
      </section>

      <section aria-labelledby="ipuclari" className="container mt-16 grid gap-6 pb-20 lg:grid-cols-2 lg:pb-28">
        <div className="rounded-3xl border border-line bg-bahar-soft/60 p-6 sm:p-8">
          <h2 id="ipuclari" className="text-xl font-semibold text-bahar-deep">
            {p.tipsTitle}
          </h2>
          <ul className="mt-5 space-y-3">
            {p.tips.map((tip) => (
              <li key={tip} className="flex gap-3">
                <Check className="mt-1 h-4 w-4 shrink-0 text-leaf" strokeWidth={3} aria-hidden="true" />
                <span className="text-ink-soft">{tip}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-3xl border border-notice/20 bg-notice-soft p-6 sm:p-8">
          <h2 className="text-xl font-semibold">{p.warningsTitle}</h2>
          <ul className="mt-5 space-y-3">
            {productText[locale].warnings.map((w) => (
              <li key={w} className="flex gap-3">
                <AlertTriangle className="mt-1 h-4 w-4 shrink-0 text-notice" aria-hidden="true" />
                <span>{w}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex flex-col items-start justify-between gap-4 rounded-3xl bg-ink p-6 text-white sm:flex-row sm:items-center sm:p-8 lg:col-span-2">
          <p className="font-display text-2xl font-medium">{p.ctaTitle}</p>
          <Link href={paths.products} className="btn bg-white px-7 text-ink hover:bg-paper-cream">
            {t.common.seeProducts} <ArrowRight className="h-5 w-5" aria-hidden="true" />
          </Link>
        </div>
      </section>
    </>
  )
}
