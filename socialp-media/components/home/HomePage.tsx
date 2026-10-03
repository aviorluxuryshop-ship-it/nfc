import { CtaBand } from '@/components/CtaBand'
import { ClientsSection } from '@/components/home/Clients'
import { FeaturedProject } from '@/components/home/FeaturedProject'
import { Hero } from '@/components/home/Hero'
import { Manifesto } from '@/components/home/Manifesto'
import { Process } from '@/components/home/Process'
import { Production } from '@/components/home/Production'
import { ServicesStack } from '@/components/home/ServicesStack'
import { Testimonials } from '@/components/home/Testimonials'
import { JsonLd } from '@/components/JsonLd'
import { Marquee } from '@/components/Marquee'
import { getDictionary } from '@/lib/content'
import { organizationJsonLd } from '@/lib/jsonld'
import { href, type Locale } from '@/lib/site'

export function HomePage({ locale }: { locale: Locale }) {
  const t = getDictionary(locale)
  return (
    <>
      <JsonLd data={organizationJsonLd(t.meta.homeDescription)} />
      <Hero locale={locale} t={t} />
      <ClientsSection t={t} />
      <Manifesto t={t} aboutHref={href(locale, 'about')} />
      <ServicesStack locale={locale} t={t} />
      <FeaturedProject t={t} linkHref={href(locale, 'web')} />
      <Production id="sahadan" eyebrow={t.production.eyebrow} title={t.production.title} body={t.production.body} items={t.production.items} />
      <Marquee items={t.marquee} tone="dark" />
      <Process eyebrow={t.process.eyebrow} title={t.process.title} steps={t.process.steps} />
      <Testimonials t={t} />
      <CtaBand locale={locale} t={t} />
    </>
  )
}
