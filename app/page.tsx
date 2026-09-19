import Image from 'next/image'
import { CheckCircle2 } from 'lucide-react'

import { ProductRow } from '@/components/ProductRow'
import { products } from '@/data/products'

const benefits = [
  'Uygulama indirmeye gerek yok, telefon yaklaştırmak yeterli',
  'Google yorumlarını ve Instagram takipçini kalıcı olarak artırır',
  'Kasada, masada ya da resepsiyonda durur — her müşteriye ulaşır',
  'Dayanıklı baskı, uzun ömürlü kullanım',
]

export default function HomePage() {
  return (
    <>
      {/* Hero: full-bleed photo, header floats over it */}
      <section className="relative overflow-hidden bg-ink">
        <div className="relative h-[56vh] min-h-[420px] w-full sm:h-[70vh]">
          <Image
            src="/images/hero/hero-recepsiyon.webp"
            alt="Resepsiyon masasında duran NFC kart ve telefonunu yaklaştıran bir müşteri"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
        </div>

        <div className="container -mt-16 pb-16 sm:-mt-20 sm:pb-20">
          <div className="relative rounded-card bg-paper-raised p-7 shadow-lift sm:p-10">
            <span className="inline-flex items-center rounded-full bg-gold-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-gold-dim">
              İşletmeler için NFC kart
            </span>
            <h1 className="mt-4 font-display text-3xl font-bold leading-[1.1] tracking-tight text-ink sm:text-4xl">
              Telefonunu yaklaştır, <span className="text-magenta">işletmeni büyüt.</span>
            </h1>
            <p className="mt-4 max-w-xl text-ink-soft">
              Masana ya da kasana koyduğun tek bir kart; müşterin telefonunu yaklaştırdığında doğrudan Google yorum
              sayfana ya da Instagram profiline yönlenir. Kod okutmak, uygulama açmak yok.
            </p>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {benefits.map((benefit) => (
                <li key={benefit} className="flex items-start gap-2 text-sm text-ink-soft">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-royal" />
                  {benefit}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Catalog rows — the homepage ends here, nothing below */}
      <section className="bg-paper pb-24">
        <div className="container flex flex-col gap-16 sm:gap-24">
          {products.map((product, i) => (
            <ProductRow key={product.slug} product={product} reverse={i % 2 === 1} />
          ))}
        </div>
      </section>
    </>
  )
}
