/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        coral: {
          50: '#fff5f5',
          100: '#ffe3e3',
          200: '#ffcccc',
          300: '#ffa3a3',
          400: '#ff8080',
          500: '#FF6B6B',
          600: '#ff4d4d',
          700: '#e63946',
          800: '#cc2936',
          900: '#a61e28',
        },
        teal: {
          50: '#f0fdfd',
          100: '#ccfbf9',
          200: '#99f6f4',
          300: '#5eecea',
          400: '#2dd4d4',
          500: '#00A6A6',
          600: '#008585',
          700: '#006a6a',
          800: '#005454',
          900: '#004545',
        },
        gold: {
          50: '#fdfcf7',
          100: '#faf6e8',
          200: '#f4ebc5',
          300: '#ead98f',
          400: '#D4AF37',
          500: '#c29d2e',
          600: '#a88126',
          700: '#8a6720',
          800: '#73531f',
          900: '#62451d',
        },
      },
    },
  },
  plugins: [],
};
