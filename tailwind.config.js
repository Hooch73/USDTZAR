/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#101014',
        'surface-0': '#1A1A20',
        'surface-1': '#24242C',
        primary: '#7B61FF',
        'primary-hover': '#6A52E0',
        'text-primary': '#F5F5F7',
        'text-secondary': '#A0A0B0',
      },
    },
  },
  plugins: [],
}
