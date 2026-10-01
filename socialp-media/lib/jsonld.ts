import { contact, FOUNDED, SITE_URL } from '@/lib/site'

/** Organization data for search engines — every field is from the brand's site. */
export function organizationJsonLd(description: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: 'Socialp Media',
    url: SITE_URL,
    logo: `${SITE_URL}/icon.svg`,
    image: `${SITE_URL}/images/brand/ofis-tabela.webp`,
    description,
    foundingDate: String(FOUNDED),
    telephone: '+905400346969',
    email: contact.tr.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: contact.address.street,
      postalCode: contact.address.postalCode,
      addressLocality: contact.address.district,
      addressRegion: contact.address.city,
      addressCountry: 'TR',
    },
    contactPoint: [
      { '@type': 'ContactPoint', telephone: '+905400346969', email: contact.tr.email, contactType: 'customer service', areaServed: 'TR' },
      {
        '@type': 'ContactPoint',
        telephone: '+14372311432',
        email: contact.intl.email,
        contactType: 'sales',
        areaServed: ['US', 'CA', 'GB', 'AU', 'DE'],
      },
    ],
    sameAs: [contact.instagram.href],
  }
}
