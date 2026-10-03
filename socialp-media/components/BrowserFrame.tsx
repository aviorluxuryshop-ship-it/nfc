import clsx from 'clsx'

/** Minimal browser chrome around a website recording. */
export function BrowserFrame({ url, children, className, tone = 'dark' }: { url: string; children: React.ReactNode; className?: string; tone?: 'dark' | 'light' }) {
  return (
    <div
      className={clsx(
        'overflow-hidden rounded-[1.1rem] border shadow-[0_40px_90px_-40px_rgba(0,0,0,0.7)]',
        tone === 'dark' ? 'border-white/10 bg-ink-3' : 'border-ink/10 bg-paper-2',
        className,
      )}
    >
      <div className={clsx('flex items-center gap-3 px-4 py-3', tone === 'dark' ? 'text-smoke' : 'text-graphite')}>
        <div className="flex gap-1.5" aria-hidden="true">
          <span className="h-2.5 w-2.5 rounded-full bg-current opacity-40" />
          <span className="h-2.5 w-2.5 rounded-full bg-current opacity-40" />
          <span className="h-2.5 w-2.5 rounded-full bg-current opacity-40" />
        </div>
        <div
          className={clsx(
            'mx-auto flex h-7 w-full max-w-[18rem] items-center justify-center rounded-full text-[0.72rem] tracking-wide',
            tone === 'dark' ? 'bg-white/[0.06]' : 'bg-ink/[0.06]',
          )}
        >
          {url}
        </div>
        <div className="w-[2.6rem]" aria-hidden="true" />
      </div>
      {children}
    </div>
  )
}
