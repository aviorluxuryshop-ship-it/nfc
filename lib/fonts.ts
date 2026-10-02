import { Figtree, Fraunces } from 'next/font/google'

// Fraunces (with its soft axis turned up) for headings: a warm serif that
// makes the store feel considered without tipping into luxury. Figtree for
// everything you read or tap — big x-height, very legible at 16px.
const fraunces = Fraunces({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-display',
  axes: ['SOFT', 'WONK', 'opsz'],
  display: 'swap',
})
const figtree = Figtree({ subsets: ['latin', 'latin-ext'], variable: '--font-sans', display: 'swap' })

export const fontVariables = `${fraunces.variable} ${figtree.variable}`
