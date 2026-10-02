import { products, productLine } from '@/data/products'
import { formatDate, formatPrice } from '@/lib/format'

import type { CartTotals } from './cart'
import type { OrderContext } from './legal/types'

export type PaymentMethod = 'card' | 'transfer'
export type InvoiceType = 'bireysel' | 'kurumsal'

export type CheckoutValues = {
  firstName: string
  lastName: string
  email: string
  phone: string
  city: string
  district: string
  address: string
  postalCode: string
  invoiceType: InvoiceType
  tckn: string
  companyName: string
  taxOffice: string
  taxNo: string
  billingSame: boolean
  billingCity: string
  billingDistrict: string
  billingAddress: string
  payment: PaymentMethod
  agreements: boolean
  marketing: boolean
}

export const initialValues: CheckoutValues = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  city: '',
  district: '',
  address: '',
  postalCode: '',
  invoiceType: 'bireysel',
  tckn: '',
  companyName: '',
  taxOffice: '',
  taxNo: '',
  billingSame: true,
  billingCity: '',
  billingDistrict: '',
  billingAddress: '',
  payment: 'card',
  agreements: false,
  marketing: false,
}

export const paymentLabels: Record<PaymentMethod, string> = {
  card: 'Kredi / Banka Kartı',
  transfer: 'Havale / EFT',
}

export type Errors = Partial<Record<keyof CheckoutValues, string>>

const digits = (s: string) => s.replace(/\D/g, '')

/** Turkish mobile numbers: 5XX XXX XX XX, with or without 0 / +90. */
export function normalisePhone(raw: string) {
  let d = digits(raw)
  if (d.startsWith('90') && d.length === 12) d = d.slice(2)
  if (d.startsWith('0') && d.length === 11) d = d.slice(1)
  return d.length === 10 && d.startsWith('5') ? d : null
}

export function formatPhone(d: string) {
  return `0${d.slice(0, 3)} ${d.slice(3, 6)} ${d.slice(6, 8)} ${d.slice(8)}`
}

/** T.C. Kimlik No checksum (11 digits, first not 0, digits 10 and 11 are checks). */
export function isValidTckn(value: string) {
  const d = digits(value)
  if (d.length !== 11 || d[0] === '0') return false
  const n = d.split('').map(Number)
  const odd = n[0] + n[2] + n[4] + n[6] + n[8]
  const even = n[1] + n[3] + n[5] + n[7]
  const d10 = (((odd * 7 - even) % 10) + 10) % 10
  const d11 = n.slice(0, 10).reduce((a, b) => a + b, 0) % 10
  return n[9] === d10 && n[10] === d11
}

export function validate(v: CheckoutValues): Errors {
  const e: Errors = {}
  const req = (key: keyof CheckoutValues, label: string, min = 2) => {
    const val = String(v[key]).trim()
    if (!val) e[key] = `${label} boş bırakılamaz.`
    else if (val.length < min) e[key] = `${label} çok kısa görünüyor.`
  }

  req('firstName', 'Adınız')
  req('lastName', 'Soyadınız')
  if (!v.email.trim()) e.email = 'E-posta adresiniz boş bırakılamaz.'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.email.trim())) e.email = 'E-posta adresini kontrol edin (örnek: ad@ornek.com).'
  if (!v.phone.trim()) e.phone = 'Telefon numaranız boş bırakılamaz.'
  else if (!normalisePhone(v.phone)) e.phone = 'Cep telefonu numarasını 05XX XXX XX XX şeklinde yazın.'

  if (!v.city) e.city = 'İl seçin.'
  req('district', 'İlçe')
  req('address', 'Adres', 10)
  if (v.postalCode && !/^\d{5}$/.test(digits(v.postalCode))) e.postalCode = 'Posta kodu 5 haneli olmalı.'

  if (v.invoiceType === 'kurumsal') {
    req('companyName', 'Firma unvanı')
    req('taxOffice', 'Vergi dairesi')
    const t = digits(v.taxNo)
    if (!t) e.taxNo = 'Vergi numarası boş bırakılamaz.'
    else if (t.length !== 10 && t.length !== 11) e.taxNo = 'Vergi numarası 10, T.C. kimlik numarası 11 haneli olmalı.'
  } else if (v.tckn && !isValidTckn(v.tckn)) {
    e.tckn = 'T.C. kimlik numarasını kontrol edin ya da boş bırakın.'
  }

  if (!v.billingSame) {
    if (!v.billingCity) e.billingCity = 'Fatura ili seçin.'
    req('billingDistrict', 'Fatura ilçesi')
    req('billingAddress', 'Fatura adresi', 10)
  }

  if (!v.agreements) e.agreements = 'Devam etmek için sözleşmeleri onaylamanız gerekiyor.'
  return e
}

