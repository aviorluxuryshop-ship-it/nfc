import type { Metadata } from 'next'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { legalHref, legalPages } from '@/data/legal'

export const metadata: Metadata = {
  title: 'Yasal Bilgiler',
  alternates: { canonical: '/yasal' },
}

export default function LegalIndexPage() {
  return (
    <div className="container pb-20 pt-6 lg:pb-28">
      <Breadcrumbs items={[{ label: 'Ana Sayfa', href: '/' }, { label: 'Yasal Bilgiler' }]} />
      <h1 className="mt-8 font-display text-[clamp(2.5rem,5vw,3.75rem)] font-medium leading-[1.04]">Yasal bilgiler</h1>
      <ul className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {legalPages.map((p) => (
          <li key={p.slug}>
            <Link href={legalHref(p.slug)} className="group flex h-full items-start justify-between gap-4 rounded-3xl border border-line bg-white p-6 transition hover:border-ink/40">
              <span>
                <span className="block text-lg font-semibold">{p.title}</span>
                <span className="mt-1 block text-[0.9375rem] text-ink-soft">{p.summary}</span>
              </span>
              <ChevronRight className="mt-1 h-5 w-5 shrink-0 text-ink-mute transition group-hover:translate-x-0.5 group-hover:text-ink" aria-hidden="true" />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
