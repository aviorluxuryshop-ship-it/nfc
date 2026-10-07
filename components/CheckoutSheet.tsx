'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import { CheckCircle2, MapPin, Minus, Plus, ShoppingBag, X } from 'lucide-react'

import { imageOf, neighborhoods, restaurant } from '@/data/yemek'
import { tl } from '@/lib/format'

import { useCart } from './CartProvider'

const empty = { name: '', phone: '', neighborhood: '', street: '', no: '', floor: '', apt: '', business: '', note: '', website: '' }
const field = 'w-full rounded-xl border border-ink/15 bg-white px-4 py-3 text-base outline-none transition focus:border-marmara focus:ring-2 focus:ring-marmara/15 disabled:bg-paper-raised'

export function CheckoutSheet() {
  const { open, setOpen, lines, subtotal, total, change, clear } = useCart()
  const [form, setForm] = useState(empty)
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [waLink, setWaLink] = useState('')
  const [done, setDone] = useState<{ code: string; total: number } | null>(null)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, setOpen])

  if (!open) return null

  const missing = restaurant.minOrder - subtotal
  const belowMin = missing > 0
  const progress = Math.min(100, Math.round((subtotal / restaurant.minOrder) * 100))
  const streets = neighborhoods.find((n) => n.name === form.neighborhood)?.streets ?? []

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
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Bir hata oluştu.')
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

  const close = () => {
    setOpen(false)
    if (done) { setDone(null); setForm(empty); setCoords(null) }
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal="true" aria-label="Sipariş fişi">
      <button aria-label="Kapat" onClick={close} className="absolute inset-0 animate-fade-in bg-ink/55 backdrop-blur-sm" />
      <div className="relative flex h-full w-full max-w-md animate-slide-in flex-col bg-white shadow-lift">
        <div className="flex items-center justify-between border-b border-ink/10 px-5 py-4">
          <h2 className="font-display text-2xl font-bold">{done ? 'Teşekkürler' : 'Sipariş fişi'}</h2>
          <button onClick={close} aria-label="Kapat" className="rounded-full p-2 hover:bg-paper-raised"><X /></button>
        </div>

        {done ? (
          <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
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
                    <span className="flex items-center gap-1.5">
                      <button type="button" aria-label="Azalt" onClick={() => change(l.id, -1)} className="rounded-full bg-marmara-50 p-1.5 text-marmara"><Minus size={14} /></button>
                      <span className="w-5 text-center font-bold">{l.qty}</span>
                      <button type="button" aria-label="Arttır" onClick={() => change(l.id, 1)} className="rounded-full bg-marmara-50 p-1.5 text-marmara"><Plus size={14} /></button>
                    </span>
                  </li>
                ))}
              </ul>

              <div>
                <div className="h-2 overflow-hidden rounded-full bg-marmara-50">
                  <div className="h-full rounded-full bg-marmara transition-all" style={{ width: `${progress}%` }} />
                </div>
                <p className={`mt-2 text-sm font-semibold ${belowMin ? 'text-marmara' : 'text-green-700'}`}>
                  {belowMin ? `Minimum sipariş ${tl(restaurant.minOrder)}: ${tl(missing)} daha ürün ekle.` : 'Minimum sipariş tutarına ulaştın ✓'}
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="font-display text-lg font-bold">Teslimat bilgileri</h3>
                <input className={field} placeholder="Ad Soyad" required autoComplete="name" value={form.name} onChange={set('name')} />
                <input className={field} placeholder="Telefon (05xx xxx xx xx)" required type="tel" autoComplete="tel" value={form.phone} onChange={set('phone')} />
                <select className={field} required value={form.neighborhood} onChange={set('neighborhood')}>
                  <option value="">Mahalle seçin</option>
                  {neighborhoods.map((n) => <option key={n.name} value={n.name}>{n.name} Mah.</option>)}
                </select>
                <input className={field} placeholder="Cadde / Sokak (listeden seç ya da yaz)" required list="sokaklar" disabled={!form.neighborhood} value={form.street} onChange={set('street')} />
                <datalist id="sokaklar">{streets.map((st) => <option key={st} value={st} />)}</datalist>
                <div className="grid grid-cols-3 gap-3">
                  <input className={field} placeholder="No" required value={form.no} onChange={set('no')} />
                  <input className={field} placeholder="Kat" value={form.floor} onChange={set('floor')} />
                  <input className={field} placeholder="Daire" value={form.apt} onChange={set('apt')} />
                </div>
                <input className={field} placeholder="İşletme / bina adı (varsa)" value={form.business} onChange={set('business')} />
                <button type="button" onClick={locate} className="flex w-full items-center justify-center gap-2 rounded-xl border border-ink/15 px-4 py-3 font-semibold transition hover:border-marmara hover:text-marmara">
                  <MapPin size={18} /> {coords ? 'Konum eklendi ✓' : 'Konumumu paylaş (isteğe bağlı)'}
                </button>
                <textarea className={field} placeholder="Sipariş notu (isteğe bağlı)" rows={2} value={form.note} onChange={set('note')} />
                <input name="website" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" value={form.website} onChange={set('website')} />
              </div>

              <p className="rounded-xl bg-paper-raised px-4 py-3 text-sm font-semibold">💵 Ödeme kapıda, nakit veya kartla yapılır. Sadece Merter civarına servis.</p>

              {error && <p role="alert" className="text-sm font-semibold text-red-700">{error}</p>}
              {waLink && (
                <a href={waLink} className="block rounded-xl bg-green-700 px-4 py-3 text-center font-bold text-white">
                  Siparişi WhatsApp&apos;tan kendim göndereyim
                </a>
              )}
            </div>

            <div className="border-t border-ink/10 bg-white px-5 py-4">
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
