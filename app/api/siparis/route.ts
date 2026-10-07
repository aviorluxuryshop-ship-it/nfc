import { NextResponse } from 'next/server'

import { formatOrderMessage, priceOrder, type OrderInput } from '@/lib/orders'

export const runtime = 'nodejs'

const clean = (v: unknown, max: number) => String(v ?? '').replace(/\s+/g, ' ').trim().slice(0, max)

export async function POST(req: Request) {
  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Geçersiz istek.' }, { status: 400 })
  }

  // Honeypot: gerçek kullanıcılar bu alanı görmez, botlar doldurur.
  if (body.website) return NextResponse.json({ ok: true })

  const phone = clean(body.phone, 20)
  const order: OrderInput = {
    name: clean(body.name, 60),
    phone,
    address: clean(body.address, 300),
    note: clean(body.note, 200),
    lat: typeof body.lat === 'number' ? body.lat : undefined,
    lng: typeof body.lng === 'number' ? body.lng : undefined,
    items: Array.isArray(body.items) ? (body.items as OrderInput['items']).slice(0, 40) : [],
  }

  if (order.name.length < 2 || order.address.length < 10 || phone.replace(/\D/g, '').length < 10) {
    return NextResponse.json({ error: 'Ad, telefon ve adres alanlarını eksiksiz doldurun.' }, { status: 400 })
  }
  const priced = priceOrder(order.items)
  if (!priced) {
    return NextResponse.json({ error: 'Sepet geçersiz ya da minimum tutarın altında.' }, { status: 400 })
  }

  const code = Math.random().toString(36).slice(2, 7).toUpperCase()
  const text = formatOrderMessage(code, order, priced)

  const token = process.env.WHATSAPP_TOKEN
  const phoneId = process.env.WHATSAPP_PHONE_NUMBER_ID
  const to = (process.env.BUSINESS_WHATSAPP_TO ?? '').replace(/\D/g, '')
  const template = process.env.WHATSAPP_TEMPLATE_NAME

  // API ayarlı değilse müşteri siparişi wa.me ile elle gönderebilsin.
  const waLink = to ? `https://wa.me/${to}?text=${encodeURIComponent(text)}` : undefined

  if (!token || !phoneId || !to) {
    console.error('WhatsApp ortam değişkenleri eksik')
    return NextResponse.json({ error: 'Sipariş şu an iletilemedi.', waLink }, { status: 503 })
  }

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
    })
    if (!res.ok) {
      console.error('WhatsApp API hatası', res.status, await res.text())
      return NextResponse.json({ error: 'Sipariş şu an iletilemedi.', waLink }, { status: 502 })
    }
  } catch (e) {
    console.error('WhatsApp API ulaşılamadı', e)
    return NextResponse.json({ error: 'Sipariş şu an iletilemedi.', waLink }, { status: 502 })
  }

  return NextResponse.json({ ok: true, code, total: priced.total })
}
