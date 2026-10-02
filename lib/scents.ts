import type { ScentSlug } from '@/data/products'

/**
 * Colour sets per scent. Tailwind classes are spelled out in full (not
 * built from strings) so the JIT compiler can see them. The hex values
 * drive the drawn pack shots and must stay in step with tailwind.config.
 */
export const scentTheme: Record<
  ScentSlug,
  {
    panel: string
    text: string
    deepText: string
    dot: string
    ring: string
    hex: { soft: string; main: string; deep: string }
    /** Ribbon colours on the box, bottom to top. */
    wave: string[]
    /** The "FOR COLOURED CLOTHES" pill. */
    pill: [string, string]
  }
> = {
  lavanta: {
    panel: 'bg-lavanta-soft',
    text: 'text-lavanta',
    deepText: 'text-lavanta-deep',
    dot: 'bg-lavanta',
    ring: 'ring-lavanta',
    hex: { soft: '#EEE8F6', main: '#6E4FA8', deep: '#45306E' },
    wave: ['#4E3587', '#8466C6', '#7FB2E5', '#9FD08E', '#F8DB76', '#F7AE62', '#F28BA8', '#E3B4E0'],
    pill: ['#B04FB4', '#F07A5A'],
  },
  bahar: {
    panel: 'bg-bahar-soft',
    text: 'text-bahar',
    deepText: 'text-bahar-deep',
    dot: 'bg-bahar',
    ring: 'ring-bahar',
    hex: { soft: '#E7F2EA', main: '#3E8A60', deep: '#245338' },
    wave: ['#25603F', '#4E9A6E', '#8BC3E8', '#BFE0A0', '#F8DB76', '#F7AE62', '#F28BA8', '#CDE8C4'],
    pill: ['#2F8A63', '#8CC26A'],
  },
  narenciye: {
    panel: 'bg-narenciye-soft',
    text: 'text-narenciye',
    deepText: 'text-narenciye-deep',
    dot: 'bg-narenciye',
    ring: 'ring-narenciye',
    hex: { soft: '#FCEEDC', main: '#D9701A', deep: '#87420A' },
    wave: ['#B24F0C', '#E9862A', '#7FB2E5', '#9FD08E', '#F8DB76', '#F7AE62', '#F28BA8', '#F8D2A8'],
    pill: ['#E2602B', '#F2A93B'],
  },
}
