'use client'

import { Play } from 'lucide-react'
import { useRef, useState } from 'react'

import { useI18n } from '@/lib/i18n/client'

const WIDE = '(min-width: 640px)'

/**
 * The promo film: a poster with a big play button. Before play only one
 * poster image loads (the 16:9 one, or the 9:16 one on phones); the film
 * itself is fetched only when the visitor presses play, and the cut that
 * fits the screen is chosen at that moment.
 */
export function FilmPlayer() {
  const { t, locale } = useI18n()
  const f = t.home.film
  const ref = useRef<HTMLVideoElement>(null)
  const [started, setStarted] = useState(false)
  const base = `/video/velmo-${locale}`

  const start = () => {
    const v = ref.current
    if (!v) return
    if (!v.getAttribute('src')) v.src = `${base}-${window.matchMedia(WIDE).matches ? '16x9' : '9x16'}.mp4`
    setStarted(true)
    // play() inside the click so phones allow sound
    void v.play()
    // keep keyboard users on the player once the button (and its focus) is gone
    requestAnimationFrame(() => v.focus())
  }

  return (
    <div className="relative mx-auto aspect-[9/16] w-full max-w-[calc(78svh*0.5625)] overflow-hidden rounded-[1.75rem] bg-ink shadow-[0_30px_80px_-30px_rgba(22,33,74,0.55)] sm:aspect-video sm:max-w-none">
      <video
        ref={ref}
        className="absolute inset-0 h-full w-full object-cover"
        preload="none"
        playsInline
        controls={started}
        aria-label={f.label}
        onEnded={() => setStarted(false)}
      />
      {!started && (
        <button
          type="button"
          onClick={start}
          className="group absolute inset-0 flex items-end justify-start p-5 text-left text-white sm:p-8"
        >
          <picture>
            <source media={WIDE} srcSet={`${base}-16x9.jpg`} width={1280} height={720} />
            <img src={`${base}-9x16.jpg`} width={720} height={1280} alt="" loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover" />
          </picture>
          <span aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(180deg,rgba(22,33,74,0)_45%,rgba(22,33,74,0.55)_100%)]" />
          <span className="relative inline-flex items-center gap-4">
            <span className="relative flex h-16 w-16 items-center justify-center rounded-full bg-white text-ink shadow-lg transition duration-300 group-hover:scale-105 sm:h-20 sm:w-20">
              <span aria-hidden="true" className="film-ping absolute inset-0 rounded-full bg-white/60" />
              <Play className="relative ml-1 h-7 w-7 fill-current sm:h-8 sm:w-8" aria-hidden="true" />
            </span>
            <span>
              <span className="block text-lg font-semibold sm:text-xl">{f.play}</span>
              <span className="block text-sm text-white/80">{f.length}</span>
            </span>
          </span>
        </button>
      )}
    </div>
  )
}
