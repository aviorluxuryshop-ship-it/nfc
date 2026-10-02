'use client'

import Link from 'next/link'
import { Trash2 } from 'lucide-react'

import { PackShot } from '@/components/product/PackShot'
import { QuantityStepper } from '@/components/ui/QuantityStepper'
import { productFacts, productText } from '@/data/products'
import { removeFromCart, setCartQty, type CartItem } from '@/lib/cart'
import { formatPrice } from '@/lib/format'
import { useI18n } from '@/lib/i18n/client'
import { scentTheme } from '@/lib/scents'

export function CartLineItem({ item, onNavigate, large = false }: { item: CartItem; onNavigate?: () => void; large?: boolean }) {
  const { product } = item
  const theme = scentTheme[product.slug]
  const { locale, t, paths } = useI18n()
  const href = paths.product(product.slug)
  const scent = product.text[locale].scent

  return (
    <li className="flex gap-4 py-5">
      <Link
        href={href}
        onClick={onNavigate}
        className={`flex shrink-0 items-center justify-center rounded-2xl ${theme.panel} ${large ? 'h-28 w-28 sm:h-32 sm:w-32' : 'h-24 w-24'} p-2`}
      >
        <PackShot scent={product.slug} view="front" className="w-full" />
      </Link>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <Link href={href} onClick={onNavigate} className="font-semibold leading-snug hover:underline">
              {productText[locale].name}
            </Link>
            <p className="mt-0.5 flex items-center gap-1.5 text-[0.9375rem]">
              <span className={`h-2.5 w-2.5 rounded-full ${theme.dot}`} aria-hidden="true" />
              <span className={`font-semibold ${theme.deepText}`}>{scent}</span>
              <span className="text-ink-mute">· {t.common.sheets(productFacts.sheets)}</span>
            </p>
          </div>
          <p className="shrink-0 text-right font-semibold tabular-nums">{formatPrice(item.lineTotal)}</p>
        </div>

        <p className="mt-1 text-sm text-ink-mute">{t.cart.unitPrice(formatPrice(product.price))}</p>

        <div className="mt-auto flex items-center justify-between gap-3 pt-3">
          <QuantityStepper size="sm" value={item.qty} onChange={(q) => setCartQty(product.slug, q)} label={t.common.qtyOf(scent)} />
          <button
            type="button"
            onClick={() => removeFromCart(product.slug)}
            className="inline-flex h-10 items-center gap-1.5 rounded-full px-3 text-sm font-semibold text-ink-soft transition hover:bg-alert-soft hover:text-alert"
          >
            <Trash2 className="h-4 w-4" aria-hidden="true" /> {t.cart.remove}
          </button>
        </div>
      </div>
    </li>
  )
}
