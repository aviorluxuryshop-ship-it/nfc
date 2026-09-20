'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * Fades and lifts its children in once they scroll into view. Small,
 * one-shot, no library — the site was reading as too static, this is the
 * minimum motion that fixes that without turning the catalog into a demo
 * reel. `as` lets it render as a `li` (or any tag) so it can sit directly
 * inside a `ul` without an extra wrapper.
 */
export function Reveal({
  children,
  className = '',
  delay = 0,
  as: Tag = 'div',
}: {
  children: React.ReactNode
  className?: string
  delay?: number
  as?: 'div' | 'li'
}) {
  const ref = useRef<HTMLDivElement & HTMLLIElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    // Belt-and-suspenders: some capture/automation tools (full-page
    // screenshots, some crawlers) render the whole page without ever
    // firing a real scroll event, so IntersectionObserver never triggers.
    // A short fallback timer guarantees content is never stuck invisible.
    const fallback = setTimeout(() => setVisible(true), 1200)

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          clearTimeout(fallback)
          observer.disconnect()
        }
      },
      { threshold: 0.15 },
    )
    observer.observe(el)
    return () => {
      observer.disconnect()
      clearTimeout(fallback)
    }
  }, [])

  return (
    <Tag
      ref={ref}
      className={`transition-all duration-700 ease-out ${visible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </Tag>
  )
}
