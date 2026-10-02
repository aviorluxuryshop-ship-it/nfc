import Link from 'next/link'
import { CreditCard, Landmark, ShieldCheck } from 'lucide-react'

import { Logo } from '@/components/brand/Logo'
import { LanguageSwitch } from '@/components/layout/LanguageSwitch'
import { CookieSettingsButton } from '@/components/cookies/ConsentProvider'
import { company } from '@/data/company'
import { legalMeta, type LegalSlug } from '@/data/legal'
import { products } from '@/data/products'
import type { Locale } from '@/lib/i18n/config'
import { getI18n } from '@/lib/i18n'

const linkClass = 'text-[0.9375rem] text-ink-soft transition hover:text-ink'

function Column({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-sm font-bold uppercase tracking-[0.12em] text-lavanta-deep">{title}</h2>
      <ul className="mt-4 space-y-2.5">{children}</ul>
    </div>
  )
}

/** The rainbow ribbon from the box, as a hairline. */
export function RibbonRule({ className = '' }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`h-1 bg-[linear-gradient(90deg,#6E4FA8_0%,#8466C6_14%,#7FB2E5_30%,#9FD08E_46%,#F8DB76_62%,#F7AE62_78%,#F28BA8_100%)] ${className}`}
    />
  )
}

export function Footer({ locale }: { locale: Locale }) {
  const { t, paths } = getI18n(locale)
  const f = t.footer

  return (
    <footer className="mt-auto bg-[#F4F0F9]">
      <RibbonRule />
      <div className="container py-14 lg:py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1.2fr]">
          <div>
            <Logo className="pt-2 text-[2rem]" />
            <p className="mt-4 max-w-xs text-ink-soft">{f.tagline}</p>
            <p className="mt-3 text-sm text-ink-mute">{f.madeIn}</p>
            <LanguageSwitch className="mt-5 inline-flex h-10 items-center gap-2 rounded-full border border-line-strong bg-white px-4 text-sm font-semibold transition hover:border-ink" />
          </div>

          <Column title={f.shop}>
            <li>
              <Link href={paths.products} className={linkClass}>
                {f.allProducts}
              </Link>
            </li>
            {products.map((p) => (
              <li key={p.slug}>
                <Link href={paths.product(p.slug)} className={linkClass}>
                  {f.scentProduct(p.text[locale].scent)}
                </Link>
              </li>
            ))}
            <li>
              <Link href={paths.cart} className={linkClass}>
                {f.myCart}
              </Link>
            </li>
          </Column>

          <Column title={f.help}>
            <li>
              <Link href={paths.howTo} className={linkClass}>
                {f.howTo}
              </Link>
            </li>
            <li>
              <Link href={paths.faq} className={linkClass}>
                {f.faq}
              </Link>
            </li>
            <li>
              <Link href={paths.legalDoc('teslimat-ve-kargo')} className={linkClass}>
                {getLegalTitle(locale, 'teslimat-ve-kargo')}
              </Link>
            </li>
            <li>
              <Link href={paths.legalDoc('iptal-ve-iade')} className={linkClass}>
                {getLegalTitle(locale, 'iptal-ve-iade')}
              </Link>
            </li>
            <li>
              <Link href={paths.contact} className={linkClass}>
                {f.contact}
              </Link>
            </li>
          </Column>

          <Column title={f.legal}>
            {(['kvkk-aydinlatma-metni', 'gizlilik-politikasi', 'cerez-politikasi'] as const).map((slug) => (
              <li key={slug}>
                <Link href={paths.legalDoc(slug)} className={linkClass}>
                  {getLegalTitle(locale, slug)}
                </Link>
              </li>
            ))}
            <li>
              <CookieSettingsButton className={linkClass} />
            </li>
            {(['mesafeli-satis-sozlesmesi', 'on-bilgilendirme-formu', 'kullanim-kosullari'] as const).map((slug) => (
              <li key={slug}>
                <Link href={paths.legalDoc(slug)} className={linkClass}>
                  {getLegalTitle(locale, slug)}
                </Link>
              </li>
            ))}
          </Column>
        </div>

        <div className="mt-12 flex flex-col gap-5 border-t border-line pt-8 lg:flex-row lg:items-center lg:justify-between">
          <p className="text-sm text-ink-mute">
            © {new Date().getFullYear()} {company.legalName}. {f.rights}
          </p>
          <ul className="flex flex-wrap items-center gap-2 text-sm text-ink-soft" aria-label={f.paymentLabel}>
            <li className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-3 py-1.5">
              <ShieldCheck className="h-4 w-4 text-leaf" aria-hidden="true" /> {f.securePayment}
            </li>
            <li className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-3 py-1.5">
              <CreditCard className="h-4 w-4 text-lavanta" aria-hidden="true" /> {f.card}
            </li>
            <li className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-3 py-1.5">
              <Landmark className="h-4 w-4 text-narenciye" aria-hidden="true" /> {f.transfer}
            </li>
          </ul>
        </div>
      </div>
    </footer>
  )
}

function getLegalTitle(locale: Locale, slug: LegalSlug) {
  return legalMeta[locale][slug].title
}
