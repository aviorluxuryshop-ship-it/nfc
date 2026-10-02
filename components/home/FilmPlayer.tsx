'use client'

import { Play } from 'lucide-react'
import { useRef, useState } from 'react'

import { useI18n } from '@/lib/i18n/client'

/**
 * The promo film: a poster with a big play button. Nothing is downloaded
 * until the visitor presses play (`preload="none"`). Phones get the vertical
 * 9:16 cut, larger screens the 16:9 one — only the visible one ever loads.
 */
function Player({ src, poster, className, frame }: { src: string; poster: string; className: string; frame: string }) {
  const { t } = useI18n()
  const f = t.home.film
  const ref = useRef<HTMLVideoElement>(null)
  const [started, setStarted] = useState(false)

  const start = () => {
    const v = ref.current
    if (!v) return
    setStarted(true)
    void v.play()
  }

  return (
    <div className={`relative overflow-hidden rounded-[1.75rem] bg-ink shadow-[0_30px_80px_-30px_rgba(22,33,74,0.55)] ${frame} ${className}`}>
      <video
        ref={ref}
        className="h-full w-full object-cover"
        poster={poster}
        preload="none"
        playsInline
        controls={started}
        aria-label={f.label}
        onEnded={() => setStarted(false)}
      >
        <source src={src} type="video/mp4" />
      </video>
      {!started && (
        <button
          type="button"
          onClick={start}
          className="group absolute inset-0 flex items-end justify-start bg-[linear-gradient(180deg,rgba(22,33,74,0)_45%,rgba(22,33,74,0.55)_100%)] p-5 text-left text-white sm:p-8"
        >
          <span className="inline-flex items-center gap-4">
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

export function FilmPlayer() {
  const { locale } = useI18n()
  const base = `/video/velmo-${locale}`
  return (
    <>
      <Player src={`${base}-16x9.mp4`} poster={`${base}-16x9.jpg`} frame="aspect-video" className="hidden sm:block" />
      <Player src={`${base}-9x16.mp4`} poster={`${base}-9x16.jpg`} frame="mx-auto aspect-[9/16] w-full max-w-[calc(78svh*0.5625)]" className="sm:hidden" />
    </>
  )
}
