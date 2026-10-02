/**
 * Policy and contract texts for a Turkish online store, written as
 * templates. Seller details come from `data/company.ts`; anything still in
 * [square brackets] must be filled in. Have the final texts reviewed by a
 * lawyer before going live — these are a starting structure, not legal
 * advice.
 */
import { company as C } from '@/data/company'
import type { LegalSlug } from '@/data/legal'
import { productLine } from '@/data/products'
import { site } from '@/data/site'
import { formatPrice } from '@/lib/format'

import type { Block, LegalDoc, OrderContext } from './types'

const { commerce } = site
const shippingRule = `${formatPrice(commerce.freeShippingThreshold)} ve üzeri siparişlerde kargo ücretsizdir; bu tutarın altındaki siparişlerde ${formatPrice(commerce.shippingFee)} kargo ücreti alınır.`

const sellerRows: string[][] = [
  ['Unvan', C.legalName],
  ['Adres', C.address],
  ['Telefon', C.phone],
  ['E-posta', C.email],
  ['KEP adresi', C.kep],
  ['MERSİS No', C.mersisNo],
  ['Vergi Dairesi / No', `${C.taxOffice} / ${C.taxNo}`],
]

function buyerRows(ctx?: OrderContext): string[][] {
  return [
    ['Ad Soyad', ctx?.buyer.name || '[Alıcı Adı Soyadı]'],
    ['Teslimat adresi', ctx?.deliveryAddress || '[Teslimat Adresi]'],
    ['Telefon', ctx?.buyer.phone || '[Alıcı Telefonu]'],
    ['E-posta', ctx?.buyer.email || '[Alıcı E-posta Adresi]'],
  ]
}

function orderBlocks(ctx?: OrderContext): Block[] {
  const items = ctx?.items.length
    ? ctx.items.map((i) => [i.name, String(i.qty), i.unitPrice, i.total])
    : [[`${productLine.fullName} — [Koku]`, '[Adet]', '[Birim Fiyat]', '[Tutar]']]
  return [
    { type: 'table', head: ['Ürün', 'Adet', 'Birim fiyat (KDV dahil)', 'Tutar'], rows: items },
    {
      type: 'table',
      rows: [
        ['Ürünler toplamı', ctx?.subtotal || '[Ara Toplam]'],
        ['Kargo ücreti', ctx?.shipping || '[Kargo Ücreti]'],
        ['Toplam (KDV dahil)', ctx?.total || '[Toplam Tutar]'],
        ['Ödeme şekli', ctx?.paymentMethod || '[Ödeme Şekli]'],
        ['Teslimat adresi', ctx?.deliveryAddress || '[Teslimat Adresi]'],
        ['Fatura bilgileri', ctx?.invoice || '[Fatura Bilgileri]'],
        ['Sipariş tarihi', ctx?.date || '[Sipariş Tarihi]'],
      ],
    },
  ]
}

const productDescription = `${productLine.fullName}: renkli çamaşırlar için, çamaşır makinesinde kullanılan deterjan yaprağı. Her kutuda ${productLine.sheets} yaprak (${productLine.washes} yıkama), net ${productLine.netWeightGrams} g. Kokular: Lavanta, Bahar, Narenciye. Elde yıkama için uygun değildir.`

const withdrawalHygiene =
  'Mesafeli Sözleşmeler Yönetmeliği’nin 15. maddesi uyarınca, tesliminden sonra ambalaj, bant, mühür, paket gibi koruyucu unsurları açılmış olan ve iadesi sağlık ve hijyen açısından uygun olmayan mallarda cayma hakkı kullanılamaz. Deterjan yaprakları bu niteliktedir; bu nedenle ambalajı açılmış ürünler cayma hakkı kapsamında iade alınamaz.'

const returnShipping = `Cayma hakkı kullanılarak iade edilen ürünler, ${C.carrier} ile [İade Kodu / İade Yöntemi] kullanılarak gönderilir. Satıcının belirttiği taşıyıcı ile yapılan iadelerde iade kargo masrafı Alıcı’dan talep edilmez.`

const disputes =
  'Şikâyet ve itirazlarınız için önce bizimle iletişime geçebilirsiniz. Ayrıca, Ticaret Bakanlığınca her yıl ilan edilen parasal sınırlar dâhilinde, mal veya hizmeti satın aldığınız ya da ikametgâhınızın bulunduğu yerdeki Tüketici Hakem Heyetine veya Tüketici Mahkemesine başvurabilirsiniz. Tüketici Hakem Heyeti başvuruları e-Devlet üzerinden Tüketici Bilgi Sistemi (TÜBİS) aracılığıyla da yapılabilir.'

/* ------------------------------------------------------------------ */

