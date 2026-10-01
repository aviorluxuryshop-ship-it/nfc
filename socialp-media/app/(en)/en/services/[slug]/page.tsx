import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { ServicePage } from '@/components/service/ServicePage'
import { getDictionary } from '@/lib/content'
import { pageMetadata } from '@/lib/metadata'
import { SERVICE_IDS, serviceFromSlug, serviceSlugs } from '@/lib/site'

export const dynamicParams = false

export function generateStaticParams() {
  return SERVICE_IDS.map((id) => ({ slug: serviceSlugs.en[id] }))
}

export async function generateMetadata({ params }: PageProps<'/en/services/[slug]'>): Promise<Metadata> {
  const { slug } = await params
  const id = serviceFromSlug('en', slug)
  if (!id) return {}
  const s = getDictionary('en').services[id]
  return pageMetadata('en', id, s.metaTitle, s.metaDescription)
}

export default async function Page({ params }: PageProps<'/en/services/[slug]'>) {
  const { slug } = await params
  const id = serviceFromSlug('en', slug)
  if (!id) notFound()
  return <ServicePage locale="en" id={id} />
}
