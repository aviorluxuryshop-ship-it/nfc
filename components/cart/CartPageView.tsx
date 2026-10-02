'use client'

import Link from 'next/link'
import { Lock, ShoppingBag } from 'lucide-react'

import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { useI18n } from '@/lib/i18n/client'

import { CartLineItem } from './CartLineItem'
import { useCart } from './CartProvider'
import { FreeShippingMeter } from './FreeShippingMeter'
import { TotalsRows } from './TotalsRows'

export function CartPageView() {
  const cart = useCart()
  const { t, paths } = useI18n()

  return (
    <div className="container pb-20 pt-6 lg:pb-28">
      <Breadcrumbs label={t.common.breadcrumb} items={[{ label: t.common.home, href: paths.home }, { label: t.cart.title }]} />
      <h1 className="mt-8 font-display text-[clamp(2.25rem,4.5vw,3.25rem)] font-medium leading-tight">{t.cart.title}</h1>

      {cart.count === 0 ? (
        <div className="mt-10 flex flex-col items-center rounded-3xl border border-line bg-white px-6 py-16 text-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-lavanta-soft">
            <ShoppingBag className="h-7 w-7 text-lavanta" aria-hidden="true" />
          </span>
          <p className="mt-5 text-xl font-semibold">{t.cart.emptyTitle}</p>
          <p className="mt-1 text-ink-soft">{t.cart.emptyLead}</p>
          <Link href={paths.products} className="btn-primary mt-6 px-8">
            {t.common.seeProducts}
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid items-start gap-8 lg:grid-cols-[1.5fr_1fr] lg:gap-12">
          <div>
            <FreeShippingMeter subtotal={cart.subtotal} toFreeShipping={cart.toFreeShipping} />
            <ul className="mt-2 divide-y divide-line border-b border-line">
              {cart.items.map((item) => (
                <CartLineItem key={item.slug} item={item} large />
              ))}
            </ul>
            <Link href={paths.products} className="link mt-6 inline-block">
              {t.cart.continueLink}
            </Link>
          </div>

          <aside data-reveal="" className="rounded-3xl border border-line bg-white p-6 lg:sticky lg:top-28" aria-labelledby="ozet">
            <h2 id="ozet" className="text-lg font-semibold">
              {t.cart.summary}
            </h2>
            <div className="mt-4">
              <TotalsRows {...cart} />
            </div>
            <Link href={paths.checkout} className="btn-primary mt-6 w-full">
              {t.cart.checkout}
            </Link>
            <p className="mt-3 flex items-center justify-center gap-1.5 text-sm text-ink-mute">
              <Lock className="h-3.5 w-3.5" aria-hidden="true" /> {t.cart.securePayment}
            </p>
          </aside>
        </div>
      )}
    </div>
  )
}
