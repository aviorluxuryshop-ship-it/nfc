import { formatPrice } from '@/lib/format'
import type { Locale } from '@/lib/i18n/config'

import { productFacts } from './products'
import { site } from './site'

export type Faq = { q: string; a: string; group: 'urun' | 'siparis' }

const { commerce } = site
const free = formatPrice(commerce.freeShippingThreshold)
const fee = formatPrice(commerce.shippingFee)
const { sheets, washes, netWeightGrams } = productFacts

/**
 * Product answers come from the packaging. Order answers pull the shipping
 * numbers from `site.ts`, so they never drift from what the cart charges.
 */
export const faqs: Record<Locale, Faq[]> = {
  tr: [
    {
      group: 'urun',
      q: 'Deterjan yaprağı nedir?',
      a: 'Sıvı ya da toz deterjanın yerine kullanılan, ince ve hafif bir yaprak. Çamaşır makinesinde suyla temas edince çözünür ve deterjan gibi temizler. Ölçü kabına, dökmeye gerek yoktur.',
    },
    {
      group: 'urun',
      q: 'Nasıl kullanılır?',
      a: 'Yaprağı doğrudan makinenin tamburuna koyun, üzerine çamaşırlarınızı yerleştirin ve makineyi her zamanki programınızla çalıştırın. Bu kadar.',
    },
    {
      group: 'urun',
      q: 'Bir yıkamada kaç yaprak kullanmalıyım?',
      a: 'Az çamaşırda (1–2 kg) yarım yaprak, normal bir yıkamada (3–5 kg) 1 yaprak kullanın. Yaprağı elinizle kolayca ikiye bölebilirsiniz.',
    },
    {
      group: 'urun',
      q: 'Bir kutuda kaç yaprak var?',
      a: `Her kutuda ${sheets} yaprak bulunur; bu da ${washes} yıkama demektir. Kutunun net ağırlığı ${netWeightGrams} g, bir yaprağın ölçüsü 11 × 28 cm’dir.`,
    },
    {
      group: 'urun',
      q: 'Hangi çamaşırlar için uygun?',
      a: 'VELMO deterjan yaprağı renkli çamaşırlar için geliştirilmiştir ve çamaşır makinesinde kullanılır. Elde yıkama için uygun değildir.',
    },
    {
      group: 'urun',
      q: 'Kokular arasında ne fark var?',
      a: 'Üç kokunun da kullanımı, yaprak sayısı ve ağırlığı aynıdır; yalnızca kokusu farklıdır. Lavanta sakin ve ferah, Bahar hafif çiçeksi, Narenciye ise canlı portakal kokusundadır.',
    },
    {
      group: 'urun',
      q: 'Nasıl saklamalıyım?',
      a: 'Kutuyu kapalı ve kuru bir yerde, çocukların ulaşamayacağı bir yerde saklayın. Yaprakları ıslak elle tutmamaya özen gösterin.',
    },
    {
      group: 'siparis',
      q: 'Siparişim ne zaman kargoya verilir?',
      a: `Siparişiniz ${commerce.dispatchDays} iş günü içinde kargoya verilir. Kargoya verildiğinde takip bilgisi e-posta adresinize gönderilir.`,
    },
    {
      group: 'siparis',
      q: 'Kargo ücreti ne kadar?',
      a: `${free} ve üzeri siparişlerde kargo ücretsizdir. Bunun altındaki siparişlerde ${fee} kargo ücreti eklenir. Toplam tutarı ödeme adımından önce sepetinizde görürsünüz.`,
    },
    {
      group: 'siparis',
      q: 'Hangi ödeme yöntemlerini kullanabilirim?',
      a: 'Kredi kartı, banka kartı ya da Havale / EFT ile ödeme yapabilirsiniz. Kart bilgileriniz sitemizde saklanmaz; ödeme, lisanslı ödeme kuruluşunun güvenli sayfasında alınır.',
    },
    {
      group: 'siparis',
      q: 'Ürünü iade edebilir miyim?',
      a: 'Ambalajı açılmamış ürünleri teslim aldığınız günden itibaren 14 gün içinde iade edebilirsiniz. Sağlık ve hijyen nedeniyle ambalajı açılmış ürünlerde cayma hakkı kullanılamaz. Hasarlı ya da hatalı ürünlerde ise bizimle hemen iletişime geçin.',
    },
    {
      group: 'siparis',
      q: 'Siparişimi iptal edebilir miyim?',
      a: 'Siparişiniz kargoya verilmeden önce bize ulaşırsanız iptal edebiliriz. Ödemeniz, kullandığınız ödeme yöntemine iade edilir.',
    },
  ],
  en: [
    {
      group: 'urun',
      q: 'What is a detergent sheet?',
      a: 'A thin, light sheet you use instead of liquid or powder detergent. It dissolves when it meets water in the washing machine and cleans just like detergent. No measuring cup, no pouring.',
    },
    {
      group: 'urun',
      q: 'How do I use it?',
      a: 'Put the sheet straight into the drum, place your laundry on top and run the machine on your usual programme. That’s it.',
    },
    {
      group: 'urun',
      q: 'How many sheets per wash?',
      a: 'Use half a sheet for a small load (1–2 kg) and one sheet for a normal load (3–5 kg). The sheet tears in half easily by hand.',
    },
    {
      group: 'urun',
      q: 'How many sheets are in a box?',
      a: `Every box has ${sheets} sheets — that’s ${washes} washes. The box weighs ${netWeightGrams} g net, and one sheet measures 11 × 28 cm.`,
    },
    {
      group: 'urun',
      q: 'What laundry is it for?',
      a: 'VELMO detergent sheets are made for coloured laundry and are used in a washing machine. They are not suitable for hand washing.',
    },
    {
      group: 'urun',
      q: 'What’s the difference between the scents?',
      a: 'All three are used the same way and have the same number of sheets and weight — only the scent differs. Lavender is calm and fresh, Spring is lightly floral and Citrus is a lively orange.',
    },
    {
      group: 'urun',
      q: 'How should I store it?',
      a: 'Keep the box closed in a dry place, out of reach of children. Try not to handle the sheets with wet hands.',
    },
    {
      group: 'siparis',
      q: 'When will my order ship?',
      a: `Your order ships within ${commerce.dispatchDays} business days. Once it ships, the tracking details are sent to your email address.`,
    },
    {
      group: 'siparis',
      q: 'How much is shipping?',
      a: `Shipping is free on orders of ${free} or more. Below that, a ${fee} shipping fee is added. You see the full total in your cart before checkout.`,
    },
    {
      group: 'siparis',
      q: 'Which payment methods can I use?',
      a: 'You can pay by credit card, debit card or bank transfer. Card details are never stored on our site; payment is taken on the licensed payment institution’s secure page.',
    },
    {
      group: 'siparis',
      q: 'Can I return the product?',
      a: 'Unopened products can be returned within 14 days of delivery. For health and hygiene reasons, the right of withdrawal does not apply once the packaging has been opened. If a product arrives damaged or faulty, contact us right away.',
    },
    {
      group: 'siparis',
      q: 'Can I cancel my order?',
      a: 'If you reach us before your order ships, we can cancel it. Your payment is refunded to the method you used.',
    },
  ],
}
