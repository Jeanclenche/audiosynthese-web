/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        navy: '#0f1e41',
        gold: '#a87e45',
        'gold-light': '#c4a06a',
        'gold-dark': '#8f6637',
        charcoal: '#111',
        smoke: '#1a1a1a',
        pearl: '#fafafa',
        cream: '#f8f4ed',
        'cream-light': '#fdfbf7',
        'cream-dark': '#efe9df',
      },
      fontFamily: {
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
        display: ['"Playfair Display"', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
}
