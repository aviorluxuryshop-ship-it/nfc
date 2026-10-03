import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { ServicePage } from '@/components/service/ServicePage'
import { getDictionary } from '@/lib/content'
import { pageMetadata } from '@/lib/metadata'
import { SERVICE_IDS, serviceFromSlug, serviceSlugs } from '@/lib/site'

export const dynamicParams = false

export function generateStaticParams() {
  return SERVICE_IDS.map((id) => ({ slug: serviceSlugs.tr[id] }))
}

export async function generateMetadata({ params }: PageProps<'/hizmetler/[slug]'>): Promise<Metadata> {
  const { slug } = await params
  const id = serviceFromSlug('tr', slug)
  if (!id) return {}
  const s = getDictionary('tr').services[id]
  return pageMetadata('tr', id, s.metaTitle, s.metaDescription)
}

export default async function Page({ params }: PageProps<'/hizmetler/[slug]'>) {
  const { slug } = await params
  const id = serviceFromSlug('tr', slug)
  if (!id) notFound()
  return <ServicePage locale="tr" id={id} />
}
