'use client'

import Link from 'next/link'
import { Check, Plus, ShoppingBag } from 'lucide-react'

import { ScentEmblem } from '@/components/product/ScentArt'
import { Dialog } from '@/components/ui/Dialog'
import { products } from '@/data/products'
import { formatPrice } from '@/lib/format'
import { useI18n } from '@/lib/i18n/client'
import { scentTheme } from '@/lib/scents'

import { CartLineItem } from './CartLineItem'
import { useCart } from './CartProvider'
import { FreeShippingMeter } from './FreeShippingMeter'
import { TotalsRows } from './TotalsRows'

export function CartDrawer() {
  const cart = useCart()
  const { locale, t, paths } = useI18n()
  const { isOpen, closeCart, items, count, lastAdded } = cart
  const missing = products.filter((p) => p.inStock && !items.some((i) => i.slug === p.slug))
  const added = lastAdded ? products.find((p) => p.slug === lastAdded) : null

  return (
    <Dialog
      open={isOpen}
      onClose={closeCart}
      variant="drawer"
      labelledBy="cart-title"
      title={
        <>
          {t.cart.title} <span className="font-normal text-ink-mute">{t.cart.count(count)}</span>
        </>
      }
      footer={
        count > 0 ? (
          <div className="space-y-4">
            <TotalsRows {...cart} />
            <div className="grid gap-2.5">
              <Link href={paths.checkout} onClick={closeCart} className="btn-primary w-full">
                {t.cart.checkout}
              </Link>
              <button type="button" onClick={closeCart} className="btn-secondary w-full">
                {t.cart.continue}
              </button>
            </div>
          </div>
        ) : undefined
      }
    >
      {count === 0 ? (
        <div className="flex flex-col items-center px-6 py-16 text-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-lavanta-soft">
            <ShoppingBag className="h-7 w-7 text-lavanta" aria-hidden="true" />
          </span>
          <p className="mt-5 text-lg font-semibold">{t.cart.emptyTitle}</p>
          <p className="mt-1 text-ink-soft">{t.cart.emptyLead}</p>
          <Link href={paths.products} onClick={closeCart} className="btn-primary mt-6">
            {t.common.seeProducts}
          </Link>
        </div>
      ) : (
        <div className="px-5 py-4 sm:px-6">
          {added && items.some((i) => i.slug === added.slug) && (
            <p className="mb-3 flex items-center gap-2 rounded-2xl bg-leaf-soft px-4 py-3 text-[0.9375rem] font-medium text-leaf" role="status">
              <Check className="h-4 w-4 shrink-0" strokeWidth={3} aria-hidden="true" />
              {t.cart.addedNotice(added.text[locale].scent)}
            </p>
          )}
          <FreeShippingMeter subtotal={cart.subtotal} toFreeShipping={cart.toFreeShipping} />

          <ul className="divide-y divide-line">
            {items.map((item) => (
              <CartLineItem key={item.slug} item={item} onNavigate={closeCart} />
            ))}
          </ul>

          {missing.length > 0 && (
            <div className="mt-2 rounded-2xl border border-line p-4">
              <p className="text-[0.9375rem] font-semibold">{t.cart.tryOthers}</p>
              <ul className="mt-3 space-y-2">
                {missing.map((p) => (
                  <li key={p.slug} className="flex items-center gap-3">
                    <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${scentTheme[p.slug].panel}`}>
                      <ScentEmblem scent={p.slug} className="h-8 w-8" />
                    </span>
                    <span className="flex-1 text-[0.9375rem]">
                      <span className="font-semibold">{p.text[locale].scent}</span>
                      <span className="text-ink-mute"> · {formatPrice(p.price)}</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => cart.add(p.slug)}
                      className="inline-flex h-10 items-center gap-1 rounded-full border border-line-strong px-4 text-sm font-semibold transition hover:border-ink"
                    >
                      <Plus className="h-4 w-4" aria-hidden="true" /> {t.cart.add}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <p className="mt-4 text-center">
            <Link href={paths.cart} onClick={closeCart} className="link text-[0.9375rem]">
              {t.cart.goToCartPage}
            </Link>
          </p>
        </div>
      )}
    </Dialog>
  )
}
