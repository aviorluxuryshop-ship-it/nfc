'use client'

import Link from 'next/link'
import { Menu, X, Instagram, Phone } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

import { navLinks, siteConfig } from '@/data/site'

/**
 * Fixed, background-less header: a hamburger and the store name float over
 * whatever is underneath, instead of a solid bar that visually slices the
 * page in two. Only the homepage has a photo under it, so only there does
 * the header go white-on-dark with a soft scrim; every other page is plain
 * paper at the top, so the header sits ink-on-transparent with no scrim at
 * all — a real transparency, not a gray smudge over white.
 */
export function Header() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const overPhoto = pathname === '/'

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  const iconTextClass = overPhoto
    ? 'text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.6)]'
    : 'text-ink'

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50">
        {overPhoto && (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/45 via-black/15 to-transparent"
          />
        )}
        <div className="container relative flex h-20 items-center justify-between">
          <button
            onClick={() => setOpen(true)}
            aria-label="Menüyü aç"
            className={`flex h-11 w-11 items-center justify-center rounded-full transition hover:opacity-70 ${iconTextClass}`}
          >
            <Menu className="h-6 w-6" strokeWidth={2} />
          </button>
          <Link href="/" className={`text-lg font-bold tracking-tight ${iconTextClass}`}>
            {siteConfig.name}
          </Link>
          <span className="w-11" aria-hidden />
        </div>
      </header>

      {/* Slide-over nav panel */}
      <div
        className={`fixed inset-0 z-[60] transition-opacity duration-300 ${
          open ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
        role="dialog"
        aria-modal="true"
      >
        <button
          aria-label="Menüyü kapat"
          onClick={() => setOpen(false)}
          className="absolute inset-0 bg-ink/50 backdrop-blur-sm"
        />
        <div
          className={`absolute inset-y-0 left-0 flex w-[86%] max-w-sm flex-col bg-paper-raised shadow-lift transition-transform duration-300 ${
            open ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="flex h-20 items-center justify-between px-6">
            <span className="text-lg font-bold tracking-tight text-ink">{siteConfig.name}</span>
            <button
              onClick={() => setOpen(false)}
              aria-label="Menüyü kapat"
              className="flex h-11 w-11 items-center justify-center rounded-full text-ink transition hover:bg-ink/5"
            >
              <X className="h-6 w-6" strokeWidth={2} />
            </button>
          </div>

          <nav className="flex flex-1 flex-col gap-1 px-4 py-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-2xl px-4 py-4 text-lg font-semibold text-ink transition hover:bg-ink/5"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="space-y-3 border-t border-ink/10 px-6 py-6">
            <a href={`tel:${siteConfig.phone.replace(/\s/g, '')}`} className="flex items-center gap-3 text-sm text-ink-soft">
              <Phone className="h-4 w-4 text-royal" /> {siteConfig.phone}
            </a>
            <a
              href={siteConfig.instagram.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 text-sm text-ink-soft"
            >
              <Instagram className="h-4 w-4 text-magenta" /> {siteConfig.instagram.handle}
            </a>
          </div>
        </div>
      </div>
    </>
  )
}
