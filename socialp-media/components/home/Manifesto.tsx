'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef } from 'react'

import type { Dictionary } from '@/lib/content'
import { media } from '@/lib/media'

/**
 * Brand statement on paper. Words light up as the section scrolls past —
 * one CSS variable (--p) drives every word, so a scroll costs one style write.
 */
export function Manifesto({ t, aboutHref }: { t: Dictionary; aboutHref: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const words = t.manifesto.text.split(' ')

  useEffect(() => {
    const el = ref.current
    if (!el) return
    let raf = 0
    const update = () => {
      raf = 0
      const r = el.getBoundingClientRect()
      const vh = window.innerHeight
      // 0 when the block's top reaches 85% of the viewport, 1 when its bottom reaches 55%.
      const start = vh * 0.85
      const end = vh * 0.55
      const p = (start - r.top) / (start - end + r.height)
      el.style.setProperty('--p', Math.min(Math.max(p, 0), 1).toFixed(3))
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return (
    <section className="relative bg-paper py-24 text-ink sm:py-36" aria-labelledby="manifesto-title">
      <div className="container-x grid gap-14 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-3">
          <p id="manifesto-title" className="eyebrow text-graphite" data-reveal>
            {t.manifesto.eyebrow}
          </p>
          <div className="relative mt-10 hidden aspect-[2/3] w-full max-w-[15rem] overflow-hidden rounded-2xl lg:block" data-reveal="clip">
            <Image
              src={media.officeSign.src}
              alt={t.locale === 'tr' ? 'Socialp Media ofis tabelası' : 'Socialp Media office sign'}
              width={media.officeSign.width}
              height={media.officeSign.height}
              sizes="240px"
              className="h-full w-full object-cover"
            />
          </div>
        </div>

        <div className="lg:col-span-9">
          <div ref={ref} style={{ '--n': words.length } as React.CSSProperties}>
            <p className="text-[clamp(1.75rem,3.6vw,3.6rem)] font-medium leading-[1.12] tracking-[-0.035em]">
              {words.map((w, i) => (
                <span key={i} className="scrub-word" style={{ '--i': i } as React.CSSProperties}>
                  {w}{' '}
                </span>
              ))}
            </p>
          </div>

          <dl className="mt-16 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-ink/10 bg-ink/10 sm:mt-24 sm:grid-cols-3">
            {t.manifesto.facts.map((f, i) => (
              <div key={f.label} className="flex flex-col-reverse gap-4 bg-paper p-6 sm:p-8" data-reveal style={{ '--delay': `${i * 90}ms` } as React.CSSProperties}>
                <dt className="eyebrow text-graphite">{f.label}</dt>
                <dd className="text-[clamp(2.4rem,4.2vw,4rem)] font-medium leading-none tracking-[-0.045em]">{f.value}</dd>
              </div>
            ))}
          </dl>

          <Link href={aboutHref} className="group mt-10 inline-flex items-center gap-3 text-[1.05rem] font-medium" data-reveal>
            <span className="link-draw">{t.manifesto.link}</span>
            <span aria-hidden="true" className="arrow-nudge">
              →
            </span>
          </Link>
        </div>
      </div>
    </section>
  )
}
