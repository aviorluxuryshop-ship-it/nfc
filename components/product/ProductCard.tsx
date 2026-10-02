import Link from 'next/link'

import { productLine, pricePerWash, type Product } from '@/data/products'
import { formatPrice } from '@/lib/format'
import { scentTheme } from '@/lib/scents'

import { AddToCartButton } from './AddToCartButton'
import { PackShot } from './PackShot'

export function ProductCard({ product, headingLevel = 'h3' }: { product: Product; headingLevel?: 'h2' | 'h3' }) {
  const theme = scentTheme[product.slug]
  const Heading = headingLevel
  const href = `/urunler/${product.slug}`

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-white transition duration-300 hover:shadow-lift">
      <Link href={href} className={`relative block ${theme.panel} px-6 pb-4 pt-10`} tabIndex={-1} aria-hidden="true">
        <PackShot scent={product.slug} className="mx-auto w-full max-w-[22rem] transition duration-500 group-hover:-translate-y-1.5" />
      </Link>

      <div className="flex flex-1 flex-col p-6 sm:p-7">
        <p className="text-sm font-semibold text-ink-mute">{productLine.name}</p>
        <Heading className="mt-1 flex items-center gap-2.5 font-display text-[2rem] font-medium leading-tight">
          <span className={`h-3 w-3 rounded-full ${theme.dot}`} aria-hidden="true" />
          <Link href={href} className="hover:underline hover:decoration-1 hover:underline-offset-4">
            {product.scent}
          </Link>
        </Heading>
        <p className="mt-1.5 text-ink-soft">{product.note}</p>

        <ul className="mt-4 flex flex-wrap gap-1.5 text-sm font-medium text-ink-soft">
          <li className="rounded-full bg-paper-cream px-3 py-1">{productLine.sheets} yaprak</li>
          <li className="rounded-full bg-paper-cream px-3 py-1">{productLine.washes} yıkama</li>
          <li className="rounded-full bg-paper-cream px-3 py-1">{productLine.netWeightGrams} g</li>
        </ul>

        <div className="mt-6 flex items-end justify-between gap-3 border-t border-line pt-5">
          <div>
            <p className="text-[1.75rem] font-bold leading-none tabular-nums">{formatPrice(product.price)}</p>
            <p className="mt-1.5 text-sm text-ink-mute">KDV dahil</p>
          </div>
          <p className="text-right text-sm text-ink-soft">
            Yıkama başına
            <br />
            <span className="font-semibold text-ink">{formatPrice(pricePerWash(product))}</span>
          </p>
        </div>

        <div className="mt-5 grid gap-2">
          <AddToCartButton slug={product.slug} disabled={!product.inStock} className="w-full" />
          <Link href={href} className="btn-secondary btn-sm w-full">
            Ürünü İncele
          </Link>
        </div>
      </div>
    </article>
  )
}
