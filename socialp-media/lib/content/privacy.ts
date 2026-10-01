import { contact } from '@/lib/site'

import type { Locale } from '@/lib/site'

// Privacy policy / KVKK information notice. Written against what this site
// actually does (checked in code): no cookies, no analytics or tracking
// scripts, fonts and media served from the site's own domain, the contact
// brief is not stored — it opens WhatsApp or the visitor's mail app.
// If any of that changes (analytics, a form backend, a newsletter), update
// the relevant section here.

export type PolicySection = { id: string; title: string; body: (string | string[])[] }

export type PrivacyContent = {
  eyebrow: string
  title: string
  updatedLabel: string
  updated: string
  intro: string
  tocLabel: string
  sections: PolicySection[]
  footerLink: string
  metaDescription: string
}

const addr = `${contact.address.street}, ${contact.address.postalCode} ${contact.address.district}/${contact.address.city}`

const tr: PrivacyContent = {
  eyebrow: 'KVKK Aydınlatma Metni',
  title: 'Gizlilik Politikası',
  updatedLabel: 'Son güncelleme',
  updated: '1 Ekim 2026',
  intro:
    'Bu metin, 6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK) kapsamında aydınlatma metni niteliğindedir. Socialp Media olarak web sitemizi ziyaret ettiğinizde ve bizimle iletişime geçtiğinizde hangi kişisel verilerin, hangi amaçla ve nasıl işlendiğini açıklar.',
  tocLabel: 'Başlıklar',
  sections: [
    {
      id: 'veri-sorumlusu',
      title: 'Veri sorumlusu',
      body: [
        `Kişisel verileriniz, veri sorumlusu sıfatıyla Socialp Media tarafından işlenir. Adres: ${addr}. E-posta: ${contact.tr.email}. Telefon: ${contact.tr.phone}.`,
      ],
    },
    {
      id: 'islenen-veriler',
      title: 'Hangi verileri işliyoruz?',
      body: [
        'Bu web sitesinde üyelik, çerez tabanlı takip veya analitik araç kullanılmaz. İşlediğimiz veriler şunlarla sınırlıdır:',
        [
          'İletişim verileri: Bize e-posta, telefon veya WhatsApp üzerinden ulaştığınızda paylaştığınız ad-soyad, şirket adı, telefon numarası, e-posta adresi ve mesaj içeriği.',
          'Teknik kayıtlar: Siteyi barındıran altyapı sağlayıcısının güvenlik ve işletim amacıyla otomatik olarak tuttuğu IP adresi, tarayıcı bilgisi, ziyaret edilen sayfa ve zaman bilgisi.',
        ],
        'İletişim sayfasındaki kısa brif formu hiçbir veriyi bu sitede saklamaz veya sunucuya göndermez. Formu doldurduğunuzda mesajınız, kendi cihazınızdaki WhatsApp ya da e-posta uygulamasında hazır olarak açılır; gönderip göndermemek size kalır.',
      ],
    },
    {
      id: 'amaclar',
      title: 'Verileri hangi amaçlarla işliyoruz?',
      body: [
        [
          'Talep ve sorularınıza yanıt vermek, teklif ve proje görüşmelerini yürütmek,',
          'Hizmet sözleşmesinin kurulması ve ifası,',
          'Web sitesinin güvenli ve kesintisiz çalışmasını sağlamak, kötüye kullanımı önlemek,',
          'Yasal yükümlülüklerimizi yerine getirmek.',
        ],
      ],
    },
    {
      id: 'hukuki-sebepler',
      title: 'Hukuki sebepler',
      body: [
        'Kişisel verileriniz KVKK’nın 5. maddesinin 2. fıkrasında yer alan; bir sözleşmenin kurulması veya ifasıyla doğrudan ilgili olması (c), veri sorumlusunun hukuki yükümlülüğünü yerine getirebilmesi (ç) ve temel hak ve özgürlüklerinize zarar vermemek kaydıyla meşru menfaatlerimiz için zorunlu olması (f) hukuki sebeplerine dayanılarak işlenir.',
      ],
    },
    {
      id: 'aktarim',
      title: 'Verilerin aktarılması',
      body: [
        'Verileriniz satılmaz ve pazarlama amacıyla üçüncü kişilerle paylaşılmaz. Yalnızca aşağıdaki durumlarda aktarılabilir:',
        [
          'Barındırma hizmeti: Web sitesi Vercel Inc. (ABD) altyapısında barındırılır. Teknik kayıtlar bu sağlayıcının yurt dışındaki sunucularında işlenir; bu aktarım KVKK’nın 9. maddesine uygun şekilde gerçekleştirilir.',
          'İletişim kanalları: WhatsApp (Meta), e-posta veya telefon üzerinden yazdığınızda mesajınız ilgili hizmet sağlayıcının altyapısından geçer ve o hizmetin kendi gizlilik koşullarına tabidir.',
          'Yasal zorunluluk: Yetkili kamu kurum ve kuruluşlarının kanuna dayalı talepleri halinde.',
        ],
      ],
    },
    {
      id: 'cerezler',
      title: 'Çerezler',
      body: [
        'Bu web sitesi reklam, analiz veya takip amaçlı çerez kullanmaz ve ziyaretinizi profillemez. Yazı tipleri, görseller ve videolar sitenin kendi alan adından sunulur.',
        'Instagram, WhatsApp ve Google Haritalar bağlantıları yalnızca tıkladığınızda ilgili platformu açar. Bu platformlarda geçerli olan çerez ve gizlilik uygulamaları o şirketlere aittir.',
      ],
    },
    {
      id: 'saklama',
      title: 'Saklama süresi',
      body: [
        'İletişim yazışmaları, talebinizin sonuçlandırılması ve varsa sözleşme ilişkisinin gerektirdiği süre ile ilgili mevzuatta öngörülen zamanaşımı süreleri boyunca saklanır; bu sürelerin sonunda silinir, yok edilir veya anonim hale getirilir. Teknik kayıtlar, barındırma sağlayıcısının kısa süreli kayıt politikası çerçevesinde tutulur.',
      ],
    },
    {
      id: 'haklariniz',
      title: 'KVKK kapsamındaki haklarınız',
      body: [
        'KVKK’nın 11. maddesi uyarınca veri sorumlusuna başvurarak:',
        [
          'Kişisel verilerinizin işlenip işlenmediğini öğrenme,',
          'İşlenmişse buna ilişkin bilgi talep etme,',
          'İşlenme amacını ve amaca uygun kullanılıp kullanılmadığını öğrenme,',
          'Yurt içinde veya yurt dışında aktarıldığı üçüncü kişileri bilme,',
          'Eksik veya yanlış işlenmişse düzeltilmesini isteme,',
          'KVKK’nın 7. maddesindeki şartlar çerçevesinde silinmesini veya yok edilmesini isteme,',
          'Düzeltme, silme ve yok etme işlemlerinin aktarıldığı üçüncü kişilere bildirilmesini isteme,',
          'Münhasıran otomatik sistemlerle analiz edilmesi sonucu aleyhinize bir sonuç çıkmasına itiraz etme,',
          'Kanuna aykırı işleme nedeniyle zarara uğramanız halinde zararın giderilmesini talep etme',
        ],
        'haklarına sahipsiniz.',
      ],
    },
    {
      id: 'basvuru',
      title: 'Başvuru',
      body: [
        `Haklarınıza ilişkin taleplerinizi ${contact.tr.email} adresine e-posta göndererek veya ${addr} adresine yazılı olarak iletebilirsiniz. Başvurunuz, niteliğine göre en geç 30 gün içinde ücretsiz olarak sonuçlandırılır.`,
      ],
    },
    {
      id: 'degisiklikler',
      title: 'Değişiklikler',
      body: ['Bu politika gerektiğinde güncellenebilir. Güncel sürüm her zaman bu sayfada yayımlanır; son güncelleme tarihi sayfanın başında yer alır.'],
    },
  ],
  footerLink: 'Gizlilik Politikası',
  metaDescription: 'Socialp Media gizlilik politikası ve KVKK aydınlatma metni: hangi verileri, hangi amaçla işlediğimiz ve haklarınız.',
}

