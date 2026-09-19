import type { Metadata } from 'next'
import { Instagram, Mail, MapPin, MessageCircle, Phone } from 'lucide-react'

import { siteConfig } from '@/data/site'

export const metadata: Metadata = {
  title: 'İletişim',
  description: `${siteConfig.name} ile iletişime geç: telefon, WhatsApp, e-posta ve Instagram.`,
  alternates: { canonical: '/iletisim' },
}

const channels = [
  { icon: Phone, label: 'Telefon', value: siteConfig.phone, href: `tel:${siteConfig.phone.replace(/\s/g, '')}` },
  {
    icon: MessageCircle,
    label: 'WhatsApp',
    value: siteConfig.whatsapp,
    href: `https://wa.me/${siteConfig.whatsapp.replace(/[^\d]/g, '')}`,
  },
  { icon: Mail, label: 'E-posta', value: siteConfig.email, href: `mailto:${siteConfig.email}` },
  { icon: Instagram, label: 'Instagram', value: siteConfig.instagram.handle, href: siteConfig.instagram.url },
  { icon: MapPin, label: 'Adres', value: siteConfig.address },
]

export default function ContactPage() {
  return (
    <section className="bg-paper px-5 pb-20 pt-28 sm:pt-32">
      <div className="container-prose">
        <h1 className="font-display text-3xl font-semibold text-ink sm:text-4xl">İletişim</h1>
        <p className="mt-3 text-ink-mute">Kart, fiyat ya da teslimat hakkında sorun mu var? Aşağıdaki kanallardan bize ulaş.</p>

        <ul className="mt-10 space-y-4">
          {channels.map(({ icon: Icon, label, value, href }) => (
            <li key={label} className="flex items-center gap-4 rounded-card border border-ink/10 bg-paper-raised p-5">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ink text-gold">
                <Icon className="h-[18px] w-[18px]" />
              </span>
              <div>
                <p className="text-xs uppercase tracking-[0.15em] text-ink-mute">{label}</p>
                {href ? (
                  <a
                    href={href}
                    target={href.startsWith('http') ? '_blank' : undefined}
                    rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className="text-ink hover:text-royal"
                  >
                    {value}
                  </a>
                ) : (
                  <p className="text-ink">{value}</p>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
