/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './data/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: '1.25rem', sm: '2rem', lg: '3rem', xl: '4rem' },
      screens: { '2xl': '1360px' },
    },
    extend: {
      colors: {
        // Ink/paper: the neutral ground the catalog sits on. Bright white,
        // near-black text — a catalog is read, not stared into.
        paper: {
          DEFAULT: '#FFFFFF',
          raised: '#F7F7FA',
        },
        ink: {
          DEFAULT: '#12131A',
          soft: '#4B4C58',
          mute: '#84858F',
        },
        // The two card platforms get their own colors, matching the actual
        // card designs: Google's blue, Instagram's magenta. Gold is the
        // shared accent (the stars on every card).
        royal: {
          DEFAULT: '#2B3E8C',
          dim: '#22316E',
          50: '#EBEEFA',
        },
        magenta: {
          DEFAULT: '#E8306B',
          dim: '#C41F55',
          50: '#FDE9F0',
        },
        gold: {
          DEFAULT: '#F2B705',
          dim: '#D19E00',
          50: '#FEF6DC',
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        sans: ['var(--font-sans)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        card: '1.25rem',
      },
      boxShadow: {
        card: '0 30px 60px -30px rgba(18,19,26,0.25)',
        lift: '0 40px 80px -32px rgba(0,0,0,0.35)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.7s cubic-bezier(0.16,1,0.3,1) both',
      },
    },
  },
  plugins: [],
}
