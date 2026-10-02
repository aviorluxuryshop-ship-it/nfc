import { productLine } from './products'
import { site } from './site'
import { formatPrice } from '@/lib/format'

export type Faq = { q: string; a: string; group: 'urun' | 'siparis' }

const { commerce } = site

/**
 * Product answers come from the packaging. Order answers pull the shipping
 * numbers from `site.ts`, so they never drift from what the cart charges.
 */
export const faqs: Faq[] = [
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
    a: `Her kutuda ${productLine.sheets} yaprak bulunur; bu da ${productLine.washes} yıkama demektir. Kutunun net ağırlığı ${productLine.netWeightGrams} g, bir yaprağın ölçüsü 11 × 28 cm’dir.`,
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
    a: `${formatPrice(commerce.freeShippingThreshold)} ve üzeri siparişlerde kargo ücretsizdir. Bunun altındaki siparişlerde ${formatPrice(commerce.shippingFee)} kargo ücreti eklenir. Toplam tutarı ödeme adımından önce sepetinizde görürsünüz.`,
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
]
