'use client'

import clsx from 'clsx'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'

import { media, RING_TEXTURES } from '@/lib/media'

// A slowly turning ring of the brand's own behind-the-scenes photos, each one
// a curved cylinder segment (see ring-scene.ts). Panels facing away dim and
// desaturate, scrolling spins the ring faster, the pointer tilts it.
//
// The scene module (and three.js with it) is imported only once the browser
// is idle after first paint, so the headline — the LCP — never waits on it.
// No WebGL → a static photo fallback.

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
        <div className="absolute inset-x-0 bottom-[8%] flex justify-center gap-3 opacity-60 sm:gap-5">
          {[media.cafe, media.streetCampaign, media.showroom].map((img, i) => (
            <div key={img.src} className={clsx('relative aspect-[3/4] w-[28vw] max-w-[260px] overflow-hidden rounded-xl', i === 1 && '-translate-y-6')}>
              <Image src={img.src} alt="" fill sizes="28vw" className="object-cover" />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