function kvkk(): LegalDoc {
  return {
    title: 'KVKK Aydınlatma Metni',
    summary: [
      'Siparişinizi alabilmek, teslim edebilmek ve faturanızı kesebilmek için gereken bilgileri işliyoruz.',
      'Bilgilerinizi satmıyoruz; yalnızca kargo, ödeme ve muhasebe gibi işin gerektirdiği taraflarla paylaşıyoruz.',
      'Verilerinizle ilgili her zaman bilgi isteyebilir, düzeltme ya da silme talep edebilirsiniz.',
    ],
    blocks: [
      {
        type: 'p',
        text: `Bu aydınlatma metni, 6698 sayılı Kişisel Verilerin Korunması Kanunu (“KVKK”) ve Aydınlatma Yükümlülüğünün Yerine Getirilmesinde Uyulacak Usul ve Esaslar Hakkında Tebliğ uyarınca, veri sorumlusu sıfatıyla ${C.legalName} (“Şirket”) tarafından, ${site.url} internet sitesini (“Site”) kullanan ve sipariş veren kişileri bilgilendirmek amacıyla hazırlanmıştır.`,
      },
      { type: 'h2', text: '1. Veri sorumlusu' },
      { type: 'table', rows: sellerRows },
      { type: 'h2', text: '2. İşlenen kişisel verileriniz' },
      {
        type: 'table',
        head: ['Veri kategorisi', 'Açıklama'],
        rows: [
          ['Kimlik', 'Ad, soyad; e-Arşiv fatura için gerektiğinde T.C. kimlik numarası'],
          ['İletişim', 'E-posta adresi, cep telefonu numarası, teslimat ve fatura adresi'],
          ['Müşteri işlem', 'Sipariş içeriği ve geçmişi, sipariş notları, talep, şikâyet ve iade kayıtları'],
          ['Finans', 'Fatura bilgileri, ödeme işlemine ilişkin kayıtlar; kurumsal faturada vergi dairesi ve vergi numarası. Kart bilgileriniz Şirket tarafından görülmez ve saklanmaz.'],
          ['İşlem güvenliği', 'IP adresi, tarayıcı ve cihaz bilgileri, site kullanım kayıtları'],
          ['Pazarlama', 'Yalnızca izin vermeniz hâlinde: ticari ileti tercihleri ve çerez verileri'],
        ],
      },
      { type: 'h2', text: '3. Kişisel verilerinizin işlenme amaçları' },
      {
        type: 'ul',
        items: [
          'Siparişinizin alınması, ödemenin tahsili, ürünün hazırlanması ve teslim edilmesi',
          'Mesafeli satış sözleşmesinin kurulması ve ifası, fatura düzenlenmesi',
          'İptal, cayma, iade, değişim ve şikâyet süreçlerinin yürütülmesi',
          'Size siparişinizle ilgili bilgi verilmesi (sipariş onayı, kargo bildirimi gibi)',
          'Mevzuattan doğan saklama, bildirim ve bilgi verme yükümlülüklerinin yerine getirilmesi',
          'Bilgi güvenliğinin sağlanması, kötüye kullanımın ve dolandırıcılığın önlenmesi',
          'İzin vermeniz hâlinde: kampanya ve duyurular hakkında ticari elektronik ileti gönderilmesi',
          'İzin vermeniz hâlinde: analitik ve pazarlama çerezleri aracılığıyla sitenin geliştirilmesi',
        ],
      },
      { type: 'h2', text: '4. Hukuki sebepler' },
      {
        type: 'ul',
        items: [
          'KVKK m. 5/2-c: Bir sözleşmenin kurulması veya ifasıyla doğrudan ilgili olması (sipariş, teslimat, fatura, iade)',
          'KVKK m. 5/2-ç: Veri sorumlusunun hukuki yükümlülüğünü yerine getirebilmesi (vergi, ticaret ve tüketici mevzuatı)',
          'KVKK m. 5/2-e: Bir hakkın tesisi, kullanılması veya korunması',
          'KVKK m. 5/2-f: İlgili kişinin temel hak ve özgürlüklerine zarar vermemek kaydıyla meşru menfaat (bilgi güvenliği)',
          'KVKK m. 5/1: Açık rıza (analitik ve pazarlama çerezleri). Ticari elektronik iletiler için 6563 sayılı Kanun kapsamında onayınız alınır.',
        ],
      },
      { type: 'h2', text: '5. Toplama yöntemi' },
      {
        type: 'p',
        text: 'Kişisel verileriniz; Site üzerindeki sipariş ve iletişim formları, e-posta, telefon ve çerezler aracılığıyla, otomatik ya da kısmen otomatik yollarla toplanır.',
      },
      { type: 'h2', text: '6. Kişisel verilerin aktarılması' },
      {
        type: 'p',
        text: 'Kişisel verileriniz, yukarıdaki amaçlarla ve yalnızca gerektiği ölçüde aşağıdaki taraflara aktarılabilir:',
      },
      {
        type: 'ul',
        items: [
          `Teslimat için kargo şirketi: ${C.carrier}`,
          `Ödemenin alınması için lisanslı ödeme kuruluşu: ${C.paymentProvider}`,
          `Sitenin barındırılması ve teknik altyapı için: ${C.hostingProvider}`,
          'Fatura düzenlenmesi için e-Arşiv / e-Fatura hizmet sağlayıcısı ve mali müşavir: [Hizmet Sağlayıcı]',
          'Talep edilmesi hâlinde yetkili kamu kurum ve kuruluşları ile hukuken yetkili kişiler',
        ],
      },
      {
        type: 'p',
        text: '[Yurt dışı aktarım: Barındırma, e-posta veya analiz hizmetleri için yurt dışında bulunan sağlayıcılar kullanılıyorsa, aktarılan veri kategorilerini ve KVKK m. 9 kapsamındaki aktarım dayanağını (ör. standart sözleşme) burada belirtin. Kullanılmıyorsa bu paragrafı kaldırın.]',
      },
      { type: 'h2', text: '7. Saklama süresi' },
      {
        type: 'p',
        text: 'Kişisel verileriniz, ilgili mevzuatta öngörülen süreler (ör. Türk Ticaret Kanunu ve Vergi Usul Kanunu’ndaki saklama süreleri) boyunca ya da işleme amacının gerektirdiği süre kadar saklanır. Bu süreler sona erdiğinde verileriniz silinir, yok edilir veya anonim hâle getirilir.',
      },
      { type: 'h2', text: '8. Haklarınız (KVKK m. 11)' },
      { type: 'p', text: 'Veri sorumlusuna başvurarak aşağıdaki haklarınızı kullanabilirsiniz:' },
      {
        type: 'ul',
        items: [
          'Kişisel verilerinizin işlenip işlenmediğini öğrenme',
          'İşlenmişse buna ilişkin bilgi talep etme',
          'İşlenme amacını ve bunların amacına uygun kullanılıp kullanılmadığını öğrenme',
          'Yurt içinde veya yurt dışında kişisel verilerin aktarıldığı üçüncü kişileri bilme',
          'Eksik veya yanlış işlenmiş olması hâlinde bunların düzeltilmesini isteme',
          'KVKK m. 7’de öngörülen şartlar çerçevesinde silinmesini veya yok edilmesini isteme',
          'Düzeltme, silme ve yok etme işlemlerinin, verilerin aktarıldığı üçüncü kişilere bildirilmesini isteme',
          'İşlenen verilerin münhasıran otomatik sistemler vasıtasıyla analiz edilmesi suretiyle aleyhinize bir sonucun ortaya çıkmasına itiraz etme',
          'Kanuna aykırı işleme sebebiyle zarara uğramanız hâlinde zararın giderilmesini talep etme',
        ],
      },
      { type: 'h2', text: '9. Başvuru yöntemi' },
      {
        type: 'p',
        text: `Taleplerinizi, Veri Sorumlusuna Başvuru Usul ve Esasları Hakkında Tebliğ’e uygun olarak; ${C.address} adresine ıslak imzalı dilekçe ile, ${C.kep} KEP adresine güvenli elektronik imza ile ya da sistemimizde kayıtlı e-posta adresinizden ${C.kvkkEmail} adresine iletebilirsiniz. Başvurunuz en geç 30 gün içinde ücretsiz olarak sonuçlandırılır; işlemin ayrıca bir maliyet gerektirmesi hâlinde Kişisel Verileri Koruma Kurulunca belirlenen tarifedeki ücret alınabilir.`,
      },
    ],
  }
}

