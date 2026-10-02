/**
 * English courtesy translation of the Turkish legal texts in `tr.ts`. Keep
 * the two in step: when a Turkish clause changes, change it here too. The
 * Turkish version is the binding one.
 */
import { company as C } from '@/data/company'
import { productFacts, productText } from '@/data/products'
import { site } from '@/data/site'
import { formatPrice } from '@/lib/format'

import type { Block, DocSet, LegalDoc, OrderContext } from './types'

const productLine = { ...productFacts, ...productText.en }
const { commerce } = site
const shippingRule = `Shipping is free on orders of ${formatPrice(commerce.freeShippingThreshold)} or more; below that amount a ${formatPrice(commerce.shippingFee)} shipping fee applies.`

const sellerRows: string[][] = [
  ['Trade name', C.legalName],
  ['Address', C.address],
  ['Phone', C.phone],
  ['Email', C.email],
  ['KEP (registered email) address', C.kep],
  ['MERSİS No', C.mersisNo],
  ['Tax office / Tax no', `${C.taxOffice} / ${C.taxNo}`],
]

function buyerRows(ctx?: OrderContext): string[][] {
  return [
    ['Full name', ctx?.buyer.name || '[Buyer Full Name]'],
    ['Delivery address', ctx?.deliveryAddress || '[Delivery Address]'],
    ['Phone', ctx?.buyer.phone || '[Buyer Phone]'],
    ['Email', ctx?.buyer.email || '[Buyer Email]'],
  ]
}

function orderBlocks(ctx?: OrderContext): Block[] {
  const items = ctx?.items.length
    ? ctx.items.map((i) => [i.name, String(i.qty), i.unitPrice, i.total])
    : [[`${productLine.fullName} — [Scent]`, '[Qty]', '[Unit Price]', '[Amount]']]
  return [
    { type: 'table', head: ['Product', 'Qty', 'Unit price (VAT incl.)', 'Amount'], rows: items },
    {
      type: 'table',
      rows: [
        ['Products total', ctx?.subtotal || '[Subtotal]'],
        ['Shipping fee', ctx?.shipping || '[Shipping Fee]'],
        ['Total (VAT incl.)', ctx?.total || '[Total Amount]'],
        ['Payment method', ctx?.paymentMethod || '[Payment Method]'],
        ['Delivery address', ctx?.deliveryAddress || '[Delivery Address]'],
        ['Invoice details', ctx?.invoice || '[Invoice Details]'],
        ['Order date', ctx?.date || '[Order Date]'],
      ],
    },
  ]
}

const productDescription = `${productLine.fullName}: detergent sheets for coloured laundry, used in a washing machine. Each box contains ${productLine.sheets} sheets (${productLine.washes} washes), net ${productLine.netWeightGrams} g. Scents: Lavender, Spring, Citrus. Not suitable for hand washing.`

const withdrawalHygiene =
  'Under Article 15 of the Turkish Regulation on Distance Contracts, the right of withdrawal does not apply to goods whose protective elements such as packaging, tape, seal or wrapping have been opened after delivery and whose return is not suitable for health and hygiene reasons. Detergent sheets are such goods; products with opened packaging therefore cannot be returned under the right of withdrawal.'

const returnShipping = `Products returned under the right of withdrawal are sent with ${C.carrier} using [Return Code / Return Method]. When the carrier named by the Seller is used, the Buyer is not charged for return shipping.`

const disputes =
  'You can contact us first with any complaint or objection. You may also apply, within the monetary limits announced each year by the Turkish Ministry of Trade, to the Consumer Arbitration Committee (Tüketici Hakem Heyeti) or the Consumer Court (Tüketici Mahkemesi) where you bought the goods or where you live. Applications to the Consumer Arbitration Committee can also be made online through e-Devlet via the Consumer Information System (TÜBİS).'

/* ------------------------------------------------------------------ */

