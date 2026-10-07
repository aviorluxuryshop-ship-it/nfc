'use client'

import { ShoppingBag } from 'lucide-react'

import { restaurant } from '@/data/yemek'
import { tl } from '@/lib/format'

import { useCart } from './CartProvider'

export function FloatingCart() {
  const { count, subtotal, open, setOpen } = useCart()
  if (!count || open) return null
  const missing = restaurant.minOrder - subtotal
  return (
    <button
      onClick={() => setOpen(true)}
      className="fixed inset-x-4 bottom-4 z-40 mx-auto flex max-w-md animate-fade-up items-center justify-between rounded-full bg-marmara px-6 py-4 font-bold text-white shadow-lift transition hover:bg-marmara-dim"
    >
      <span className="flex items-center gap-2"><ShoppingBag size={20} /> Sepetim ({count})</span>
      <span>{missing > 0 ? `${tl(missing)} daha ekle` : `${tl(subtotal)} · Siparişi tamamla`}</span>
    </button>
  )
}
