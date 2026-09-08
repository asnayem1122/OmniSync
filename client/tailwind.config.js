/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}', './client/src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: 'hsl(var(--background) / <alpha-value>)',
        foreground: 'hsl(var(--foreground) / <alpha-value>)',
        primary: {
          DEFAULT: 'hsl(var(--primary) / <alpha-value>)',
          foreground: 'hsl(var(--primary-foreground) / <alpha-value>)',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted) / <alpha-value>)',
          foreground: 'hsl(var(--muted-foreground) / <alpha-value>)',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent) / <alpha-value>)',
          foreground: 'hsl(var(--accent-foreground) / <alpha-value>)',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive) / <alpha-value>)',
          foreground: 'hsl(var(--destructive-foreground) / <alpha-value>)',
        },
        border: 'hsl(var(--border) / <alpha-value>)',
        input: 'hsl(var(--input) / <alpha-value>)',
        ring: 'hsl(var(--ring) / <alpha-value>)',
        brand: {
          dark: '#070C18',
          slate: '#0B132B',
          surface: '#111C3A',
          glass: 'rgba(255, 255, 255, 0.05)',
          emerald: '#10B981',
          teal: '#14B8A6',
          cyan: '#06B6D4',
          canvas: '#F4F7FC',
          lightGlass: 'rgba(255, 255, 255, 0.75)',
          lightBorder: 'rgba(255, 255, 255, 0.85)',
          forest: '#1E3A2B',
          forestDark: '#13261C',
          forestHover: '#284C38',
          forestLight: '#EEF5F0',
          forestBorder: '#CFE0D5',
          softBg: '#F8FAFC',
          cardBorder: '#E2E8F0',
        },
      },
      boxShadow: {
        'contractor-pill': '0 4px 14px -1px rgba(30, 58, 43, 0.18)',
        'clean-card': '0 8px 30px -4px rgba(15, 23, 42, 0.05), 0 0 0 1px rgba(226, 232, 240, 0.8)',
        'hero-card': '0 20px 40px -10px rgba(15, 23, 42, 0.08), 0 0 0 1px rgba(226, 232, 240, 0.9)',
        'spatial-sm': '0 4px 20px -2px rgba(15, 23, 42, 0.05), 0 0 0 1px rgba(255, 255, 255, 0.8)',
        'spatial-md': '0 12px 36px -4px rgba(15, 23, 42, 0.08), 0 0 0 1px rgba(255, 255, 255, 0.9), inset 0 1px 1px rgba(255, 255, 255, 0.9)',
        'spatial-lg': '0 25px 60px -12px rgba(15, 23, 42, 0.12), 0 0 0 1px rgba(255, 255, 255, 0.9), inset 0 1px 2px rgba(255, 255, 255, 1)',
        'spatial-glow': '0 0 35px -5px rgba(16, 185, 129, 0.22), 0 12px 36px -4px rgba(15, 23, 42, 0.08)',
        'spatial-pill': '0 6px 20px -2px rgba(15, 23, 42, 0.07), inset 0 1px 1px rgba(255, 255, 255, 0.9)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2.5s ease-in-out infinite alternate',
        'float': 'float 7s ease-in-out infinite',
        marquee: 'marquee var(--duration, 40s) linear infinite',
        'marquee-vertical': 'marquee-vertical var(--duration, 40s) linear infinite',
      },
      keyframes: {
        marquee: {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(calc(-100% - var(--gap, 1rem)))' },
        },
        'marquee-vertical': {
          from: { transform: 'translateY(0)' },
          to: { transform: 'translateY(calc(-100% - var(--gap, 1rem)))' },
        },
        glow: {
          '0%': { boxShadow: '0 0 15px rgba(16, 185, 129, 0.3)' },
          '100%': { boxShadow: '0 0 30px rgba(20, 184, 166, 0.7)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      },
      backdropBlur: {
        xs: '2px',
        '2xl': '24px',
        '3xl': '40px',
      },
    },
  },
  plugins: [],
};
