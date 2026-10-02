'use client'

import { X } from 'lucide-react'
import { useEffect, useRef } from 'react'

/**
 * Native <dialog> underneath: focus is trapped, Esc closes, and it sits in
 * the top layer — no portal or focus-trap library needed. `variant`
 * decides whether it is a centred modal or a panel sliding in from the
 * right (the cart).
 */
export function Dialog({
  open,
  onClose,
  title,
  children,
  footer,
  variant = 'modal',
  size = 'md',
  labelledBy,
}: {
  open: boolean
  onClose: () => void
  title: React.ReactNode
  children: React.ReactNode
  footer?: React.ReactNode
  variant?: 'modal' | 'drawer' | 'menu'
  size?: 'md' | 'lg'
  labelledBy?: string
}) {
  const ref = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (open && !el.open) el.showModal()
    if (!open && el.open) el.close()
  }, [open])

  const shell =
    variant === 'drawer'
      ? 'ml-auto mr-0 h-full max-h-none w-full max-w-[28rem] animate-[drawer-in_0.32s_cubic-bezier(0.16,1,0.3,1)] sm:rounded-l-3xl'
      : variant === 'menu'
        ? 'ml-0 mr-auto h-full max-h-none w-[88%] max-w-sm animate-[menu-in_0.32s_cubic-bezier(0.16,1,0.3,1)] rounded-r-3xl'
        : `m-auto max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] ${size === 'lg' ? 'max-w-3xl' : 'max-w-lg'} rounded-3xl animate-[modal-in_0.28s_cubic-bezier(0.16,1,0.3,1)]`

  return (
    <dialog
      ref={ref}
      aria-labelledby={labelledBy}
      onClose={onClose}
      onCancel={(e) => {
        e.preventDefault()
        onClose()
      }}
      onClick={(e) => {
        // A click that lands on the <dialog> itself is the backdrop.
        if (e.target === e.currentTarget) onClose()
      }}
      className={`bg-paper p-0 text-ink shadow-drawer backdrop:bg-ink/40 ${shell}`}
    >
      <div className="flex h-full max-h-[inherit] flex-col">
        <div className="flex items-center justify-between gap-4 border-b border-line px-5 py-4 sm:px-6">
          <h2 id={labelledBy} className="text-lg font-semibold">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="-mr-2 inline-flex h-11 items-center gap-1.5 rounded-full px-3 text-[0.9375rem] font-semibold text-ink-soft transition hover:bg-ink/5 hover:text-ink"
          >
            Kapat <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">{children}</div>
        {footer && <div className="border-t border-line bg-white px-5 py-4 sm:px-6">{footer}</div>}
      </div>
    </dialog>
  )
}
