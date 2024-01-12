/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      scale: {
        '200': '2'},
      keyframes: {
        moveNeonLight: {
          '0%, 100%': { transform: 'translateX(0%) translateY(0%)' },
          '25%': { transform: 'translateX(100%) translateY(0%)' },
          '50%': { transform: 'translateX(100%) translateY(100%)' },
          '75%': { transform: 'translateX(0%) translateY(100%)' },
        }
      },
      animation: {
        'neon-light': 'moveNeonLight 6s linear infinite',
      },
    },
  },
  plugins: [],
  darkMode: 'class',
}
