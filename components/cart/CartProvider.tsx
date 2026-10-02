'use client'

import { createContext, useCallback, useContext, useMemo, useState, useSyncExternalStore } from 'react'

import type { ScentSlug } from '@/data/products'
import { addToCart, cartStore, computeTotals, type CartTotals } from '@/lib/cart'

type CartContextValue = CartTotals & {
  isOpen: boolean
  openCart: () => void
  closeCart: () => void
  /** Adds and opens the drawer so the customer sees it happened. */
  add: (slug: ScentSlug, qty?: number) => void
  /** Most recently added scent — the drawer highlights it. */
  lastAdded: ScentSlug | null
}

const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const lines = useSyncExternalStore(cartStore.subscribe, cartStore.getSnapshot, cartStore.getServerSnapshot)
  const [isOpen, setOpen] = useState(false)
  const [lastAdded, setLastAdded] = useState<ScentSlug | null>(null)

  const openCart = useCallback(() => setOpen(true), [])
  const closeCart = useCallback(() => setOpen(false), [])
  const add = useCallback((slug: ScentSlug, qty = 1) => {
    addToCart(slug, qty)
    setLastAdded(slug)
    setOpen(true)
  }, [])

  const value = useMemo(
    () => ({ ...computeTotals(lines), isOpen, openCart, closeCart, add, lastAdded }),
    [lines, isOpen, openCart, closeCart, add, lastAdded],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>')
  return ctx
}
