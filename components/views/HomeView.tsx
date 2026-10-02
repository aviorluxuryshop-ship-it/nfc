import Link from 'next/link'
import { ArrowRight, Check, X } from 'lucide-react'

import { FilmPlayer } from '@/components/home/FilmPlayer'
import { HeroShowcase } from '@/components/home/HeroShowcase'
import { WaveBackdrop } from '@/components/home/WaveBackdrop'
import { RibbonRule } from '@/components/layout/Footer'
import { DosageGuide } from '@/components/product/DosageGuide'
import { Highlights } from '@/components/product/Highlights'
import { ProductCard } from '@/components/product/ProductCard'
import { ScentEmblem } from '@/components/product/ScentArt'
import { SheetDiagram } from '@/components/product/SheetDiagram'
import { UsageSteps } from '@/components/product/UsageSteps'
import { FaqList } from '@/components/ui/FaqList'
import { Reveal } from '@/components/ui/Reveal'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { faqs } from '@/data/faq'
import { productFacts, products, samePriceForAll } from '@/data/products'
import { formatPrice } from '@/lib/format'
import type { Locale } from '@/lib/i18n/config'
import { getI18n } from '@/lib/i18n'
import { scentTheme } from '@/lib/scents'

const lowestPrice = Math.min(...products.map((p) => p.price))