function kvkk(): LegalDoc {
  return {
    title: 'Privacy Notice (KVKK)',
    summary: [
      'We process the information needed to take your order, deliver it and issue your invoice.',
      'We never sell your data; we share it only with parties the job requires, such as the courier, payment and accounting.',
      'You can always ask what we hold about you, and request correction or deletion.',
    ],
    blocks: [
      {
        type: 'p',
        text: `This notice is issued by ${C.legalName} (the “Company”), as data controller under Turkish Personal Data Protection Law No. 6698 (“KVKK”) and the Communiqué on the Procedures and Principles for Fulfilling the Obligation to Inform, to inform people who use and order from the ${site.url} website (the “Site”).`,
      },
      { type: 'h2', text: '1. Data controller' },
      { type: 'table', rows: sellerRows },
      { type: 'h2', text: '2. Personal data we process' },
      {
        type: 'table',
        head: ['Data category', 'Description'],
        rows: [
          ['Identity', 'First and last name; Turkish ID number where required for an e-Archive invoice'],
          ['Contact', 'Email address, mobile number, delivery and billing address'],
          ['Customer transaction', 'Order contents and history, order notes, requests, complaints and return records'],
          ['Finance', 'Invoice details and payment transaction records; tax office and tax number for company invoices. Your card details are never seen or stored by the Company.'],
          ['Transaction security', 'IP address, browser and device information, site usage logs'],
          ['Marketing', 'Only if you allow it: commercial message preferences and cookie data'],
        ],
      },
      { type: 'h2', text: '3. Why we process your personal data' },
      {
        type: 'ul',
        items: [
          'Taking your order, collecting payment, preparing and delivering the product',
          'Forming and performing the distance sales agreement and issuing invoices',
          'Handling cancellations, withdrawals, returns, exchanges and complaints',
          'Keeping you informed about your order (order confirmation, shipping notice)',
          'Meeting storage, notification and disclosure obligations under the law',
          'Keeping information secure and preventing misuse and fraud',
          'If you allow it: sending commercial electronic messages about offers and news',
          'If you allow it: improving the site through analytics and marketing cookies',
        ],
      },
      { type: 'h2', text: '4. Legal grounds' },
      {
        type: 'ul',
        items: [
          'KVKK Art. 5/2-c: Processing is directly related to forming or performing a contract (order, delivery, invoice, returns)',
          'KVKK Art. 5/2-ç: Processing is necessary for the data controller to meet its legal obligations (tax, commercial and consumer law)',
          'KVKK Art. 5/2-e: Processing is necessary to establish, exercise or protect a right',
          'KVKK Art. 5/2-f: Legitimate interest, provided it does not harm your fundamental rights and freedoms (information security)',
          'KVKK Art. 5/1: Explicit consent (analytics and marketing cookies). For commercial electronic messages, your approval is obtained under Law No. 6563.',
        ],
      },
      { type: 'h2', text: '5. How we collect it' },
      {
        type: 'p',
        text: 'Your personal data is collected through the order and contact forms on the Site, email, phone and cookies, by automatic or partly automatic means.',
      },
      { type: 'h2', text: '6. Who we share it with' },
      { type: 'p', text: 'For the purposes above, and only as far as necessary, your personal data may be shared with:' },
      {
        type: 'ul',
        items: [
          `The courier company, for delivery: ${C.carrier}`,
          `The licensed payment institution, for payment: ${C.paymentProvider}`,
          `Hosting and technical infrastructure: ${C.hostingProvider}`,
          'The e-Archive / e-Invoice service provider and accountant, for invoicing: [Service Provider]',
          'Competent public authorities and legally authorised persons, when requested',
        ],
      },
      {
        type: 'p',
        text: '[Transfers abroad: If hosting, email or analytics providers located outside Türkiye are used, state the data categories transferred and the legal basis under KVKK Art. 9 (e.g. standard contract). Remove this paragraph if not applicable.]',
      },
      { type: 'h2', text: '7. How long we keep it' },
      {
        type: 'p',
        text: 'Your personal data is kept for the periods set by law (for example, the retention periods in the Turkish Commercial Code and Tax Procedure Law) or for as long as the purpose requires. After that it is deleted, destroyed or anonymised.',
      },
      { type: 'h2', text: '8. Your rights (KVKK Art. 11)' },
      { type: 'p', text: 'By applying to the data controller, you have the right to:' },
      {
        type: 'ul',
        items: [
          'Learn whether your personal data is processed',
          'Request information if it has been processed',
          'Learn the purpose of processing and whether it is used accordingly',
          'Know the third parties in Türkiye or abroad to whom it is transferred',
          'Request correction if it is incomplete or inaccurate',
          'Request deletion or destruction under the conditions in KVKK Art. 7',
          'Request that corrections, deletions and destructions be notified to the third parties it was transferred to',
          'Object to a result against you arising from analysis exclusively by automated systems',
          'Claim compensation if you suffer damage from unlawful processing',
        ],
      },
      { type: 'h2', text: '9. How to apply' },
      {
        type: 'p',
        text: `In line with the Communiqué on the Procedures and Principles of Application to the Data Controller, you can send your request by a signed letter to ${C.address}, to our KEP address ${C.kep} with a secure electronic signature, or from the email address registered with us to ${C.kvkkEmail}. Your request is answered free of charge within 30 days at the latest; if the process involves an additional cost, the fee set by the Personal Data Protection Board may be charged.`,
      },
    ],
  }
}

