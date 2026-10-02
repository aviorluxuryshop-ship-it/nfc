import Link from 'next/link'
import { ArrowRight, Check, X } from 'lucide-react'

import { WaveBackdrop } from '@/components/home/WaveBackdrop'
import { DosageGuide } from '@/components/product/DosageGuide'
import { Highlights } from '@/components/product/Highlights'
import { PackShot } from '@/components/product/PackShot'
import { ProductCard } from '@/components/product/ProductCard'
import { ScentEmblem } from '@/components/product/ScentArt'
import { SheetDiagram } from '@/components/product/SheetDiagram'
import { UsageSteps } from '@/components/product/UsageSteps'
import { FaqList } from '@/components/ui/FaqList'
import { Reveal } from '@/components/ui/Reveal'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { faqs } from '@/data/faq'
import { productLine, products, samePriceForAll } from '@/data/products'
import { formatPrice } from '@/lib/format'
import { scentTheme } from '@/lib/scents'

const lowestPrice = Math.min(...products.map((p) => p.price))

const comparison = [
  { topic: 'Ölçmek', liquid: 'Her yıkamada kapakla ölçmeniz gerekir.', sheet: 'Ölçmek yok: 1 yaprak = 1 yıkama.' },
  { topic: 'Dökülme', liquid: 'Dökülür, damlar, şişenin ağzı yapış yapış olur.', sheet: 'Dökülmez, damlamaz, elinize bulaşmaz.' },
  { topic: 'Ağırlık', liquid: 'Ağır şişeyi taşımak ve kaldırmak gerekir.', sheet: `30 yıkamalık kutu sadece ${productLine.netWeightGrams} g.` },
  { topic: 'Ambalaj', liquid: 'Her bitişte bir plastik şişe daha.', sheet: 'Plastik içermeyen karton kutu.' },
]

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="overflow-hidden">
        <div className="container grid items-center gap-10 pb-16 pt-10 lg:grid-cols-[1fr_1.05fr] lg:gap-14 lg:pb-24 lg:pt-16">
          <div className="animate-fade-up">
            <p className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-4 py-1.5 text-sm font-semibold text-ink-soft">
              <span className="h-2 w-2 rounded-full bg-leaf" aria-hidden="true" />
              Renkli çamaşırlar için deterjan yaprağı
            </p>
            <h1 className="mt-6 font-display text-[clamp(3rem,7vw,5.25rem)] font-medium leading-[0.98] tracking-[-0.02em]">
              Bir yaprak.
              <br />
              <span className="text-lavanta">Bir yıkama.</span>
            </h1>
            <p className="mt-6 max-w-lg text-lg text-ink-soft sm:text-xl sm:leading-relaxed">
              Yaprağı makineye atın, çamaşırlarınızı koyun, makineyi çalıştırın. Ölçü kabı yok, dökülme yok, ağır şişe yok.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a href="#kokular" className="btn-primary px-8">
                Kokunu Seç, Satın Al <ArrowRight className="h-5 w-5" aria-hidden="true" />
              </a>
              <Link href="/nasil-kullanilir" className="btn-secondary px-8">
                Nasıl Kullanılır?
              </Link>
            </div>
            <dl className="mt-10 grid max-w-md grid-cols-3 gap-4 border-t border-line pt-6">
              <div>
                <dt className="text-sm text-ink-mute">Bir kutuda</dt>
                <dd className="mt-0.5 text-xl font-bold">{productLine.sheets} yaprak</dd>
              </div>
              <div>
                <dt className="text-sm text-ink-mute">Yeterli</dt>
                <dd className="mt-0.5 text-xl font-bold">{productLine.washes} yıkama</dd>
              </div>
              <div>
                <dt className="text-sm text-ink-mute">Kutu fiyatı</dt>
                <dd className="mt-0.5 text-xl font-bold tabular-nums">{formatPrice(lowestPrice)}</dd>
              </div>
            </dl>
          </div>

          <div className="relative animate-fade-up [animation-delay:120ms]">
            <div className="relative aspect-[6/5] overflow-hidden rounded-[2.25rem] bg-paper-cream">
              <WaveBackdrop className="absolute inset-0 h-full w-full opacity-90" />
              <PackShot scent="bahar" className="absolute left-[1%] top-[3%] w-[49%]" />
              <PackShot scent="narenciye" className="absolute right-[1%] top-[3%] w-[49%]" />
              <PackShot scent="lavanta" className="absolute bottom-0 left-1/2 w-[64%] -translate-x-1/2" />
            </div>
            <ul className="mt-4 flex justify-center gap-2 text-sm font-semibold" aria-label="Kokular">
              {products.map((p) => (
                <li key={p.slug}>
                  <Link href={`/urunler/${p.slug}`} className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-3.5 py-1.5 transition hover:border-ink">
                    <span className={`h-2.5 w-2.5 rounded-full ${scentTheme[p.slug].dot}`} aria-hidden="true" />
                    {p.scent}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Highlights */}
      <section aria-label="Öne çıkan özellikler" className="border-y border-line bg-paper-cream">
        <div className="container py-8">
          <Highlights />
        </div>
      </section>

      {/* Products */}
      <section id="kokular" aria-labelledby="kokular-baslik" className="scroll-mt-24 py-20 lg:py-28">
        <div className="container">
          <Reveal>
            <SectionHeading id="kokular-baslik" eyebrow={samePriceForAll ? '3 koku · tek fiyat' : '3 koku'} title="Kokunuzu seçin">
              Üç kokunun da kullanımı ve yaprak sayısı aynı{samePriceForAll ? ', fiyatı aynı' : ''}. Yalnızca kokusu farklı.
            </SectionHeading>
          </Reveal>
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {products.map((p, i) => (
              <Reveal key={p.slug} delay={i * 90} className="h-full">
                <ProductCard product={p} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* What's in the box */}
      <section aria-labelledby="kutu-baslik" className="bg-paper-cream py-20 lg:py-28">
        <div className="container grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <Reveal className="order-2 lg:order-1">
            <div className="relative flex items-center justify-center rounded-[2.25rem] bg-paper px-6 py-10">
              <SheetDiagram className="h-[26rem] w-auto max-w-full" />
            </div>
          </Reveal>
          <Reveal className="order-1 lg:order-2">
            <SectionHeading id="kutu-baslik" eyebrow="Kutunun içinde" title="İnce bir yaprak, tam bir yıkama">
              Bir yaprak, 3–5 kg’lık normal bir yıkama için yeterlidir. Daha az çamaşırda yaprağı ortadan ikiye bölmeniz yeterli.
            </SectionHeading>
            <dl className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-line bg-line">
              {[
                [`${productLine.sheets}`, 'yaprak', 'her kutuda'],
                [`${productLine.washes}`, 'yıkama', '1 yaprak = 1 yıkama'],
                [`${productLine.netWeightGrams} g`, '', 'net ağırlık'],
                ['11 × 28', 'cm', 'yaprak ölçüsü'],
              ].map(([n, unit, label]) => (
                <div key={label} className="bg-paper p-6">
                  <dt className="sr-only">{label}</dt>
                  <dd>
                    <span className="font-display text-4xl font-medium tabular-nums">{n}</span>
                    {unit && <span className="ml-1.5 text-lg font-semibold">{unit}</span>}
                    <span className="mt-1 block text-[0.9375rem] text-ink-mute">{label}</span>
                  </dd>
                </div>
              ))}
            </dl>
            <p className="mt-5 text-[0.9375rem] text-ink-soft">
              <strong className="font-semibold text-ink">Renkli çamaşırlar için.</strong> Çamaşır makinesinde kullanılır, elde yıkama için uygun değildir.
            </p>
          </Reveal>
        </div>
      </section>

      {/* How to use */}
      <section aria-labelledby="kullanim-baslik" className="py-20 lg:py-28">
        <div className="container">
          <Reveal>
            <SectionHeading id="kullanim-baslik" eyebrow="Kullanımı" title="Üç adımda temiz çamaşır" />
          </Reveal>
          <Reveal className="mt-12">
            <UsageSteps />
          </Reveal>
          <Reveal className="mt-12 grid items-center gap-6 rounded-3xl bg-paper-cream p-6 sm:p-8 lg:grid-cols-[0.8fr_2fr]">
            <div>
              <h3 className="font-display text-2xl font-medium">Kaç yaprak kullanmalıyım?</h3>
              <p className="mt-2 text-ink-soft">Çamaşırınızın miktarına bakın, yeterli.</p>
            </div>
            <DosageGuide />
          </Reveal>
        </div>
      </section>

      {/* Why sheets */}
      <section aria-labelledby="neden-baslik" className="border-t border-line py-20 lg:py-28">
        <div className="container">
          <Reveal>
            <SectionHeading id="neden-baslik" eyebrow="Farkı ne?" title="Sıvı deterjan yerine neden yaprak?" />
          </Reveal>
          <Reveal className="mt-12 overflow-hidden rounded-3xl border border-line bg-white">
            <div className="hidden grid-cols-[0.6fr_1fr_1fr] border-b border-line bg-paper-cream text-sm font-bold uppercase tracking-[0.1em] md:grid">
              <div className="px-6 py-4 text-ink-mute">Konu</div>
              <div className="px-6 py-4 text-ink-mute">Sıvı deterjan</div>
              <div className="px-6 py-4 text-ink">VELMO deterjan yaprağı</div>
            </div>
            <ul className="divide-y divide-line">
              {comparison.map((row) => (
                <li key={row.topic} className="grid gap-3 px-6 py-5 md:grid-cols-[0.6fr_1fr_1fr] md:gap-0 md:px-0 md:py-0">
                  <p className="font-semibold md:px-6 md:py-5">{row.topic}</p>
                  <p className="flex gap-3 text-ink-mute md:px-6 md:py-5">
                    <X className="mt-1 h-4 w-4 shrink-0 text-ink-mute" aria-hidden="true" />
                    <span>
                      <span className="sr-only">Sıvı deterjan: </span>
                      {row.liquid}
                    </span>
                  </p>
                  <p className="flex gap-3 font-medium md:bg-leaf-soft/40 md:px-6 md:py-5">
                    <Check className="mt-1 h-4 w-4 shrink-0 text-leaf" strokeWidth={3} aria-hidden="true" />
                    <span>
                      <span className="sr-only">VELMO: </span>
                      {row.sheet}
                    </span>
                  </p>
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal className="mt-10">
            <Highlights variant="grid" />
          </Reveal>
        </div>
      </section>

      {/* FAQ */}
      <section aria-labelledby="sss-baslik" className="bg-paper-cream py-20 lg:py-28">
        <div className="container grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <Reveal>
            <SectionHeading id="sss-baslik" eyebrow="Merak edilenler" title="Sıkça sorulan sorular">
              Aklınıza takılan başka bir şey olursa bize her zaman yazabilirsiniz.
            </SectionHeading>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/sss" className="btn-secondary btn-sm">
                Tüm Sorular
              </Link>
              <Link href="/iletisim" className="btn-secondary btn-sm">
                Bize Ulaşın
              </Link>
            </div>
          </Reveal>
          <Reveal>
            <FaqList items={faqs.filter((f) => f.group === 'urun').slice(0, 5)} />
          </Reveal>
        </div>
      </section>

      {/* Closing call to action */}
      <section className="py-20 lg:py-24">
        <div className="container">
          <Reveal className="relative overflow-hidden rounded-[2.25rem] bg-ink px-6 py-14 text-center text-white sm:px-12 lg:py-20">
            <ul className="mb-8 flex justify-center gap-3" aria-hidden="true">
              {products.map((p) => (
                <li key={p.slug} className={`flex h-16 w-16 items-center justify-center rounded-full ${scentTheme[p.slug].panel}`}>
                  <ScentEmblem scent={p.slug} className="h-12 w-12" />
                </li>
              ))}
            </ul>
            <h2 className="mx-auto max-w-2xl font-display text-[clamp(2rem,4.5vw,3.25rem)] font-medium leading-[1.08]">Çamaşır gününü kolaylaştırın.</h2>
            <p className="mx-auto mt-4 max-w-lg text-lg text-white/75">
              Kokunuzu seçin, sepete ekleyin; {productLine.washes} yıkamalık kutunuz kapınıza gelsin.
            </p>
            <a href="#kokular" className="btn mt-8 bg-white px-8 text-ink hover:bg-paper-cream">
              Kokunu Seç <ArrowRight className="h-5 w-5" aria-hidden="true" />
            </a>
          </Reveal>
        </div>
      </section>
    </>
  )
}
