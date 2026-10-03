/** Brand slogan running across the page — pure CSS, pauses on hover. */
export function Marquee({ items, tone = 'dark' }: { items: string[][]; tone?: 'dark' | 'light' | 'signal' }) {
  const seq = [...items, ...items]
  const bg = tone === 'dark' ? 'bg-ink text-bone' : tone === 'light' ? 'bg-paper text-ink' : 'bg-signal text-bone'

  return (
    <div className={`marquee-wrap overflow-hidden border-y py-7 sm:py-10 ${bg} ${tone === 'light' ? 'border-ink/10' : 'border-white/10'}`} aria-hidden="true">
      <div className="marquee" style={{ '--marquee-duration': '48s' } as React.CSSProperties}>
        {[0, 1].map((half) => (
          <div key={half} className="flex shrink-0 items-center">
            {seq.map((phrase, i) => (
              <span key={`${half}-${i}`} className="flex items-center">
                {/* A phrase's parts run on as one line; the star only separates phrases. */}
                <span className="flex items-baseline gap-[0.28em] px-6 text-[clamp(2.2rem,5.6vw,5.4rem)] leading-none tracking-[-0.04em] sm:px-10">
                  {phrase.map((part, j) => (
                    <span key={j} className={j % 2 ? 'serif-accent' : 'font-medium'}>
                      {part}
                    </span>
                  ))}
                </span>
                <svg width="28" height="28" viewBox="0 0 28 28" className="shrink-0 text-signal-hot" aria-hidden="true">
                  <path d="M14 0v28M0 14h28M4.1 4.1l19.8 19.8M23.9 4.1 4.1 23.9" stroke="currentColor" strokeWidth="2" />
                </svg>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
