'use client'

import Link from 'next/link'

// Shown if a page crashes while rendering; the header and footer stay.
export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <section className="grain relative isolate flex min-h-[80svh] flex-col justify-center bg-ink pt-[var(--header-h)]">
      <div className="container-x py-20">
        <p className="eyebrow text-smoke">Hata</p>
        <h1 className="display-l mt-8 max-w-[14ch] text-bone">Bir şeyler ters gitti.</h1>
        <p className="lead mt-8 max-w-[44ch] text-bone/70">Sayfa yüklenirken beklenmedik bir hata oluştu. Tekrar deneyebilir ya da ana sayfaya dönebilirsiniz.</p>
        <div className="mt-10 flex flex-wrap gap-3">
          <button type="button" onClick={reset} className="btn btn-light">
            <span>Tekrar dene</span>
          </button>
          <Link href="/" className="btn btn-ghost text-bone">
            <span>Ana sayfa</span>
          </Link>
        </div>
      </div>
    </section>
  )
}
