import { Check, Truck } from 'lucide-react'

import { site } from '@/data/site'
import { formatPrice } from '@/lib/format'

/** Says in plain words how far the cart is from free shipping. */
export function FreeShippingMeter({ subtotal, toFreeShipping }: { subtotal: number; toFreeShipping: number }) {
  const pct = Math.min(100, Math.round((subtotal / site.commerce.freeShippingThreshold) * 100))
  const reached = toFreeShipping === 0

  return (
    <div className={`rounded-2xl px-4 py-3 ${reached ? 'bg-leaf-soft' : 'bg-paper-cream'}`}>
      <p className="flex items-center gap-2 text-[0.9375rem] font-medium">
        {reached ? (
          <>
            <Check className="h-4 w-4 shrink-0 text-leaf" strokeWidth={3} aria-hidden="true" />
            <span className="text-leaf">Tebrikler, kargonuz ücretsiz!</span>
          </>
        ) : (
          <>
            <Truck className="h-4 w-4 shrink-0 text-ink-soft" aria-hidden="true" />
            <span>
              Ücretsiz kargo için <strong className="font-semibold">{formatPrice(toFreeShipping)}</strong> daha ekleyin.
            </span>
          </>
        )}
      </p>
      <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-white" aria-hidden="true">
        <div className={`h-full rounded-full transition-[width] duration-500 ${reached ? 'bg-leaf' : 'bg-ink'}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}
