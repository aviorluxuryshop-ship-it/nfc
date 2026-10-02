import Link from 'next/link'

import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { FaqList } from '@/components/ui/FaqList'
import { faqs } from '@/data/faq'
import type { Locale } from '@/lib/i18n/config'
import { getI18n } from '@/lib/i18n'

const groupColors = { urun: 'text-lavanta', siparis: 'text-narenciye-deep' } as const

export function FaqView({ locale }: { locale: Locale }) {
  const { t, paths } = getI18n(locale)
  const items = faqs[locale]
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  }

  return (
    <div className="container pb-20 pt-6 lg:pb-28">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Breadcrumbs label={t.common.breadcrumb} items={[{ label: t.common.home, href: paths.home }, { label: t.meta.faq }]} />
      <div className="mt-8 grid gap-12 lg:grid-cols-[0.8fr_1.6fr] lg:gap-20">
        <header>
          <h1 className="font-display text-[clamp(2.5rem,5vw,3.75rem)] font-medium leading-[1.04] tracking-[-0.01em]">{t.faqPage.title}</h1>
          <p className="mt-4 text-lg text-ink-soft">{t.faqPage.lead}</p>
          <Link href={paths.contact} className="btn-secondary btn-sm mt-6">
            {t.faqPage.contact}
          </Link>
        </header>
        <div className="space-y-12">
          {(['urun', 'siparis'] as const).map((g) => (
            <section key={g} aria-labelledby={`grup-${g}`}>
              <h2 id={`grup-${g}`} className={`mb-2 text-sm font-bold uppercase tracking-[0.12em] ${groupColors[g]}`}>
                {t.faqPage.groups[g]}
              </h2>
              <FaqList items={items.filter((f) => f.group === g)} />
            </section>
          ))}
        </div>
      </div>
    </div>
  )
}
