/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'neon-red': '#ff073a',
        'neon-orange': '#ff7c0a',
        'neon-yellow': '#fffd38',
        'dark': '#0f0f0f',
        'darker': '#070707',
      },
      boxShadow: {
        'neon': '0 0 8px rgba(255, 7, 58, 0.7), 0 0 16px rgba(255, 7, 58, 0.5), 0 0 24px rgba(255, 7, 58, 0.3)',
        'neon-orange': '0 0 8px rgba(255, 124, 10, 0.7), 0 0 16px rgba(255, 124, 10, 0.5), 0 0 24px rgba(255, 124, 10, 0.3)',
        'neon-yellow': '0 0 8px rgba(255, 253, 56, 0.7), 0 0 16px rgba(255, 253, 56, 0.5), 0 0 24px rgba(255, 253, 56, 0.3)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}
