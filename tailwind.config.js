/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        carrot: {
          50:  '#FFF5EE',
          100: '#FFE8D5',
          200: '#FFD0AB',
          300: '#FFB07E',
          400: '#FF9E67',
          500: '#FF7E36',
          600: '#FA6616',
        },
      },
      fontFamily: {
        sans: [
          '-apple-system', 'BlinkMacSystemFont',
          '"Apple SD Gothic Neo"', '"Noto Sans KR"', 'sans-serif',
        ],
      },
    },
  },
  plugins: [],
}
