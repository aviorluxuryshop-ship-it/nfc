'use client'

import Image from 'next/image'
import { Minus, Plus, ShoppingCart } from 'lucide-react'

import { imageOf, type MenuItem } from '@/data/yemek'
import { tl } from '@/lib/format'

import { useCart } from './CartProvider'

const stepBtn = 'flex h-10 w-10 items-center justify-center rounded-full text-marmara transition hover:bg-marmara-100 active:scale-95'

export function ProductCard({ item, level = 3, priority = false }: { item: MenuItem; level?: 2 | 3; priority?: boolean }) {
  const { cart, add, change } = useCart()
  const inCart = cart[item.id] ?? 0
  const Title = level === 2 ? 'h2' : 'h3'

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-ink/10 bg-white shadow-soft transition duration-300 hover:-translate-y-1 hover:shadow-card">
      <div className="relative aspect-[4/3] overflow-hidden bg-marmara-50">
        <Image
          src={imageOf(item.id)}
          alt={item.name}
          fill
          priority={priority}
          sizes="(min-width:1280px) 20vw, (min-width:1024px) 25vw, (min-width:640px) 33vw, 50vw"
          className="object-cover transition duration-700 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col p-4">
        <Title className="min-h-[2.75rem] text-[1.05rem] font-bold leading-snug">{item.name}</Title>
        <p className="mt-1 text-sm">
          <b className="text-lg text-marmara">{tl(item.price)}</b> <span className="text-ink-mute">/ Paket</span>
        </p>

        {inCart > 0 ? (
          <div className="mt-3 flex h-12 items-center justify-between rounded-xl bg-marmara-50 px-1.5" role="group" aria-label={`${item.name}, sepette ${inCart} paket`}>
            <button type="button" aria-label={`${item.name} azalt`} onClick={() => change(item.id, -1)} className={stepBtn}>
              <Minus size={18} />
            </button>
            <span className="text-center font-bold" aria-live="polite">{inCart} paket</span>
            <button type="button" aria-label={`${item.name} arttır`} onClick={() => change(item.id, 1)} className={stepBtn}>
              <Plus size={18} />
            </button>
          </div>
        ) : (
          <button
            type="button"
            aria-label={`Sepete ekle: ${item.name}`}
            onClick={() => add(item.id, 1)}
            className="mt-3 flex h-12 items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-marmara px-3 text-sm font-bold text-white transition hover:bg-marmara-dim active:scale-[0.98]"
          >
            <ShoppingCart size={18} aria-hidden />
            Sepete Ekle
          </button>
        )}
      </div>
    </article>
  )
}
