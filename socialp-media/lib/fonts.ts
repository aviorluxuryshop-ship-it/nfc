import { Archivo, Instrument_Serif } from 'next/font/google'

// Archivo carries everything: its width axis lets the small uppercase labels
// run wide like the brand's thin, extended wordmark, while headlines stay at
// normal width. Instrument Serif italic is the one expressive accent.
const archivo = Archivo({
  subsets: ['latin', 'latin-ext'],
  axes: ['wdth'],
  variable: '--font-archivo',
  display: 'swap',
})

const instrument = Instrument_Serif({
  subsets: ['latin', 'latin-ext'],
  weight: '400',
  // Only the italic is used (.serif-accent); the upright cut isn't loaded.
  style: 'italic',
  variable: '--font-instrument',
  display: 'swap',
})

export const fontVariables = `${archivo.variable} ${instrument.variable}`