function privacy(): LegalDoc {
  return {
    title: 'Gizlilik Politikası',
    summary: [
      'Sadece siparişiniz için gereken bilgileri istiyoruz.',
      'Kart bilgileriniz bizim sitemizde girilmez ve saklanmaz.',
      'İzniniz olmadan size reklam iletisi göndermiyoruz.',
    ],
    blocks: [
      {
        type: 'p',
        text: `Bu politika, ${C.legalName} (“VELMO”, “biz”) tarafından işletilen ${site.url} internet sitesini ziyaret ettiğinizde ve alışveriş yaptığınızda bilgilerinizin nasıl korunduğunu açıklar. Kişisel verilerinizin işlenmesine ilişkin ayrıntılar KVKK Aydınlatma Metni’nde yer alır.`,
      },
      { type: 'h2', text: 'Hangi bilgileri alıyoruz?' },
      {
        type: 'ul',
        items: [
          '**Sipariş verirken:** ad, soyad, e-posta, telefon, teslimat ve fatura adresi; kurumsal fatura isterseniz firma unvanı, vergi dairesi ve vergi numarası.',
          '**Bizimle iletişime geçtiğinizde:** mesajınızda paylaştığınız bilgiler.',
          '**Siteyi gezerken:** sitenin çalışması için gereken teknik bilgiler; izin verirseniz analitik ve pazarlama çerezleri.',
        ],
      },
      { type: 'h2', text: 'Bilgilerinizi ne için kullanıyoruz?' },
      {
        type: 'p',
        text: 'Siparişinizi hazırlamak ve teslim etmek, faturanızı düzenlemek, siparişiniz hakkında sizi bilgilendirmek, sorularınızı yanıtlamak ve yasal yükümlülüklerimizi yerine getirmek için kullanırız. Bilgilerinizi satmayız ve kiralamayız.',
      },
      { type: 'h2', text: 'Ödeme güvenliği' },
      {
        type: 'p',
        text: `Kart ile ödemeler, lisanslı ödeme kuruluşu ${C.paymentProvider} altyapısı üzerinden alınır. Kart bilgileriniz ödeme kuruluşunun güvenli sayfasında girilir; VELMO bu bilgileri görmez ve saklamaz.`,
      },
      { type: 'h2', text: 'Ticari elektronik iletiler' },
      {
        type: 'p',
        text: 'Kampanya ve duyuru içeren e-posta veya SMS’leri yalnızca onay vermeniz hâlinde göndeririz. Onayınızı dilediğiniz zaman, iletilerdeki ret bağlantısı aracılığıyla, İleti Yönetim Sistemi (İYS) üzerinden ya da bize yazarak ücretsiz olarak geri alabilirsiniz. Siparişinizle ilgili bilgilendirmeler (sipariş onayı, kargo bildirimi) bu kapsamda değildir.',
      },
      { type: 'h2', text: 'Çerezler' },
      {
        type: 'p',
        text: 'Sitemizde kullanılan çerezler ve tercihlerinizi nasıl yönetebileceğiniz Çerez Politikası’nda anlatılmıştır. Tercihlerinizi sayfanın altındaki “Çerez Tercihleri” bağlantısından istediğiniz zaman değiştirebilirsiniz.',
      },
      { type: 'h2', text: 'Bilgilerinizi nasıl koruyoruz?' },
      {
        type: 'p',
        text: 'Site trafiği şifreli bağlantı (HTTPS) üzerinden iletilir. Bilgilerinize yalnızca işi gereği erişmesi gereken kişiler erişebilir. Hizmet aldığımız taraflarla, bilgilerinizi yalnızca bizim adımıza ve gerekli ölçüde kullanmaları koşuluyla çalışırız.',
      },
      { type: 'h2', text: 'Haklarınız' },
      {
        type: 'p',
        text: 'Kişisel verilerinizle ilgili KVKK’nın 11. maddesinde sayılan haklarınızı kullanmak için KVKK Aydınlatma Metni’nde belirtilen yollarla bize başvurabilirsiniz.',
      },
      { type: 'h2', text: 'Değişiklikler' },
      {
        type: 'p',
        text: 'Bu politikayı zaman zaman güncelleyebiliriz. Güncel sürüm her zaman bu sayfada yer alır; önemli değişiklikleri sitede duyururuz.',
      },
      { type: 'h2', text: 'İletişim' },
      { type: 'p', text: `Sorularınız için: ${C.email} · ${C.phone}` },
    ],
  }
}

