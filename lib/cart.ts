import { getProduct, products, type Product, type ScentSlug } from '@/data/products'
import { site } from '@/data/site'

import { createStorageStore } from './storage-store'

export type CartLine = { slug: ScentSlug; qty: number }

export type CartItem = CartLine & { product: Product; lineTotal: number }

export type CartTotals = {
  items: CartItem[]
  count: number
  subtotal: number
  shipping: number
  total: number
  /** Kuruş still needed for free shipping; 0 once reached. */
  toFreeShipping: number
}

const { maxQuantity, shippingFee, freeShippingThreshold } = site.commerce

const EMPTY: CartLine[] = []

export function clampQty(qty: number) {
  if (!Number.isFinite(qty)) return 1
  return Math.min(maxQuantity, Math.max(1, Math.round(qty)))
}

export const cartStore = createStorageStore<CartLine[]>({
  key: 'velmo-cart-v1',
  fallback: EMPTY,
  serverValue: EMPTY,
  parse(raw) {
    if (!Array.isArray(raw)) return null
    // Drop anything that no longer matches a product (renamed slug, etc).
    return raw
      .filter((l): l is CartLine => !!l && typeof l === 'object' && !!getProduct(l.slug) && typeof l.qty === 'number')
      .map((l) => ({ slug: l.slug, qty: clampQty(l.qty) }))
  },
})

export function addToCart(slug: ScentSlug, qty = 1) {
  const lines = cartStore.get()
  const existing = lines.find((l) => l.slug === slug)
  cartStore.set(
    existing
      ? lines.map((l) => (l.slug === slug ? { ...l, qty: clampQty(l.qty + qty) } : l))
      : [...lines, { slug, qty: clampQty(qty) }],
  )
}

export function setCartQty(slug: ScentSlug, qty: number) {
  cartStore.set(cartStore.get().map((l) => (l.slug === slug ? { ...l, qty: clampQty(qty) } : l)))
}

export function removeFromCart(slug: ScentSlug) {
  cartStore.set(cartStore.get().filter((l) => l.slug !== slug))
}

export function clearCart() {
  cartStore.set(EMPTY)
}

export function computeTotals(lines: CartLine[]): CartTotals {
  // Keep catalogue order so the cart never reshuffles while editing.
  const items = products
    .map((product) => {
      const line = lines.find((l) => l.slug === product.slug)
      return line ? { ...line, product, lineTotal: product.price * line.qty } : null
    })
    .filter((i): i is CartItem => i !== null)

  const count = items.reduce((n, i) => n + i.qty, 0)
  const subtotal = items.reduce((n, i) => n + i.lineTotal, 0)
  const freeShipping = subtotal >= freeShippingThreshold
  const shipping = count === 0 || freeShipping ? 0 : shippingFee
  return {
    items,
    count,
    subtotal,
    shipping,
    total: subtotal + shipping,
    toFreeShipping: freeShipping ? 0 : freeShippingThreshold - subtotal,
  }
}
