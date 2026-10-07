'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef, useState, useSyncExternalStore } from 'react'
import { ArrowLeft, Banknote, CheckCircle2, CreditCard, MapPin, Minus, Phone, Plus, ShoppingBag } from 'lucide-react'

import { imageOf, neighborhoods, restaurant } from '@/data/yemek'
import { tl } from '@/lib/format'
import { paymentMethods, type PaymentMethod } from '@/lib/orders'

import { useCart } from './CartProvider'

const empty = { name: '', phone: '', neighborhood: '', street: '', no: '', floor: '', apt: '', business: '', note: '', hp_url: '' }
const field = 'w-full rounded-xl border border-ink/20 bg-white px-4 py-3 text-base outline-none transition placeholder:text-ink-mute focus:border-marmara focus:ring-2 focus:ring-marmara/20 disabled:bg-paper-raised'
const stepBtn = 'flex h-10 w-10 items-center justify-center rounded-full bg-marmara-50 text-marmara transition hover:bg-marmara-100'
const card = 'rounded-2xl bg-white p-5 shadow-soft ring-1 ring-ink/10 sm:p-6'

const payIcons = { nakit: Banknote, kart: CreditCard } as const

function Label({ htmlFor, children, required }: { htmlFor: string; children: React.ReactNode; required?: boolean }) {
  return (
    <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-semibold">
      {children}
      {required && <span className="text-marmara" aria-hidden> *</span>}
    </label>
  )
}