function cookies(): LegalDoc {
  return {
    title: 'Çerez Politikası',
    summary: [
      'Sepetinizin çalışması için zorunlu teknolojiler kullanıyoruz; bunlar kapatılamaz.',
      'Analitik ve pazarlama çerezlerini yalnızca izin verirseniz kullanırız.',
      'Tercihlerinizi istediğiniz zaman “Çerez Tercihleri”nden değiştirebilirsiniz.',
    ],
    blocks: [
      {
        type: 'p',
        text: `Bu politika, ${C.legalName} tarafından işletilen ${site.url} sitesinde kullanılan çerezler ve benzeri teknolojiler (ör. tarayıcının yerel depolama alanı) hakkında sizi bilgilendirmek için hazırlanmıştır.`,
      },
      { type: 'h2', text: 'Çerez nedir?' },
      {
        type: 'p',
        text: 'Çerezler, bir siteyi ziyaret ettiğinizde tarayıcınıza kaydedilen küçük metin dosyalarıdır. Sitenin çalışmasını, tercihlerinizin hatırlanmasını ve sitenin nasıl kullanıldığının anlaşılmasını sağlar.',
      },
      { type: 'h2', text: 'Kullandığımız çerezler ve benzeri teknolojiler' },
      {
        type: 'table',
        head: ['Ad', 'Tür', 'Amaç', 'Süre'],
        rows: [
          ['velmo-cart-v1', 'Zorunlu (yerel depolama)', 'Sepetinizdeki ürünleri hatırlar.', 'Siz silene kadar'],
          ['velmo-cookie-consent', 'Zorunlu (yerel depolama)', 'Çerez tercihlerinizi hatırlar.', 'Siz silene kadar'],
          ['velmo-last-order', 'Zorunlu (oturum depolaması)', 'Sipariş onay sayfasında siparişinizin özetini gösterir.', 'Tarayıcı kapanınca silinir'],
          ['[Analitik aracı adı]', 'Analitik (izne bağlı)', '[Amaç]', '[Süre]'],
          ['[Pazarlama aracı adı]', 'Pazarlama (izne bağlı)', '[Amaç]', '[Süre]'],
        ],
      },
      { type: 'h2', text: 'Hukuki sebep' },
      {
        type: 'p',
        text: 'Zorunlu çerezler, sözleşmenin kurulması ve ifası (KVKK m. 5/2-c) ile meşru menfaatimiz (KVKK m. 5/2-f) kapsamında kullanılır. İşlevsel, analitik ve pazarlama çerezleri ise yalnızca açık rızanıza (KVKK m. 5/1) dayanılarak kullanılır; izin vermezseniz bu çerezler çalıştırılmaz.',
      },
      { type: 'h2', text: 'Tercihlerinizi nasıl yönetebilirsiniz?' },
      {
        type: 'ul',
        items: [
          'Sitenin altındaki “Çerez Tercihleri” bağlantısından izinlerinizi istediğiniz zaman verebilir veya geri alabilirsiniz.',
          'Tarayıcınızın ayarlarından çerezleri silebilir veya engelleyebilirsiniz. Zorunlu çerezleri engellemeniz hâlinde sepet ve ödeme adımları çalışmayabilir.',
        ],
      },
      { type: 'h2', text: 'İletişim' },
      { type: 'p', text: `Çerezlerle ilgili sorularınız için: ${C.email}` },
    ],
  }
}

