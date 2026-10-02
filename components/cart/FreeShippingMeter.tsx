'use client'

import { Check, Truck } from 'lucide-react'

import { site } from '@/data/site'
import { formatPrice } from '@/lib/format'
import { useI18n } from '@/lib/i18n/client'

/** Says in plain words how far the cart is from free shipping. */
export function FreeShippingMeter({ subtotal, toFreeShipping }: { subtotal: number; toFreeShipping: number }) {
  const { t } = useI18n()
  const pct = Math.min(100, Math.round((subtotal / site.commerce.freeShippingThreshold) * 100))
  const reached = toFreeShipping === 0
  const [before, amount, after] = t.cart.toFreeShipping(formatPrice(toFreeShipping))

  return (
    <div className={`rounded-2xl px-4 py-3 ${reached ? 'bg-leaf-soft' : 'bg-narenciye-soft/70'}`}>
      <p className="flex items-center gap-2 text-[0.9375rem] font-medium">
        {reached ? (
          <>
            <Check className="h-4 w-4 shrink-0 text-leaf" strokeWidth={3} aria-hidden="true" />
            <span className="text-leaf">{t.cart.freeShippingReached}</span>
          </>
        ) : (
          <>
            <Truck className="h-4 w-4 shrink-0 text-narenciye-deep" aria-hidden="true" />
            <span>
              {before}
              <strong className="font-semibold">{amount}</strong>
              {after}
            </span>
          </>
        )}
      </p>
      <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-white" aria-hidden="true">
        <div
          className={`h-full rounded-full transition-[width] duration-500 ${reached ? 'bg-leaf' : 'bg-[linear-gradient(90deg,#F7AE62,#D9701A)]'}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
