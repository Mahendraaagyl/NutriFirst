/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        'nutri-bg': '#1B2230',
        'nutri-card': '#252C3A',
        'nutri-darker': '#141A26',
        'tosca': {
          DEFAULT: '#5EEAD4',
          light: '#7FF5DE',
          dark: '#14B8A6',
          deeper: '#0F766E',
        },
      },
      boxShadow: {
        'glow': '0 0 24px rgba(94, 234, 212, 0.45)',
        'glow-sm': '0 0 12px rgba(94, 234, 212, 0.3)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};