function privacy(): LegalDoc {
  return {
    title: 'Privacy Policy',
    summary: [
      'We only ask for the information your order needs.',
      'Your card details are never entered or stored on our site.',
      'We don’t send you advertising messages without your permission.',
    ],
    blocks: [
      {
        type: 'p',
        text: `This policy explains how your information is protected when you visit and shop on the ${site.url} website operated by ${C.legalName} (“VELMO”, “we”). Details of how your personal data is processed are in the Privacy Notice (KVKK).`,
      },
      { type: 'h2', text: 'What information do we collect?' },
      {
        type: 'ul',
        items: [
          '**When you order:** first and last name, email, phone, delivery and billing address; if you want a company invoice, the company name, tax office and tax number.',
          '**When you contact us:** whatever you share in your message.',
          '**When you browse:** technical information the site needs to work; analytics and marketing cookies only if you allow them.',
        ],
      },
      { type: 'h2', text: 'What do we use it for?' },
      {
        type: 'p',
        text: 'To prepare and deliver your order, issue your invoice, keep you informed about your order, answer your questions and meet our legal obligations. We never sell or rent your information.',
      },
      { type: 'h2', text: 'Payment security' },
      {
        type: 'p',
        text: `Card payments are taken through the infrastructure of the licensed payment institution ${C.paymentProvider}. You enter your card details on the payment institution’s secure page; VELMO never sees or stores them.`,
      },
      { type: 'h2', text: 'Commercial electronic messages' },
      {
        type: 'p',
        text: 'We only send emails or SMS with offers and news if you approve. You can withdraw your approval free of charge at any time using the opt-out link in the messages, via the Message Management System (İYS) or by writing to us. Order notifications (order confirmation, shipping notice) are not covered by this.',
      },
      { type: 'h2', text: 'Cookies' },
      {
        type: 'p',
        text: 'The cookies used on our site and how to manage them are explained in the Cookie Policy. You can change your choices at any time from the “Cookie Preferences” link at the bottom of the page.',
      },
      { type: 'h2', text: 'How do we protect your information?' },
      {
        type: 'p',
        text: 'Site traffic is sent over an encrypted connection (HTTPS). Only people who need it for their work can access your information. We work with service providers on the condition that they use your information only on our behalf and only as far as necessary.',
      },
      { type: 'h2', text: 'Your rights' },
      {
        type: 'p',
        text: 'To exercise your rights listed in Article 11 of KVKK, you can apply to us as described in the Privacy Notice (KVKK).',
      },
      { type: 'h2', text: 'Changes' },
      {
        type: 'p',
        text: 'We may update this policy from time to time. The current version is always on this page, and we announce important changes on the site.',
      },
      { type: 'h2', text: 'Contact' },
      { type: 'p', text: `For questions: ${C.email} · ${C.phone}` },
    ],
  }
}

