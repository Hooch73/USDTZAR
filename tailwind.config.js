/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0f1419',
        surface: '#16181d',
        'card-bg': 'rgba(255, 255, 255, 0.03)',
        'card-border': 'rgba(255, 255, 255, 0.1)',
        primary: '#3b82f6',
        success: '#10b981',
        warning: '#f59e0b',
        danger: '#ef4444',
        neutral: '#6b7280',
        'content-primary': '#ffffff',
        'content-secondary': '#9ca3af',
        'content-muted': '#6b7280',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        card: '0 4px 6px -1px rgb(0 0 0 / 0.3)',
        'card-hover': '0 10px 15px -3px rgb(0 0 0 / 0.4)',
        'glow-green': '0 0 20px rgba(16, 185, 129, 0.3)',
        'glow-yellow': '0 0 20px rgba(245, 158, 11, 0.3)',
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'flash-green': 'flashGreen 0.6s ease-in-out',
        'flash-red': 'flashRed 0.6s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        flashGreen: {
          '0%, 100%': { backgroundColor: 'transparent' },
          '50%': { backgroundColor: 'rgba(16, 185, 129, 0.2)' },
        },
        flashRed: {
          '0%, 100%': { backgroundColor: 'transparent' },
          '50%': { backgroundColor: 'rgba(239, 68, 68, 0.2)' },
        },
      },
    },
  },
  plugins: [],
}
