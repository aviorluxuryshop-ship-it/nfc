'use client'

import clsx from 'clsx'
import { useEffect, useState } from 'react'

import { contact } from '@/lib/site'

/** Floating WhatsApp shortcut — appears once the visitor is past the hero. */
export function WhatsAppButton({ label }: { label: string }) {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > window.innerHeight * 0.8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Its own landmark, so nothing on the page sits outside one.
  return (
    <aside aria-label="WhatsApp">
      <a
        href={contact.whatsappHref}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={label}
        tabIndex={show ? 0 : -1}
        className={clsx(
          'group fixed bottom-5 right-5 z-30 flex h-14 items-center gap-0 overflow-hidden rounded-full bg-bone pl-4 pr-4 text-ink shadow-[0_20px_50px_-15px_rgba(0,0,0,0.6)] transition-all duration-700 ease-[var(--ease-out-expo)] sm:bottom-7 sm:right-7',
          show ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-6 opacity-0',
        )}
      >
        <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" className="shrink-0">
          <path
            fill="currentColor"
            d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91C21.95 6.45 17.5 2 12.04 2Zm0 18.15c-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.26 8.26 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.25-8.24 4.54 0 8.24 3.7 8.24 8.24 0 4.55-3.7 8.24-8.24 8.24Zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.25-.64.81-.78.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.13-.15.17-.25.25-.42.08-.16.04-.31-.02-.43-.06-.13-.56-1.35-.76-1.84-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.22.25-.86.85-.86 2.07s.89 2.4 1.01 2.56c.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.15-1.18-.06-.1-.23-.16-.48-.29Z"
          />
        </svg>
        <span className="max-w-0 whitespace-nowrap text-sm font-medium opacity-0 transition-all duration-700 ease-[var(--ease-out-expo)] group-hover:ml-3 group-hover:max-w-[14rem] group-hover:opacity-100 group-focus-visible:ml-3 group-focus-visible:max-w-[14rem] group-focus-visible:opacity-100">
          {label}
        </span>
      </a>
    </aside>
  )
}
