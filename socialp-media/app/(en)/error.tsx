'use client'

import Link from 'next/link'

// Shown if a page crashes while rendering; the header and footer stay.
export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <section className="grain relative isolate flex min-h-[80svh] flex-col justify-center bg-ink pt-[var(--header-h)]">
      <div className="container-x py-20">
        <p className="eyebrow text-smoke">Error</p>
        <h1 className="display-l mt-8 max-w-[14ch] text-bone">Something went wrong.</h1>
        <p className="lead mt-8 max-w-[44ch] text-bone/70">An unexpected error occurred while loading this page. You can try again or go back to the home page.</p>
        <div className="mt-10 flex flex-wrap gap-3">
          <button type="button" onClick={reset} className="btn btn-light">
            <span>Try again</span>
          </button>
          <Link href="/en" className="btn btn-ghost text-bone">
            <span>Home</span>
          </Link>
        </div>
      </div>
    </section>
  )
}
