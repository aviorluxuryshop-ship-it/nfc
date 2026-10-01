'use client'

import clsx from 'clsx'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'

import { RING_TEXTURES } from '@/lib/media'

// A slowly turning ring of the brand's own behind-the-scenes photos, each one
// a curved cylinder segment (see ring-scene.ts). Panels facing away dim and
// desaturate, scrolling spins the ring faster, the pointer tilts it.
//
// The scene module (and three.js with it) is imported only once the browser
// is idle after first paint, so the headline — the LCP — never waits on it.
// No WebGL → the photos run as a flat CSS film strip instead.

export function HeroRing() {
  const hostRef = useRef<HTMLDivElement>(null)
  const [ready, setReady] = useState(false)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    const host = hostRef.current
    if (!host) return

    let cancelled = false
    let teardown: (() => void) | null = null

    const hasWebGL = (() => {
      try {
        const c = document.createElement('canvas')
        return Boolean(c.getContext('webgl2') || c.getContext('webgl'))
      } catch {
        return false
      }
    })()

    const boot = async () => {
      if (!hasWebGL) {
        setFailed(true)
        return
      }
      const { createRingScene } = await import('./ring-scene')
      if (cancelled) return
      teardown = createRingScene(host, {
        textures: RING_TEXTURES,
        reduceMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
        onReady: () => setReady(true),
      })
      if (!teardown) setFailed(true)
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
      {failed && (
        // No WebGL: the same photos drift past as a flat film strip.
        <div className="absolute inset-x-0 bottom-[7%] overflow-hidden opacity-70 [mask-image:linear-gradient(90deg,transparent,black_14%,black_86%,transparent)]">
          <div className="marquee" style={{ '--marquee-duration': '70s' } as React.CSSProperties}>
            {[0, 1].map((half) => (
              <div key={half} className="flex shrink-0 gap-4 pr-4">
                {RING_TEXTURES.map((src) => (
                  <Image key={`${half}-${src}`} src={src} alt="" width={600} height={800} sizes="26vh" className="h-[34vh] w-auto rounded-xl object-cover" />
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