function cookies(): LegalDoc {
  return {
    title: 'Cookie Policy',
    summary: [
      'We use necessary technologies to run your cart; these cannot be turned off.',
      'We only use analytics and marketing cookies if you allow them.',
      'You can change your choices at any time under “Cookie Preferences”.',
    ],
    blocks: [
      {
        type: 'p',
        text: `This policy explains the cookies and similar technologies (such as the browser’s local storage) used on ${site.url}, operated by ${C.legalName}.`,
      },
      { type: 'h2', text: 'What is a cookie?' },
      {
        type: 'p',
        text: 'Cookies are small text files saved in your browser when you visit a website. They let the site work, remember your preferences and help us understand how the site is used.',
      },
      { type: 'h2', text: 'Cookies and similar technologies we use' },
      {
        type: 'table',
        head: ['Name', 'Type', 'Purpose', 'Duration'],
        rows: [
          ['velmo-cart-v1', 'Necessary (local storage)', 'Remembers the products in your cart.', 'Until you delete it'],
          ['velmo-cookie-consent', 'Necessary (local storage)', 'Remembers your cookie choices.', 'Until you delete it'],
          ['velmo-last-order', 'Necessary (session storage)', 'Shows your order summary on the order confirmation page.', 'Deleted when the browser closes'],
          ['[Analytics tool name]', 'Analytics (consent-based)', '[Purpose]', '[Duration]'],
          ['[Marketing tool name]', 'Marketing (consent-based)', '[Purpose]', '[Duration]'],
        ],
      },
      { type: 'h2', text: 'Legal basis' },
      {
        type: 'p',
        text: 'Necessary cookies are used to form and perform the contract (KVKK Art. 5/2-c) and for our legitimate interest (KVKK Art. 5/2-f). Functional, analytics and marketing cookies are used only with your explicit consent (KVKK Art. 5/1); if you don’t allow them, they are not run.',
      },
      { type: 'h2', text: 'How can you manage your choices?' },
      {
        type: 'ul',
        items: [
          'Use the “Cookie Preferences” link at the bottom of the site to give or withdraw consent at any time.',
          'You can delete or block cookies in your browser settings. If you block necessary cookies, the cart and checkout may not work.',
        ],
      },
      { type: 'h2', text: 'Contact' },
      { type: 'p', text: `For questions about cookies: ${C.email}` },
    ],
  }
}

function preInformation(ctx?: OrderContext): LegalDoc {
  return {
    title: 'Pre-Information Form',
    blocks: [
      {
        type: 'p',
        text: 'This form is presented for your information before you confirm your order, in accordance with Turkish Consumer Protection Law No. 6502 and the Regulation on Distance Contracts.',
      },
      { type: 'h2', text: '1. Seller' },
      { type: 'table', rows: sellerRows },
      { type: 'h2', text: '2. Buyer' },
      { type: 'table', rows: buyerRows(ctx) },
      { type: 'h2', text: '3. Main characteristics of the product' },
      { type: 'p', text: productDescription },
      { type: 'h2', text: '4. Price and payment' },
      ...orderBlocks(ctx),
      {
        type: 'p',
        text: `All prices include VAT. ${shippingRule} Payment can be made by credit or debit card through ${C.paymentProvider}, or by bank transfer (Havale / EFT). Orders paid by bank transfer are prepared once the payment reaches our account.`,
      },
      { type: 'h2', text: '5. Delivery' },
      {
        type: 'p',
        text: `The product is handed to the courier within ${commerce.dispatchDays} business days of order confirmation (for bank transfers, of the payment reaching our account) and delivered by ${C.carrier} to the address given by the Buyer. Delivery never exceeds the legal maximum of 30 days.`,
      },
      { type: 'h2', text: '6. Right of withdrawal' },
      {
        type: 'p',
        text: `The Buyer may withdraw within 14 days of the product being delivered to them or to a third party they named, without giving any reason and without paying any penalty. Notice of withdrawal can be given by email to ${C.email}, by phone on ${C.phone}, or in writing to ${C.address}.`,
      },
      {
        type: 'p',
        text: `All payments collected, including delivery costs, are refunded by the payment method used within 14 days of the withdrawal notice reaching the Seller. The Buyer sends the product back within 10 days of the withdrawal notice. ${returnShipping}`,
      },
      { type: 'h3', text: 'When the right of withdrawal does not apply' },
      { type: 'p', text: withdrawalHygiene },
      { type: 'h2', text: '7. Complaints and objections' },
      { type: 'p', text: disputes },
      {
        type: 'p',
        text: 'The Buyer confirms having read this form, that the order creates an obligation to pay, and confirms the information above electronically.',
      },
    ],
  }
}