function preInformation(ctx?: OrderContext): LegalDoc {
  return {
    title: 'Ön Bilgilendirme Formu',
    blocks: [
      {
        type: 'p',
        text: 'Bu form, 6502 sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli Sözleşmeler Yönetmeliği uyarınca, siparişinizi onaylamadan önce bilgilenmeniz amacıyla sunulmaktadır.',
      },
      { type: 'h2', text: '1. Satıcı bilgileri' },
      { type: 'table', rows: sellerRows },
      { type: 'h2', text: '2. Alıcı bilgileri' },
      { type: 'table', rows: buyerRows(ctx) },
      { type: 'h2', text: '3. Ürünün temel nitelikleri' },
      { type: 'p', text: productDescription },
      { type: 'h2', text: '4. Fiyat ve ödeme' },
      ...orderBlocks(ctx),
      {
        type: 'p',
        text: `Tüm fiyatlara KDV dâhildir. ${shippingRule} Ödeme; kredi kartı veya banka kartı ile ${C.paymentProvider} altyapısı üzerinden ya da Havale / EFT ile yapılabilir. Havale / EFT ile verilen siparişler, ödeme hesabımıza ulaştıktan sonra hazırlanır.`,
      },
      { type: 'h2', text: '5. Teslimat' },
      {
        type: 'p',
        text: `Ürün, siparişin onaylanmasından (Havale / EFT siparişlerinde ödemenin hesabımıza ulaşmasından) itibaren ${commerce.dispatchDays} iş günü içinde kargoya verilir ve ${C.carrier} aracılığıyla Alıcı’nın belirttiği adrese teslim edilir. Teslim süresi, her durumda yasal azami süre olan 30 günü aşamaz.`,
      },
      { type: 'h2', text: '6. Cayma hakkı' },
      {
        type: 'p',
        text: `Alıcı, ürünün kendisine veya gösterdiği üçüncü kişiye teslim edildiği tarihten itibaren 14 gün içinde, hiçbir gerekçe göstermeksizin ve cezai şart ödemeksizin cayma hakkını kullanabilir. Cayma bildirimi ${C.email} adresine e-posta ile, ${C.phone} numaralı telefondan bilgi verilerek veya ${C.address} adresine yazılı olarak yapılabilir.`,
      },
      {
        type: 'p',
        text: `Cayma bildiriminin Satıcı’ya ulaşmasından itibaren 14 gün içinde, teslimat masrafları da dâhil olmak üzere tahsil edilen tüm ödemeler, ödemede kullanılan yöntemle iade edilir. Alıcı, cayma bildirimini takip eden 10 gün içinde ürünü geri gönderir. ${returnShipping}`,
      },
      { type: 'h3', text: 'Cayma hakkının kullanılamayacağı durumlar' },
      { type: 'p', text: withdrawalHygiene },
      { type: 'h2', text: '7. Şikâyet ve itirazlar' },
      { type: 'p', text: disputes },
      {
        type: 'p',
        text: 'Alıcı, bu formu okuduğunu, siparişinin ödeme yükümlülüğü doğurduğunu ve yukarıdaki bilgileri elektronik ortamda teyit ettiğini kabul eder.',
      },
    ],
  }
}

