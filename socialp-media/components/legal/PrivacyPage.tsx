import { PageHero } from '@/components/PageHero'
import { privacy } from '@/lib/content/privacy'
import type { Locale } from '@/lib/site'

export function PrivacyPage({ locale }: { locale: Locale }) {
  const p = privacy[locale]

  return (
    <>
      <PageHero eyebrow={p.eyebrow} title={p.title} lead={p.intro} compact>
        <p className="eyebrow fade-in mt-10 text-smoke" style={{ '--delay': '650ms' } as React.CSSProperties}>
          {p.updatedLabel}: {p.updated}
        </p>
      </PageHero>

      <section className="bg-paper py-20 text-ink sm:py-28">
        <div className="container-x grid gap-12 lg:grid-cols-12 lg:gap-10">
          <nav aria-label={p.tocLabel} className="lg:col-span-4">
            <div className="lg:sticky lg:top-[calc(var(--header-h)+2rem)]">
              <p className="eyebrow mb-5 text-graphite">{p.tocLabel}</p>
              <ol className="space-y-2.5 text-[0.95rem]">
                {p.sections.map((s, i) => (
                  <li key={s.id} className="flex gap-3">
                    <span className="eyebrow w-6 shrink-0 pt-1 text-graphite">{String(i + 1).padStart(2, '0')}</span>
                    <a href={`#${s.id}`} className="link-draw text-ink/80 hover:text-ink">
                      {s.title}
                    </a>
                  </li>
                ))}
              </ol>
            </div>
          </nav>

          <article className="max-w-[68ch] lg:col-span-8">
            {p.sections.map((s, i) => (
              <section key={s.id} id={s.id} className="scroll-mt-28 border-t border-ink/10 py-10 first:border-t-0 first:pt-0">
                <h2 className="flex items-baseline gap-4 text-[1.5rem] font-medium tracking-[-0.02em]">
                  <span className="serif-accent text-[1.6rem] text-signal">{String(i + 1).padStart(2, '0')}</span>
                  {s.title}
                </h2>
                <div className="mt-5 space-y-4 text-[1.02rem] leading-relaxed text-ink/75">
                  {s.body.map((block, j) =>
                    Array.isArray(block) ? (
                      <ul key={j} className="space-y-2.5">
                        {block.map((item) => (
                          <li key={item} className="flex gap-3">
                            <span className="mt-[0.6em] h-1.5 w-1.5 shrink-0 rounded-full bg-signal" aria-hidden="true" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p key={j}>{block}</p>
                    ),
                  )}
                </div>
              </section>
            ))}
          </article>
        </div>
      </section>
    </>
  )
}
