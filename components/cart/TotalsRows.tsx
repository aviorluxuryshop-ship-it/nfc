'use client'

import { formatPrice } from '@/lib/format'
import { useI18n } from '@/lib/i18n/client'

export function TotalsRows({ subtotal, shipping, total, count }: { subtotal: number; shipping: number; total: number; count: number }) {
  const { t } = useI18n()
  return (
    <dl className="space-y-2 text-[0.9375rem]">
      <div className="flex justify-between">
        <dt className="text-ink-soft">{t.cart.items(count)}</dt>
        <dd className="tabular-nums">{formatPrice(subtotal)}</dd>
      </div>
      <div className="flex justify-between">
        <dt className="text-ink-soft">{t.cart.shipping}</dt>
        <dd className={`tabular-nums ${shipping === 0 && count > 0 ? 'font-semibold text-leaf' : ''}`}>
          {count === 0 ? '—' : shipping === 0 ? t.cart.free : formatPrice(shipping)}
        </dd>
      </div>
      <div className="flex items-baseline justify-between border-t border-line pt-3">
        <dt className="font-semibold">
          {t.cart.total} <span className="text-sm font-normal text-ink-mute">{t.cart.vat}</span>
        </dt>
        <dd className="text-xl font-bold tabular-nums">{formatPrice(total)}</dd>
      </div>
    </dl>
  )
}
