import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { LegalDocView } from '@/components/views/LegalViews'
import { legalMeta } from '@/data/legal'
import { legalSegments, legalSlugFromSegment, pathsFor } from '@/lib/i18n/config'
import { pageMetadata } from '@/lib/i18n/metadata'

const locale = 'en'

export const dynamicParams = false

export function generateStaticParams() {
  return legalSegments(locale).map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const slug = legalSlugFromSegment(locale, (await params).slug)
  if (!slug) return {}
  const meta = legalMeta[locale][slug]
  return pageMetadata({ locale, path: pathsFor(locale).legalDoc(slug), title: meta.title, description: meta.summary })
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const slug = legalSlugFromSegment(locale, (await params).slug)
  if (!slug) notFound()
  return <LegalDocView slug={slug} locale={locale} />
}
