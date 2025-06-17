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
        'neon-blue': '#2bd2ff',
        'neon-green': '#2bff88',
        'alert-red': '#ff073a',
        'dark': '#0f0f0f',
        'darker': '#070707',
        'darkest': '#030303',
        'midnight': '#121212',
        'nuclear-green': '#39ff14',
      },
      boxShadow: {
        'neon': '0 0 8px rgba(255, 7, 58, 0.7), 0 0 16px rgba(255, 7, 58, 0.5), 0 0 24px rgba(255, 7, 58, 0.3)',
        'neon-orange': '0 0 8px rgba(255, 124, 10, 0.7), 0 0 16px rgba(255, 124, 10, 0.5), 0 0 24px rgba(255, 124, 10, 0.3)',
        'neon-yellow': '0 0 8px rgba(255, 253, 56, 0.7), 0 0 16px rgba(255, 253, 56, 0.5), 0 0 24px rgba(255, 253, 56, 0.3)',
        'neon-blue': '0 0 8px rgba(43, 210, 255, 0.7), 0 0 16px rgba(43, 210, 255, 0.5), 0 0 24px rgba(43, 210, 255, 0.3)',
        'neon-green': '0 0 8px rgba(43, 255, 136, 0.7), 0 0 16px rgba(43, 255, 136, 0.5), 0 0 24px rgba(43, 255, 136, 0.3)',
        'clock-glow': '0 0 15px rgba(255, 7, 58, 0.9), 0 0 30px rgba(255, 7, 58, 0.6), 0 0 45px rgba(255, 7, 58, 0.4)',
        'nuclear': '0 0 15px rgba(57, 255, 20, 0.7), 0 0 30px rgba(57, 255, 20, 0.5)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'pulse-fast': 'pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'pulse-alert': 'pulseAlert 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 3s linear infinite',
        'glow-pulse': 'glowPulse 4s ease-in-out infinite',
        'ticker': 'ticker 30s linear infinite',
        'ticker-fast': 'ticker 15s linear infinite',
        'fade-in': 'fadeIn 0.5s ease-in',
        'fade-out': 'fadeOut 0.3s ease-out',
        'bounce-subtle': 'bounceSubtle 2s infinite',
        'slide-up': 'slideUp 0.5s ease-out',
      },
      keyframes: {
        glowPulse: {
          '0%, 100%': { opacity: 1, textShadow: '0 0 10px rgba(255, 7, 58, 0.9), 0 0 20px rgba(255, 7, 58, 0.7)' },
          '50%': { opacity: 0.8, textShadow: '0 0 15px rgba(255, 7, 58, 1), 0 0 30px rgba(255, 7, 58, 0.9), 0 0 45px rgba(255, 7, 58, 0.7)' },
        },
        pulseAlert: {
          '0%, 100%': { opacity: 1, boxShadow: '0 0 10px rgba(255, 7, 58, 0.9), 0 0 20px rgba(255, 7, 58, 0.8)' },
          '50%': { opacity: 0.85, boxShadow: '0 0 15px rgba(255, 7, 58, 1), 0 0 30px rgba(255, 7, 58, 0.9)' },
        },
        ticker: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        fadeOut: {
          '0%': { opacity: 1 },
          '100%': { opacity: 0 },
        },
        bounceSubtle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'noise-pattern': "url('/assets/noise.png')",
        'grid-pattern': "url('/assets/grid.svg')",
      },
    },
  },
  plugins: [],
}
