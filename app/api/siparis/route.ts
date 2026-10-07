import { NextResponse } from 'next/server'

import { restaurant } from '@/data/yemek'
import { formatOrderMessage, isPaymentMethod, isServedNeighborhood, priceOrder, type OrderInput } from '@/lib/orders'

export const runtime = 'nodejs'

const clean = (v: unknown, max: number) => String(v ?? '').replace(/\s+/g, ' ').trim().slice(0, max)
const coord = (v: unknown, limit: number) => (typeof v === 'number' && Number.isFinite(v) && Math.abs(v) <= limit ? v : undefined)

// Aynı ürün birden fazla satırda gelirse miktarlar birleştirilir; 50 pakete kadar kabul edilir.
function mergeItems(raw: unknown): OrderInput['items'] {
  if (!Array.isArray(raw)) return []
  const byId = new Map<string, number>()
  for (const it of raw.slice(0, 60)) {
    if (!it || typeof it !== 'object') continue
    const { id, qty } = it as { id?: unknown; qty?: unknown }
    if (typeof id !== 'string') continue
    byId.set(id, (byId.get(id) ?? 0) + Math.floor(Number(qty) || 0))
  }
  return [...byId].map(([id, qty]) => ({ id, qty }))
}

export async function POST(req: Request) {
  let body: Record<string, unknown>
  try {
    const parsed = await req.json()
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) throw new Error('shape')
    body = parsed
  } catch {
    return NextResponse.json({ error: 'Geçersiz istek.' }, { status: 400 })
  }

  // Honeypot: gerçek kullanıcılar bu alanı görmez, botlar doldurur. Bota başarılı gibi görünür, mesaj gönderilmez.
  if (body.hp_url) return NextResponse.json({ ok: true, code: '00000', total: 0 })

  const phone = clean(body.phone, 20)
  const order: OrderInput = {
    name: clean(body.name, 60),
    phone,
    neighborhood: clean(body.neighborhood, 60),
    street: clean(body.street, 80),
    no: clean(body.no, 10),
    floor: clean(body.floor, 10),
    apt: clean(body.apt, 10),
    business: clean(body.business, 80),
    note: clean(body.note, 200),
    payment: isPaymentMethod(body.payment) ? body.payment : 'nakit',
    lat: coord(body.lat, 90),
    lng: coord(body.lng, 180),
    items: mergeItems(body.items),
  }

  if (!isPaymentMethod(body.payment)) {
    return NextResponse.json({ error: 'Ödeme yöntemini seçin (nakit ya da kart).' }, { status: 400 })
  }

  const digits = phone.replace(/\D/g, '')
  if (order.name.length < 2 || !isServedNeighborhood(order.neighborhood) || order.street.length < 2 || !order.no || digits.length < 10 || digits.length > 13) {
    return NextResponse.json({ error: 'Ad, telefon, mahalle, sokak ve bina no alanlarını eksiksiz doldurun. Sadece Merter civarına servis var.' }, { status: 400 })
  }
  const priced = priceOrder(order.items)
  if (!priced) {
    return NextResponse.json({ error: 'Sepet geçersiz ya da minimum tutarın altında.' }, { status: 400 })
  }

  const code = Math.random().toString(36).slice(2, 7).toUpperCase()
  const text = formatOrderMessage(code, order, priced)

  const token = process.env.WHATSAPP_TOKEN
  const phoneId = process.env.WHATSAPP_PHONE_NUMBER_ID
  const to = (process.env.BUSINESS_WHATSAPP_TO || restaurant.whatsapp).replace(/\D/g, '')
  const template = process.env.WHATSAPP_TEMPLATE_NAME

  // API ayarlı değilse ya da hata verirse müşteri siparişi wa.me ile elle gönderebilsin.
  const waLink = to ? `https://wa.me/${to}?text=${encodeURIComponent(text)}` : undefined

  // İletilemeyen sipariş kaybolmasın: işletme Vercel loglarından kodla bulabilir.
  const failed = (status: number, detail: string) => {
    console.error(`Sipariş #${code} iletilemedi (${detail})\n${text}`)
    return NextResponse.json({ error: 'Sipariş şu an iletilemedi.', waLink }, { status })
  }

  if (!token || !phoneId || !to) return failed(503, 'WhatsApp ortam değişkenleri eksik')

  // Şablon (template) mesajları 24 saatlik pencere dışında da iletilir; düz
  // metin yalnızca işletme numarasına son 24 saatte mesaj atılmışsa gider.
  const payload = template
    ? {
        messaging_product: 'whatsapp',
        to,
        type: 'template',
        template: {
          name: template,
          language: { code: process.env.WHATSAPP_TEMPLATE_LANG || 'tr' },
          // Şablon parametreleri satır sonu içeremez.
          components: [{ type: 'body', parameters: [{ type: 'text', text: text.replace(/\n+/g, ' | ') }] }],
        },
      }
    : { messaging_product: 'whatsapp', to, type: 'text', text: { body: text } }

  try {
    const res = await fetch(`https://graph.facebook.com/v21.0/${phoneId}/messages`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(8000),
    })
    if (!res.ok) return failed(502, `WhatsApp API ${res.status}: ${await res.text()}`)
  } catch (e) {
    return failed(502, `WhatsApp API ulaşılamadı: ${e instanceof Error ? e.message : e}`)
  }

  return NextResponse.json({ ok: true, code, total: priced.total })
}
