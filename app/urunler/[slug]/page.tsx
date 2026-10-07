import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { PageHead } from '@/components/PageHead'
import { ProductGrid } from '@/components/ProductGrid'
import { categories } from '@/data/yemek'

type Props = { params: Promise<{ slug: string }> }

export const dynamicParams = false
export const generateStaticParams = () => categories.map((c) => ({ slug: c.slug }))

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const c = categories.find((x) => x.slug === slug)
  return c ? { title: c.name, description: c.description } : {}
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params
  const c = categories.find((x) => x.slug === slug)
  if (!c) notFound()
  return (
    <>
      <PageHead
        crumbs={[{ label: 'Ana Sayfa', href: '/' }, { label: 'Ürünler', href: '/urunler' }, { label: c.name }]}
        title={c.name}
        description={c.description}
      />
      <ProductGrid category={c.slug} />
    </>
  )
}
