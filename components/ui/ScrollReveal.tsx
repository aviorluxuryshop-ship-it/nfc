'use client'

import { useEffect } from 'react'

/**
 * Page-wide scroll reveal for every `[data-reveal]` element.
 *
 * Whatever is already on screen when the page loads is marked revealed
 * *before* the hiding rules switch on (same task, so no flicker); only
 * content further down waits for the reader. If JavaScript never runs,
 * nothing is ever hidden. New content added by client-side navigation is
 * picked up through a MutationObserver, so it fades in as the page changes.
 */
export function ScrollReveal() {
  useEffect(() => {
    const reveal = (el: Element) => el.setAttribute('data-revealed', '')

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            reveal(entry.target)
            io.unobserve(entry.target)
          }
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
    )

    const watch = (root: ParentNode) => {
      root.querySelectorAll('[data-reveal]:not([data-revealed])').forEach((el) => io.observe(el))
    }

    const onScreen = window.innerHeight
    document.querySelectorAll('[data-reveal]').forEach((el) => {
      const r = el.getBoundingClientRect()
      if (r.top < onScreen && r.bottom > 0) reveal(el)
    })
    document.documentElement.setAttribute('data-reveal-ready', '')
    watch(document)

    const mo = new MutationObserver((mutations) => {
      for (const m of mutations) {
        m.addedNodes.forEach((node) => {
          if (!(node instanceof Element)) return
          if (node.matches('[data-reveal]:not([data-revealed])')) io.observe(node)
          watch(node)
        })
      }
    })
    mo.observe(document.body, { childList: true, subtree: true })

    return () => {
      io.disconnect()
      mo.disconnect()
    }
  }, [])

  return null
}