const en: PrivacyContent = {
  eyebrow: 'Privacy & data protection',
  title: 'Privacy Policy',
  updatedLabel: 'Last updated',
  updated: '1 October 2026',
  intro:
    'This notice explains which personal data Socialp Media processes when you visit this website or contact us, why, and what rights you have. It is provided under the Turkish Personal Data Protection Law No. 6698 (KVKK) and, for visitors in the EU/EEA and UK, in line with the GDPR.',
  tocLabel: 'Contents',
  sections: [
    {
      id: 'controller',
      title: 'Data controller',
      body: [
        `Your personal data is processed by Socialp Media as data controller. Address: ${addr}, Türkiye. Email: ${contact.intl.email} / ${contact.tr.email}. Phone: ${contact.intl.phone} / ${contact.tr.phone}.`,
      ],
    },
    {
      id: 'data',
      title: 'What we process',
      body: [
        'This website has no accounts, no cookie-based tracking and no analytics tools. The data we process is limited to:',
        [
          'Contact data: the name, company, phone number, email address and message you share when you reach us by email, phone or WhatsApp.',
          'Technical logs: IP address, browser details, requested page and time, recorded automatically by our hosting provider for security and operation.',
        ],
        'The short brief form on the contact page does not store anything on this site or send it to a server. Filling it in simply opens your own WhatsApp or email app with the message ready; whether to send it is up to you.',
      ],
    },
    {
      id: 'purposes',
      title: 'Why we process it',
      body: [
        [
          'To answer your questions and requests, and to discuss proposals and projects,',
          'To enter into and perform a service agreement,',
          'To keep the website secure and running, and to prevent abuse,',
          'To meet our legal obligations.',
        ],
      ],
    },
    {
      id: 'legal-basis',
      title: 'Legal basis',
      body: [
        'We rely on steps taken to enter into or perform a contract, compliance with legal obligations, and our legitimate interests in running a secure website and responding to enquiries (KVKK Art. 5(2)(c), (ç), (f); GDPR Art. 6(1)(b), (c), (f)).',
      ],
    },
    {
      id: 'sharing',
      title: 'Sharing and transfers',
      body: [
        'We never sell your data or share it for marketing. It may only be shared as follows:',
        [
          'Hosting: the site runs on Vercel Inc. (USA). Technical logs are processed on its servers abroad, in line with KVKK Art. 9 and applicable safeguards.',
          'Messaging channels: when you write via WhatsApp (Meta), email or phone, your message passes through that provider and is subject to its own privacy terms.',
          'Legal requirements: where competent authorities request it under the law.',
        ],
      ],
    },
    {
      id: 'cookies',
      title: 'Cookies',
      body: [
        'This website does not use advertising, analytics or tracking cookies and does not profile your visit. Fonts, images and videos are served from the site’s own domain.',
        'Instagram, WhatsApp and Google Maps links only open those platforms when you click them; their own cookie and privacy practices apply there.',
      ],
    },
    {
      id: 'retention',
      title: 'Retention',
      body: [
        'Correspondence is kept for as long as needed to handle your request and any resulting contract, and for the limitation periods set by law; it is then deleted, destroyed or anonymised. Technical logs are kept under the hosting provider’s short-term log policy.',
      ],
    },
    {
      id: 'rights',
      title: 'Your rights',
      body: [
        'You may ask us to confirm whether we process your data and obtain a copy; learn the purposes and recipients; have inaccurate data corrected; have data deleted or destroyed; object to processing, including decisions based solely on automated processing; and claim compensation for damage caused by unlawful processing. EU/EEA and UK residents may also request restriction and data portability, and lodge a complaint with their local supervisory authority.',
      ],
    },
    {
      id: 'requests',
      title: 'How to make a request',
      body: [
        `Email ${contact.intl.email} or ${contact.tr.email}, or write to ${addr}, Türkiye. We respond free of charge within 30 days.`,
      ],
    },
    {
      id: 'changes',
      title: 'Changes',
      body: ['We may update this policy when needed. The current version is always published on this page, with the last-updated date at the top.'],
    },
  ],
  footerLink: 'Privacy Policy',
  metaDescription: 'Socialp Media privacy policy: what personal data we process, why, and your rights under KVKK and GDPR.',
}

export const privacy: Record<Locale, PrivacyContent> = { tr, en }
