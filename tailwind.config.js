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
      animation: {
        marquee: 'marquee 20s linear infinite',
        'fade-in-up': 'fadeInUp 0.3s ease-out forwards',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(5px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
