import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Info } from 'lucide-react'

import { ConsentForm } from '@/components/cookies/ConsentForm'
import { LegalBody } from '@/components/legal/LegalBody'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { company } from '@/data/company'
import { legalHref, legalPages, type LegalSlug } from '@/data/legal'
import { site } from '@/data/site'
import { getLegalDoc } from '@/lib/legal/documents'

export const dynamicParams = false

export function generateStaticParams() {
  return legalPages.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const page = legalPages.find((p) => p.slug === slug)
  if (!page) return {}
  return { title: page.title, description: page.summary, alternates: { canonical: legalHref(page.slug) } }
}

export default async function LegalPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const page = legalPages.find((p) => p.slug === slug)
  if (!page) notFound()

  const doc = page.slug === 'cerez-tercihleri' ? null : getLegalDoc(page.slug as Exclude<LegalSlug, 'cerez-tercihleri'>)

  return (
    <div className="container pb-20 pt-6 lg:pb-28">
      <Breadcrumbs items={[{ label: 'Ana Sayfa', href: '/' }, { label: 'Yasal Bilgiler', href: '/yasal' }, { label: page.title }]} />

      <div className="mt-8 grid gap-10 lg:grid-cols-[16rem_1fr] lg:gap-16">
        <nav aria-label="Yasal sayfalar" className="order-2 lg:order-1">
          <p className="eyebrow">Yasal bilgiler</p>
          <ul className="mt-3 space-y-0.5 lg:sticky lg:top-28">
            {legalPages.map((p) => (
              <li key={p.slug}>
                <Link
                  href={legalHref(p.slug)}
                  aria-current={p.slug === page.slug ? 'page' : undefined}
                  className={`block rounded-xl px-3 py-2 text-[0.9375rem] transition ${
                    p.slug === page.slug ? 'bg-paper-cream font-semibold text-ink' : 'text-ink-soft hover:text-ink'
                  }`}
                >
                  {p.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <article className="order-1 min-w-0 max-w-3xl lg:order-2">
          <h1 className="font-display text-[clamp(2.25rem,4.5vw,3.25rem)] font-medium leading-[1.06]">{page.title}</h1>
          {doc && <p className="mt-3 text-sm text-ink-mute">Son güncelleme: {company.legalUpdatedAt}</p>}

          {site.demoMode && doc && (
            <p className="mt-6 flex gap-3 rounded-2xl border border-notice/25 bg-notice-soft px-4 py-3 text-[0.9375rem] text-notice">
              <Info className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
              <span>
                Bu metin bir şablondur. <mark className="placeholder-mark">[Köşeli parantez]</mark> içindeki bilgileri şirketinizin gerçek bilgileriyle
                doldurun ve yayına almadan önce bir hukuk danışmanına kontrol ettirin.
              </span>
            </p>
          )}

          {doc?.summary && (
            <div className="mt-8 rounded-3xl bg-paper-cream p-6">
              <h2 className="text-sm font-bold uppercase tracking-[0.12em] text-ink-mute">Kısaca</h2>
              <ul className="mt-3 space-y-2">
                {doc.summary.map((s) => (
                  <li key={s} className="flex gap-3">
                    <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-ink" aria-hidden="true" />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-10">
            {doc ? (
              <LegalBody doc={doc} />
            ) : (
              <>
                <ConsentForm />
                <p className="mt-6 text-[0.9375rem] text-ink-soft">
                  Hangi çerezleri ne amaçla kullandığımızı{' '}
                  <Link href={legalHref('cerez-politikasi')} className="link font-medium">
                    Çerez Politikası
                  </Link>
                  ’nda bulabilirsiniz.
                </p>
              </>
            )}
          </div>
        </article>
      </div>
    </div>
  )
}
