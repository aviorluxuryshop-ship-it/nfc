'use client'

import clsx from 'clsx'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

import { LogoInline } from '@/components/Logo'
import { alternatePath, type Locale } from '@/lib/site'

type NavService = { number: string; title: string; href: string }

type HeaderProps = {
  locale: Locale
  homeHref: string
  aboutHref: string
  contactHref: string
  workHref: string
  servicesHref: string
  services: NavService[]
  labels: {
    services: string
    work: string
    about: string
    contact: string
    cta: string
    menu: string
    close: string
    language: string
  }
  contactLines: { label: string; href: string }[]
}

export function Header(props: HeaderProps) {
  const { locale, labels, services } = props
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [open, setOpen] = useState(false)
  const lastY = useRef(0)

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY
      setScrolled(y > 24)
      // Hide while reading downwards, return on any upward scroll.
      setHidden(y > 480 && y > lastY.current + 2)
      if (y < lastY.current - 2 || y <= 480) setHidden(false)
      lastY.current = y
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close the menu on navigation (React's "adjust state on prop change").
  const [prevPath, setPrevPath] = useState(pathname)
  if (prevPath !== pathname) {
    setPrevPath(pathname)
    setOpen(false)
  }

  useEffect(() => {
    const lenis = window.__lenis
    if (open) {
      lenis?.stop()
      document.documentElement.style.overflow = 'hidden'
    } else {
      lenis?.start()
      document.documentElement.style.overflow = ''
    }
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const other: Locale = locale === 'tr' ? 'en' : 'tr'
  const altHref = alternatePath(pathname, other)
  const isActive = (href: string) => pathname === href || (href !== '/' && href !== '/en' && pathname.startsWith(href))
  const inServices = services.some((s) => pathname === s.href)

  return (
    <>
      <header
        className={clsx(
          'fixed inset-x-0 top-0 z-50 transition-[transform,background-color,border-color] duration-700 ease-[var(--ease-out-expo)]',
          hidden && !open ? '-translate-y-full' : 'translate-y-0',
          scrolled && !open ? 'border-b border-white/[0.07] bg-ink/75 backdrop-blur-xl' : 'border-b border-transparent',
        )}
      >
        <div className="container-x flex h-[var(--header-h)] items-center justify-between gap-6">
          <Link href={props.homeHref} className="relative z-10 -m-2 p-2 text-bone" aria-label="Socialp Media">
            <LogoInline className="h-[15px] w-auto sm:h-[17px]" />
          </Link>

          <nav aria-label="Ana menü" className="hidden items-center gap-1 lg:flex">
            <div className="group relative">
              <Link
                href={props.servicesHref}
                className={clsx(
                  'inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-[0.93rem] text-bone/80 transition-colors hover:text-bone',
                  inServices && 'text-bone',
                )}
                aria-haspopup="true"
              >
                {labels.services}
                <svg width="9" height="9" viewBox="0 0 10 10" aria-hidden="true" className="transition-transform duration-500 group-hover:rotate-180 group-focus-within:rotate-180">
                  <path d="M1 3.5 5 7l4-3.5" fill="none" stroke="currentColor" strokeWidth="1.3" />
                </svg>
              </Link>
              <div className="pointer-events-none invisible absolute left-1/2 top-full w-[26rem] -translate-x-1/2 pt-3 opacity-0 transition-all duration-500 ease-[var(--ease-out-expo)] group-hover:pointer-events-auto group-hover:visible group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:visible group-focus-within:opacity-100">
                <ul className="overflow-hidden rounded-2xl border border-white/10 bg-ink-2/95 p-2 shadow-2xl shadow-black/50 backdrop-blur-xl">
                  {services.map((s) => (
                    <li key={s.href}>
                      <Link
                        href={s.href}
                        className="group/item flex items-center gap-4 rounded-xl px-4 py-3.5 text-bone/85 transition-colors hover:bg-white/[0.06] hover:text-bone"
                      >
                        <span className="eyebrow text-smoke">{s.number}</span>
                        <span className="flex-1 text-[0.98rem]">{s.title}</span>
                        <span aria-hidden="true" className="-translate-x-2 opacity-0 transition-all duration-500 group-hover/item:translate-x-0 group-hover/item:opacity-100">
                          →
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            {[
              { href: props.workHref, label: labels.work },
              { href: props.aboutHref, label: labels.about },
              { href: props.contactHref, label: labels.contact },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  'rounded-full px-4 py-2 text-[0.93rem] text-bone/80 transition-colors hover:text-bone',
                  isActive(item.href) && 'text-bone',
                )}
                aria-current={isActive(item.href) ? 'page' : undefined}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="relative z-10 flex items-center gap-2 sm:gap-3">
            <Link
              href={altHref}
              hrefLang={other}
              className="eyebrow rounded-full px-3 py-2.5 text-bone/70 transition-colors hover:text-bone"
              aria-label={`${labels.language}: ${other === 'en' ? 'English' : 'Türkçe'}`}
            >
              <span className={clsx(locale === 'tr' && 'text-bone')}>TR</span>
              <span className="mx-1.5 text-bone/30">/</span>
              <span className={clsx(locale === 'en' && 'text-bone')}>EN</span>
            </Link>
            <Link href={props.contactHref} className="btn btn-light hidden !h-11 !px-5 !text-[0.88rem] md:inline-flex">
              <span>{labels.cta}</span>
            </Link>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="relative flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-bone lg:hidden"
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? labels.close : labels.menu}
            >
              <span className={clsx('absolute h-px w-4 bg-current transition-transform duration-500', open ? 'rotate-45' : '-translate-y-[3px]')} />
              <span className={clsx('absolute h-px w-4 bg-current transition-transform duration-500', open ? '-rotate-45' : 'translate-y-[3px]')} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        className={clsx(
          'fixed inset-0 z-40 flex flex-col bg-ink transition-[clip-path] duration-700 ease-[var(--ease-in-out-quart)] lg:hidden',
          open ? '[clip-path:inset(0_0_0_0)]' : 'pointer-events-none [clip-path:inset(0_0_100%_0)]',
        )}
        aria-hidden={!open}
        inert={!open}
      >
        <nav aria-label={labels.menu} className="container-x flex flex-1 flex-col justify-center gap-1 pt-[var(--header-h)]">
          <p className="eyebrow mb-3 text-smoke">{labels.services}</p>
          {services.map((s, i) => (
            <Link
              key={s.href}
              href={s.href}
              className={clsx(
                'flex items-baseline gap-3 py-1.5 text-[1.55rem] leading-tight tracking-tight text-bone transition-all duration-700',
                open ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0',
              )}
              style={{ transitionDelay: open ? `${150 + i * 60}ms` : '0ms' }}
            >
              <span className="eyebrow text-smoke">{s.number}</span>
              {s.title}
            </Link>
          ))}
          <div className="my-6 h-px bg-white/10" />
          {[
            { href: props.workHref, label: labels.work },
            { href: props.aboutHref, label: labels.about },
            { href: props.contactHref, label: labels.contact },
          ].map((item, i) => (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                'py-1 text-[2.4rem] font-medium leading-[1.1] tracking-[-0.03em] text-bone transition-all duration-700',
                open ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0',
              )}
              style={{ transitionDelay: open ? `${330 + i * 60}ms` : '0ms' }}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="container-x flex flex-wrap gap-x-6 gap-y-2 pb-10 text-sm text-smoke">
          {props.contactLines.map((l) => (
            <a key={l.href} href={l.href} className="link-draw">
              {l.label}
            </a>
          ))}
        </div>
      </div>
    </>
  )
}
