'use client'

import clsx from 'clsx'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'

import { probeGL } from '@/lib/gl-probe'
import { RING_TEXTURES, RING_TEXTURES_SMALL } from '@/lib/media'

// A slowly turning ring of the brand's own behind-the-scenes photos, each one
// a curved cylinder segment (see ring-scene.ts). Panels facing away dim and
// desaturate, scrolling spins the ring faster, the pointer tilts it.
//
// The scene module is imported only once the browser is idle after first
// paint, so the headline never waits on it. No (hardware) WebGL → the photos
// run as a flat CSS film strip instead (see lib/gl-probe.ts).

export function HeroRing() {
  const hostRef = useRef<HTMLDivElement>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const host = hostRef.current
    if (!host || !probeGL()) return

    let cancelled = false
    let teardown: (() => void) | null = null

    const boot = async () => {
      const { createRingScene } = await import('./ring-scene')
      if (cancelled) return
      teardown = createRingScene(host, {
        textures: window.matchMedia('(max-width: 767px)').matches ? RING_TEXTURES_SMALL : RING_TEXTURES,
        reduceMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
        onReady: () => setReady(true),
      })
      if (!teardown) document.documentElement.dataset.gl = 'sw'
    }

    const w = window as Window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number
      cancelIdleCallback?: (id: number) => void
    }
    const idle = w.requestIdleCallback ? w.requestIdleCallback(() => void boot(), { timeout: 900 }) : window.setTimeout(() => void boot(), 250)

    return () => {
      cancelled = true
      if (w.cancelIdleCallback) w.cancelIdleCallback(idle)
      else window.clearTimeout(idle)
      teardown?.()
    }
  }, [])

  return (
    <div className="absolute inset-0" aria-hidden="true">
      <div
        ref={hostRef}
        className={clsx('absolute inset-0 transition-opacity duration-[1800ms] ease-out', ready ? 'opacity-100' : 'opacity-0')}
      />
      {/* No hardware WebGL (or no JS): the same photos drift past as a flat
          film strip. Always in the markup, shown by CSS from <html data-gl>;
          its images are lazy, so nothing loads while it stays hidden. */}
      <div className="ring-fallback absolute inset-x-0 top-1/2 -translate-y-1/2 overflow-hidden opacity-80 [mask-image:linear-gradient(90deg,transparent,black_12%,black_88%,transparent)]">
        <div className="marquee" style={{ '--marquee-duration': '70s' } as React.CSSProperties}>
          {[0, 1].map((half) => (
            <div key={half} className="flex shrink-0 gap-4 pr-4">
              {RING_TEXTURES.map((src, i) => (
                <Image
                  key={`${half}-${src}`}
                  src={src}
                  alt=""
                  width={600}
                  height={800}
                  sizes="26vh"
                  // The first frames are on screen at once when shown.
                  loading="lazy"
                  fetchPriority={half === 0 && i < 4 ? 'high' : 'auto'}
                  className="h-[min(30vh,280px)] w-auto rounded-xl object-cover"
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
