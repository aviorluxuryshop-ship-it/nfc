'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

/**
 * Reveals every [data-reveal] element once (adds `.is-in`). Re-scans after
 * client navigation.
 *
 * An IntersectionObserver does the normal work. A scroll sweep backs it up:
 * on a slow device, a fast flick, the End key or an anchor jump, an element
 * can enter and leave the viewport between two rendered frames, so the
 * observer never reports it and it would stay hidden. The sweep reveals
 * anything that has reached the viewport or already scrolled past it.
 */
export function RevealObserver() {
  const pathname = usePathname()

  useEffect(() => {
    const pending = new Set<Element>()

    const reveal = (el: Element) => {
      el.classList.add('is-in')
      pending.delete(el)
      io.unobserve(el)
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) reveal(entry.target)
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
    )

    const scan = () => {
      document.querySelectorAll('[data-reveal]:not(.is-in)').forEach((el) => {
        if (pending.has(el)) return
        pending.add(el)
        io.observe(el)
      })
    }

    let raf = 0
    const sweep = () => {
      raf = 0
      const limit = window.innerHeight * 0.92
      for (const el of pending) {
        const r = el.getBoundingClientRect()
        // Skip hidden elements (e.g. display:none at this breakpoint).
        if (r.width === 0 && r.height === 0) continue
        if (r.top < limit) reveal(el)
      }
    }
    const onScroll = () => {
      if (!raf && pending.size) raf = requestAnimationFrame(sweep)
    }

    scan()
    // Catch sections that mount a beat later (client components, images).
    const t = window.setTimeout(() => {
      scan()
      onScroll()
    }, 600)
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)

    return () => {
      window.clearTimeout(t)
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      io.disconnect()
    }
  }, [pathname])

  return null
}
