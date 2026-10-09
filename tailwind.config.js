/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#F0F4F8',
          100: '#D9E2EC',
          200: '#BCCCDC',
          300: '#9FB3C8',
          400: '#829AB1',
          500: '#627D98',
          600: '#486581',
          700: '#334E68',
          800: '#102A43',
          900: '#0A192F',
          950: '#060F1D',
        },
        gold: {
          50: '#FAF8F0',
          100: '#F5EED6',
          200: '#EBDCB0',
          300: '#E0CA86',
          400: '#D4AF37',
          500: '#C59B27',
          600: '#A9801A',
          700: '#876313',
          800: '#66490E',
          900: '#4A3309',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
