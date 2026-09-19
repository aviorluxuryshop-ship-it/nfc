import type { Metadata } from 'next'
import { MessageSquareText, Smartphone, Star, Users } from 'lucide-react'

import { siteConfig } from '@/data/site'

export const metadata: Metadata = {
  title: 'NFC Kart Nedir?',
  description: 'NFC kart nedir, nasıl çalışır, işletmene ne kazandırır? Google yorumu ve Instagram takipçisi toplamanın en kolay yolu.',
  alternates: { canonical: '/nfc-kart-nedir' },
}

const steps = [
  {
    icon: Smartphone,
    title: 'Telefonu yaklaştır',
    text: 'Kart içine gömülü küçük bir çip (NFC) taşır. Herhangi bir akıllı telefon karta yaklaştırıldığında bu çipi otomatik olarak okur — uygulama açmaya, kod okutmaya gerek kalmaz.',
  },
  {
    icon: Star,
    title: 'Doğru sayfaya yönlensin',
    text: 'Kart, önceden tanımladığın bir bağlantıya yönlendirir: Google yorum sayfan ya da Instagram profilin. Telefon yaklaştığı an o sayfa doğrudan açılır.',
  },
  {
    icon: Users,
    title: 'Müşterin aksiyonu tamamlasın',
    text: 'Açılan sayfada müşterinin tek yapması gereken yorumu yazmak ya da takip etmek. Aradan uygulama arama, kullanıcı adı yazma gibi adımlar çıkar — tamamlama oranı yükselir.',
  },
]

const useCases = [
  'Kasada: ödeme sırasında müşteriden Google yorumu iste',
  'Masada: kafe ya da restoranda müşteri beklerken Instagram\'ı büyüt',
  'Resepsiyonda: otel ya da klinikte check-in sırasında yorum topla',
  'Vitrinde: mağaza girişinde geçen herkese ulaş',
]

export default function AboutNfcPage() {
  return (
    <section className="bg-paper px-5 pb-20 pt-28 sm:pt-32">
      <div className="container-prose">
        <span className="inline-flex items-center rounded-full bg-gold-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-gold-dim">
          {siteConfig.name}
        </span>
        <h1 className="mt-4 font-display text-3xl font-bold leading-tight text-ink sm:text-4xl">NFC Kart Nedir?</h1>
        <p className="mt-4 text-ink-soft">
          NFC (Near Field Communication), iki cihazın birbirine birkaç santim yaklaştığında veri alışverişi yapmasını
          sağlayan kısa mesafeli bir teknolojidir. Kartlarımızın içine gömülü bu çip sayesinde, telefonunu karta
          yaklaştıran herkes anında istediğin sayfaya yönlenir.
        </p>

        <div className="mt-12 space-y-8">
          {steps.map(({ icon: Icon, title, text }) => (
            <div key={title} className="flex gap-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-ink text-gold">
                <Icon className="h-5 w-5" />
              </span>
              <div>
                <h2 className="font-semibold text-ink">{title}</h2>
                <p className="mt-1 text-sm text-ink-soft">{text}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-14 rounded-card border border-ink/10 bg-paper-raised p-6 sm:p-8">
          <h2 className="flex items-center gap-2 font-display text-xl font-bold text-ink">
            <MessageSquareText className="h-5 w-5 text-magenta" />
            Nerede kullanılır?
          </h2>
          <ul className="mt-4 space-y-3">
            {useCases.map((item) => (
              <li key={item} className="text-sm text-ink-soft">
                • {item}
              </li>
            ))}
          </ul>
        </div>

        <p className="mt-10 text-sm text-ink-mute">
          Kartlarımızı yerinde satıyoruz — kargo göndermiyoruz. Hangi kartın sana uygun olduğunu konuşmak için bizimle
          iletişime geç.
        </p>
      </div>
    </section>
  )
}
