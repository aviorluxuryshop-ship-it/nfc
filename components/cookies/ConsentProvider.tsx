'use client'

import Link from 'next/link'
import { createContext, useCallback, useContext, useMemo, useState, useSyncExternalStore } from 'react'

import { Dialog } from '@/components/ui/Dialog'
import { consentStore, makeConsent, type Consent } from '@/lib/consent'

import { ConsentForm } from './ConsentForm'

type ConsentContextValue = {
  consent: Consent | null | 'pending'
  openPreferences: () => void
}

const ConsentContext = createContext<ConsentContextValue | null>(null)

export function useConsent() {
  const ctx = useContext(ConsentContext)
  if (!ctx) throw new Error('useConsent must be used inside <ConsentProvider>')
  return ctx
}

const acceptAll = () => consentStore.set(makeConsent({ functional: true, analytics: true, marketing: true }))
const rejectAll = () => consentStore.set(makeConsent({ functional: false, analytics: false, marketing: false }))

export function ConsentProvider({ children }: { children: React.ReactNode }) {
  const consent = useSyncExternalStore(consentStore.subscribe, consentStore.getSnapshot, consentStore.getServerSnapshot)
  const [prefsOpen, setPrefsOpen] = useState(false)
  const openPreferences = useCallback(() => setPrefsOpen(true), [])
  const value = useMemo(() => ({ consent, openPreferences }), [consent, openPreferences])

  return (
    <ConsentContext.Provider value={value}>
      {children}

      {consent === null && !prefsOpen && (
        <div
          role="region"
          aria-label="Çerez bildirimi"
          className="fixed inset-x-3 bottom-3 z-40 animate-fade-up sm:inset-x-auto sm:left-5 sm:max-w-md"
        >
          <div className="rounded-3xl border border-line bg-white p-4 shadow-lift sm:p-5">
            <p className="font-semibold">Çerezler hakkında</p>
            <p className="mt-1 text-[0.9375rem] leading-snug text-ink-soft">
              Sepetiniz için zorunlu çerezler kullanıyoruz. İzin verirseniz analiz ve pazarlama çerezleri de kullanırız.{' '}
              <Link href="/yasal/cerez-politikasi" className="link font-medium">
                Çerez Politikası
              </Link>
            </p>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <button type="button" onClick={acceptAll} className="btn-primary btn-sm">
                Kabul Et
              </button>
              <button type="button" onClick={rejectAll} className="btn-primary btn-sm">
                Reddet
              </button>
            </div>
            <button type="button" onClick={openPreferences} className="link mt-2.5 w-full text-center text-[0.9375rem]">
              Tercihlerimi seçmek istiyorum
            </button>
          </div>
        </div>
      )}

      <Dialog open={prefsOpen} onClose={() => setPrefsOpen(false)} title="Çerez Tercihleri" labelledBy="cookie-prefs-title">
        <div className="px-5 py-5 sm:px-6">
          <ConsentForm onSaved={() => setPrefsOpen(false)} />
        </div>
      </Dialog>
    </ConsentContext.Provider>
  )
}

/** Footer / policy-page link that reopens the preferences. */
export function CookieSettingsButton({ className = '' }: { className?: string }) {
  const { openPreferences } = useConsent()
  return (
    <button type="button" onClick={openPreferences} className={className}>
      Çerez Tercihleri
    </button>
  )
}
