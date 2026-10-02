export type Block =
  | { type: 'h2'; text: string }
  | { type: 'h3'; text: string }
  | { type: 'p'; text: string }
  | { type: 'ul'; items: string[] }
  | { type: 'ol'; items: string[] }
  | { type: 'table'; head?: string[]; rows: string[][] }

export type LegalDoc = {
  title: string
  /** Short, plain-language summary shown above the full text. */
  summary?: string[]
  blocks: Block[]
}

/**
 * Order details poured into the Distance Sales Agreement and the
 * Pre-Information Form at checkout. Without it the documents show
 * [placeholders] for the buyer and the order.
 */
export type OrderContext = {
  buyer: { name: string; email: string; phone: string }
  deliveryAddress: string
  invoice: string
  items: { name: string; qty: number; unitPrice: string; total: string }[]
  subtotal: string
  shipping: string
  total: string
  paymentMethod: string
  date: string
}
