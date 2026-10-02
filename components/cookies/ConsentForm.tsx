'use client'

import { Check } from 'lucide-react'
import { useState, useSyncExternalStore } from 'react'

import { consentCategories, consentStore, makeConsent, type ConsentCategory } from '@/lib/consent'

/**
 * The category switches. Used in the preferences dialog and inline on the
 * cookie-preferences page. Starts from what was saved before, if anything.
 */
export function ConsentForm({ onSaved }: { onSaved?: () => void }) {
  const stored = useSyncExternalStore(consentStore.subscribe, consentStore.getSnapshot, consentStore.getServerSnapshot)
  // Unsaved edits; until the first toggle the switches mirror what's stored.
  const [draft, setDraft] = useState<Record<ConsentCategory, boolean> | null>(null)
  const [saved, setSaved] = useState(false)
  const base = stored && stored !== 'pending' ? stored : null
  const choice = draft ?? {
    functional: base?.functional ?? false,
    analytics: base?.analytics ?? false,
    marketing: base?.marketing ?? false,
  }

  const save = (next: Record<ConsentCategory, boolean>) => {
    setDraft(null)
    consentStore.set(makeConsent(next))
    setSaved(true)
    onSaved?.()
  }

  return (
    <div>
      <p className="text-[0.9375rem] text-ink-soft">
        Hangi çerezlere izin verdiğinizi buradan seçebilir, dilediğiniz zaman değiştirebilirsiniz.
      </p>
      <ul className="mt-4 divide-y divide-line rounded-2xl border border-line bg-white">
        {consentCategories.map((cat) => {
          const locked = cat.key === 'necessary'
          const on = locked ? true : choice[cat.key as ConsentCategory]
          return (
            <li key={cat.key} className="flex items-start gap-4 p-4">
              <div className="flex-1">
                <p className="font-semibold">{cat.title}</p>
                <p className="mt-0.5 text-sm text-ink-soft">{cat.text}</p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={on}
                aria-label={cat.title}
                disabled={locked}
                onClick={() => {
                  setSaved(false)
                  setDraft({ ...choice, [cat.key]: !on })
                }}
                className={`relative mt-0.5 inline-flex h-8 w-14 shrink-0 items-center rounded-full transition ${on ? 'bg-leaf' : 'bg-line-strong'} ${locked ? 'opacity-60' : ''}`}
              >
                <span className={`inline-block h-6 w-6 rounded-full bg-white shadow transition ${on ? 'translate-x-7' : 'translate-x-1'}`} />
                <span className="sr-only">{on ? 'Açık' : 'Kapalı'}</span>
              </button>
            </li>
          )
        })}
      </ul>
      <div className="mt-5 grid gap-2 sm:grid-cols-3">
        <button type="button" onClick={() => save(choice)} className="btn-primary btn-sm sm:col-span-3">
          Seçimlerimi Kaydet
        </button>
        <button type="button" onClick={() => save({ functional: true, analytics: true, marketing: true })} className="btn-secondary btn-sm sm:col-span-1 sm:col-start-1">
          Tümüne İzin Ver
        </button>
        <button type="button" onClick={() => save({ functional: false, analytics: false, marketing: false })} className="btn-secondary btn-sm sm:col-span-2">
          Yalnızca Zorunlu Çerezler
        </button>
      </div>
      {saved && !onSaved && (
        <p className="mt-4 flex items-center gap-2 text-[0.9375rem] font-medium text-leaf" role="status">
          <Check className="h-4 w-4" strokeWidth={3} aria-hidden="true" /> Tercihleriniz kaydedildi.
        </p>
      )}
    </div>
  )
}
