import { menu, neighborhoods, restaurant } from '@/data/yemek'

export type OrderInput = {
  name: string
  phone: string
  neighborhood: string
  street: string
  no: string
  floor?: string
  apt?: string
  business?: string
  note?: string
  lat?: number
  lng?: number
  items: { id: string; qty: number }[]
}

export type PricedOrder = {
  lines: { name: string; qty: number; total: number }[]
  subtotal: number
  deliveryFee: number
  total: number
}

export const isServedNeighborhood = (n: string) => neighborhoods.some((x) => x.name === n)

export function priceOrder(items: OrderInput['items']): PricedOrder | null {
  const lines: PricedOrder['lines'] = []
  let subtotal = 0
  for (const it of items) {
    if (!it || typeof it.id !== 'string') return null
    const m = menu.find((x) => x.id === it.id)
    const qty = Math.floor(Number(it.qty))
    if (!m || !(qty >= 1 && qty <= 50)) return null
    lines.push({ name: m.name, qty, total: m.price * qty })
    subtotal += m.price * qty
  }
  if (!lines.length || subtotal < restaurant.minOrder) return null
  return { lines, subtotal, deliveryFee: restaurant.deliveryFee, total: subtotal + restaurant.deliveryFee }
}

export function formatOrderMessage(code: string, o: OrderInput, p: PricedOrder): string {
  const loc =
    typeof o.lat === 'number' && typeof o.lng === 'number'
      ? `https://maps.google.com/?q=${o.lat},${o.lng}`
      : 'Paylaşılmadı'
  return [
    `🛎️ YENİ SİPARİŞ #${code}`,
    `👤 ${o.name}`,
    `📞 ${o.phone}`,
    `🏢 İşletme: ${o.business || '-'}`,
    `📍 ${o.neighborhood} Mah. ${o.street}`,
    `No: ${o.no} Kat: ${o.floor || '-'} Daire: ${o.apt || '-'}`,
    `🗺️ Konum: ${loc}`,
    '',
    ...p.lines.map((l) => `• ${l.qty} x ${l.name} — ${l.total} TL`),
    '',
    `Ara toplam: ${p.subtotal} TL`,
    `Teslimat: ${p.deliveryFee} TL`,
    `TOPLAM: ${p.total} TL`,
    `💵 Ödeme: Kapıda ödeme`,
    o.note ? `📝 Not: ${o.note}` : '',
  ]
    .filter((l, i, a) => l !== '' || a[i - 1] !== '')
    .join('\n')
}
