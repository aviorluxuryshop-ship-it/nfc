import { formatPrice } from '@/lib/format'

export function TotalsRows({ subtotal, shipping, total, count }: { subtotal: number; shipping: number; total: number; count: number }) {
  return (
    <dl className="space-y-2 text-[0.9375rem]">
      <div className="flex justify-between">
        <dt className="text-ink-soft">Ürünler ({count} adet)</dt>
        <dd className="tabular-nums">{formatPrice(subtotal)}</dd>
      </div>
      <div className="flex justify-between">
        <dt className="text-ink-soft">Kargo</dt>
        <dd className={`tabular-nums ${shipping === 0 && count > 0 ? 'font-semibold text-leaf' : ''}`}>
          {count === 0 ? '—' : shipping === 0 ? 'Ücretsiz' : formatPrice(shipping)}
        </dd>
      </div>
      <div className="flex items-baseline justify-between border-t border-line pt-3">
        <dt className="font-semibold">
          Toplam <span className="text-sm font-normal text-ink-mute">(KDV dahil)</span>
        </dt>
        <dd className="text-xl font-bold tabular-nums">{formatPrice(total)}</dd>
      </div>
    </dl>
  )
}
