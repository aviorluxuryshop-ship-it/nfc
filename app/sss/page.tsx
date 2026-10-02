import type { Metadata } from 'next'
import Link from 'next/link'

import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { FaqList } from '@/components/ui/FaqList'
import { faqs } from '@/data/faq'

export const metadata: Metadata = {
  title: 'Sıkça Sorulan Sorular',
  description: 'VELMO deterjan yaprağı, kullanım, kargo, ödeme ve iade hakkında sıkça sorulan sorular.',
  alternates: { canonical: '/sss' },
}

const groups = [
  { key: 'urun', title: 'Ürün ve kullanım' },
  { key: 'siparis', title: 'Sipariş, kargo ve iade' },
] as const

export default function FaqPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  }

  return (
    <div className="container pb-20 pt-6 lg:pb-28">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Breadcrumbs items={[{ label: 'Ana Sayfa', href: '/' }, { label: 'Sıkça Sorulan Sorular' }]} />
      <div className="mt-8 grid gap-12 lg:grid-cols-[0.8fr_1.6fr] lg:gap-20">
        <header>
          <h1 className="font-display text-[clamp(2.5rem,5vw,3.75rem)] font-medium leading-[1.04] tracking-[-0.01em]">Sıkça sorulan sorular</h1>
          <p className="mt-4 text-lg text-ink-soft">Cevabını bulamadığınız bir soru olursa bize yazın, yardımcı olalım.</p>
          <Link href="/iletisim" className="btn-secondary btn-sm mt-6">
            Bize Ulaşın
          </Link>
        </header>
        <div className="space-y-12">
          {groups.map((g) => (
            <section key={g.key} aria-labelledby={`grup-${g.key}`}>
              <h2 id={`grup-${g.key}`} className="mb-2 text-sm font-bold uppercase tracking-[0.12em] text-ink-mute">
                {g.title}
              </h2>
              <FaqList items={faqs.filter((f) => f.group === g.key)} />
            </section>
          ))}
        </div>
      </div>
    </div>
  )
}
