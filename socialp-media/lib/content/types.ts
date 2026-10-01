import type { ServiceId } from '@/lib/site'

export type Img = { src: string; alt: string; width: number; height: number }

export type WorkItem = Img & { caption: string }

export type Feature = { title: string; body: string }

export type Step = { title: string; body: string }

export type ServiceContent = {
  id: ServiceId
  number: string
  title: string
  /** Short label for nav and footer. */
  short: string
  tagline: string
  lead: string
  intro: string[]
  bullets: string[]
  features: Feature[]
  featuresTitle: string
  metaTitle: string
  metaDescription: string
}

export type Dictionary = {
  locale: 'tr' | 'en'
  meta: {
    homeTitle: string
    homeDescription: string
    aboutTitle: string
    aboutDescription: string
    contactTitle: string
    contactDescription: string
  }
  nav: {
    services: string
    work: string
    about: string
    contact: string
    cta: string
    menu: string
    close: string
    language: string
    skip: string
  }
  common: {
    explore: string
    allServices: string
    whatsapp: string
    call: string
    email: string
    instagram: string
    scroll: string
    next: string
    prev: string
    playVideo: string
    pauseVideo: string
  }
  hero: {
    eyebrow: string
    titleA: string
    titleB: string
    body: string
    primary: string
    secondary: string
  }
  clients: {
    eyebrow: string
    title: string
    body: string
    more: string
    moreLabel: string
  }
  manifesto: {
    eyebrow: string
    text: string
    facts: { value: string; label: string }[]
    link: string
  }
  servicesSection: {
    eyebrow: string
    title: string
    body: string
  }
  services: Record<ServiceId, ServiceContent>
  featured: {
    eyebrow: string
    title: string
    by: string
    body: string
    rows: { label: string; value: string }[]
    link: string
    /** Label shown in the browser frame's address bar (the project's name, not a guessed domain). */
    url: string
  }
  production: {
    eyebrow: string
    title: string
    body: string
    items: WorkItem[]
  }
  process: {
    eyebrow: string
    title: string
    steps: Step[]
  }
  testimonials: {
    eyebrow: string
    items: { quote: string; topic: string }[]
  }
  marquee: string[]
  cta: {
    eyebrow: string
    title: string
    body: string
  }
  footer: {
    statement: string
    servicesTitle: string
    agencyTitle: string
    turkeyTitle: string
    intlTitle: string
    intlCountries: string
    followTitle: string
    rights: string
    backToTop: string
  }
  servicePage: {
    eyebrow: string
    otherServices: string
    processTitle: string
    processEyebrow: string
    socialGalleryTitle: string
    socialDesignTitle: string
    socialDesignBody: string
    webBuildsTitle: string
    webBuilds: string[]
    webSectorsTitle: string
    webSectorsBody: string
    webSectors: (Img & { label: string })[]
    webProcess: Step[]
    webFeaturedTitle: string
    adsPlatformsTitle: string
    adsObjectivesTitle: string
    adsObjectives: string[]
    adsReportTitle: string
    adsReportBody: string
    adsMetrics: string[]
    adsGoal: string
  }
  about: {
    eyebrow: string
    title: string
    paragraphs: string[]
    pillars: Feature[]
    closing: string
    clientsTitle: string
  }
  contactPage: {
    eyebrow: string
    title: string
    body: string
    turkey: string
    intl: string
    address: string
    openMap: string
    social: string
    form: {
      title: string
      body: string
      name: string
      company: string
      interest: string
      message: string
      messagePlaceholder: string
      sendWhatsapp: string
      sendEmail: string
      note: string
      greeting: string
      subject: string
      other: string
    }
  }
  notFound: { title: string; body: string; home: string }
}
