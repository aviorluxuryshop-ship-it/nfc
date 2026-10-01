import Link from 'next/link'

import { HeroRing } from '@/components/home/HeroRing'
import type { Dictionary } from '@/lib/content'
import { href, SERVICE_IDS, type Locale } from '@/lib/site'

export function Hero({ locale, t }: { locale: Locale; t: Dictionary }) {
  return (
    <section className="grain relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-ink" aria-labelledby="hero-title">
      <HeroRing />

      {/* Legibility: darken behind the headline and fade the ring's base into the page. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_70%_at_20%_15%,rgba(11,11,12,0.92)_0%,rgba(11,11,12,0.55)_45%,transparent_75%)]" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-[38%] bg-gradient-to-t from-ink via-ink/70 to-transparent" />

      <div className="container-x relative z-10 flex flex-1 flex-col pb-6 pt-[calc(var(--header-h)+2.5rem)] sm:pt-[calc(var(--header-h)+4rem)]">
        <p className="eyebrow fade-in flex items-center gap-3 text-bone/70" style={{ '--delay': '200ms' } as React.CSSProperties}>
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-signal-hot opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-signal-hot" />
          </span>
          {t.hero.eyebrow}
        </p>

        <h1 id="hero-title" className="display-xl mt-7 max-w-[13ch] text-bone sm:mt-9">
          <span className="rise">
            <span style={{ '--delay': '150ms' } as React.CSSProperties}>{t.hero.titleA}</span>
          </span>
          <span className="rise">
            <span className="serif-accent pr-[0.05em] text-bone/90" style={{ '--delay': '280ms' } as React.CSSProperties}>
              {t.hero.titleB}
            </span>
          </span>
        </h1>

        <div className="mt-8 flex flex-col gap-8 sm:mt-10 md:flex-row md:items-end md:justify-between">
          <p className="lead fade-in max-w-[36ch] text-bone/75 md:max-w-[64ch]" style={{ '--delay': '650ms' } as React.CSSProperties}>
            {t.hero.body}
          </p>
        </div>

        <div className="mt-auto hidden pt-16 sm:block">
          <ul className="fade-in grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-3" style={{ '--delay': '1000ms' } as React.CSSProperties}>
            {SERVICE_IDS.map((id) => (
              <li key={id} className="bg-ink/70 backdrop-blur-md">
                <Link href={href(locale, id)} className="group flex items-center gap-4 px-5 py-4 text-bone/85 transition-colors hover:bg-white/[0.05] hover:text-bone sm:py-5">
                  <span className="eyebrow text-smoke">{t.services[id].number}</span>
                  <span className="flex-1 text-[0.98rem] tracking-tight">{t.services[id].short}</span>
                  <span aria-hidden="true" className="text-smoke transition-all duration-500 group-hover:translate-x-1 group-hover:text-bone">
                    ↗
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
