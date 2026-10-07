import Link from 'next/link'

export default function NotFound() {
  return (
    <section className="flex min-h-[60vh] items-center justify-center px-5">
      <div className="text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-marmara">404</p>
        <h1 className="mt-3 font-display text-2xl font-semibold text-ink">Sayfa bulunamadı</h1>
        <Link href="/" className="mt-6 inline-block rounded-full bg-marmara px-6 py-3 text-sm font-semibold text-white">
          Ürünlere dön
        </Link>
      </div>
    </section>
  )
}
