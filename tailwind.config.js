/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      keyframes: {
        'scale-in-pop': {
          '0%': {
              opacity: '0',
              transform: 'scale(0.95)'
          },
          '100%': {
              opacity: '1',
              transform: 'scale(1)'
          },
        },
        'glow': {
          '0%, 100%': { 
            boxShadow: '0 0 5px rgba(251, 191, 36, 0.4), 0 0 10px rgba(251, 191, 36, 0.3)',
          },
          '50%': { 
            boxShadow: '0 0 15px rgba(251, 191, 36, 0.6), 0 0 20px rgba(251, 191, 36, 0.4)',
          },
        }
      },
      animation: {
        'scale-in-pop': 'scale-in-pop 0.3s ease-out forwards',
        'glow': 'glow 2.5s ease-in-out infinite alternate',
      }
    }
  },
  plugins: [],
}