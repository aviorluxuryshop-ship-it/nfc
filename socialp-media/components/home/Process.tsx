import type { Step } from '@/lib/content/types'

/** Numbered steps on paper; a red rule draws across each column as it enters. */
export function Process({ eyebrow, title, steps, tone = 'light' }: { eyebrow: string; title: string; steps: Step[]; tone?: 'light' | 'dark' }) {
  const light = tone === 'light'
  const cols = steps.length === 5 ? 'lg:grid-cols-5' : 'lg:grid-cols-4'

  return (
    <section className={light ? 'bg-paper py-24 text-ink sm:py-36' : 'bg-ink py-24 text-bone sm:py-32'} aria-labelledby="process-title">
      <div className="container-x">
        <p className={`eyebrow mb-6 ${light ? 'text-graphite' : 'text-smoke'}`} data-reveal>
          {eyebrow}
        </p>
        <h2 id="process-title" className="display-l max-w-[16ch]" data-reveal style={{ '--delay': '80ms' } as React.CSSProperties}>
          {title}
        </h2>

        <ol className={`mt-16 grid gap-x-8 gap-y-12 sm:mt-24 sm:grid-cols-2 ${cols}`}>
          {steps.map((step, i) => (
            <li key={step.title} className="group relative pt-8" data-reveal style={{ '--delay': `${i * 110}ms` } as React.CSSProperties}>
              <span className={`absolute inset-x-0 top-0 h-px ${light ? 'bg-ink/15' : 'bg-white/15'}`} aria-hidden="true" />
              <span
                className="absolute left-0 top-0 h-px w-full origin-left scale-x-0 bg-signal transition-transform duration-[1.6s] ease-[var(--ease-out-expo)] [.is-in>&]:scale-x-100"
                style={{ transitionDelay: `${300 + i * 140}ms` }}
                aria-hidden="true"
              />
              <span className="serif-accent block text-[3.4rem] leading-none text-signal">{String(i + 1).padStart(2, '0')}</span>
              <h3 className="mt-6 text-[1.4rem] font-medium tracking-[-0.02em]">{step.title}</h3>
              <p className={`mt-3 text-[0.98rem] leading-relaxed ${light ? 'text-ink/65' : 'text-bone/60'}`}>{step.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
