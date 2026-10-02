'use client'

import Link from 'next/link'
import { Check, Info, Landmark, Mail, Package } from 'lucide-react'
import { useMemo, useSyncExternalStore } from 'react'

import { company } from '@/data/company'
import { productLine } from '@/data/products'
import { site } from '@/data/site'
import { LAST_ORDER_KEY, paymentLabels, type PlacedOrder } from '@/lib/checkout'
import { formatDate, formatPrice } from '@/lib/format'

const subscribe = () => () => {}
const readOrder = () => {
  try {
    return window.sessionStorage.getItem(LAST_ORDER_KEY)
  } catch {
    return null
  }
}

export function OrderConfirmation() {
  const raw = useSyncExternalStore(subscribe, readOrder, () => 'pending')
  const order = useMemo<PlacedOrder | null>(() => {
    if (!raw || raw === 'pending') return null
    try {
      return JSON.parse(raw) as PlacedOrder
    } catch {
      return null
    }
  }, [raw])

  if (raw === 'pending') return <div className="container min-h-[50vh] py-24" />

  if (!order) {
    return (
      <div className="container max-w-xl py-24 text-center">
        <h1 className="font-display text-4xl font-medium">Sipariş bulunamadı</h1>
        <p className="mt-3 text-ink-soft">Sipariş özetinize bu sayfadan artık ulaşılamıyor. Siparişinizle ilgili bilgiler e-posta adresinize gönderilir.</p>
        <Link href="/" className="btn-primary mt-8 px-8">
          Ana Sayfaya Dön
        </Link>
      </div>
    )
  }

  const transfer = order.payment === 'transfer'

  return (
    <div className="container max-w-3xl pb-20 pt-12 lg:pb-28">
      <div className="text-center">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-leaf text-white">
          <Check className="h-8 w-8" strokeWidth={3} aria-hidden="true" />
        </span>
        <h1 className="mt-6 font-display text-[clamp(2.25rem,4.5vw,3.25rem)] font-medium leading-tight">Teşekkürler, siparişiniz alındı!</h1>
        <p className="mt-3 text-lg text-ink-soft">
          Sipariş numaranız: <strong className="font-bold text-ink">{order.number}</strong>
        </p>
      </div>

      {site.demoMode && (
        <p className="mt-8 flex gap-3 rounded-2xl border border-notice/25 bg-notice-soft px-4 py-3 text-[0.9375rem] text-notice">
          <Info className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
          <span>
            <strong className="font-semibold">Önizleme modu:</strong> Bu bir deneme siparişidir; ödeme alınmadı ve e-posta gönderilmedi.
          </span>
        </p>
      )}

      {transfer && (
        <section className="mt-8 rounded-3xl border-2 border-ink bg-white p-6" aria-labelledby="havale">
          <h2 id="havale" className="flex items-center gap-2 text-lg font-semibold">
            <Landmark className="h-5 w-5" aria-hidden="true" /> Havale / EFT bilgileri
          </h2>
          <p className="mt-2 text-ink-soft">
            Lütfen <strong className="text-ink">{formatPrice(order.total)}</strong> tutarı aşağıdaki hesaba gönderin ve açıklamaya sipariş numaranızı (
            <strong className="text-ink">{order.number}</strong>) yazın. Ödemeniz ulaştığında siparişiniz hazırlanır.
          </p>
          <dl className="mt-4 grid gap-3 rounded-2xl bg-paper-cream p-4 text-[0.9375rem] sm:grid-cols-[8rem_1fr]">
            <dt className="text-ink-mute">Banka</dt>
            <dd className="font-medium">{company.bank.name}</dd>
            <dt className="text-ink-mute">Alıcı</dt>
            <dd className="font-medium">{company.bank.accountHolder}</dd>
            <dt className="text-ink-mute">IBAN</dt>
            <dd className="break-all font-mono font-semibold">{company.bank.iban}</dd>
            <dt className="text-ink-mute">Açıklama</dt>
            <dd className="font-medium">{order.number}</dd>
          </dl>
        </section>
      )}

      <ol className="mt-8 grid gap-3 sm:grid-cols-2">
        <li className="flex gap-3 rounded-2xl border border-line bg-white p-5">
          <Mail className="mt-0.5 h-5 w-5 shrink-0 text-ink-soft" aria-hidden="true" />
          <span className="text-[0.9375rem]">
            Sipariş özetiniz ve sözleşmeleriniz <strong className="font-semibold">{order.customer.email}</strong> adresine gönderilecek.
          </span>
        </li>
        <li className="flex gap-3 rounded-2xl border border-line bg-white p-5">
          <Package className="mt-0.5 h-5 w-5 shrink-0 text-ink-soft" aria-hidden="true" />
          <span className="text-[0.9375rem]">
            {transfer ? 'Ödemeniz ulaştıktan sonra' : 'Siparişiniz'} <strong className="font-semibold">{site.commerce.dispatchDays} iş günü</strong> içinde kargoya verilir.
          </span>
        </li>
      </ol>

      <section className="mt-8 rounded-3xl border border-line bg-white p-6" aria-labelledby="ozet">
        <h2 id="ozet" className="text-lg font-semibold">
          Sipariş özeti
        </h2>
        <p className="mt-1 text-sm text-ink-mute">{formatDate(order.createdAt)}</p>
        <ul className="mt-4 divide-y divide-line border-y border-line">
          {order.items.map((i) => (
            <li key={i.slug} className="flex justify-between gap-4 py-3 text-[0.9375rem]">
              <span>
                {productLine.name} — <strong className="font-semibold">{i.scent}</strong> × {i.qty}
              </span>
              <span className="font-semibold tabular-nums">{formatPrice(i.lineTotal)}</span>
            </li>
          ))}
        </ul>
        <dl className="mt-4 space-y-2 text-[0.9375rem]">
          <div className="flex justify-between">
            <dt className="text-ink-soft">Kargo</dt>
            <dd>{order.shipping === 0 ? 'Ücretsiz' : formatPrice(order.shipping)}</dd>
          </div>
          <div className="flex justify-between text-lg font-bold">
            <dt>Toplam</dt>
            <dd className="tabular-nums">{formatPrice(order.total)}</dd>
          </div>
        </dl>
        <dl className="mt-6 grid gap-4 border-t border-line pt-5 text-[0.9375rem] sm:grid-cols-2">
          <div>
            <dt className="text-sm text-ink-mute">Teslimat adresi</dt>
            <dd className="mt-1">
              {order.customer.name}
              <br />
              {order.deliveryAddress}
              <br />
              {order.customer.phone}
            </dd>
          </div>
          <div>
            <dt className="text-sm text-ink-mute">Ödeme yöntemi</dt>
            <dd className="mt-1">{paymentLabels[order.payment]}</dd>
            <dt className="mt-3 text-sm text-ink-mute">Fatura</dt>
            <dd className="mt-1">{order.invoice}</dd>
          </div>
        </dl>
      </section>

      <div className="mt-10 text-center">
        <Link href="/" className="btn-secondary px-8">
          Ana Sayfaya Dön
        </Link>
      </div>
    </div>
  )
}
