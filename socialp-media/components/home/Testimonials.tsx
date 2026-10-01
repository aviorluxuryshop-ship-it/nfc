'use client'

import clsx from 'clsx'
import Image from 'next/image'
import { useCallback, useEffect, useRef, useState } from 'react'

import type { Dictionary } from '@/lib/content'
import { media } from '@/lib/media'

const DURATION = 9000

/**
 * The brand's three client quotes, on the campaign red. Auto-advances with a
 * progress bar; pauses on hover/focus. Reduced motion drops the slide-up,
 * keeping a plain crossfade.
 */
export function Testimonials({ t }: { t: Dictionary }) {
  const items = t.testimonials.items
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const barRef = useRef<HTMLSpanElement>(null)

  const go = useCallback((dir: 1 | -1) => setIndex((i) => (i + dir + items.length) % items.length), [items.length])

  useEffect(() => {
    if (paused) return
    const bar = barRef.current
    let start = performance.now()
    let raf = 0
    const tick = (now: number) => {
      const p = Math.min((now - start) / DURATION, 1)
      if (bar) bar.style.transform = `scaleX(${p})`
      if (p >= 1) {
        start = now
        go(1)
        return
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [index, paused, go])

  return (
    <section
      className="grain relative isolate overflow-hidden bg-signal py-24 text-bone sm:py-36"
      aria-roledescription="carousel"
      aria-labelledby="testimonials-title"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="container-x grid gap-14 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-4">
          <p id="testimonials-title" className="eyebrow text-bone/70" data-reveal>
            {t.testimonials.eyebrow}
          </p>
          <div className="relative mt-10 hidden aspect-[3/4] w-full max-w-[19rem] overflow-hidden rounded-2xl lg:block" data-reveal="clip">
            <Image
              src={media.trayPhone.src}
              alt=""
              width={media.trayPhone.width}
              height={media.trayPhone.height}
              sizes="304px"
              className="h-full w-full object-cover"
            />
          </div>
        </div>

        <div className="flex flex-col lg:col-span-8">
          <span className="serif-accent -mb-6 block text-[7rem] leading-none text-bone/30 sm:text-[9rem]" aria-hidden="true">
            “
          </span>
          <div className="grid" aria-live={paused ? 'polite' : 'off'}>
            {items.map((item, i) => (
              <figure
                key={item.topic}
                className={clsx(
                  '[grid-area:1/1] transition-all duration-[900ms] ease-[var(--ease-out-expo)]',
                  i === index ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0 motion-reduce:translate-y-0',
                )}
                aria-hidden={i !== index}
                role="group"
                aria-roledescription="slide"
                aria-label={`${i + 1} / ${items.length}`}
              >
                <blockquote>
                  <p className="text-[clamp(1.6rem,3.1vw,3rem)] font-medium leading-[1.16] tracking-[-0.03em]">{item.quote}</p>
                </blockquote>
                <figcaption className="mt-10 flex items-center gap-4 text-bone/75">
                  <span className="h-px w-10 bg-bone/50" aria-hidden="true" />
                  <span className="eyebrow">{item.topic}</span>
                </figcaption>
              </figure>
            ))}
          </div>

          <div className="mt-14 flex items-center gap-6 sm:mt-20">
            <span className="eyebrow tabular-nums text-bone/80">
              {String(index + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')}
            </span>
            <span className="relative h-px flex-1 overflow-hidden bg-bone/25" aria-hidden="true">
              <span ref={barRef} className="absolute inset-0 origin-left scale-x-0 bg-bone" />
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => go(-1)}
                aria-label={t.common.prev}
                className="flex h-12 w-12 items-center justify-center rounded-full border border-bone/30 transition-colors hover:bg-bone hover:text-signal"
              >
                ←
              </button>
              <button
                type="button"
                onClick={() => go(1)}
                aria-label={t.common.next}
                className="flex h-12 w-12 items-center justify-center rounded-full border border-bone/30 transition-colors hover:bg-bone hover:text-signal"
              >
                →
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
