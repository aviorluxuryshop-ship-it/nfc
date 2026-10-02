import Link from 'next/link'
import { ChevronRight, Info } from 'lucide-react'

import { ConsentForm } from '@/components/cookies/ConsentForm'
import { LegalBody } from '@/components/legal/LegalBody'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { company } from '@/data/company'
import { legalMeta, legalSlugs, type LegalSlug } from '@/data/legal'
import { site } from '@/data/site'
import type { Locale } from '@/lib/i18n/config'
import { getI18n } from '@/lib/i18n'
import { getLegalDoc } from '@/lib/legal/documents'

export function LegalIndexView({ locale }: { locale: Locale }) {
  const { t, paths } = getI18n(locale)
  return (
    <div className="container pb-20 pt-6 lg:pb-28">
      <Breadcrumbs label={t.common.breadcrumb} items={[{ label: t.common.home, href: paths.home }, { label: t.meta.legal }]} />
      <h1 className="mt-8 font-display text-[clamp(2.5rem,5vw,3.75rem)] font-medium leading-[1.04]">{t.legal.title}</h1>
      <ul className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {legalSlugs.map((slug) => (
          <li key={slug}>
            <Link
              href={paths.legalDoc(slug)}
              className="group flex h-full items-start justify-between gap-4 rounded-3xl border border-line bg-white p-6 transition hover:border-lavanta/40 hover:bg-lavanta-soft/40"
            >
              <span>
                <span className="block text-lg font-semibold">{legalMeta[locale][slug].title}</span>
                <span className="mt-1 block text-[0.9375rem] text-ink-soft">{legalMeta[locale][slug].summary}</span>
              </span>
              <ChevronRight className="mt-1 h-5 w-5 shrink-0 text-ink-mute transition group-hover:translate-x-0.5 group-hover:text-ink" aria-hidden="true" />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function LegalDocView({ slug, locale }: { slug: LegalSlug; locale: Locale }) {
  const { t, paths } = getI18n(locale)
  const meta = legalMeta[locale][slug]
  const doc = slug === 'cerez-tercihleri' ? null : getLegalDoc(slug, locale)

  return (
    <div className="container pb-20 pt-6 lg:pb-28">
      <Breadcrumbs
        label={t.common.breadcrumb}
        items={[{ label: t.common.home, href: paths.home }, { label: t.meta.legal, href: paths.legal }, { label: meta.title }]}
      />

      <div className="mt-8 grid gap-10 lg:grid-cols-[16rem_1fr] lg:gap-16">
        <nav aria-label={t.legal.navLabel} className="order-2 lg:order-1">
          <p className="eyebrow text-lavanta">{t.legal.title}</p>
          <ul className="mt-3 space-y-0.5 lg:sticky lg:top-28">
            {legalSlugs.map((s) => (
              <li key={s}>
                <Link
                  href={paths.legalDoc(s)}
                  aria-current={s === slug ? 'page' : undefined}
                  className={`block rounded-xl px-3 py-2 text-[0.9375rem] transition ${
                    s === slug ? 'bg-lavanta-soft font-semibold text-lavanta-deep' : 'text-ink-soft hover:text-ink'
                  }`}
                >
                  {legalMeta[locale][s].title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <article className="order-1 min-w-0 max-w-3xl lg:order-2">
          <h1 className="font-display text-[clamp(2.25rem,4.5vw,3.25rem)] font-medium leading-[1.06]">{meta.title}</h1>
          {doc && (
            <p className="mt-3 text-sm text-ink-mute">
              {t.legal.updated} {company.legalUpdatedAt}
            </p>
          )}

          {doc && t.legal.translationNote && (
            <p className="mt-6 flex gap-3 rounded-2xl border border-line bg-paper-cream px-4 py-3 text-[0.9375rem] text-ink-soft">
              <Info className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
              <span>{t.legal.translationNote}</span>
            </p>
          )}

          {site.demoMode && doc && (
            <p className="mt-6 flex gap-3 rounded-2xl border border-notice/25 bg-notice-soft px-4 py-3 text-[0.9375rem] text-notice">
              <Info className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
              <span>
                {t.legal.templatePre}
                <mark className="placeholder-mark">{t.legal.templateMark}</mark>
                {t.legal.templatePost}
              </span>
            </p>
          )}

          {doc?.summary && (
            <div className="mt-8 rounded-3xl bg-lavanta-soft/70 p-6">
              <h2 className="text-sm font-bold uppercase tracking-[0.12em] text-lavanta-deep">{t.legal.inShort}</h2>
              <ul className="mt-3 space-y-2">
                {doc.summary.map((s) => (
                  <li key={s} className="flex gap-3">
                    <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-lavanta" aria-hidden="true" />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-10">
            {doc ? (
              <LegalBody doc={doc} />
            ) : (
              <>
                <ConsentForm />
                <p className="mt-6 text-[0.9375rem] text-ink-soft">
                  {t.legal.cookiePolicyPre}
                  <Link href={paths.legalDoc('cerez-politikasi')} className="link font-medium">
                    {t.legal.cookiePolicyLink}
                  </Link>
                  {t.legal.cookiePolicyPost}
                </p>
              </>
            )}
          </div>
        </article>
      </div>
    </div>
  )
}
