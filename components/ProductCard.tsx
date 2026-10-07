'use client'

import Image from 'next/image'
import { useState } from 'react'
import { Check, Minus, Plus, ShoppingCart } from 'lucide-react'

import { imageOf, type MenuItem } from '@/data/yemek'
import { tl } from '@/lib/format'

import { useCart } from './CartProvider'

export function ProductCard({ item }: { item: MenuItem }) {
  const { cart, add } = useCart()
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)
  const inCart = cart[item.id] ?? 0

  const onAdd = () => {
    add(item.id, qty)
    setQty(1)
    setAdded(true)
    setTimeout(() => setAdded(false), 1400)
  }

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-ink/10 bg-white shadow-soft transition duration-300 hover:-translate-y-1 hover:shadow-card">
      <div className="relative aspect-[4/3] overflow-hidden bg-marmara-50">
        <Image
          src={imageOf(item.id)}
          alt={item.name}
          fill
          sizes="(min-width:1280px) 20vw, (min-width:1024px) 25vw, (min-width:640px) 33vw, 50vw"
          className="object-cover transition duration-700 group-hover:scale-105"
        />
        {inCart > 0 && (
          <span className="absolute right-2.5 top-2.5 rounded-full bg-marmara px-3 py-1 text-xs font-bold text-white shadow-soft">
            Sepette: {inCart}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="text-[1.05rem] font-bold leading-snug">{item.name}</h3>
        <p className="mt-1 text-sm">
          <b className="text-lg text-marmara">{tl(item.price)}</b> <span className="text-ink-mute">/ Paket</span>
        </p>

        <div className="mt-4 flex items-center justify-between rounded-full bg-marmara-50 p-1">
          <button
            type="button"
            aria-label="Azalt"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="flex h-9 w-9 items-center justify-center rounded-full text-marmara transition hover:bg-marmara-100"
          >
            <Minus size={16} />
          </button>
          <span className="w-8 text-center font-bold" aria-live="polite">{qty}</span>
          <button
            type="button"
            aria-label="Arttır"
            onClick={() => setQty((q) => Math.min(50, q + 1))}
            className="flex h-9 w-9 items-center justify-center rounded-full text-marmara transition hover:bg-marmara-100"
          >
            <Plus size={16} />
          </button>
        </div>

        <button
          type="button"
          onClick={onAdd}
          className={`mt-3 flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold text-white transition active:scale-[0.98] ${added ? 'bg-green-700' : 'bg-marmara hover:bg-marmara-dim'}`}
        >
          {added ? <Check size={18} /> : <ShoppingCart size={18} />}
          {added ? 'Sepete eklendi' : 'Sepete Ekle'}
        </button>
      </div>
    </article>
  )
}
