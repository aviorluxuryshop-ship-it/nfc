import Link from 'next/link'

import { AutoVideo } from '@/components/AutoVideo'
import { BrowserFrame } from '@/components/BrowserFrame'
import type { Dictionary } from '@/lib/content'
import { DLUX_VIDEO, DLUX_VIDEO_SMALL, media } from '@/lib/media'

/** The one live website we have footage of: Dlux Professional's e-commerce site. */
export function FeaturedProject({ t, linkHref, tone = 'light' }: { t: Dictionary; linkHref?: string; tone?: 'light' | 'dark' }) {
  const light = tone === 'light'
  return (
    <section className={light ? 'bg-paper py-24 text-ink sm:py-36' : 'bg-ink py-24 text-bone sm:py-32'} aria-labelledby="featured-title">
      <div className="container-x">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <p className={`eyebrow mb-6 ${light ? 'text-graphite' : 'text-smoke'}`} data-reveal>
              {t.featured.eyebrow}
            </p>
            <h2 id="featured-title" className="display-l" data-reveal style={{ '--delay': '80ms' } as React.CSSProperties}>
              {t.featured.title}
              <span className={`serif-accent mt-3 block text-[0.42em] tracking-normal ${light ? 'text-graphite' : 'text-smoke'}`}>{t.featured.by}</span>
            </h2>
          </div>
          <p className={`lead max-w-[42ch] lg:col-span-4 ${light ? 'text-ink/70' : 'text-bone/65'}`} data-reveal style={{ '--delay': '160ms' } as React.CSSProperties}>
            {t.featured.body}
          </p>
        </div>

        <div className="mt-14 sm:mt-20" data-reveal style={{ '--delay': '120ms' } as React.CSSProperties}>
          <BrowserFrame url={t.featured.url} tone={light ? 'light' : 'dark'}>
            <AutoVideo
              src={DLUX_VIDEO}
              srcSmall={DLUX_VIDEO_SMALL}
              poster={media.dluxPoster.src}
              label={`${t.featured.title} — ${t.services.web.title}`}
              playLabel={t.common.playVideo}
              pauseLabel={t.common.pauseVideo}
              className="aspect-[1440/736]"
            />
          </BrowserFrame>
        </div>

        <div className={`mt-10 grid gap-px overflow-hidden rounded-2xl border ${linkHref ? 'sm:grid-cols-4' : 'sm:grid-cols-3'} ${light ? 'border-ink/10 bg-ink/10' : 'border-white/10 bg-white/10'}`}>
          {t.featured.rows.map((row, i) => (
            <div key={row.label} className={`p-6 ${light ? 'bg-paper' : 'bg-ink'}`} data-reveal="fade" style={{ '--delay': `${i * 80}ms` } as React.CSSProperties}>
              <p className={`eyebrow ${light ? 'text-graphite' : 'text-smoke'}`}>{row.label}</p>
              <p className="mt-3 text-[1.08rem] tracking-tight">{row.value}</p>
            </div>
          ))}
          {linkHref ? (
            <Link
              href={linkHref}
              className={`group flex items-center justify-between gap-4 p-6 transition-colors ${light ? 'bg-ink text-bone hover:bg-signal' : 'bg-bone text-ink hover:bg-signal hover:text-bone'}`}
            >
              <span className="text-[1.02rem] font-medium tracking-tight">{t.featured.link}</span>
              <span aria-hidden="true" className="arrow-nudge text-xl">
                →
              </span>
            </Link>
          ) : null}
        </div>
      </div>
    </section>
  )
}