export function HomeView({ locale }: { locale: Locale }) {
  const { t, paths } = getI18n(locale)
  const h = t.home

  const boxStats = [
    { n: `${productFacts.sheets}`, unit: h.boxStats.sheets, label: h.boxStats.sheetsNote, color: 'text-lavanta' },
    { n: `${productFacts.washes}`, unit: h.boxStats.washes, label: h.boxStats.washesNote, color: 'text-bahar' },
    { n: `${productFacts.netWeightGrams} g`, unit: '', label: h.boxStats.weightNote, color: 'text-narenciye' },
    { n: '11 × 28', unit: 'cm', label: h.boxStats.sizeNote, color: 'text-[#3C7FC2]' },
  ]

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(40rem_28rem_at_8%_10%,#F1ECF8_0%,transparent_70%),radial-gradient(34rem_26rem_at_95%_85%,#FDF0E2_0%,transparent_70%),radial-gradient(30rem_22rem_at_55%_100%,#E8F3EC_0%,transparent_70%)]"
        />
        <div className="container relative grid items-center gap-10 pb-16 pt-10 lg:grid-cols-[1fr_1.05fr] lg:gap-14 lg:pb-24 lg:pt-16">
          <div className="animate-fade-up">
            <p className="inline-flex items-center gap-2 rounded-full border border-lavanta/20 bg-white px-4 py-1.5 text-sm font-semibold text-lavanta-deep">
              <span className="h-2 w-2 rounded-full bg-leaf" aria-hidden="true" />
              {h.eyebrow}
            </p>
            <h1 className="mt-6 font-display text-[clamp(3rem,7vw,5.25rem)] font-medium leading-[0.98] tracking-[-0.02em]">
              {h.titleA}
              <br />
              <span className="bg-[linear-gradient(90deg,#6E4FA8,#B04FB4_55%,#E2602B)] bg-clip-text text-transparent">{h.titleB}</span>
            </h1>
            <p className="mt-6 max-w-lg text-lg text-ink-soft sm:text-xl sm:leading-relaxed">{h.lead}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a href="#kokular" className="btn-primary px-8">
                {h.ctaPrimary} <ArrowRight className="h-5 w-5" aria-hidden="true" />
              </a>
              <Link href={paths.howTo} className="btn-secondary px-8">
                {h.ctaSecondary}
              </Link>
            </div>
            <dl className="mt-10 grid max-w-md grid-cols-3 gap-4 border-t border-line pt-6">
              <div>
                <dt className="text-sm text-ink-mute">{h.statBox}</dt>
                <dd className="mt-0.5 text-xl font-bold text-lavanta-deep">{t.common.sheets(productFacts.sheets)}</dd>
              </div>
              <div>
                <dt className="text-sm text-ink-mute">{h.statEnough}</dt>
                <dd className="mt-0.5 text-xl font-bold text-bahar-deep">{t.common.washes(productFacts.washes)}</dd>
              </div>
              <div>
                <dt className="text-sm text-ink-mute">{h.statPrice}</dt>
                <dd className="mt-0.5 text-xl font-bold tabular-nums text-narenciye-deep">{formatPrice(lowestPrice)}</dd>
              </div>
            </dl>
          </div>

          <div className="relative animate-fade-up [animation-delay:120ms]">
            <HeroShowcase />
          </div>
        </div>
      </section>

      {/* Highlights */}
      <section aria-label={h.highlightsLabel} className="border-y border-line bg-white">
        <div className="container py-8">
          <Highlights locale={locale} />
        </div>
      </section>

      {/* Promo film */}
      <section aria-labelledby="film-baslik" className="relative overflow-hidden bg-[linear-gradient(180deg,#FCFBF8_0%,#F1ECF8_100%)] py-20 lg:py-28">
        <div className="container grid items-center gap-10 lg:grid-cols-[0.75fr_1.6fr] lg:gap-14">
          <Reveal>
            <SectionHeading id="film-baslik" eyebrow={h.film.eyebrow} eyebrowClass="text-lavanta" title={h.film.title}>
              {h.film.lead}
            </SectionHeading>
          </Reveal>
          <Reveal delay={90}>
            <FilmPlayer />
          </Reveal>
        </div>
      </section>

      {/* Products */}
      <section id="kokular" aria-labelledby="kokular-baslik" className="scroll-mt-24 py-20 lg:py-28">
        <div className="container">
          <Reveal>
            <SectionHeading id="kokular-baslik" eyebrow={samePriceForAll ? h.productsEyebrowSame : h.productsEyebrow} eyebrowClass="text-lavanta" title={h.productsTitle}>
              {h.productsLead(samePriceForAll)}
            </SectionHeading>
          </Reveal>
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {products.map((p, i) => (
              <Reveal key={p.slug} delay={i * 90} className="h-full">
                <ProductCard product={p} locale={locale} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* What's in the box */}
      <section aria-labelledby="kutu-baslik" className="bg-lavanta-soft/70 py-20 lg:py-28">
        <div className="container grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <Reveal className="order-2 lg:order-1">
            <div className="relative flex items-center justify-center overflow-hidden rounded-[2.25rem] bg-paper px-6 py-10">
              <WaveBackdrop className="absolute inset-x-0 bottom-0 h-1/2 w-full opacity-60" />
              <SheetDiagram className="relative h-[26rem] w-auto max-w-full" label={t.usage.sheetAria} halfLabel={t.usage.halfSheet} />
            </div>
          </Reveal>
          <Reveal className="order-1 lg:order-2">
            <SectionHeading id="kutu-baslik" eyebrow={h.boxEyebrow} eyebrowClass="text-lavanta" title={h.boxTitle}>
              {h.boxLead}
            </SectionHeading>
            <dl className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-line bg-line">
              {boxStats.map((s) => (
                <div key={s.label} className="bg-paper p-6">
                  <dt className="sr-only">{s.label}</dt>
                  <dd>
                    <span className={`font-display text-4xl font-medium tabular-nums ${s.color}`}>{s.n}</span>
                    {s.unit && <span className="ml-1.5 text-lg font-semibold">{s.unit}</span>}
                    <span className="mt-1 block text-[0.9375rem] text-ink-mute">{s.label}</span>
                  </dd>
                </div>
              ))}
            </dl>
            <p className="mt-5 text-[0.9375rem] text-ink-soft">
              <strong className="font-semibold text-ink">{h.boxFootnoteStrong}</strong> {h.boxFootnote}
            </p>
          </Reveal>
        </div>
      </section>

      {/* How to use */}
      <section aria-labelledby="kullanim-baslik" className="py-20 lg:py-28">
        <div className="container">
          <Reveal>
            <SectionHeading id="kullanim-baslik" eyebrow={h.howEyebrow} eyebrowClass="text-bahar" title={h.howTitle} />
          </Reveal>
          <div className="mt-12">
            <UsageSteps locale={locale} idPrefix="home-usage" />
          </div>
          <div className="mt-12 grid items-center gap-6 rounded-3xl bg-bahar-soft p-6 sm:p-8 lg:grid-cols-[0.8fr_2fr]">
            <Reveal>
              <h3 className="font-display text-2xl font-medium text-bahar-deep">{h.dosageTitle}</h3>
              <p className="mt-2 text-ink-soft">{h.dosageLead}</p>
            </Reveal>
            <DosageGuide locale={locale} />
          </div>
        </div>
      </section>

      {/* Why sheets */}
      <section aria-labelledby="neden-baslik" className="border-t border-line bg-white py-20 lg:py-28">
        <div className="container">
          <Reveal>
            <SectionHeading id="neden-baslik" eyebrow={h.whyEyebrow} eyebrowClass="text-narenciye" title={h.whyTitle} />
          </Reveal>
          <div className="mt-12 overflow-hidden rounded-3xl border border-line bg-white">
            <div className="hidden grid-cols-[0.6fr_1fr_1fr] border-b border-line bg-paper-cream text-sm font-bold uppercase tracking-[0.1em] md:grid">
              <div className="px-6 py-4 text-ink-mute">{h.whyHead.topic}</div>
              <div className="px-6 py-4 text-ink-mute">{h.whyHead.liquid}</div>
              <div className="bg-leaf-soft px-6 py-4 text-leaf">{h.whyHead.sheet}</div>
            </div>
            <ul data-reveal="stagger" className="divide-y divide-line">
              {h.whyRows.map((row) => (
                <li key={row.topic} className="grid gap-3 px-6 py-5 md:grid-cols-[0.6fr_1fr_1fr] md:gap-0 md:px-0 md:py-0">
                  <p className="font-semibold md:px-6 md:py-5">{row.topic}</p>
                  <p className="flex gap-3 text-ink-mute md:px-6 md:py-5">
                    <X className="mt-1 h-4 w-4 shrink-0 text-alert/70" aria-hidden="true" />
                    <span>
                      <span className="sr-only">{h.whyHead.liquid}: </span>
                      {row.liquid}
                    </span>
                  </p>
                  <p className="flex gap-3 font-medium md:bg-leaf-soft/50 md:px-6 md:py-5">
                    <Check className="mt-1 h-4 w-4 shrink-0 text-leaf" strokeWidth={3} aria-hidden="true" />
                    <span>
                      <span className="sr-only">{h.whyHead.sheet}: </span>
                      {row.sheet}
                    </span>
                  </p>
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-10">
            <Highlights locale={locale} variant="grid" />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section aria-labelledby="sss-baslik" className="bg-narenciye-soft/60 py-20 lg:py-28">
        <div className="container grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <Reveal>
            <SectionHeading id="sss-baslik" eyebrow={h.faqEyebrow} eyebrowClass="text-narenciye-deep" title={h.faqTitle}>
              {h.faqLead}
            </SectionHeading>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href={paths.faq} className="btn-secondary btn-sm">
                {h.faqAll}
              </Link>
              <Link href={paths.contact} className="btn-secondary btn-sm">
                {h.faqContact}
              </Link>
            </div>
          </Reveal>
          <FaqList items={faqs[locale].filter((f) => f.group === 'urun').slice(0, 5)} />
        </div>
      </section>

      {/* Closing call to action */}
      <section className="py-20 lg:py-24">
        <div className="container">
          <Reveal className="relative overflow-hidden rounded-[2.25rem] bg-ink px-6 py-14 text-center text-white sm:px-12 lg:py-20">
            <WaveBackdrop className="absolute inset-x-0 bottom-0 h-2/3 w-full opacity-[0.16]" />
            <div className="relative">
              <ul className="mb-8 flex justify-center gap-3" aria-hidden="true">
                {products.map((p) => (
                  <li key={p.slug} className={`flex h-16 w-16 items-center justify-center rounded-full ${scentTheme[p.slug].panel}`}>
                    <ScentEmblem scent={p.slug} className="h-12 w-12" />
                  </li>
                ))}
              </ul>
              <h2 className="mx-auto max-w-2xl font-display text-[clamp(2rem,4.5vw,3.25rem)] font-medium leading-[1.08]">{h.ctaTitle}</h2>
              <p className="mx-auto mt-4 max-w-lg text-lg text-white/75">{h.ctaLead}</p>
              <a href="#kokular" className="btn mt-8 bg-white px-8 text-ink hover:bg-paper-cream">
                {h.ctaButton} <ArrowRight className="h-5 w-5" aria-hidden="true" />
              </a>
            </div>
            <RibbonRule className="absolute inset-x-0 bottom-0" />
          </Reveal>
        </div>
      </section>
    </>
  )
}
