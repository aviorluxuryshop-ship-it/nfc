/**
 * Seller (satıcı) details shown in the footer, on the contact page and
 * inside every legal text. None of these were provided, so each one is an
 * editable [placeholder] — fill them in with the real registered details.
 * Legal pages highlight any value that is still a [placeholder].
 */
export const company = {
  brand: 'VELMO',
  legalName: '[Ticaret Unvanı]',
  mersisNo: '[MERSİS No]',
  tradeRegistryNo: '[Ticaret Sicil No]',
  taxOffice: '[Vergi Dairesi]',
  taxNo: '[Vergi No]',
  address: '[Açık Adres, İlçe / İl]',
  phone: '[Telefon]',
  whatsapp: '[WhatsApp Numarası]',
  email: '[E-posta Adresi]',
  kep: '[KEP Adresi]',
  serviceHours: '[Müşteri Hizmetleri Çalışma Saatleri]',
  /** Elektronik Ticaret Bilgi Sistemi kayıt bilgisi. */
  etbis: '[ETBİS Kayıt Bilgisi]',
  /** Contact for KVKK requests, if different from the general e-mail. */
  kvkkEmail: '[KVKK Başvuru E-posta Adresi]',

  /** Bank details shown to customers who pick Havale / EFT. */
  bank: {
    name: '[Banka Adı]',
    accountHolder: '[Hesap Sahibi Unvanı]',
    iban: '[TR00 0000 0000 0000 0000 0000 00]',
  },

  /** Licensed payment institution that collects card payments. */
  paymentProvider: '[Ödeme Kuruluşu]',
  /** Cargo company that delivers the orders. */
  carrier: '[Kargo Firması]',
  /** Hosting / infrastructure provider(s), named in the KVKK text. */
  hostingProvider: '[Barındırma / Altyapı Sağlayıcısı]',

  /** "Son güncelleme" date on the legal pages. */
  legalUpdatedAt: '[GG.AA.YYYY]',
} as const

/** True while a value is still an unfilled `[placeholder]`. */
export function isPlaceholder(value: string) {
  return /^\[.*\]$/.test(value.trim())
}
