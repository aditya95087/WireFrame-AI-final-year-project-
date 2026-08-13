/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#07070A',
        accent: '#2A0F3A',
        highlight: '#8A2BE2',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['Poppins', 'sans-serif'],
      },
      keyframes: {
        shine: {
          '100%': { left: '125%' },
        },
      },
      animation: {
        shine: 'shine 1.5s infinite',
      },
    },
  },
  plugins: [],
}
