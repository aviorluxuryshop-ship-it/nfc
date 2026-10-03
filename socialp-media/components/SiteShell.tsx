import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { LogoSprite } from '@/components/Logo'
import { RevealObserver } from '@/components/RevealObserver'
import { SmoothScroll } from '@/components/SmoothScroll'
import { WhatsAppButton } from '@/components/WhatsAppButton'
import { getDictionary } from '@/lib/content'
import { anchor, contact, href, SERVICE_IDS, type Locale } from '@/lib/site'

export function SiteShell({ locale, children }: { locale: Locale; children: React.ReactNode }) {
  const t = getDictionary(locale)
  const line = locale === 'tr' ? 'tr' : 'intl'

  return (
    <>
      <LogoSprite />
      <a
        href="#main"
        className="fixed left-4 top-4 z-[60] -translate-y-24 rounded-full bg-bone px-5 py-3 text-sm text-ink transition-transform focus:translate-y-0"
      >
        {t.nav.skip}
      </a>
      <Header
        locale={locale}
        homeHref={href(locale, 'home')}
        aboutHref={href(locale, 'about')}
        contactHref={href(locale, 'contact')}
        workHref={anchor(locale, 'sahadan')}
        servicesHref={anchor(locale, 'hizmetler')}
        services={SERVICE_IDS.map((id) => ({
          number: t.services[id].number,
          title: t.services[id].short,
          href: href(locale, id),
        }))}
        labels={t.nav}
        // English pages lead with the international line, like the brief form.
        contactLines={[
          { label: contact[line].phone, href: contact[line].phoneHref },
          { label: contact[line].email, href: `mailto:${contact[line].email}` },
          { label: contact.instagram.handle, href: contact.instagram.href },
        ]}
      />
      <main id="main">{children}</main>
      <Footer locale={locale} t={t} />
      <WhatsAppButton label={t.common.whatsapp} />
      <SmoothScroll />
      <RevealObserver />
    </>
  )
}
