import Link from 'next/link'

import type { Dictionary } from '@/lib/content'
import { contact, href, type Locale } from '@/lib/site'

/** Closing call to action, shared by every page. */
export function CtaBand({ locale, t }: { locale: Locale; t: Dictionary }) {
  return (
    <section className="relative overflow-hidden bg-ink pt-28 sm:pt-40" aria-labelledby="cta-title">
      <div className="container-x">
        <p className="eyebrow mb-8 flex items-center gap-3 text-smoke" data-reveal>
          <span className="h-1.5 w-1.5 rounded-full bg-signal-hot" aria-hidden="true" />
          {t.cta.eyebrow}
        </p>
        <h2 id="cta-title" className="display-xl max-w-[12ch] text-bone">
          <span className="block" data-reveal>
            {t.cta.title.split(' ').slice(0, -1).join(' ')}
          </span>
          <span className="serif-accent block text-bone/85" data-reveal style={{ '--delay': '120ms' } as React.CSSProperties}>
            {t.cta.title.split(' ').slice(-1)}
          </span>
        </h2>

        <div className="mt-14 grid gap-10 border-t border-white/10 pt-10 lg:grid-cols-12 lg:items-center">
          <p className="lead max-w-[34ch] text-bone/65 lg:col-span-5" data-reveal>
            {t.cta.body}
          </p>
          <div className="flex flex-wrap gap-3 lg:col-span-7 lg:justify-end" data-reveal style={{ '--delay': '100ms' } as React.CSSProperties}>
            <Link href={href(locale, 'contact')} className="btn btn-light">
              <span>{t.nav.cta}</span>
              <span aria-hidden="true" className="arrow-nudge">
                →
              </span>
            </Link>
            <a href={contact.whatsappHref} target="_blank" rel="noopener noreferrer" className="btn btn-ghost text-bone">
              <span>{t.common.whatsapp}</span>
            </a>
            <a href={`mailto:${contact.tr.email}`} className="btn btn-ghost text-bone">
              <span>{contact.tr.email}</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