function distanceSales(ctx?: OrderContext): LegalDoc {
  return {
    title: 'Mesafeli Satış Sözleşmesi',
    blocks: [
      { type: 'h2', text: 'Madde 1 – Taraflar' },
      { type: 'h3', text: '1.1 Satıcı' },
      { type: 'table', rows: sellerRows },
      { type: 'h3', text: '1.2 Alıcı' },
      { type: 'table', rows: buyerRows(ctx) },
      { type: 'h2', text: 'Madde 2 – Konu' },
      {
        type: 'p',
        text: `İşbu sözleşmenin konusu, Alıcı’nın Satıcı’ya ait ${site.url} internet sitesi üzerinden elektronik ortamda sipariş verdiği, aşağıda nitelikleri ve satış fiyatı belirtilen ürünün satışı ve teslimi ile ilgili olarak 6502 sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli Sözleşmeler Yönetmeliği hükümleri gereğince tarafların hak ve yükümlülüklerinin belirlenmesidir.`,
      },
      { type: 'h2', text: 'Madde 3 – Sözleşme konusu ürün, ödeme ve teslimat' },
      { type: 'p', text: productDescription },
      ...orderBlocks(ctx),
      { type: 'h2', text: 'Madde 4 – Genel hükümler' },
      {
        type: 'ol',
        items: [
          'Alıcı, sözleşme konusu ürünün temel nitelikleri, satış fiyatı, ödeme şekli ve teslimata ilişkin Ön Bilgilendirme Formu’nu okuyup bilgi sahibi olduğunu ve elektronik ortamda gerekli teyidi verdiğini kabul eder.',
          `Ürün, yasal 30 günlük süreyi aşmamak kaydıyla, siparişin onaylanmasından itibaren ${commerce.dispatchDays} iş günü içinde kargoya verilir ve Alıcı’nın belirttiği teslimat adresine teslim edilir.`,
          'Satıcı, ürünü sağlam, eksiksiz ve siparişte belirtilen niteliklere uygun olarak teslim etmekle yükümlüdür.',
          'Satıcı, siparişin ifasının imkânsızlaştığı hâllerde, bu durumu öğrendiği tarihten itibaren 3 gün içinde Alıcı’ya bildirir ve tahsil edilen tüm ödemeleri bildirim tarihinden itibaren en geç 14 gün içinde iade eder.',
          'Teslimat sırasında kargo paketinin hasarlı olduğu fark edilirse, Alıcı’nın paketi teslim almadan önce kargo görevlisine hasar tespit tutanağı düzenletmesi önerilir.',
        ],
      },
      { type: 'h2', text: 'Madde 5 – Cayma hakkı' },
      {
        type: 'ol',
        items: [
          'Alıcı, ürünün kendisine veya gösterdiği üçüncü kişiye teslim tarihinden itibaren 14 gün içinde, hiçbir hukuki ve cezai sorumluluk üstlenmeksizin ve hiçbir gerekçe göstermeksizin cayma hakkını kullanabilir. Cayma hakkı, ürünün teslimatından önce de kullanılabilir.',
          `Cayma bildirimi, süresi içinde ${C.email} adresine e-posta ile veya ${C.address} adresine yazılı olarak yapılır.`,
          'Satıcı, cayma bildiriminin kendisine ulaştığı tarihten itibaren 14 gün içinde, teslimat masrafları da dâhil olmak üzere tahsil ettiği tüm ödemeleri, Alıcı’nın ödemede kullandığı yöntemle ve Alıcı’ya herhangi bir masraf yüklemeden iade eder.',
          `Alıcı, cayma bildirimini takip eden 10 gün içinde ürünü Satıcı’ya geri gönderir. ${returnShipping}`,
          'Alıcı, cayma süresi içinde ürünün işleyişine, teknik özelliklerine ve kullanım talimatlarına uygun kullanılması dışında oluşan değer kayıplarından sorumludur.',
        ],
      },
      { type: 'h2', text: 'Madde 6 – Cayma hakkının kullanılamayacağı durumlar' },
      { type: 'p', text: withdrawalHygiene },
      { type: 'h2', text: 'Madde 7 – Ayıplı ürün' },
      {
        type: 'p',
        text: 'Ürünün ayıplı olması hâlinde Alıcı, 6502 sayılı Kanun’un 11. maddesi uyarınca; sözleşmeden dönme, satış bedelinden ayıp oranında indirim isteme, ücretsiz onarım isteme veya imkân varsa ürünün ayıpsız bir misli ile değiştirilmesini isteme haklarından birini kullanabilir.',
      },
      { type: 'h2', text: 'Madde 8 – Uyuşmazlıkların çözümü' },
      { type: 'p', text: disputes },
      { type: 'h2', text: 'Madde 9 – Yürürlük' },
      {
        type: 'p',
        text: 'Alıcı, siparişi onayladığı anda işbu sözleşmenin tüm koşullarını kabul etmiş sayılır. Sözleşme ve Ön Bilgilendirme Formu, sipariş onayıyla birlikte Alıcı’nın e-posta adresine gönderilir ve Satıcı tarafından mevzuatta öngörülen süre boyunca saklanır.',
      },
    ],
  }
}

