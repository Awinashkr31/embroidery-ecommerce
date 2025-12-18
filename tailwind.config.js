/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#881337', // Rose 900
          light: '#be123c',   // Rose 700
        },
        secondary: {
          DEFAULT: '#fdfbf7', // Warm Paper
          dark: '#f5f5f4',    // Stone 100
        },
        accent: {
          DEFAULT: '#b45309', // Amber 700
          light: '#d97706',   // Amber 600
        },
        'deep-rose': '#881337', // Legacy support / Brand color
        'rose-gold': '#b45309', // Mapped to accent for now
        'sage': '#57534e',      // Mapped to stone-600 for a more neutral sage/earthy tone
        'warm-beige': '#fdfbf7',
      },
      fontFamily: {
        heading: ['"Playfair Display"', 'serif'],
        body: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
