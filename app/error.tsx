'use client'

export default function GlobalError({ reset }: { error: Error; reset: () => void }) {
  return (
    <section className="container flex flex-col items-center gap-4 py-24 text-center">
      <h1 className="font-display text-4xl font-bold">Bir şeyler ters gitti</h1>
      <p className="max-w-md text-ink-soft">Sayfa yüklenirken bir sorun oluştu. Sepetin kaybolmadı; yeniden deneyebilirsin.</p>
      <button onClick={reset} className="rounded-xl bg-marmara px-7 py-4 font-bold text-white transition hover:bg-marmara-dim">Yeniden dene</button>
    </section>
  )
}
