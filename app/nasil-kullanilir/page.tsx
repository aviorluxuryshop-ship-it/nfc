import type { Metadata } from 'next'
import Link from 'next/link'
import { AlertTriangle, ArrowRight, Check } from 'lucide-react'

import { DosageGuide } from '@/components/product/DosageGuide'
import { SheetDiagram } from '@/components/product/SheetDiagram'
import { UsageSteps } from '@/components/product/UsageSteps'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { productLine } from '@/data/products'

export const metadata: Metadata = {
  title: 'Nasıl Kullanılır?',
  description: 'VELMO deterjan yaprağı nasıl kullanılır? Yaprağı tambura koyun, çamaşırları ekleyin, makineyi çalıştırın. 1–2 kg için yarım, 3–5 kg için 1 yaprak.',
  alternates: { canonical: '/nasil-kullanilir' },
}

const tips = [
  'Renkli çamaşırlarınız için kullanın.',
  'Yaprağı her zaman çamaşırlardan önce, boş tambura koyun.',
  'Az çamaşırda yaprağı elinizle ortadan ikiye bölün.',
  'Kutuyu kapalı ve kuru bir yerde saklayın; yaprakları kuru elle tutun.',
]

export default function HowToPage() {
  return (
    <>
      <div className="container pt-6">
        <Breadcrumbs items={[{ label: 'Ana Sayfa', href: '/' }, { label: 'Nasıl Kullanılır?' }]} />
        <header className="mt-8 max-w-2xl">
          <h1 className="font-display text-[clamp(2.5rem,5vw,3.75rem)] font-medium leading-[1.04] tracking-[-0.01em]">Nasıl kullanılır?</h1>
          <p className="mt-4 text-lg text-ink-soft">Ölçü kabı, dökme, hesaplama yok. Üç adımda bitiyor.</p>
        </header>
        <div className="mt-10">
          <UsageSteps />
        </div>
      </div>

      <section aria-labelledby="dozaj" className="container mt-16 grid items-center gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
        <div className="flex justify-center rounded-[2rem] bg-paper-cream px-6 py-10">
          <SheetDiagram className="h-80 w-auto" />
        </div>
        <div>
          <h2 id="dozaj" className="font-display text-[clamp(1.875rem,3.5vw,2.5rem)] font-medium">
            Kaç yaprak kullanmalıyım?
          </h2>
          <p className="mt-3 text-lg text-ink-soft">
            Bir kutuda {productLine.sheets} yaprak var. Çamaşırınızın miktarına göre:
          </p>
          <div className="mt-6">
            <DosageGuide compact />
          </div>
        </div>
      </section>

      <section aria-labelledby="ipuclari" className="container mt-16 grid gap-6 pb-20 lg:grid-cols-2 lg:pb-28">
        <div className="rounded-3xl border border-line bg-white p-6 sm:p-8">
          <h2 id="ipuclari" className="text-xl font-semibold">
            İpuçları
          </h2>
          <ul className="mt-5 space-y-3">
            {tips.map((t) => (
              <li key={t} className="flex gap-3">
                <Check className="mt-1 h-4 w-4 shrink-0 text-leaf" strokeWidth={3} aria-hidden="true" />
                <span className="text-ink-soft">{t}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-3xl border border-notice/20 bg-notice-soft p-6 sm:p-8">
          <h2 className="text-xl font-semibold">Güvenlik uyarıları</h2>
          <ul className="mt-5 space-y-3">
            {productLine.warnings.map((w) => (
              <li key={w} className="flex gap-3">
                <AlertTriangle className="mt-1 h-4 w-4 shrink-0 text-notice" aria-hidden="true" />
                <span>{w}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex flex-col items-start justify-between gap-4 rounded-3xl bg-ink p-6 text-white sm:flex-row sm:items-center sm:p-8 lg:col-span-2">
          <p className="font-display text-2xl font-medium">Hazırsanız, kokunuzu seçin.</p>
          <Link href="/urunler" className="btn bg-white px-7 text-ink hover:bg-paper-cream">
            Ürünleri Gör <ArrowRight className="h-5 w-5" aria-hidden="true" />
          </Link>
        </div>
      </section>
    </>
  )
}
