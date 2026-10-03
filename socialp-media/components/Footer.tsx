import Link from 'next/link'

import { LanguageLink } from '@/components/LanguageLink'
import type { Dictionary } from '@/lib/content'
import { privacy } from '@/lib/content/privacy'
import { anchor, contact, href, SERVICE_IDS, type Locale } from '@/lib/site'

export function Footer({ locale, t }: { locale: Locale; t: Dictionary }) {
  const year = new Date().getFullYear()

  return (
    <footer className="relative overflow-hidden bg-ink pt-24 text-bone sm:pt-32">
      <div className="container-x">
        <div className="grid gap-16 border-t border-white/10 pt-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-4">
            <p className="display-s max-w-[14ch] text-bone">
              {t.footer.statement.split(',')[0]},
              <span className="serif-accent text-bone/70"> {t.footer.statement.split(',').slice(1).join(',').trim()}</span>
            </p>
          </div>

          <div className="grid grid-cols-2 gap-10 lg:col-span-8 xl:grid-cols-[1.05fr_0.8fr_1.1fr_1.25fr]">
            <div>
              <h2 className="eyebrow mb-5 text-smoke">{t.footer.servicesTitle}</h2>
              <ul className="space-y-3 text-[0.95rem] text-bone/80">
                {SERVICE_IDS.map((id) => (
                  <li key={id}>
                    <Link href={href(locale, id)} className="link-draw hover:text-bone">
                      {t.services[id].short}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="eyebrow mb-5 text-smoke">{t.footer.agencyTitle}</h2>
              <ul className="space-y-3 text-[0.95rem] text-bone/80">
                <li>
                  <Link href={href(locale, 'about')} className="link-draw hover:text-bone">
                    {t.nav.about}
                  </Link>
                </li>
                <li>
                  <Link href={anchor(locale, 'sahadan')} className="link-draw hover:text-bone">
                    {t.nav.work}
                  </Link>
                </li>
                <li>
                  <Link href={href(locale, 'contact')} className="link-draw hover:text-bone">
                    {t.nav.contact}
                  </Link>
                </li>
                <li>
                  <a href={contact.instagram.href} target="_blank" rel="noopener noreferrer" className="link-draw hover:text-bone">
                    Instagram ↗
                  </a>
                </li>
              </ul>
            </div>
            <div className="col-span-2 sm:col-span-1 [overflow-wrap:anywhere]">
              <h2 className="eyebrow mb-5 text-smoke">{t.footer.turkeyTitle}</h2>
              <address className="space-y-3 text-[0.95rem] not-italic text-bone/80">
                <a href={contact.tr.phoneHref} className="link-draw block w-fit hover:text-bone">
                  {contact.tr.phone}
                </a>
                <a href={`mailto:${contact.tr.email}`} className="link-draw block w-fit hover:text-bone">
                  {contact.tr.email}
                </a>
                <a href={contact.address.mapsHref} target="_blank" rel="noopener noreferrer" className="block leading-relaxed text-smoke hover:text-bone">
                  {contact.address.street}
                  <br />
                  {contact.address.postalCode} {contact.address.district}/{contact.address.city}
                </a>
              </address>
            </div>
            <div className="col-span-2 sm:col-span-1 [overflow-wrap:anywhere]">
              <h2 className="eyebrow mb-5 text-smoke">{t.footer.intlTitle}</h2>
              <address className="space-y-3 text-[0.95rem] not-italic text-bone/80">
                <a href={contact.intl.phoneHref} className="link-draw block w-fit hover:text-bone">
                  {contact.intl.phone}
                </a>
                <a href={`mailto:${contact.intl.email}`} className="link-draw block w-fit hover:text-bone">
                  {contact.intl.email}
                </a>
                <p className="leading-relaxed text-smoke">{t.footer.intlCountries}</p>
              </address>
            </div>
          </div>
        </div>
      </div>

      <div className="container-x mt-16 sm:mt-24">
        <div className="flex flex-col gap-4 border-t border-white/10 py-7 text-[0.82rem] text-smoke sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} Socialp Media. {t.footer.rights}
          </p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 sm:pr-20">
            <Link href={href(locale, 'privacy')} className="link-draw hover:text-bone">
              {privacy[locale].footerLink}
            </Link>
            <LanguageLink locale={locale} className="link-draw hover:text-bone" />
            <a href="#top" className="link-draw hover:text-bone">
              {t.footer.backToTop} ↑
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
