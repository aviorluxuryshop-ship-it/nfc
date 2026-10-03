import type { Metadata } from 'next'
import Link from 'next/link'

import { LogoInline, LogoSprite } from '@/components/Logo'
import { tr } from '@/lib/content/tr'
import { en } from '@/lib/content/en'
import { fontVariables } from '@/lib/fonts'

import './globals.css'

export const metadata: Metadata = {
  title: '404 — Socialp Media',
}

// Unmatched URLs land here, outside both language layouts — so it speaks both.
export default function GlobalNotFound() {
  return (
    <html lang="tr" className={fontVariables}>
      <body>
        <LogoSprite />
        <main className="grain relative isolate flex min-h-[100svh] flex-col bg-ink text-bone">
          <div className="container-x flex h-[var(--header-h)] items-center">
            <Link href="/" aria-label="Socialp Media" className="-m-2 p-2">
              <LogoInline className="h-[16px] w-auto" />
            </Link>
          </div>
          <div className="container-x flex flex-1 flex-col justify-center py-20">
            <p className="eyebrow text-smoke">404</p>
            <h1 className="display-l mt-8 max-w-[14ch]">{tr.notFound.title}</h1>
            <p className="serif-accent mt-4 text-[clamp(1.4rem,2.4vw,2.2rem)] text-bone/60">{en.notFound.title}</p>
            <p className="lead mt-8 max-w-[44ch] text-bone/65">{tr.notFound.body}</p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link href="/" className="btn btn-light">
                <span>{tr.notFound.home}</span>
              </Link>
              <Link href="/en" className="btn btn-ghost text-bone">
                <span>{en.notFound.home}</span>
              </Link>
            </div>
          </div>
        </main>
      </body>
    </html>
  )
}
