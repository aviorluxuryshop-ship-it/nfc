import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { ProductView } from '@/components/views/ProductView'
import { getProduct } from '@/data/products'
import { formatPrice } from '@/lib/format'
import { pathsFor, productSegments, productSlugFromSegment } from '@/lib/i18n/config'
import { getI18n } from '@/lib/i18n'
import { pageMetadata } from '@/lib/i18n/metadata'

const locale = 'en'

export const dynamicParams = false

export function generateStaticParams() {
  return productSegments(locale).map((slug) => ({ slug }))
}

function resolve(segment: string) {
  const id = productSlugFromSegment(locale, segment)
  return id ? getProduct(id) : undefined
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const product = resolve((await params).slug)
  if (!product) return {}
  const { t } = getI18n(locale)
  const scent = product.text[locale].scent
  return pageMetadata({
    locale,
    path: pathsFor(locale).product(product.slug),
    title: t.meta.productTitle(scent),
    description: t.meta.productDescription(scent, formatPrice(product.price)),
  })
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const product = resolve((await params).slug)
  if (!product) notFound()
  return <ProductView product={product} locale={locale} />
}
