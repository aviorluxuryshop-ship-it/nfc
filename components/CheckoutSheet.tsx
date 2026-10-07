'use client'

import Image from 'next/image'
import { useEffect, useEffectEvent, useRef, useState } from 'react'
import { CheckCircle2, MapPin, Minus, Phone, Plus, ShoppingBag, X } from 'lucide-react'

import { imageOf, neighborhoods, restaurant } from '@/data/yemek'
import { tl } from '@/lib/format'

import { useCart } from './CartProvider'

const empty = { name: '', phone: '', neighborhood: '', street: '', no: '', floor: '', apt: '', business: '', note: '', hp_url: '' }
const field = 'w-full rounded-xl border border-ink/20 bg-white px-4 py-3 text-base outline-none transition placeholder:text-ink-mute focus:border-marmara focus:ring-2 focus:ring-marmara/20 disabled:bg-paper-raised'
const stepBtn = 'flex h-10 w-10 items-center justify-center rounded-full bg-marmara-50 text-marmara transition hover:bg-marmara-100'
const focusable = 'a[href],button:not([disabled]),input:not([disabled]):not([tabindex="-1"]),select:not([disabled]),textarea:not([disabled])'

function Label({ htmlFor, children, required }: { htmlFor: string; children: React.ReactNode; required?: boolean }) {
  return (
    <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-semibold">
      {children}
      {required && <span className="text-marmara" aria-hidden> *</span>}
    </label>
  )
}