function distanceSales(ctx?: OrderContext): LegalDoc {
  return {
    title: 'Distance Sales Agreement',
    blocks: [
      { type: 'h2', text: 'Article 1 – Parties' },
      { type: 'h3', text: '1.1 Seller' },
      { type: 'table', rows: sellerRows },
      { type: 'h3', text: '1.2 Buyer' },
      { type: 'table', rows: buyerRows(ctx) },
      { type: 'h2', text: 'Article 2 – Subject' },
      {
        type: 'p',
        text: `This agreement sets out the rights and obligations of the parties, under Turkish Consumer Protection Law No. 6502 and the Regulation on Distance Contracts, regarding the sale and delivery of the product described below, which the Buyer ordered electronically on the Seller’s website ${site.url}.`,
      },
      { type: 'h2', text: 'Article 3 – Product, payment and delivery' },
      { type: 'p', text: productDescription },
      ...orderBlocks(ctx),
      { type: 'h2', text: 'Article 4 – General terms' },
      {
        type: 'ol',
        items: [
          'The Buyer confirms having read the Pre-Information Form on the product’s main characteristics, sale price, payment method and delivery, and having given the necessary confirmation electronically.',
          `Without exceeding the legal 30-day limit, the product is handed to the courier within ${commerce.dispatchDays} business days of order confirmation and delivered to the delivery address given by the Buyer.`,
          'The Seller must deliver the product intact, complete and as described in the order.',
          'If performance of the order becomes impossible, the Seller informs the Buyer within 3 days of learning this and refunds all payments collected within 14 days of the notice at the latest.',
          'If the parcel looks damaged at delivery, the Buyer is advised to have the courier prepare a damage report before accepting it.',
        ],
      },
      { type: 'h2', text: 'Article 5 – Right of withdrawal' },
      {
        type: 'ol',
        items: [
          'The Buyer may withdraw within 14 days of delivery to them or to a third party they named, without any legal or penal liability and without giving any reason. The right may also be exercised before delivery.',
          `Notice of withdrawal is given within this period by email to ${C.email} or in writing to ${C.address}.`,
          'Within 14 days of receiving the withdrawal notice, the Seller refunds all payments collected, including delivery costs, by the method the Buyer used, without charging the Buyer any cost.',
          `The Buyer sends the product back to the Seller within 10 days of the withdrawal notice. ${returnShipping}`,
          'The Buyer is responsible for any loss in value caused by use other than in line with the product’s function, technical features and instructions during the withdrawal period.',
        ],
      },
      { type: 'h2', text: 'Article 6 – When the right of withdrawal does not apply' },
      { type: 'p', text: withdrawalHygiene },
      { type: 'h2', text: 'Article 7 – Defective products' },
      {
        type: 'p',
        text: 'If the product is defective, under Article 11 of Law No. 6502 the Buyer may choose to withdraw from the contract, ask for a price reduction in proportion to the defect, ask for free repair, or, where possible, ask for replacement with a non-defective equivalent.',
      },
      { type: 'h2', text: 'Article 8 – Disputes' },
      { type: 'p', text: disputes },
      { type: 'h2', text: 'Article 9 – Entry into force' },
      {
        type: 'p',
        text: 'By confirming the order, the Buyer is deemed to accept all terms of this agreement. The agreement and the Pre-Information Form are sent to the Buyer’s email address with the order confirmation and kept by the Seller for the period required by law.',
      },
    ],
  }
}

function returns(): LegalDoc {
  return {
    title: 'Cancellation & Returns',
    summary: [
      'If you reach us before your order ships, we’ll cancel it.',
      'Unopened products can be returned within 14 days of delivery.',
      'For hygiene reasons opened products can’t be returned; your rights for damaged or faulty products are unaffected.',
    ],
    blocks: [
      { type: 'h2', text: 'Cancelling an order' },
      {
        type: 'p',
        text: `Before your order ships, just contact ${C.email} or ${C.phone} with your order number. Your payment is refunded to the method you used. How long a card refund takes to appear depends on your bank.`,
      },
      { type: 'h2', text: 'Right of withdrawal (14 days)' },
      {
        type: 'p',
        text: 'You can withdraw without giving a reason within 14 days of receiving the product. The packaging must be unopened, with its tape and protective elements intact.',
      },
      { type: 'h2', text: 'Which products can’t be returned?' },
      { type: 'p', text: withdrawalHygiene },
      { type: 'h2', text: 'How to return' },
      {
        type: 'ol',
        items: [
          `Email your return request with your order number to ${C.email}.`,
          `Using the return details we send you (${C.carrier} · [Return Code / Return Method]), send the product unopened, together with its invoice.`,
          'Your payment is refunded by the method you used within 14 days of your withdrawal notice reaching us.',
        ],
      },
      { type: 'p', text: returnShipping },
      { type: 'h2', text: 'Damaged or faulty products' },
      {
        type: 'p',
        text: 'If the parcel arrives damaged, we recommend having the courier prepare a damage report before you accept it. If your product is faulty or incomplete, write to us right away with a photo. Your rights under Law No. 6502 (free replacement, refund, price reduction) are unaffected, and you won’t be charged for return shipping.',
      },
      { type: 'h2', text: 'Contact' },
      { type: 'p', text: `${C.email} · ${C.phone} · ${C.serviceHours}` },
    ],
  }
}