function returns(): LegalDoc {
  return {
    title: 'İptal ve İade Koşulları',
    summary: [
      'Siparişiniz kargoya verilmeden önce bize ulaşırsanız iptal ederiz.',
      'Ambalajı açılmamış ürünleri teslimden itibaren 14 gün içinde iade edebilirsiniz.',
      'Hijyen nedeniyle ambalajı açılmış ürünler iade alınamaz; hasarlı veya hatalı ürünlerde haklarınız saklıdır.',
    ],
    blocks: [
      { type: 'h2', text: 'Sipariş iptali' },
      {
        type: 'p',
        text: `Siparişiniz kargoya verilmeden önce ${C.email} adresine veya ${C.phone} numarasına sipariş numaranızla ulaşmanız yeterlidir. Ödemeniz, kullandığınız ödeme yöntemine iade edilir. Kart iadelerinin hesabınıza yansıma süresi bankanıza göre değişebilir.`,
      },
      { type: 'h2', text: 'Cayma hakkı (14 gün)' },
      {
        type: 'p',
        text: 'Ürünü teslim aldığınız günden itibaren 14 gün içinde, hiçbir gerekçe göstermeden cayma hakkınızı kullanabilirsiniz. Bunun için ürünün ambalajının açılmamış, bandının ve koruyucu unsurlarının bozulmamış olması gerekir.',
      },
      { type: 'h2', text: 'Hangi ürünler iade edilemez?' },
      { type: 'p', text: withdrawalHygiene },
      { type: 'h2', text: 'İade nasıl yapılır?' },
      {
        type: 'ol',
        items: [
          `${C.email} adresine sipariş numaranızla birlikte iade talebinizi yazın.`,
          `Size ileteceğimiz iade bilgisiyle (${C.carrier} · [İade Kodu / İade Yöntemi]) ürünü, ambalajı açılmamış hâlde ve faturasıyla birlikte gönderin.`,
          'Cayma bildiriminiz bize ulaştıktan sonra en geç 14 gün içinde ödemeniz, ödemede kullandığınız yöntemle iade edilir.',
        ],
      },
      { type: 'p', text: returnShipping },
      { type: 'h2', text: 'Hasarlı veya hatalı ürün' },
      {
        type: 'p',
        text: 'Kargo paketi hasarlı geldiyse, teslim almadan önce kargo görevlisine hasar tespit tutanağı düzenletmenizi öneririz. Ürününüz hatalı ya da eksik çıktıysa, fotoğrafıyla birlikte bize hemen yazın. Bu durumda 6502 sayılı Kanun kapsamındaki haklarınız (ücretsiz değişim, bedel iadesi, bedel indirimi) saklıdır; iade kargo ücreti sizden alınmaz.',
      },
      { type: 'h2', text: 'İletişim' },
      { type: 'p', text: `${C.email} · ${C.phone} · ${C.serviceHours}` },
    ],
  }
}

function shipping(): LegalDoc {
  return {
    title: 'Teslimat ve Kargo',
    summary: [
      `Siparişiniz ${commerce.dispatchDays} iş günü içinde kargoya verilir.`,
      shippingRule,
      'Kargo takip bilgisi e-posta adresinize gönderilir.',
    ],
    blocks: [
      { type: 'h2', text: 'Teslimat bölgesi' },
      { type: 'p', text: 'Siparişler Türkiye içindeki adreslere gönderilir.' },
      { type: 'h2', text: 'Kargoya verilme süresi' },
      {
        type: 'p',
        text: `Siparişiniz, onaylandıktan sonra ${commerce.dispatchDays} iş günü içinde kargoya verilir (hafta sonu ve resmî tatiller hariç). Havale / EFT ile verilen siparişlerde bu süre, ödemenin hesabımıza ulaşmasıyla başlar. Teslim süresi her durumda yasal azami süre olan 30 günü aşmaz.`,
      },
      { type: 'h2', text: 'Kargo firması ve takip' },
      {
        type: 'p',
        text: `Gönderilerimiz ${C.carrier} ile yapılır. Siparişiniz kargoya verildiğinde, kargo takip bilgisi e-posta adresinize gönderilir. Kargonun size ulaşma süresi, bulunduğunuz bölgeye göre değişebilir.`,
      },
      { type: 'h2', text: 'Kargo ücreti' },
      { type: 'p', text: `${shippingRule} Kargo ücreti, ödeme adımından önce sepetinizde açıkça gösterilir.` },
      { type: 'h2', text: 'Teslim alırken' },
      {
        type: 'p',
        text: 'Paketi teslim alırken dış ambalajı kontrol etmenizi öneririz. Pakette ezilme, yırtılma veya ıslaklık varsa, teslim almadan önce kargo görevlisine hasar tespit tutanağı düzenletin ve bize haber verin.',
      },
      { type: 'h2', text: 'Adreste bulunamazsanız' },
      {
        type: 'p',
        text: `Teslimat sırasında adreste bulunamazsanız, kargo firması sizi bilgilendirir ve paketiniz [Bekleme Süresi] boyunca ${C.carrier} şubesinde bekletilir. Bu süre içinde teslim alınmayan paketler bize geri döner; bu durumda sizinle iletişime geçeriz.`,
      },
    ],
  }
}