export function CheckoutSheet() {
  const { open, setOpen, lines, subtotal, total, change, clear } = useCart()
  const [form, setForm] = useState(empty)
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [waLink, setWaLink] = useState('')
  const [done, setDone] = useState<{ code: string; total: number } | null>(null)
  const dialogRef = useRef<HTMLDivElement>(null)

  const close = () => {
    setOpen(false)
    if (done) { setDone(null); setForm(empty); setCoords(null) }
  }
  const onEscape = useEffectEvent(close)

  // Açılınca odak pencereye taşınır, Tab pencerede döner, kapanınca odak geri verilir.
  useEffect(() => {
    if (!open) return
    const opener = document.activeElement as HTMLElement | null
    dialogRef.current?.focus()
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') return onEscape()
      if (e.key !== 'Tab' || !dialogRef.current) return
      const items = [...dialogRef.current.querySelectorAll<HTMLElement>(focusable)]
      if (!items.length) return
      const first = items[0]
      const last = items[items.length - 1]
      if (e.shiftKey && (document.activeElement === first || document.activeElement === dialogRef.current)) { e.preventDefault(); last.focus() }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus() }
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
      opener?.focus?.()
    }
  }, [open])

  if (!open) return null

  const missing = restaurant.minOrder - subtotal
  const belowMin = missing > 0
  const progress = Math.min(100, Math.round((subtotal / restaurant.minOrder) * 100))
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
        body: JSON.stringify({ ...form, ...coords, items: lines.map((l) => ({ id: l.id, qty: l.qty })) }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok || typeof data.code !== 'string' || typeof data.total !== 'number') {
        setError(data.error || 'Sipariş iletilemedi, lütfen tekrar deneyin.')
        if (data.waLink) setWaLink(data.waLink)
        return
      }
      setDone({ code: data.code, total: data.total })
      clear()
    } catch {
      setError('Bağlantı hatası. Lütfen tekrar deneyin.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button tabIndex={-1} aria-label="Kapat" onClick={close} className="absolute inset-0 animate-fade-in bg-ink/55 backdrop-blur-sm" />
      <div
        ref={dialogRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="fis-baslik"
        className="relative flex h-full w-full max-w-md animate-slide-in flex-col bg-white shadow-lift outline-none"
      >
        <div className="flex items-center justify-between border-b border-ink/10 px-5 py-4">
          <h2 id="fis-baslik" className="font-display text-2xl font-bold">{done ? 'Teşekkürler' : 'Sipariş fişi'}</h2>
          <button onClick={close} aria-label="Pencereyi kapat" className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-paper-raised"><X /></button>
        </div>

        {done ? (
          <div className="flex flex-1 flex-col items-center justify-center px-6 text-center" role="status">
            <CheckCircle2 className="h-16 w-16 text-green-600" />
            <h3 className="mt-4 font-display text-3xl font-bold">Siparişin alındı!</h3>
            <p className="mt-2 text-ink-soft">Sipariş no: <b>#{done.code}</b>. İşletmeye iletildi; hazırlanıp kuryeyle yola çıkacak.</p>
            <p className="mt-5 rounded-xl bg-marmara-50 px-5 py-3 font-bold text-marmara">Kapıda ödenecek tutar: {tl(done.total)}</p>
            <button onClick={close} className="mt-8 rounded-full bg-marmara px-7 py-3 font-bold text-white">Ürünlere dön</button>
          </div>
        ) : !lines.length ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
            <ShoppingBag size={44} className="text-marmara" />
            <p className="text-lg font-semibold">Sepetin henüz boş.</p>
            <button onClick={close} className="rounded-full bg-marmara px-7 py-3 font-bold text-white">Ürünlere göz at</button>
          </div>
        ) : (
          <form onSubmit={submit} className="flex min-h-0 flex-1 flex-col">
            <div className="flex-1 space-y-6 overflow-y-auto px-5 py-5">
              <ul className="divide-y divide-ink/10 rounded-2xl border border-ink/10">
                {lines.map((l) => (
                  <li key={l.id} className="flex items-center gap-3 p-3">
                    <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-marmara-50">
                      <Image src={imageOf(l.id)} alt="" fill sizes="56px" className="object-cover" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-semibold">{l.name}</span>
                      <span className="text-sm text-ink-mute">{tl(l.price)} / Paket</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <button type="button" aria-label={`${l.name} azalt`} onClick={() => change(l.id, -1)} className={stepBtn}><Minus size={16} /></button>
                      <span className="w-6 text-center font-bold" aria-label={`${l.qty} paket`}>{l.qty}</span>
                      <button type="button" aria-label={`${l.name} arttır`} onClick={() => change(l.id, 1)} className={stepBtn}><Plus size={16} /></button>
                    </span>
                    <b className="w-16 shrink-0 text-right">{tl(l.price * l.qty)}</b>
                  </li>
                ))}
              </ul>

              <dl className="space-y-1.5 text-sm">
                <div className="flex justify-between"><dt className="text-ink-soft">Ara toplam</dt><dd className="font-semibold">{tl(subtotal)}</dd></div>
                <div className="flex justify-between"><dt className="text-ink-soft">Teslimat</dt><dd className="font-semibold">{restaurant.deliveryFee ? tl(restaurant.deliveryFee) : 'Ücretsiz'}</dd></div>
                <div className="flex justify-between border-t border-dashed border-ink/20 pt-2 text-base"><dt className="font-bold">Toplam</dt><dd className="font-extrabold text-marmara">{tl(total)}</dd></div>
              </dl>

              <div>
                <div className="h-2 overflow-hidden rounded-full bg-marmara-50" role="progressbar" aria-label="Minimum sipariş tutarı" aria-valuemin={0} aria-valuemax={restaurant.minOrder} aria-valuenow={Math.min(subtotal, restaurant.minOrder)}>
                  <div className="h-full rounded-full bg-marmara transition-all" style={{ width: `${progress}%` }} />
                </div>
                <p className={`mt-2 text-sm font-semibold ${belowMin ? 'text-marmara' : 'text-green-700'}`}>
                  {belowMin ? `Minimum sipariş ${tl(restaurant.minOrder)}: ${tl(missing)} daha ürün ekle.` : 'Minimum sipariş tutarına ulaştın ✓'}
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="font-display text-lg font-bold">Teslimat bilgileri</h3>
                <div>
                  <Label htmlFor="f-ad" required>Ad Soyad</Label>
                  <input id="f-ad" className={field} required maxLength={60} autoComplete="name" value={form.name} onChange={set('name')} />
                </div>
                <div>
                  <Label htmlFor="f-tel" required>Telefon</Label>
                  <input id="f-tel" className={field} placeholder="05xx xxx xx xx" required type="tel" maxLength={20} autoComplete="tel" value={form.phone} onChange={set('phone')} />
                </div>
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
                <div className="grid grid-cols-3 gap-3">
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
                  <MapPin size={18} /> {coords ? 'Konum eklendi ✓' : 'Konumumu paylaş (isteğe bağlı)'}
                </button>
                <div>
                  <Label htmlFor="f-not">Sipariş notu</Label>
                  <textarea id="f-not" className={field} placeholder="İsteğe bağlı" rows={2} maxLength={200} value={form.note} onChange={set('note')} />
                </div>
                <input name="hp_url" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" value={form.hp_url} onChange={set('hp_url')} />
              </div>

              <p className="rounded-xl bg-paper-raised px-4 py-3 text-sm font-semibold">💵 Online ödeme yok, ödeme teslimatta kapıda yapılır. Sadece Merter civarına servis.</p>
            </div>

            <div className="border-t border-ink/10 bg-white px-5 py-4">
              {(error || waLink) && (
                <div role="alert" className="mb-3 space-y-2 rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-800">
                  {error && <p>{error}</p>}
                  {waLink ? (
                    <a href={waLink} className="block rounded-lg bg-green-700 px-4 py-2.5 text-center font-bold text-white">
                      Siparişi WhatsApp&apos;tan kendim göndereyim
                    </a>
                  ) : (
                    <a href={`tel:${tel}`} className="flex items-center justify-center gap-2 rounded-lg bg-white px-4 py-2.5 font-bold text-marmara ring-1 ring-marmara/30">
                      <Phone size={16} /> Bizi arayın: {restaurant.phoneDisplay}
                    </a>
                  )}
                </div>
              )}
              <p className="flex items-baseline justify-between">
                <span className="text-ink-soft">Toplam (kapıda ödenir)</span>
                <b className="text-2xl text-marmara">{tl(total)}</b>
              </p>
              <button disabled={busy || belowMin} className="mt-3 w-full rounded-xl bg-marmara px-6 py-4 text-lg font-bold text-white transition hover:bg-marmara-dim disabled:opacity-50">
                {busy ? 'Gönderiliyor…' : belowMin ? `${tl(missing)} daha ekle` : 'Siparişi ver'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
