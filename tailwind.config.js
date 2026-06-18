/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        vintage: {
          bg: '#2C1810',
          card: '#F4E4C1',
          accent: '#8B1A2B',
          gold: '#C9A96E',
          ink: '#1A1A1A',
          paper: '#E8D5B7',
        },
      },
      fontFamily: {
        heading: ['"Playfair Display"', 'serif'],
        body: ['"Noto Serif SC"', 'serif'],
        script: ['Caveat', 'cursive'],
      },
    },
  },
  plugins: [],
}
