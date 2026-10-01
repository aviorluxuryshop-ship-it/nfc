import Link from 'next/link'

import { HeroRing } from '@/components/home/HeroRing'
import type { Dictionary } from '@/lib/content'
import { href, SERVICE_IDS, type Locale } from '@/lib/site'

// Text and the photo ring never share space: on desktop the copy takes the
// left columns and the ring gets its own box on the right, bleeding to the
// viewport edge (past the container's max width on very wide screens); on
// phones the ring sits in a band under the copy. The services strip has its
// own row at the bottom.
export function Hero({ locale, t }: { locale: Locale; t: Dictionary }) {
  return (
    <section className="grain relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-ink" aria-labelledby="hero-title">
      <div className="container-x relative z-10 flex flex-1 flex-col pb-6 pt-[calc(var(--header-h)+2rem)] sm:pt-[calc(var(--header-h)+3rem)]">
        <div className="flex flex-1 flex-col gap-6 lg:grid lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-7 lg:flex lg:flex-col lg:justify-center">
            <p className="eyebrow fade-in flex items-center gap-3 text-bone/70" style={{ '--delay': '200ms' } as React.CSSProperties}>
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-signal-hot opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-signal-hot" />
              </span>
              {t.hero.eyebrow}
            </p>

            <h1
              id="hero-title"
              className="mt-7 text-[clamp(3rem,8.2vw,9.5rem)] font-medium leading-[0.98] tracking-[-0.045em] text-bone sm:mt-9"
            >
              <span className="rise">
                <span style={{ '--delay': '150ms' } as React.CSSProperties}>{t.hero.titleA}</span>
              </span>
              <span className="rise">
                <span className="serif-accent pr-[0.05em] text-bone/90" style={{ '--delay': '280ms' } as React.CSSProperties}>
                  {t.hero.titleB}
                </span>
              </span>
            </h1>

            <p className="lead fade-in mt-8 max-w-[44ch] text-bone/75 sm:mt-10" style={{ '--delay': '650ms' } as React.CSSProperties}>
              {t.hero.body}
            </p>
          </div>

          <div className="relative -mx-[var(--gutter)] min-h-[300px] flex-1 lg:col-span-5 lg:mx-0 lg:-mr-[calc(var(--gutter)_+_max(0px,_(100vw_-_104rem)_/_2))] lg:min-h-[440px] lg:[mask-image:linear-gradient(90deg,black_78%,transparent)]">
            <HeroRing />
          </div>
        </div>

        <div className="mt-6 hidden sm:block">
          <ul className="fade-in grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-3" style={{ '--delay': '1000ms' } as React.CSSProperties}>
            {SERVICE_IDS.map((id) => (
              <li key={id} className="bg-ink-2">
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
