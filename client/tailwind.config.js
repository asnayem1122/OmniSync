/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: '#070C18',
          slate: '#0B132B',
          surface: '#111C3A',
          glass: 'rgba(255, 255, 255, 0.05)',
          emerald: '#10B981',
          teal: '#14B8A6',
          cyan: '#06B6D4',
        },
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2.5s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 15px rgba(16, 185, 129, 0.3)' },
          '100%': { boxShadow: '0 0 30px rgba(20, 184, 166, 0.7)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};
