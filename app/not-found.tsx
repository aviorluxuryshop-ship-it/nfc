import Link from 'next/link'

export default function NotFound() {
  return (
    <section className="flex min-h-[70vh] items-center justify-center bg-paper px-5 pb-20 pt-28">
      <div className="text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-magenta">404</p>
        <h1 className="mt-3 font-display text-2xl font-semibold text-ink">Bu sayfa yaklaştırınca açılmadı</h1>
        <Link
          href="/"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-semibold text-paper transition hover:bg-royal"
        >
          Ana Sayfaya Dön
        </Link>
      </div>
    </section>
  )
}
