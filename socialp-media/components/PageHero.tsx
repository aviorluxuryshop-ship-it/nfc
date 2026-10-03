import clsx from 'clsx'

type Props = {
  eyebrow: string
  title: string
  accent?: string
  lead?: string
  aside?: React.ReactNode
  children?: React.ReactNode
  compact?: boolean
}

/** Dark opening block for inner pages: big title rising line by line, optional media. */
export function PageHero({ eyebrow, title, accent, lead, aside, children, compact }: Props) {
  return (
    <section className="grain relative isolate overflow-hidden bg-ink pb-16 pt-[calc(var(--header-h)+3.5rem)] sm:pb-24 sm:pt-[calc(var(--header-h)+6rem)]">
      <div className="container-x">
        <div className={clsx('grid gap-12 lg:grid-cols-12 lg:gap-10', aside ? 'lg:items-end' : '')}>
          <div className={aside ? 'lg:col-span-7' : 'lg:col-span-12'}>
            <p className="eyebrow fade-in flex items-center gap-3 text-smoke" style={{ '--delay': '120ms' } as React.CSSProperties}>
              <span className="h-1.5 w-1.5 rounded-full bg-signal-hot" aria-hidden="true" />
              {eyebrow}
            </p>
            <h1 className={clsx(compact ? 'display-l' : 'display-xl', 'mt-8 max-w-[14ch] text-bone')}>
              <span className="rise">
                <span style={{ '--delay': '150ms' } as React.CSSProperties}>{title}</span>
              </span>
              {accent && (
                <span className="rise">
                  <span className="serif-accent text-[0.62em] leading-[1.05] text-bone/80" style={{ '--delay': '300ms' } as React.CSSProperties}>
                    {accent}
                  </span>
                </span>
              )}
            </h1>
            {lead && (
              <p className="lead fade-in mt-10 max-w-[44ch] text-bone/70" style={{ '--delay': '550ms' } as React.CSSProperties}>
                {lead}
              </p>
            )}
            {children}
          </div>
          {aside && (
            <div className="fade-in lg:col-span-5" style={{ '--delay': '400ms' } as React.CSSProperties}>
              {aside}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
