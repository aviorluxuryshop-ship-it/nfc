'use client'

import clsx from 'clsx'
import Image from 'next/image'
import { useRef, useState } from 'react'

import type { Img } from '@/lib/content/types'

type Sector = Img & { label: string }

/**
 * Sector list for the web design page. On desktop the matching photo floats
 * beside the cursor while hovering a row; on touch screens each row carries
 * a small thumbnail instead.
 */
export function SectorList({ sectors }: { sectors: Sector[] }) {
  const listRef = useRef<HTMLUListElement>(null)
  const floatRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState<number | null>(null)

  const onMove = (e: React.PointerEvent) => {
    const list = listRef.current
    const float = floatRef.current
    if (!list || !float || e.pointerType !== 'mouse') return
    const r = list.getBoundingClientRect()
    const x = e.clientX - r.left
    const y = e.clientY - r.top
    float.style.transform = `translate3d(${x + 32}px, ${y - 140}px, 0)`
  }

  return (
    <div className="relative">
      <ul ref={listRef} className="border-t border-ink/15" onPointerMove={onMove} onPointerLeave={() => setActive(null)}>
        {sectors.map((s, i) => (
          <li
            key={s.label}
            onPointerEnter={(e) => e.pointerType === 'mouse' && setActive(i)}
            className="group relative flex items-center gap-5 border-b border-ink/15 py-5 sm:py-7"
            data-reveal
            style={{ '--delay': `${i * 60}ms` } as React.CSSProperties}
          >
            <span className="eyebrow w-8 text-graphite">{String(i + 1).padStart(2, '0')}</span>
            <div className="relative h-14 w-11 shrink-0 overflow-hidden rounded-md md:hidden">
              <Image src={s.src} alt="" fill sizes="44px" className="object-cover" />
            </div>
            <span className="flex-1 text-[clamp(1.5rem,3.4vw,3.2rem)] font-medium leading-none tracking-[-0.035em] transition-transform duration-700 ease-[var(--ease-out-expo)] md:group-hover:translate-x-4">
              {s.label}
            </span>
            <span aria-hidden="true" className="hidden text-2xl text-graphite transition-all duration-500 group-hover:text-signal md:block">
              ↗
            </span>
          </li>
        ))}
      </ul>

      <div
        ref={floatRef}
        aria-hidden="true"
        className={clsx(
          'pointer-events-none absolute left-0 top-0 z-10 hidden h-[17rem] w-[13.5rem] overflow-hidden rounded-xl shadow-2xl shadow-black/30 transition-opacity duration-300 md:block',
          active === null ? 'opacity-0' : 'opacity-100',
        )}
      >
        {sectors.map((s, i) => (
          <Image
            key={s.src}
            src={s.src}
            alt=""
            fill
            sizes="216px"
            className={clsx('object-cover transition-all duration-500', active === i ? 'scale-100 opacity-100' : 'scale-110 opacity-0')}
          />
        ))}
      </div>
    </div>
  )
}
