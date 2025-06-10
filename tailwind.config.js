module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    extend: {
      colors: {
        gwentBoard: '#2c2c2c',
        gwentAccent: '#e1b873',
        gwentCardBack: '#1f1f1f'
      },
      keyframes: {
        pulseGlow: {
          '0%': { boxShadow: '0 0 0px rgba(225, 184, 115, 0.5)' },
          '50%': { boxShadow: '0 0 15px rgba(225, 184, 115, 1)' },
          '100%': { boxShadow: '0 0 0px rgba(225, 184, 115, 0.5)' }
        },
        cardEntrance: {
          '0%': { transform: 'translateY(200px) rotate(20deg)', opacity: '0' },
          '100%': { transform: 'translateY(0) rotate(0deg)', opacity: '1' }
        },
        twinkling: {
          '0%, 100%': { opacity: '0.2' },
          '50%': { opacity: '1' }
        }
      },
      animation: {
        pulseGlow: 'pulseGlow 2s infinite ease-in-out',
        cardEntrance: 'cardEntrance 0.5s ease-out',
        twinkling: 'twinkling 2s linear infinite'
      }
    }
  },
  plugins: [],
};