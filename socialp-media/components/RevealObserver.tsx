'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

/**
 * One IntersectionObserver for every [data-reveal] element on the page. Adds
 * `.is-in` once, then stops watching. Re-scans after client navigation.
 */
export function RevealObserver() {
  const pathname = usePathname()

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-in')
            io.unobserve(entry.target)
          }
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
    )

    const scan = () => {
      document.querySelectorAll('[data-reveal]:not(.is-in)').forEach((el) => io.observe(el))
    }
    scan()
    // Catch sections that mount a beat later (client components, images).
    const t = window.setTimeout(scan, 600)

    return () => {
      window.clearTimeout(t)
      io.disconnect()
    }
  }, [pathname])

  return null
}
