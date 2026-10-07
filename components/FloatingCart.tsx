'use client'

import { usePathname } from 'next/navigation'
import { ShoppingBag } from 'lucide-react'

import { restaurant } from '@/data/yemek'
import { tl } from '@/lib/format'

import { useCart } from './CartProvider'

export function FloatingCart() {
  const { count, subtotal, open, setOpen } = useCart()
  const pathname = usePathname()
  if (!count || open || pathname === '/siparis') return null
  const belowMin = subtotal < restaurant.minOrder
  return (
    <button
      onClick={() => setOpen(true)}
      className="fixed inset-x-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-40 mx-auto flex max-w-md animate-fade-up items-center justify-between gap-3 whitespace-nowrap rounded-full bg-marmara px-5 py-3 text-sm font-bold text-white shadow-lift transition hover:bg-marmara-dim sm:px-6 sm:text-base"
    >
      <span className="flex items-center gap-2"><ShoppingBag size={20} aria-hidden /> Sepetim ({count})</span>
      <span className="text-right leading-tight">
        <b className="block text-base font-extrabold sm:text-lg">{tl(subtotal)}</b>
        <span className="block text-[0.7rem] font-semibold">{belowMin ? `Min. sipariş ${tl(restaurant.minOrder)}` : 'Siparişi tamamla'}</span>
      </span>
    </button>
  )
}

// Yüzen sepet butonu sayfanın son satırlarını örtmesin diye altta boşluk bırakır.
export function CartSpacer() {
  const { count } = useCart()
  const pathname = usePathname()
  return <div aria-hidden className={count && pathname !== '/siparis' ? 'h-24' : 'h-0'} />
}