function shipping(): LegalDoc {
  return {
    title: 'Delivery & Shipping',
    summary: [`Your order ships within ${commerce.dispatchDays} business days.`, shippingRule, 'Tracking details are sent to your email address.'],
    blocks: [
      { type: 'h2', text: 'Delivery area' },
      { type: 'p', text: 'We deliver to addresses in Türkiye.' },
      { type: 'h2', text: 'When does my order ship?' },
      {
        type: 'p',
        text: `Your order is handed to the courier within ${commerce.dispatchDays} business days of confirmation (weekends and public holidays excluded). For bank transfers, this period starts when the payment reaches our account. Delivery never exceeds the legal maximum of 30 days.`,
      },
      { type: 'h2', text: 'Courier and tracking' },
      {
        type: 'p',
        text: `We ship with ${C.carrier}. When your order ships, the tracking details are sent to your email address. How long delivery takes depends on your region.`,
      },
      { type: 'h2', text: 'Shipping cost' },
      { type: 'p', text: `${shippingRule} The shipping cost is shown clearly in your cart before checkout.` },
      { type: 'h2', text: 'When you receive it' },
      {
        type: 'p',
        text: 'We recommend checking the outer packaging when you receive the parcel. If it is crushed, torn or wet, have the courier prepare a damage report before accepting it and let us know.',
      },
      { type: 'h2', text: 'If you’re not at home' },
      {
        type: 'p',
        text: `If you’re not at the address at delivery, the courier informs you and the parcel is held at the ${C.carrier} branch for [Holding Period]. Parcels not collected within that time come back to us, and we’ll get in touch with you.`,
      },
    ],
  }
}

function terms(): LegalDoc {
  return {
    title: 'Terms of Use',
    blocks: [
      {
        type: 'p',
        text: `The ${site.url} website (the “Site”) is operated by ${C.legalName} (“VELMO”). Everyone who uses the Site is deemed to accept the terms below.`,
      },
      { type: 'h2', text: '1. Using the Site' },
      {
        type: 'p',
        text: 'You may use the Site only for lawful purposes. You may not do anything that disrupts how the Site works, endangers its security or infringes the rights of others.',
      },
      { type: 'h2', text: '2. Orders and contract' },
      {
        type: 'p',
        text: 'Orders placed on the Site are subject to the Pre-Information Form and Distance Sales Agreement confirmed during the order. You must have legal capacity to enter into contracts to place an order.',
      },
      { type: 'h2', text: '3. Product information and prices' },
      {
        type: 'p',
        text: 'Product information and images are prepared carefully to present the product accurately; product images may be illustrative. All prices include VAT. In case of an obvious typing or system error in prices, we reserve the right to cancel the order after informing you and to refund your payment in full.',
      },
      { type: 'h2', text: '4. Intellectual property' },
      {
        type: 'p',
        text: 'The VELMO name and logo, and the design, text, images and other content on the Site, belong to VELMO or its licensors. They may not be copied, reproduced or used commercially without permission.',
      },
      { type: 'h2', text: '5. Links' },
      {
        type: 'p',
        text: 'The Site may contain links to third-party sites. VELMO is not responsible for their content or privacy practices.',
      },
      { type: 'h2', text: '6. Liability' },
      {
        type: 'p',
        text: 'VELMO takes due care for the Site to work without interruption or error. Your rights under consumer law are always reserved.',
      },
      { type: 'h2', text: '7. Changes' },
      {
        type: 'p',
        text: 'VELMO may update these terms. The current terms apply from the date they are published on the Site; orders already placed are subject to the terms in force on the order date.',
      },
      { type: 'h2', text: '8. Governing law' },
      {
        type: 'p',
        text: 'These terms are governed by the laws of the Republic of Türkiye. Consumer Arbitration Committees and Consumer Courts have jurisdiction over consumer disputes.',
      },
      { type: 'h2', text: '9. Contact' },
      { type: 'p', text: `${C.legalName} · ${C.address} · ${C.email} · ${C.phone}` },
    ],
  }
}

export const enDocs: DocSet = {
  'kvkk-aydinlatma-metni': kvkk,
  'gizlilik-politikasi': privacy,
  'cerez-politikasi': cookies,
  'mesafeli-satis-sozlesmesi': distanceSales,
  'on-bilgilendirme-formu': preInformation,
  'iptal-ve-iade': returns,
  'teslimat-ve-kargo': shipping,
  'kullanim-kosullari': terms,
}