// Sepetten "Sipariş ver" denince gelinen sayfa: teslimat bilgileri, ödeme yöntemi ve sipariş özeti.
export function CheckoutForm() {
  const { lines, subtotal, total, change, clear } = useCart()
  const [form, setForm] = useState(empty)
  const [payment, setPayment] = useState<PaymentMethod>('nakit')
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [waLink, setWaLink] = useState('')
  const [done, setDone] = useState<{ code: string; total: number; payment: PaymentMethod } | null>(null)
  const alertRef = useRef<HTMLDivElement>(null)

  // Sepet localStorage'dan istemcide okunur; ilk karede boş görünüp sıçramasın diye bekle.
  const hydrated = useSyncExternalStore(() => () => {}, () => true, () => false)

  useEffect(() => {
    if (error || waLink) alertRef.current?.scrollIntoView({ block: 'center', behavior: 'smooth' })
  }, [error, waLink])

  const missing = restaurant.minOrder - subtotal
  const belowMin = missing > 0
  const streets = neighborhoods.find((n) => n.name === form.neighborhood)?.streets ?? []
  const tel = restaurant.phoneDisplay.replace(/\s/g, '')

  const set = (k: keyof typeof empty) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value, ...(k === 'neighborhood' ? { street: '' } : {}) }))

  const locate = () => {
    if (!navigator.geolocation) return setError('Tarayıcınız konum paylaşımını desteklemiyor.')
    navigator.geolocation.getCurrentPosition(
      (p) => { setCoords({ lat: p.coords.latitude, lng: p.coords.longitude }); setError('') },
      () => setError('Konum alınamadı. İzin verin ya da adresi yazın.'),
      { enableHighAccuracy: true, timeout: 10000 },
    )
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setBusy(true); setError(''); setWaLink('')
    try {
      const res = await fetch('/api/siparis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, payment, ...coords, items: lines.map((l) => ({ id: l.id, qty: l.qty })) }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok || typeof data.code !== 'string' || typeof data.total !== 'number') {
        setError(data.error || 'Sipariş iletilemedi, lütfen tekrar deneyin.')
        if (data.waLink) setWaLink(data.waLink)
        return
      }
      setDone({ code: data.code, total: data.total, payment })
      clear()
      window.scrollTo({ top: 0 })
    } catch {
      setError('Bağlantı hatası. Lütfen tekrar deneyin.')
    } finally {
      setBusy(false)
    }
  }

  if (!hydrated) {
    return (
      <div className="container py-12" aria-busy="true">
        <div className="h-10 w-64 animate-pulse rounded-xl bg-paper-raised" />
        <div className="mt-8 h-96 animate-pulse rounded-2xl bg-paper-raised" />
      </div>
    )
  }

  if (done) {
    const method = paymentMethods.find((m) => m.id === done.payment)
    return (
      <section className="container flex flex-col items-center py-16 text-center lg:py-24" role="status">
        <CheckCircle2 className="h-20 w-20 text-green-600" aria-hidden />
        <h1 className="mt-5 font-display text-4xl font-bold sm:text-5xl">Siparişin alındı!</h1>
        <p className="mt-3 max-w-md text-lg text-ink-soft">
          Sipariş no: <b>#{done.code}</b>. İşletmeye iletildi; hazırlanıp kuryeyle yola çıkacak.
        </p>
        <p className="mt-6 rounded-xl bg-marmara-50 px-6 py-4 text-lg font-bold text-marmara">
          Kapıda ödenecek tutar: {tl(done.total)} · {method?.label}
        </p>
        <Link href="/urunler" className="mt-9 rounded-xl bg-marmara px-8 py-4 font-bold text-white shadow-card transition hover:bg-marmara-dim">
          Ürünlere dön
        </Link>
      </section>
    )
  }

  if (!lines.length) {
    return (
      <section className="container flex flex-col items-center gap-4 py-24 text-center">
        <ShoppingBag size={56} className="text-marmara" aria-hidden />
        <h1 className="font-display text-4xl font-bold">Sepetin henüz boş</h1>
        <p className="max-w-md text-ink-soft">Sipariş verebilmek için önce ürünleri sepete ekle.</p>
        <Link href="/urunler" className="rounded-xl bg-marmara px-8 py-4 font-bold text-white shadow-card transition hover:bg-marmara-dim">Ürünlere göz at</Link>
      </section>
    )
  }

  return (
    <div className="container py-8 lg:py-12">
      <Link href="/urunler" className="inline-flex min-h-10 items-center gap-2 text-sm font-semibold text-ink-soft hover:text-marmara">
        <ArrowLeft size={16} aria-hidden /> Alışverişe devam et
      </Link>
      <h1 className="mt-2 font-display text-4xl font-bold tracking-tight sm:text-5xl">Siparişi tamamla</h1>
      <p className="mt-2 text-ink-soft">Teslimat bilgilerini yaz, ödeme yöntemini seç. Ödeme kapıda yapılır, online ödeme yok.</p>

      <form onSubmit={submit} className="mt-8 grid items-start gap-6 lg:grid-cols-[1fr_400px] lg:gap-10">
        <div className="space-y-6">
          <section className={card} aria-labelledby="teslimat">
            <h2 id="teslimat" className="font-display text-2xl font-bold">Teslimat bilgileri</h2>
            <p className="mt-1 text-sm text-ink-soft">Sadece Merter civarına (Güngören) servis yapıyoruz.</p>
            <div className="mt-5 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="f-ad" required>Ad Soyad</Label>
                  <input id="f-ad" className={field} required maxLength={60} autoComplete="name" value={form.name} onChange={set('name')} />
                </div>
                <div>
                  <Label htmlFor="f-tel" required>Telefon</Label>
                  <input id="f-tel" className={field} placeholder="05xx xxx xx xx" required type="tel" maxLength={20} autoComplete="tel" value={form.phone} onChange={set('phone')} />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="f-mah" required>Mahalle</Label>
                  <select id="f-mah" className={field} required value={form.neighborhood} onChange={set('neighborhood')}>
                    <option value="">Mahalle seçin</option>
                    {neighborhoods.map((n) => <option key={n.name} value={n.name}>{n.name} Mah.</option>)}
                  </select>
                </div>
                <div>
                  <Label htmlFor="f-sokak" required>Cadde / Sokak</Label>
                  <input id="f-sokak" className={field} placeholder={form.neighborhood ? 'Listeden seç ya da yaz' : 'Önce mahalle seçin'} required maxLength={80} list="sokaklar" disabled={!form.neighborhood} value={form.street} onChange={set('street')} />
                  <datalist id="sokaklar">{streets.map((st) => <option key={st} value={st} />)}</datalist>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="f-no" required>No</Label>
                  <input id="f-no" className={field} required maxLength={10} value={form.no} onChange={set('no')} />
                </div>
                <div>
                  <Label htmlFor="f-kat">Kat</Label>
                  <input id="f-kat" className={field} maxLength={10} value={form.floor} onChange={set('floor')} />
                </div>
                <div>
                  <Label htmlFor="f-daire">Daire</Label>
                  <input id="f-daire" className={field} maxLength={10} value={form.apt} onChange={set('apt')} />
                </div>
              </div>
              <div>
                <Label htmlFor="f-isletme">İşletme / bina adı</Label>
                <input id="f-isletme" className={field} placeholder="Varsa" maxLength={80} value={form.business} onChange={set('business')} />
              </div>
              <button type="button" onClick={locate} className="flex w-full items-center justify-center gap-2 rounded-xl border border-ink/20 px-4 py-3 font-semibold transition hover:border-marmara hover:text-marmara">
                <MapPin size={18} aria-hidden /> {coords ? 'Konum eklendi ✓' : 'Konumumu paylaş (isteğe bağlı, kurye daha kolay bulur)'}
              </button>
              <div>
                <Label htmlFor="f-not">Sipariş notu</Label>
                <textarea id="f-not" className={field} placeholder="İsteğe bağlı" rows={2} maxLength={200} value={form.note} onChange={set('note')} />
              </div>
              <input name="hp_url" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" value={form.hp_url} onChange={set('hp_url')} />
            </div>
          </section>

          <fieldset className={card}>
            <legend className="sr-only">Ödeme yöntemi</legend>
            <h2 className="font-display text-2xl font-bold" aria-hidden>Ödeme yöntemi</h2>
            <p className="mt-1 text-sm text-ink-soft">Ödeme siparişi teslim alırken kapıda yapılır.</p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {paymentMethods.map((m) => {
                const Icon = payIcons[m.id]
                return (
                  <label
                    key={m.id}
                    className="flex cursor-pointer items-center gap-4 rounded-xl border-2 border-ink/15 p-4 transition hover:border-marmara/50 has-[:checked]:border-marmara has-[:checked]:bg-marmara-50 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-marmara/40"
                  >
                    <input type="radio" name="payment" value={m.id} checked={payment === m.id} onChange={() => setPayment(m.id)} className="peer sr-only" />
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-marmara-50 text-marmara peer-checked:bg-marmara peer-checked:text-white">
                      <Icon size={22} aria-hidden />
                    </span>
                    <span className="leading-tight">
                      <b className="block">{m.label}</b>
                      <span className="text-sm text-ink-soft">{m.hint}</span>
                    </span>
                  </label>
                )
              })}
            </div>
          </fieldset>
        </div>

        <aside className={`${card} lg:sticky lg:top-6`} aria-labelledby="ozet">
          <h2 id="ozet" className="font-display text-2xl font-bold">Sipariş özeti</h2>
          <ul className="mt-4 divide-y divide-ink/10">
            {lines.map((l) => (
              <li key={l.id} className="flex items-center gap-3 py-3">
                <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-marmara-50">
                  <Image src={imageOf(l.id)} alt="" fill sizes="56px" className="object-cover" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-semibold">{l.name}</span>
                  <span className="mt-1 flex items-center gap-1">
                    <button type="button" aria-label={`${l.name} azalt`} onClick={() => change(l.id, -1)} className={stepBtn}><Minus size={16} /></button>
                    <span className="w-6 text-center font-bold" aria-label={`${l.qty} paket`}>{l.qty}</span>
                    <button type="button" aria-label={`${l.name} arttır`} onClick={() => change(l.id, 1)} className={stepBtn}><Plus size={16} /></button>
                  </span>
                </span>
                <b className="w-16 shrink-0 text-right">{tl(l.price * l.qty)}</b>
              </li>
            ))}
          </ul>

          <dl className="mt-3 space-y-1.5 border-t border-dashed border-ink/20 pt-4 text-sm">
            <div className="flex justify-between"><dt className="text-ink-soft">Ara toplam</dt><dd className="font-semibold">{tl(subtotal)}</dd></div>
            <div className="flex justify-between"><dt className="text-ink-soft">Teslimat</dt><dd className="font-semibold">{restaurant.deliveryFee ? tl(restaurant.deliveryFee) : 'Ücretsiz'}</dd></div>
            <div className="flex items-baseline justify-between pt-1"><dt className="text-base font-bold">Toplam</dt><dd className="text-2xl font-extrabold text-marmara">{tl(total)}</dd></div>
          </dl>
          <p className="mt-1 text-xs text-ink-soft">Kapıda ödenir · {paymentMethods.find((m) => m.id === payment)?.label}</p>

          {belowMin && (
            <p className="mt-4 rounded-xl bg-marmara-50 px-4 py-3 text-sm font-semibold text-marmara">
              Minimum sipariş {tl(restaurant.minOrder)}: {tl(missing)} daha ürün ekle. <Link href="/urunler" className="underline">Ürünlere dön</Link>
            </p>
          )}

          {(error || waLink) && (
            <div ref={alertRef} role="alert" className="mt-4 space-y-2 rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-800">
              {error && <p>{error}</p>}
              {waLink ? (
                <a href={waLink} className="block rounded-lg bg-green-700 px-4 py-2.5 text-center font-bold text-white">
                  Siparişi WhatsApp&apos;tan kendim göndereyim
                </a>
              ) : (
                <a href={`tel:${tel}`} className="flex items-center justify-center gap-2 rounded-lg bg-white px-4 py-2.5 font-bold text-marmara ring-1 ring-marmara/30">
                  <Phone size={16} aria-hidden /> Bizi arayın: {restaurant.phoneDisplay}
                </a>
              )}
            </div>
          )}

          <button disabled={busy || belowMin} className="mt-4 w-full rounded-xl bg-marmara px-6 py-4 text-lg font-bold text-white transition hover:bg-marmara-dim disabled:opacity-50">
            {busy ? 'Gönderiliyor…' : belowMin ? `${tl(missing)} daha ekle` : `Siparişi ver · ${tl(total)}`}
          </button>
        </aside>
      </form>
    </div>
  )
}
