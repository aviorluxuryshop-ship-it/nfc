import { menu, restaurant } from '@/data/yemek'

export type OrderInput = {
  name: string
  phone: string
  address: string
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

export function priceOrder(items: OrderInput['items']): PricedOrder | null {
  const lines: PricedOrder['lines'] = []
  let subtotal = 0
  for (const it of items) {
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
    `📍 ${o.address}`,
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
