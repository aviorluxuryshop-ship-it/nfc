'use client'

import Image from 'next/image'
import { useEffect, useRef } from 'react'

import type { WorkItem } from '@/lib/content/types'

type Props = {
  id?: string
  eyebrow: string
  title: string
  body: string
  items: WorkItem[]
}

/**
 * Behind-the-scenes wall: three columns drifting at different speeds on
 * desktop (subtle parallax). Below md the column wrappers are display:contents,
 * so every shot flows into a plain two-column grid.
 */
export function Production({ id, eyebrow, title, body, items }: Props) {
  const gridRef = useRef<HTMLDivElement>(null)

  // Distribute into three columns, round-robin, so each column mixes shoots.
  const columns: WorkItem[][] = [[], [], []]
  items.forEach((item, i) => columns[i % 3].push(item))

  useEffect(() => {
    const grid = gridRef.current
    if (!grid) return
    const mq = window.matchMedia('(min-width: 768px) and (prefers-reduced-motion: no-preference)')
    const cols = Array.from(grid.querySelectorAll<HTMLElement>('[data-col]'))
    const speeds = [-0.05, 0.04, -0.08]
    const MAX = 90
    let raf = 0

    const update = () => {
      raf = 0
      if (!mq.matches) {
        cols.forEach((c) => (c.style.transform = ''))
        return
      }
      const r = grid.getBoundingClientRect()
      const center = r.top + r.height / 2 - window.innerHeight / 2
      cols.forEach((c, i) => {
        const y = Math.max(-MAX, Math.min(MAX, center * speeds[i]))
        c.style.transform = `translate3d(0, ${y.toFixed(1)}px, 0)`
      })
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
    <section id={id} className="relative overflow-hidden bg-ink py-24 sm:py-36" aria-labelledby={id ? `${id}-title` : undefined}>
      <div className="container-x">
        <div className="mb-16 grid gap-8 sm:mb-24 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <p className="eyebrow mb-6 text-smoke" data-reveal>
              {eyebrow}
            </p>
            <h2 id={id ? `${id}-title` : undefined} className="display-l text-bone" data-reveal style={{ '--delay': '80ms' } as React.CSSProperties}>
              {title}
            </h2>
          </div>
          <p className="lead max-w-[40ch] text-bone/65 lg:col-span-5 lg:justify-self-end" data-reveal style={{ '--delay': '160ms' } as React.CSSProperties}>
            {body}
          </p>
        </div>

        <div ref={gridRef} className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 md:gap-6">
          {columns.map((col, ci) => (
            <div key={ci} data-col className={`contents will-change-transform md:flex md:flex-col md:gap-6 ${ci === 1 ? 'md:pt-24' : ''} ${ci === 2 ? 'md:pt-10' : ''}`}>
              {col.map((item, i) => (
                <figure key={item.src} className="group" data-reveal style={{ '--delay': `${(i % 2) * 90}ms` } as React.CSSProperties}>
                  <div className="relative overflow-hidden rounded-2xl bg-ink-3" style={{ aspectRatio: i % 2 === 0 ? '4 / 5' : '3 / 4' }}>
                    <Image
                      src={item.src}
                      alt={item.alt}
                      fill
                      sizes="(min-width: 768px) 31vw, 46vw"
                      className="object-cover transition-transform duration-[1.4s] ease-[var(--ease-out-expo)] group-hover:scale-[1.045]"
                    />
                  </div>
                  <figcaption className="mt-3 flex items-baseline justify-between gap-3 text-[0.86rem] text-bone/70">
                    <span>{item.caption}</span>
                    <span className="eyebrow text-[0.62rem] text-smoke">{String(ci + i * 3 + 1).padStart(2, '0')}</span>
                  </figcaption>
                </figure>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
