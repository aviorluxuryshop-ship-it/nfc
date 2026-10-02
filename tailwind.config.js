/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './data/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: '1.25rem', sm: '1.75rem', lg: '2.5rem' },
      screens: { '2xl': '1280px' },
    },
    extend: {
      colors: {
        // Navy is lifted straight from the VELMO wordmark — it carries all
        // text and every primary button, so the store reads as one voice.
        ink: {
          DEFAULT: '#16214A',
          soft: '#454E70',
          mute: '#767D97',
        },
        // Warm off-whites taken from the carton board, never pure grey.
        paper: {
          DEFAULT: '#FCFBF8',
          cream: '#F5F1E9',
          deep: '#ECE6DA',
        },
        line: {
          DEFAULT: '#E6E0D4',
          strong: '#D3CBBB',
        },
        // The leaf over the logo. Used for positive states (added, free
        // shipping reached) and the eco cues — not as a decoration colour.
        leaf: {
          DEFAULT: '#2E7A47',
          soft: '#E6F1E8',
        },
        // One family per scent. `soft` tints the product panels, `DEFAULT`
        // marks the scent name and swatch, `deep` is text on `soft`.
        lavanta: { soft: '#EEE8F6', DEFAULT: '#6E4FA8', deep: '#45306E' },
        bahar: { soft: '#E7F2EA', DEFAULT: '#3E8A60', deep: '#245338' },
        narenciye: { soft: '#FCEEDC', DEFAULT: '#D9701A', deep: '#87420A' },
        alert: { DEFAULT: '#B4232F', soft: '#FBEAEA' },
        notice: { DEFAULT: '#8A5A00', soft: '#FFF5DB' },
      },
      fontFamily: {
        display: ['var(--font-display)', 'ui-serif', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        // Body copy never drops below 16px — this store is for everyone,
        // not just people with perfect eyesight.
        base: ['1rem', { lineHeight: '1.65' }],
        lg: ['1.125rem', { lineHeight: '1.6' }],
      },
      borderRadius: {
        xl: '0.875rem',
        '2xl': '1.25rem',
        '3xl': '1.75rem',
      },
      boxShadow: {
        soft: '0 1px 2px rgba(22,33,74,0.04), 0 8px 24px -12px rgba(22,33,74,0.12)',
        lift: '0 2px 4px rgba(22,33,74,0.04), 0 24px 48px -20px rgba(22,33,74,0.22)',
        drawer: '-24px 0 64px -24px rgba(22,33,74,0.28)',
      },
      maxWidth: {
        prose: '68ch',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(14px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.6s cubic-bezier(0.16,1,0.3,1) both',
        'fade-in': 'fade-in 0.3s ease-out both',
      },
    },
  },
  plugins: [],
}
