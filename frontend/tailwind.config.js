/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Space Grotesk', 'sans-serif'],
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'gradient': 'gradient 6s ease infinite',
      },
      keyframes: {
        gradient: {
          '0%': { 'background-position': '0% 50%' },
          '25%': { 'background-position': '100% 50%' },
          '50%': { 'background-position': '50% 100%' },
          '75%': { 'background-position': '0% 50%' },
          '100%': { 'background-position': '0% 50%' },
        }
      }
    },
  },
  plugins: [],
}