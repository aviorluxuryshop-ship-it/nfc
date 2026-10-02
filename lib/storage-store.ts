/**
 * A tiny localStorage-backed store for `useSyncExternalStore`. The server
 * (and the first client render) sees `serverValue`, so markup always
 * hydrates cleanly; the stored value takes over right after. Changes in
 * another tab arrive through the `storage` event.
 */
export function createStorageStore<T, S = T>({
  key,
  parse,
  fallback,
  serverValue,
}: {
  key: string
  /** Validates what came out of storage; return null to discard it. */
  parse: (raw: unknown) => T | null
  fallback: T
  serverValue: S
}) {
  let cache: T | undefined
  const listeners = new Set<() => void>()

  function read(): T {
    if (cache !== undefined) return cache
    let value: T | null = null
    try {
      const raw = window.localStorage.getItem(key)
      value = raw ? parse(JSON.parse(raw)) : null
    } catch {
      value = null
    }
    cache = value ?? fallback
    return cache
  }

  function write(next: T) {
    cache = next
    try {
      window.localStorage.setItem(key, JSON.stringify(next))
    } catch {
      // Private mode / storage full: keep working in memory for this visit.
    }
    listeners.forEach((l) => l())
  }

  function onStorage(e: StorageEvent) {
    if (e.key !== key) return
    cache = undefined
    listeners.forEach((l) => l())
  }

  return {
    subscribe(listener: () => void) {
      listeners.add(listener)
      if (listeners.size === 1) window.addEventListener('storage', onStorage)
      return () => {
        listeners.delete(listener)
        if (listeners.size === 0) window.removeEventListener('storage', onStorage)
      }
    },
    // Typed as the union so useSyncExternalStore accepts both snapshots.
    getSnapshot: read as () => T | S,
    getServerSnapshot: (): T | S => serverValue,
    get: read,
    set: write,
  }
}