/* ------------------------------------------------------------------ */

export type PlacedOrder = {
  number: string
  createdAt: string
  items: { slug: string; scent: string; qty: number; unitPrice: number; lineTotal: number }[]
  subtotal: number
  shipping: number
  total: number
  payment: PaymentMethod
  customer: { name: string; email: string; phone: string }
  deliveryAddress: string
  invoice: string
  marketingOptIn: boolean
}

function deliveryLine(v: CheckoutValues) {
  return [v.address.trim(), v.postalCode.trim(), `${v.district.trim()} / ${v.city}`].filter(Boolean).join(', ')
}

function invoiceLine(v: CheckoutValues) {
  const address = v.billingSame ? deliveryLine(v) : `${v.billingAddress.trim()}, ${v.billingDistrict.trim()} / ${v.billingCity}`
  return v.invoiceType === 'kurumsal'
    ? `Kurumsal — ${v.companyName.trim()}, ${v.taxOffice.trim()} V.D. ${digits(v.taxNo)} — ${address}`
    : `Bireysel — ${v.firstName.trim()} ${v.lastName.trim()} — ${address}`
}

/** The live form + cart, shaped for the legal documents. */
export function toOrderContext(v: CheckoutValues, cart: CartTotals): OrderContext {
  const name = `${v.firstName} ${v.lastName}`.trim()
  const phone = normalisePhone(v.phone)
  return {
    buyer: { name, email: v.email.trim(), phone: phone ? formatPhone(phone) : v.phone.trim() },
    deliveryAddress: v.address.trim() && v.city ? deliveryLine(v) : '',
    invoice: v.address.trim() || !v.billingSame ? invoiceLine(v) : '',
    items: cart.items.map((i) => ({
      name: `${productLine.fullName} — ${i.product.scent}`,
      qty: i.qty,
      unitPrice: formatPrice(i.product.price),
      total: formatPrice(i.lineTotal),
    })),
    subtotal: formatPrice(cart.subtotal),
    shipping: cart.shipping === 0 ? 'Ücretsiz' : formatPrice(cart.shipping),
    total: formatPrice(cart.total),
    paymentMethod: paymentLabels[v.payment],
    date: formatDate(new Date()),
  }
}

function orderNumber() {
  const t = Date.now().toString(36).toUpperCase().slice(-5)
  const r = Math.floor(Math.random() * 36 ** 3).toString(36).toUpperCase().padStart(3, '0')
  return `VLM-${t}${r}`
}

export const LAST_ORDER_KEY = 'velmo-last-order'

/**
 * Hand the order to the backend.
 *
 * Today the store has no server: the order is kept in this browser tab
 * so the confirmation page can show it. To take real orders, replace the
 * body with a call to your order API, which should (1) re-price the cart
 * from the product list on the server, (2) create the order, and (3) for
 * card payments, start a session with the payment institution (iyzico,
 * PayTR, …) and return its hosted payment page URL to redirect to.
 */
export async function placeOrder(v: CheckoutValues, cart: CartTotals): Promise<PlacedOrder> {
  const phone = normalisePhone(v.phone)!
  const order: PlacedOrder = {
    number: orderNumber(),
    createdAt: new Date().toISOString(),
    items: cart.items.map((i) => ({
      slug: i.slug,
      scent: products.find((p) => p.slug === i.slug)!.scent,
      qty: i.qty,
      unitPrice: i.product.price,
      lineTotal: i.lineTotal,
    })),
    subtotal: cart.subtotal,
    shipping: cart.shipping,
    total: cart.total,
    payment: v.payment,
    customer: { name: `${v.firstName.trim()} ${v.lastName.trim()}`, email: v.email.trim(), phone: formatPhone(phone) },
    deliveryAddress: deliveryLine(v),
    invoice: invoiceLine(v),
    marketingOptIn: v.marketing,
  }
  try {
    window.sessionStorage.setItem(LAST_ORDER_KEY, JSON.stringify(order))
  } catch {
    // Confirmation page falls back to a generic message.
  }
  return order
}