function terms(): LegalDoc {
  return {
    title: 'Kullanım Koşulları',
    blocks: [
      {
        type: 'p',
        text: `${site.url} internet sitesi (“Site”), ${C.legalName} (“VELMO”) tarafından işletilmektedir. Site’yi kullanan herkes aşağıdaki koşulları kabul etmiş sayılır.`,
      },
      { type: 'h2', text: '1. Site’nin kullanımı' },
      {
        type: 'p',
        text: 'Site’yi yalnızca hukuka uygun amaçlarla kullanabilirsiniz. Site’nin işleyişini bozacak, güvenliğini tehlikeye atacak veya başkalarının haklarını ihlal edecek davranışlarda bulunamazsınız.',
      },
      { type: 'h2', text: '2. Sipariş ve sözleşme' },
      {
        type: 'p',
        text: 'Site üzerinden verilen siparişler, sipariş sırasında onaylanan Ön Bilgilendirme Formu ve Mesafeli Satış Sözleşmesi hükümlerine tabidir. Sipariş verebilmek için sözleşme yapma ehliyetine sahip olmanız gerekir.',
      },
      { type: 'h2', text: '3. Ürün bilgileri ve fiyatlar' },
      {
        type: 'p',
        text: 'Ürün bilgileri ve görseller, ürünü doğru tanıtmak amacıyla özenle hazırlanır; ürün görselleri temsilî olabilir. Tüm fiyatlara KDV dâhildir. Fiyatlarda açık bir yazım veya sistem hatası olması hâlinde, sizi bilgilendirerek siparişi iptal etme ve ödemenizi eksiksiz iade etme hakkımız saklıdır.',
      },
      { type: 'h2', text: '4. Fikrî mülkiyet' },
      {
        type: 'p',
        text: 'VELMO adı ve logosu, Site’deki tasarım, metin, görsel ve diğer içerikler VELMO’ya veya lisans verenlerine aittir. İzin alınmadan kopyalanamaz, çoğaltılamaz ve ticari amaçla kullanılamaz.',
      },
      { type: 'h2', text: '5. Bağlantılar' },
      {
        type: 'p',
        text: 'Site, üçüncü kişilere ait sitelere bağlantılar içerebilir. Bu sitelerin içeriğinden ve gizlilik uygulamalarından VELMO sorumlu değildir.',
      },
      { type: 'h2', text: '6. Sorumluluk' },
      {
        type: 'p',
        text: 'VELMO, Site’nin kesintisiz ve hatasız çalışması için gereken özeni gösterir. Tüketici mevzuatından doğan haklarınız her durumda saklıdır.',
      },
      { type: 'h2', text: '7. Değişiklikler' },
      {
        type: 'p',
        text: 'VELMO bu koşulları güncelleyebilir. Güncel koşullar Site’de yayımlandığı tarihten itibaren geçerlidir; verilmiş siparişler, sipariş tarihindeki koşullara tabidir.',
      },
      { type: 'h2', text: '8. Uygulanacak hukuk' },
      {
        type: 'p',
        text: 'Bu koşullar Türkiye Cumhuriyeti hukukuna tabidir. Tüketici uyuşmazlıklarında Tüketici Hakem Heyetleri ve Tüketici Mahkemeleri yetkilidir.',
      },
      { type: 'h2', text: '9. İletişim' },
      { type: 'p', text: `${C.legalName} · ${C.address} · ${C.email} · ${C.phone}` },
    ],
  }
}

const documents: Record<Exclude<LegalSlug, 'cerez-tercihleri'>, (ctx?: OrderContext) => LegalDoc> = {
  'kvkk-aydinlatma-metni': kvkk,
  'gizlilik-politikasi': privacy,
  'cerez-politikasi': cookies,
  'mesafeli-satis-sozlesmesi': distanceSales,
  'on-bilgilendirme-formu': preInformation,
  'iptal-ve-iade': returns,
  'teslimat-ve-kargo': shipping,
  'kullanim-kosullari': terms,
}

export function getLegalDoc(slug: Exclude<LegalSlug, 'cerez-tercihleri'>, ctx?: OrderContext) {
  return documents[slug](ctx)
}
