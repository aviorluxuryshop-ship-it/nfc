// Every photo here is the brand's own material from socialpmedia.com: behind-
// the-scenes shots from client productions, campaign stills and the office.
// Dimensions are the optimized files in /public.

const m = (src: string, width: number, height: number) => ({ src, width, height })

export const media = {
  // Production (behind the scenes)
  cafe: m('/images/work/kafe-tanitim-filmi.webp', 1080, 1350),
  cafeDetail: m('/images/work/kafe-cekim-detay.webp', 1023, 1800),
  interview: m('/images/work/roportaj-cekimi.webp', 1037, 1800),
  interviewSet: m('/images/work/roportaj-set.webp', 1037, 1800),
  interviewStudio: m('/images/work/roportaj-studyo.webp', 1030, 1800),
  interviewLight: m('/images/work/roportaj-isik-kurulumu.webp', 1013, 1800),
  restaurant: m('/images/work/restoran-icerik-cekimi.webp', 1013, 1800),
  beauty: m('/images/work/guzellik-merkezi-cekimi.webp', 1350, 1800),
  beautySet: m('/images/work/guzellik-salonu-set.webp', 1350, 1800),
  beautyCrew: m('/images/work/guzellik-salonu-ekip.webp', 1013, 1800),
  conceptMagazine: m('/images/work/konsept-cekim-dergi.webp', 1290, 1599),
  conceptNewspaper: m('/images/work/konsept-cekim-gazete.webp', 1290, 1607),
  conceptVideo: m('/images/work/konsept-video-cekimi.webp', 1289, 1716),
  venue: m('/images/work/mekan-cekimi.webp', 1023, 1800),
  stage: m('/images/work/sahne-cekimi.webp', 1350, 1800),
  showroom: m('/images/work/showroom-cekimi.webp', 1023, 1800),
  studio: m('/images/work/studyo-cekimi.webp', 1037, 1800),
  socialDesign: m('/images/work/sosyal-medya-tasarimi.webp', 1005, 1800),

  // Brand
  officeSign: m('/images/brand/ofis-tabela.webp', 1200, 1800),
  streetCampaign: m('/images/brand/sokak-kampanyasi.webp', 1350, 1800),
  teeIdeas: m('/images/brand/tisort-farkli-fikirler.webp', 1450, 1800),
  teeContent: m('/images/brand/tisort-ozgun-icerikler.webp', 1080, 1350),
  whatWeDo: m('/images/brand/neler-yapiyoruz.webp', 1800, 1013),

  // Service visuals
  socialNeedsUs: m('/images/services/sosyal-medyanin-bize-ihtiyaci-var.webp', 1080, 1350),
  newCustomer: m('/images/services/yeni-musteri.webp', 1080, 1350),
  trayInstagram: m('/images/services/instagram-tepsi.webp', 1350, 1800),
  trayMeta: m('/images/services/meta-tepsi.webp', 1350, 1800),
  trayPhone: m('/images/services/telefon-tepsi.webp', 1350, 1800),
  // Same tray series, with a five-star review card on the tray (testimonials).
  trayReview: m('/images/services/yorum-tepsi.webp', 1350, 1800),
  dluxPoster: m('/video/dlux-professional-web-poster.webp', 1440, 736),
  dluxStill: m('/images/services/dlux-web-poster.webp', 2000, 1022),

  // Web design sector images (as used on the brand's web design page)
  sectorBeauty: m('/images/sectors/guzellik.webp', 960, 1200),
  sectorRestaurant: m('/images/sectors/restoran.webp', 960, 1200),
  sectorEducation: m('/images/sectors/egitim.webp', 960, 1200),
  sectorEcommerce: m('/images/sectors/e-ticaret.webp', 960, 1200),
  sectorConstruction: m('/images/sectors/insaat.webp', 960, 1200),
  sectorCorporate: m('/images/sectors/kurumsal.webp', 960, 1200),
} as const

export const DLUX_VIDEO = '/video/dlux-professional-web.mp4'

export const clientLogos = [
  { name: 'Dlux Professional', src: '/images/logos/dlux-professional.png', width: 380, height: 160 },
  { name: 'Fibabanka', src: '/images/logos/fibabanka.png', width: 722, height: 144 },
  { name: 'Kinetics', src: '/images/logos/kinetics.png', width: 559, height: 155 },
  { name: 'The Balance', src: '/images/logos/the-balance.png', width: 661, height: 160 },
  { name: 'Lalin Cadde', src: '/images/logos/lalin-cadde.png', width: 715, height: 104 },
] as const

export const platformLogos = {
  meta: { name: 'Meta', src: '/images/logos/meta.png', width: 609, height: 125 },
  google: { name: 'Google Ads', src: '/images/logos/google-ads.png', width: 632, height: 160 },
} as const

/** Textures for the WebGL ring in the hero (600×800 crops). */
export const RING_TEXTURES = Array.from({ length: 14 }, (_, i) => `/ring/${String(i + 1).padStart(2, '0')}.webp`)
