import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="container flex flex-col items-center py-28 text-center">
      <p className="eyebrow">Hata 404</p>
      <h1 className="mt-4 font-display text-[clamp(2.5rem,5vw,3.75rem)] font-medium leading-tight">Bu sayfayı bulamadık</h1>
      <p className="mt-4 max-w-md text-lg text-ink-soft">Aradığınız sayfa taşınmış ya da kaldırılmış olabilir.</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/" className="btn-primary px-8">
          Ana Sayfaya Dön
        </Link>
        <Link href="/urunler" className="btn-secondary px-8">
          Ürünleri Gör
        </Link>
      </div>
    </div>
  )
}
