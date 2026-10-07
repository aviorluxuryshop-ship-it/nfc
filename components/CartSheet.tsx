'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect, useEffectEvent, useRef } from 'react'
import { Minus, Plus, ShoppingBag, X } from 'lucide-react'

import { imageOf, restaurant } from '@/data/yemek'
import { tl } from '@/lib/format'

import { useCart } from './CartProvider'

const stepBtn = 'flex h-10 w-10 items-center justify-center rounded-full bg-marmara-50 text-marmara transition hover:bg-marmara-100'
const focusable = 'a[href],button:not([disabled]),input:not([disabled]):not([tabindex="-1"]),select:not([disabled]),textarea:not([disabled])'

// Sepet paneli: ürünler, tutar ve "Sipariş ver". Adres/isim/ödeme bilgileri /siparis sayfasında girilir.
export function CartSheet() {
  const router = useRouter()
  const { open, setOpen, lines, subtotal, total, change } = useCart()
  const dialogRef = useRef<HTMLDivElement>(null)

  const close = () => setOpen(false)
  const onEscape = useEffectEvent(close)

  // Açılınca odak pencereye taşınır, Tab pencerede döner, kapanınca odak geri verilir.
  useEffect(() => {
    if (!open) return
    const opener = document.activeElement as HTMLElement | null
    dialogRef.current?.focus()
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') return onEscape()
      if (e.key !== 'Tab' || !dialogRef.current) return
      const items = [...dialogRef.current.querySelectorAll<HTMLElement>(focusable)]
      if (!items.length) return
      const first = items[0]
      const last = items[items.length - 1]
      if (e.shiftKey && (document.activeElement === first || document.activeElement === dialogRef.current)) { e.preventDefault(); last.focus() }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus() }
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
      opener?.focus?.()
    }
  }, [open])

  if (!open) return null

  const missing = restaurant.minOrder - subtotal
  const belowMin = missing > 0
  const progress = Math.min(100, Math.round((subtotal / restaurant.minOrder) * 100))

  const order = () => {
    setOpen(false)
    router.push('/siparis')
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button tabIndex={-1} aria-label="Kapat" onClick={close} className="absolute inset-0 animate-fade-in bg-ink/55 backdrop-blur-sm" />
      <div
        ref={dialogRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="sepet-baslik"
        className="relative flex h-full w-full max-w-md animate-slide-in flex-col bg-white shadow-lift outline-none"
      >
        <div className="flex items-center justify-between border-b border-ink/10 px-5 py-4">
          <h2 id="sepet-baslik" className="font-display text-2xl font-bold">Sepetim</h2>
          <button onClick={close} aria-label="Sepeti kapat" className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-paper-raised"><X /></button>
        </div>

        {!lines.length ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
            <ShoppingBag size={44} className="text-marmara" />
            <p className="text-lg font-semibold">Sepetin henüz boş.</p>
            <button onClick={close} className="rounded-full bg-marmara px-7 py-3 font-bold text-white">Ürünlere göz at</button>
          </div>
        ) : (
          <>
            <div className="flex-1 space-y-5 overflow-y-auto px-5 py-5">
              <ul className="divide-y divide-ink/10 rounded-2xl border border-ink/10">
                {lines.map((l) => (
                  <li key={l.id} className="flex items-center gap-3 p-3">
                    <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-marmara-50">
                      <Image src={imageOf(l.id)} alt="" fill sizes="56px" className="object-cover" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-semibold">{l.name}</span>
                      <span className="text-sm text-ink-mute">{tl(l.price)} / Paket</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <button type="button" aria-label={`${l.name} azalt`} onClick={() => change(l.id, -1)} className={stepBtn}><Minus size={16} /></button>
                      <span className="w-6 text-center font-bold" aria-label={`${l.qty} paket`}>{l.qty}</span>
                      <button type="button" aria-label={`${l.name} arttır`} onClick={() => change(l.id, 1)} className={stepBtn}><Plus size={16} /></button>
                    </span>
                    <b className="w-16 shrink-0 text-right">{tl(l.price * l.qty)}</b>
                  </li>
                ))}
              </ul>

              <div>
                <div className="h-2 overflow-hidden rounded-full bg-marmara-50" role="progressbar" aria-label="Minimum sipariş tutarı" aria-valuemin={0} aria-valuemax={restaurant.minOrder} aria-valuenow={Math.min(subtotal, restaurant.minOrder)}>
                  <div className="h-full rounded-full bg-marmara transition-all" style={{ width: `${progress}%` }} />
                </div>
                <p className={`mt-2 text-sm font-semibold ${belowMin ? 'text-marmara' : 'text-green-700'}`}>
                  {belowMin ? `Minimum sipariş ${tl(restaurant.minOrder)}: ${tl(missing)} daha ürün ekle.` : 'Minimum sipariş tutarına ulaştın ✓'}
                </p>
              </div>
            </div>

            <div className="border-t border-ink/10 bg-white px-5 py-4">
              <dl className="space-y-1.5 text-sm">
                <div className="flex justify-between"><dt className="text-ink-soft">Ara toplam</dt><dd className="font-semibold">{tl(subtotal)}</dd></div>
                <div className="flex justify-between"><dt className="text-ink-soft">Teslimat</dt><dd className="font-semibold">{restaurant.deliveryFee ? tl(restaurant.deliveryFee) : 'Ücretsiz'}</dd></div>
              </dl>
              <p className="mt-2 flex items-baseline justify-between">
                <span className="font-bold">Toplam</span>
                <b className="text-2xl text-marmara">{tl(total)}</b>
              </p>
              <button onClick={order} disabled={belowMin} className="mt-3 w-full rounded-xl bg-marmara px-6 py-4 text-lg font-bold text-white transition hover:bg-marmara-dim disabled:opacity-50">
                {belowMin ? `${tl(missing)} daha ekle` : 'Sipariş ver'}
              </button>
              <p className="mt-2 text-center text-xs text-ink-soft">Adres ve ödeme bilgilerini bir sonraki sayfada gireceksin.</p>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
