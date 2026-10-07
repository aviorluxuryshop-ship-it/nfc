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
      padding: { DEFAULT: '1.25rem', sm: '2rem', lg: '3rem', xl: '4rem' },
      screens: { '2xl': '1360px' },
    },
    extend: {
      colors: {
        // Beyaz zemin, kırmızı vurgu.
        paper: { DEFAULT: '#FFFFFF', raised: '#FAF7F5' },
        ink: { DEFAULT: '#1A1414', soft: '#5B5050', mute: '#8C8181' },
        marmara: { DEFAULT: '#B5121B', dim: '#8E0E15', 50: '#FDF2F2', 100: '#FBE3E3' },
      },
      fontFamily: {
        display: ['var(--font-display)', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 24px 50px -24px rgba(26,20,20,0.28)',
        soft: '0 8px 30px -18px rgba(26,20,20,0.25)',
        lift: '0 40px 80px -32px rgba(0,0,0,0.35)',
      },
      keyframes: {
        'fade-up': { '0%': { opacity: '0', transform: 'translateY(18px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        'slide-in': { '0%': { transform: 'translateX(100%)' }, '100%': { transform: 'translateX(0)' } },
        'fade-in': { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
      },
      animation: {
        'fade-up': 'fade-up 0.8s cubic-bezier(0.16,1,0.3,1) both',
        'slide-in': 'slide-in 0.35s cubic-bezier(0.16,1,0.3,1) both',
        'fade-in': 'fade-in 0.25s ease-out both',
      },
    },
  },
  plugins: [],
}
