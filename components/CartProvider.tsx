'use client'

import { createContext, useCallback, useContext, useMemo, useState, useSyncExternalStore } from 'react'

import { menu, restaurant, type MenuItem } from '@/data/yemek'

type Line = MenuItem & { qty: number }

type CartCtx = {
  cart: Record<string, number>
  lines: Line[]
  count: number
  subtotal: number
  total: number
  add: (id: string, qty: number) => void
  change: (id: string, delta: number) => void
  clear: () => void
  open: boolean
  setOpen: (v: boolean) => void
  query: string
  setQuery: (v: string) => void
}

const Ctx = createContext<CartCtx | null>(null)
const KEY = 'marmara-sepet'

// Sepet localStorage'da tutulur (sayfa yenilenince kaybolmasın); useSyncExternalStore
// sunucu/istemci uyumsuzluğu olmadan okur. Depolama kapalıysa bellekte çalışır.
let memory = '{}'
const listeners = new Set<() => void>()

const subscribe = (cb: () => void) => {
  listeners.add(cb)
  const onStorage = (e: StorageEvent) => e.key === KEY && cb()
  window.addEventListener('storage', onStorage)
  return () => {
    listeners.delete(cb)
    window.removeEventListener('storage', onStorage)
  }
}
const getSnapshot = () => {
  try {
    return localStorage.getItem(KEY) ?? memory
  } catch {
    return memory
  }
}
const getServerSnapshot = () => '{}'

function parse(raw: string): Record<string, number> {
  const clean: Record<string, number> = {}
  try {
    const saved = JSON.parse(raw)
    for (const m of menu) {
      const q = Number(saved?.[m.id])
      if (Number.isInteger(q) && q > 0) clean[m.id] = Math.min(q, 50)
    }
  } catch {}
  return clean
}

function write(next: Record<string, number>) {
  memory = JSON.stringify(next)
  try {
    localStorage.setItem(KEY, memory)
  } catch {}
  listeners.forEach((l) => l())
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const raw = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
  const cart = useMemo(() => parse(raw), [raw])
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')

  const change = useCallback((id: string, delta: number) => {
    const cur = parse(getSnapshot())
    const q = Math.min(50, Math.max(0, (cur[id] ?? 0) + delta))
    if (q) cur[id] = q
    else delete cur[id]
    write(cur)
  }, [])

  const value = useMemo<CartCtx>(() => {
    const lines = menu.filter((m) => cart[m.id]).map((m) => ({ ...m, qty: cart[m.id] }))
    const subtotal = lines.reduce((s, l) => s + l.price * l.qty, 0)
    const count = lines.reduce((s, l) => s + l.qty, 0)
    return {
      cart,
      lines,
      count,
      subtotal,
      total: subtotal + (count ? restaurant.deliveryFee : 0),
      add: (id, qty) => change(id, qty),
      change,
      clear: () => write({}),
      open,
      setOpen,
      query,
      setQuery,
    }
  }, [cart, change, open, query])

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useCart() {
  const c = useContext(Ctx)
  if (!c) throw new Error('useCart must be used inside CartProvider')
  return c
}
