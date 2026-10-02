'use client'

import { Check, ShoppingBag } from 'lucide-react'
import { useRef, useState } from 'react'

import { useCart } from '@/components/cart/CartProvider'
import type { ScentSlug } from '@/data/products'
import { useI18n } from '@/lib/i18n/client'

/**
 * The one button that matters. Says exactly what it does, confirms with a
 * green tick, and opens the cart drawer so the result is visible.
 */
export function AddToCartButton({
  slug,
  qty = 1,
  label,
  className = '',
  disabled = false,
}: {
  slug: ScentSlug
  qty?: number
  label?: React.ReactNode
  className?: string
  disabled?: boolean
}) {
  const { add } = useCart()
  const { t } = useI18n()
  const [done, setDone] = useState(false)
  const timer = useRef<number | undefined>(undefined)

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => {
        add(slug, qty)
        setDone(true)
        window.clearTimeout(timer.current)
        timer.current = window.setTimeout(() => setDone(false), 2200)
      }}
      className={`${done ? 'btn-success' : 'btn-primary'} ${className}`}
    >
      {done ? (
        <>
          <Check className="h-5 w-5" strokeWidth={3} aria-hidden="true" /> {t.common.added}
        </>
      ) : (
        <>
          <ShoppingBag className="h-5 w-5" aria-hidden="true" /> {disabled ? t.common.outOfStock : (label ?? t.common.addToCart)}
        </>
      )}
    </button>
  )
}
