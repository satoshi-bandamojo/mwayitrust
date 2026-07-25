export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#0d6efd',
          accent: '#14b8a6',
          background: '#ffffff',
          muted: '#F7F7F7',
          text: '#1f2937',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 8px 30px rgba(15, 23, 42, 0.08)',
      },
      borderRadius: {
        xl2: '1.25rem',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        fadeUp: 'fadeUp 0.5s ease-out',
      },
    },
  },
  plugins: [],
}