import Image from 'next/image'

import type { Dictionary } from '@/lib/content'
import { clientLogos } from '@/lib/media'

/** The brand's reference logos, set as a quiet grid — the last cell is the "+100". */
export function Clients({ t, tone = 'dark' }: { t: Dictionary; tone?: 'dark' | 'light' }) {
  const dark = tone === 'dark'

  return (
    <div
      className={
        dark
          ? 'grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-white/10 bg-white/10 sm:grid-cols-3'
          : 'grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-ink/10 bg-ink/10 sm:grid-cols-3'
      }
    >
      {clientLogos.map((logo, i) => (
        <div
          key={logo.name}
          data-reveal="fade"
          style={{ '--delay': `${i * 70}ms` } as React.CSSProperties}
          className={`group relative flex aspect-[16/9] items-center justify-center px-8 ${dark ? 'bg-ink' : 'bg-paper'}`}
        >
          <Image
            src={logo.src}
            alt={logo.name}
            width={logo.width}
            height={logo.height}
            sizes="(min-width: 640px) 220px, 160px"
            className={`h-auto max-h-12 w-auto max-w-[72%] object-contain opacity-60 transition-all duration-700 group-hover:scale-[1.04] group-hover:opacity-100 sm:max-h-14 ${dark ? '' : 'brightness-0'}`}
          />
        </div>
      ))}
      <div
        data-reveal="fade"
        style={{ '--delay': `${clientLogos.length * 70}ms` } as React.CSSProperties}
        className={`flex aspect-[16/9] flex-col items-center justify-center gap-2 px-6 text-center ${dark ? 'bg-ink text-bone' : 'bg-paper text-ink'}`}
      >
        <span className="text-[clamp(2rem,4vw,3.4rem)] font-medium leading-none tracking-[-0.04em]">{t.clients.more}</span>
        <span className={`eyebrow text-[0.6rem] tracking-[0.14em] sm:text-[0.72rem] sm:tracking-[0.2em] ${dark ? 'text-smoke' : 'text-graphite'}`}>{t.clients.moreLabel}</span>
      </div>
    </div>
  )
}

export function ClientsSection({ t }: { t: Dictionary }) {
  return (
    <section className="relative bg-ink py-24 sm:py-32" aria-labelledby="clients-title">
      <div className="container-x">
        <div className="mb-12 grid gap-6 sm:mb-16 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <p className="eyebrow mb-6 text-smoke" data-reveal>
              {t.clients.eyebrow}
            </p>
            <h2 id="clients-title" className="display-m max-w-[18ch] text-bone" data-reveal style={{ '--delay': '80ms' } as React.CSSProperties}>
              {t.clients.title}
            </h2>
          </div>
        </div>
        <Clients t={t} />
      </div>
    </section>
  )
}
