'use client'

import { useMemo, useState } from 'react'
import { Minus, Plus, ShoppingBag, MapPin, X, CheckCircle2 } from 'lucide-react'

import { categories, menu, restaurant } from '@/data/yemek'

const tl = (n: number) => `${n.toLocaleString('tr-TR')} TL`

type Done = { code: string; total: number } | null

export function Shop() {
  const [cart, setCart] = useState<Record<string, number>>({})
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ name: '', phone: '', address: '', note: '', website: '' })
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [waLink, setWaLink] = useState('')
  const [done, setDone] = useState<Done>(null)

  const lines = useMemo(
    () => menu.filter((m) => cart[m.id]).map((m) => ({ ...m, qty: cart[m.id] })),
    [cart],
  )
  const subtotal = lines.reduce((s, l) => s + l.price * l.qty, 0)
  const count = lines.reduce((s, l) => s + l.qty, 0)
  const total = subtotal + (count ? restaurant.deliveryFee : 0)
  const belowMin = subtotal < restaurant.minOrder

  const change = (id: string, d: number) =>
    setCart((c) => {
      const q = Math.max(0, (c[id] ?? 0) + d)
      const next = { ...c }
      if (q) next[id] = q
      else delete next[id]
      return next
    })

  const locate = () => {
    if (!navigator.geolocation) return setError('Tarayıcınız konum paylaşımını desteklemiyor.')
    navigator.geolocation.getCurrentPosition(
      (p) => {
        setCoords({ lat: p.coords.latitude, lng: p.coords.longitude })
        setError('')
      },
      () => setError('Konum alınamadı. İzin verin ya da adresi yazın.'),
      { enableHighAccuracy: true, timeout: 10000 },
    )
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setBusy(true)
    setError('')
    setWaLink('')
    try {
      const res = await fetch('/api/siparis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          ...coords,
          items: lines.map((l) => ({ id: l.id, qty: l.qty })),
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Bir hata oluştu.')
        if (data.waLink) setWaLink(data.waLink)
        return
      }
      setDone({ code: data.code, total: data.total })
      setCart({})
    } catch {
      setError('Bağlantı hatası. Lütfen tekrar deneyin.')
    } finally {
      setBusy(false)
    }
  }

  const input = 'w-full rounded-xl border border-ink/15 bg-white px-4 py-3 text-base outline-none focus:border-magenta'

  if (done) {
    return (
      <div className="container flex min-h-screen max-w-lg flex-col items-center justify-center text-center">
        <CheckCircle2 className="h-16 w-16 text-green-600" />
        <h1 className="mt-4 font-display text-3xl font-bold">Siparişin alındı!</h1>
        <p className="mt-2 text-ink-soft">
          Sipariş no: <b>#{done.code}</b>. İşletmeye WhatsApp ile iletildi, hazırlanıyor.
        </p>
        <p className="mt-4 rounded-xl bg-gold-50 px-5 py-3 font-semibold">Kapıda ödenecek tutar: {tl(done.total)}</p>
        <button onClick={() => { setDone(null); setOpen(false) }} className="mt-8 rounded-full bg-ink px-6 py-3 font-semibold text-white">
          Menüye dön
        </button>
      </div>
    )
  }

  return (
    <div className="pb-28">
      <header className="bg-ink px-5 py-10 text-white">
        <div className="container">
          <h1 className="font-display text-4xl font-extrabold">{restaurant.name}</h1>
          <p className="mt-2 text-white/80">{restaurant.tagline}</p>
          <p className="mt-3 text-sm text-white/60">
            Minimum sipariş {tl(restaurant.minOrder)} · Teslimat {tl(restaurant.deliveryFee)} · 💵 Sadece kapıda ödeme
          </p>
        </div>
      </header>

      <nav className="sticky top-0 z-10 overflow-x-auto border-b border-ink/10 bg-white/95 backdrop-blur">
        <div className="container flex gap-2 py-3">
          {categories.map((c) => (
            <a key={c} href={`#${c}`} className="whitespace-nowrap rounded-full bg-paper-raised px-4 py-2 text-sm font-semibold">
              {c}
            </a>
          ))}
        </div>
      </nav>

      <div className="container mt-6 space-y-10">
        {categories.map((c) => (
          <section key={c} id={c} className="scroll-mt-20">
            <h2 className="font-display text-2xl font-bold">{c}</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {menu.filter((m) => m.category === c).map((m) => (
                <div key={m.id} className="flex items-center justify-between gap-3 rounded-card border border-ink/10 p-4">
                  <div>
                    <p className="font-semibold">{m.name}</p>
                    {m.desc && <p className="text-sm text-ink-mute">{m.desc}</p>}
                    <p className="mt-1 font-bold text-magenta">{tl(m.price)}</p>
                  </div>
                  {cart[m.id] ? (
                    <div className="flex items-center gap-2">
                      <button aria-label="Azalt" onClick={() => change(m.id, -1)} className="rounded-full bg-paper-raised p-2"><Minus size={16} /></button>
                      <span className="w-5 text-center font-bold">{cart[m.id]}</span>
                      <button aria-label="Arttır" onClick={() => change(m.id, 1)} className="rounded-full bg-ink p-2 text-white"><Plus size={16} /></button>
                    </div>
                  ) : (
                    <button onClick={() => change(m.id, 1)} className="rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white">Ekle</button>
                  )}
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      {count > 0 && !open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed inset-x-4 bottom-4 z-20 mx-auto flex max-w-lg items-center justify-between rounded-full bg-magenta px-6 py-4 font-bold text-white shadow-lift"
        >
          <span className="flex items-center gap-2"><ShoppingBag size={20} /> Sepet ({count})</span>
          <span>{tl(subtotal)}</span>
        </button>
      )}

      {open && (
        <div className="fixed inset-0 z-30 overflow-y-auto bg-white">
          <form onSubmit={submit} className="container max-w-lg py-6">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-2xl font-bold">Siparişi tamamla</h2>
              <button type="button" aria-label="Kapat" onClick={() => setOpen(false)}><X /></button>
            </div>

            <ul className="mt-4 divide-y divide-ink/10 rounded-card border border-ink/10">
              {lines.map((l) => (
                <li key={l.id} className="flex items-center justify-between gap-2 p-3">
                  <span>{l.qty} × {l.name}</span>
                  <span className="flex items-center gap-2 font-semibold">
                    {tl(l.price * l.qty)}
                    <button type="button" aria-label="Azalt" onClick={() => change(l.id, -1)} className="rounded-full bg-paper-raised p-1"><Minus size={14} /></button>
                    <button type="button" aria-label="Arttır" onClick={() => change(l.id, 1)} className="rounded-full bg-paper-raised p-1"><Plus size={14} /></button>
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-4 space-y-1 text-sm">
              <p className="flex justify-between"><span>Ara toplam</span><span>{tl(subtotal)}</span></p>
              <p className="flex justify-between"><span>Teslimat</span><span>{tl(restaurant.deliveryFee)}</span></p>
              <p className="flex justify-between text-lg font-bold"><span>Toplam</span><span>{tl(total)}</span></p>
            </div>

            <div className="mt-6 space-y-3">
              <input className={input} placeholder="Ad Soyad" required autoComplete="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              <input className={input} placeholder="Telefon (05xx xxx xx xx)" required type="tel" autoComplete="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              <textarea className={input} placeholder="Açık adres (mahalle, sokak, bina, daire)" required rows={3} autoComplete="street-address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
              <button type="button" onClick={locate} className="flex w-full items-center justify-center gap-2 rounded-xl border border-ink/15 px-4 py-3 font-semibold">
                <MapPin size={18} /> {coords ? 'Konum eklendi ✓' : 'Konumumu paylaş (isteğe bağlı)'}
              </button>
              <textarea className={input} placeholder="Sipariş notu (isteğe bağlı)" rows={2} value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} />
              {/* honeypot */}
              <input name="website" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} />
            </div>

            <p className="mt-4 rounded-xl bg-gold-50 px-4 py-3 text-sm font-semibold">💵 Ödeme kapıda, nakit veya kartla yapılır.</p>

            {error && <p className="mt-3 text-sm font-semibold text-red-600">{error}</p>}
            {waLink && (
              <a href={waLink} className="mt-2 block rounded-xl bg-green-600 px-4 py-3 text-center font-bold text-white">
                Siparişi WhatsApp&apos;tan kendim göndereyim
              </a>
            )}

            <button disabled={busy || belowMin} className="mt-5 w-full rounded-full bg-magenta px-6 py-4 text-lg font-bold text-white disabled:opacity-50">
              {busy ? 'Gönderiliyor…' : belowMin ? `Minimum sipariş ${tl(restaurant.minOrder)}` : 'Siparişi ver'}
            </button>
          </form>
        </div>
      )}
    </div>
  )
}
