'use client'

import Link from 'next/link'
import { Check, Info, Landmark, Mail, Package } from 'lucide-react'
import { useMemo, useSyncExternalStore } from 'react'

import { company } from '@/data/company'
import { productText } from '@/data/products'
import { site } from '@/data/site'
import { LAST_ORDER_KEY, paymentLabel, type PlacedOrder } from '@/lib/checkout'
import { formatDate, formatPrice } from '@/lib/format'
import { useI18n } from '@/lib/i18n/client'

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
  const { locale, t, paths } = useI18n()
  const c = t.confirmation
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
        <h1 className="font-display text-4xl font-medium">{c.notFoundTitle}</h1>
        <p className="mt-3 text-ink-soft">{c.notFoundLead}</p>
        <Link href={paths.home} className="btn-primary mt-8 px-8">
          {c.backHome}
        </Link>
      </div>
    )
  }

  const transfer = order.payment === 'transfer'
  const [tl1, tlTotal, tl2, tlNo, tl3] = c.transferLead(formatPrice(order.total), order.number)
  const [em1, emAddr, em2] = c.emailNote(order.customer.email)
  const [dn1, dnDays, dn2] = c.dispatchNote(transfer, site.commerce.dispatchDays)

  return (
    <div data-reveal="stagger" className="container max-w-3xl pb-20 pt-12 lg:pb-28">
      <div className="text-center">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-leaf text-white">
          <Check className="h-8 w-8" strokeWidth={3} aria-hidden="true" />
        </span>
        <h1 className="mt-6 font-display text-[clamp(2.25rem,4.5vw,3.25rem)] font-medium leading-tight">{c.title}</h1>
        <p className="mt-3 text-lg text-ink-soft">
          {c.number} <strong className="font-bold text-ink">{order.number}</strong>
        </p>
      </div>

      {site.demoMode && (
        <p className="mt-8 flex gap-3 rounded-2xl border border-notice/25 bg-notice-soft px-4 py-3 text-[0.9375rem] text-notice">
          <Info className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
          <span>
            <strong className="font-semibold">{t.checkout.demoStrong}</strong> {c.demo}
          </span>
        </p>
      )}

      {transfer && (
        <section className="mt-8 rounded-3xl border-2 border-ink bg-white p-6" aria-labelledby="havale">
          <h2 id="havale" className="flex items-center gap-2 text-lg font-semibold">
            <Landmark className="h-5 w-5" aria-hidden="true" /> {c.transferTitle}
          </h2>
          <p className="mt-2 text-ink-soft">
            {tl1}
            <strong className="text-ink">{tlTotal}</strong>
            {tl2}
            <strong className="text-ink">{tlNo}</strong>
            {tl3}
          </p>
          <dl className="mt-4 grid gap-3 rounded-2xl bg-paper-cream p-4 text-[0.9375rem] sm:grid-cols-[8rem_1fr]">
            <dt className="text-ink-mute">{c.bank}</dt>
            <dd className="font-medium">{company.bank.name}</dd>
            <dt className="text-ink-mute">{c.holder}</dt>
            <dd className="font-medium">{company.bank.accountHolder}</dd>
            <dt className="text-ink-mute">{c.iban}</dt>
            <dd className="break-all font-mono font-semibold">{company.bank.iban}</dd>
            <dt className="text-ink-mute">{c.reference}</dt>
            <dd className="font-medium">{order.number}</dd>
          </dl>
        </section>
      )}

      <ol className="mt-8 grid gap-3 sm:grid-cols-2">
        <li className="flex gap-3 rounded-2xl border border-line bg-white p-5">
          <Mail className="mt-0.5 h-5 w-5 shrink-0 text-ink-soft" aria-hidden="true" />
          <span className="text-[0.9375rem]">
            {em1}
            <strong className="font-semibold">{emAddr}</strong>
            {em2}
          </span>
        </li>
        <li className="flex gap-3 rounded-2xl border border-line bg-white p-5">
          <Package className="mt-0.5 h-5 w-5 shrink-0 text-ink-soft" aria-hidden="true" />
          <span className="text-[0.9375rem]">
            {dn1}
            <strong className="font-semibold">{dnDays}</strong>
            {dn2}
          </span>
        </li>
      </ol>

      <section className="mt-8 rounded-3xl border border-line bg-white p-6" aria-labelledby="ozet">
        <h2 id="ozet" className="text-lg font-semibold">
          {c.summary}
        </h2>
        <p className="mt-1 text-sm text-ink-mute">{formatDate(order.createdAt, locale)}</p>
        <ul className="mt-4 divide-y divide-line border-y border-line">
          {order.items.map((i) => (
            <li key={i.slug} className="flex justify-between gap-4 py-3 text-[0.9375rem]">
              <span>
                {productText[locale].name} — <strong className="font-semibold">{i.scent}</strong> × {i.qty}
              </span>
              <span className="font-semibold tabular-nums">{formatPrice(i.lineTotal)}</span>
            </li>
          ))}
        </ul>
        <dl className="mt-4 space-y-2 text-[0.9375rem]">
          <div className="flex justify-between">
            <dt className="text-ink-soft">{c.shipping}</dt>
            <dd>{order.shipping === 0 ? c.free : formatPrice(order.shipping)}</dd>
          </div>
          <div className="flex justify-between text-lg font-bold">
            <dt>{c.total}</dt>
            <dd className="tabular-nums">{formatPrice(order.total)}</dd>
          </div>
        </dl>
        <dl className="mt-6 grid gap-4 border-t border-line pt-5 text-[0.9375rem] sm:grid-cols-2">
          <div>
            <dt className="text-sm text-ink-mute">{c.delivery}</dt>
            <dd className="mt-1">
              {order.customer.name}
              <br />
              {order.deliveryAddress}
              <br />
              {order.customer.phone}
            </dd>
          </div>
          <div>
            <dt className="text-sm text-ink-mute">{c.payment}</dt>
            <dd className="mt-1">{paymentLabel(order.payment, t)}</dd>
            <dt className="mt-3 text-sm text-ink-mute">{c.invoice}</dt>
            <dd className="mt-1">{order.invoice}</dd>
          </div>
        </dl>
      </section>

      <div className="mt-10 text-center">
        <Link href={paths.home} className="btn-secondary px-8">
          {c.backHome}
        </Link>
      </div>
    </div>
  )
}
