'use client'

import clsx from 'clsx'
import { useEffect, useRef, useState } from 'react'

type Props = {
  src: string
  poster: string
  label: string
  playLabel: string
  pauseLabel: string
  className?: string
}

/**
 * Muted loop that only downloads and plays while on screen. Reduced-motion
 * users get the poster until they press play. Always has a pause control.
 */
export function AutoVideo({ src, poster, label, playLabel, pauseLabel, className }: Props) {
  const ref = useRef<HTMLVideoElement>(null)
  const [playing, setPlaying] = useState(false)
  const userPaused = useRef(false)

  useEffect(() => {
    const video = ref.current
    if (!video) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) userPaused.current = true

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !userPaused.current) {
          if (video.preload === 'none') video.preload = 'auto'
          video.play().catch(() => setPlaying(false))
        } else if (!entry.isIntersecting) {
          video.pause()
        }
      },
      { threshold: 0.25 },
    )
    io.observe(video)
    return () => io.disconnect()
  }, [])

  const toggle = () => {
    const video = ref.current
    if (!video) return
    if (video.paused) {
      userPaused.current = false
      video.play().catch(() => undefined)
    } else {
      userPaused.current = true
      video.pause()
    }
  }

  return (
    <div className={clsx('relative', className)}>
      <video
        ref={ref}
        className="h-full w-full object-cover"
        poster={poster}
        muted
        loop
        playsInline
        preload="none"
        aria-label={label}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      >
        <source src={src} type="video/mp4" />
      </video>
      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? pauseLabel : playLabel}
        className="absolute bottom-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-ink/70 text-bone backdrop-blur-md transition-colors hover:bg-ink"
      >
        {playing ? (
          <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
            <rect x="2" y="1.5" width="2.6" height="9" fill="currentColor" />
            <rect x="7.4" y="1.5" width="2.6" height="9" fill="currentColor" />
          </svg>
        ) : (
          <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
            <path d="M3 1.5v9l7.5-4.5z" fill="currentColor" />
          </svg>
        )}
      </button>
    </div>
  )
}
