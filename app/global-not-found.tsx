import type { Metadata } from 'next'
import Link from 'next/link'

import { Logo } from '@/components/brand/Logo'
import { RibbonRule } from '@/components/layout/Footer'
import { fontVariables } from '@/lib/fonts'
import { en } from '@/lib/i18n/en'
import { tr } from '@/lib/i18n/tr'

import './globals.css'

export const metadata: Metadata = {
  title: '404 — VELMO',
}

// Unmatched URLs land here, outside both language layouts — so it speaks both.
export default function GlobalNotFound() {
  return (
    <html lang="tr" className={fontVariables}>
      <body className="flex min-h-dvh flex-col bg-paper">
        <RibbonRule />
        <header className="container flex h-[4.5rem] items-center">
          <Link href="/" aria-label={tr.nav.homeAria} className="pt-2">
            <Logo className="text-[1.75rem]" />
          </Link>
        </header>
        <main className="container flex flex-1 flex-col items-center justify-center py-20 text-center">
          <p className="eyebrow text-lavanta">404</p>
          <h1 className="mt-4 font-display text-[clamp(2.5rem,5vw,3.75rem)] font-medium leading-tight">{tr.notFound.title}</h1>
          <p className="mt-2 font-display text-2xl text-ink-mute">{en.notFound.title}</p>
          <p className="mt-6 max-w-md text-lg text-ink-soft">{tr.notFound.lead}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/" className="btn-primary px-8">
              {tr.notFound.home}
            </Link>
            <Link href="/en" className="btn-secondary px-8" hrefLang="en">
              {en.notFound.home}
            </Link>
          </div>
        </main>
      </body>
    </html>
  )
}
