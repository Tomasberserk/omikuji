/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        vermilion: { DEFAULT: '#D63A2A', dark: '#9E2318', deep: '#7C1A11', soft: '#F4C9BF' },
        parchment: { DEFAULT: '#FBF1DA', deep: '#F0DFB8', shade: '#E4CFA4' },
        gold: { DEFAULT: '#C79B3B', light: '#E8CB84', dark: '#9A7325' },
        ink: '#2A1A15',
      },
      fontFamily: {
        display: ['"Shippori Mincho"', '"Yu Mincho"', '"Hiragino Mincho ProN"', 'Georgia', 'serif'],
        body: ['"Noto Sans"', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
      },
      keyframes: {
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        shake: {
          '0%, 100%': { transform: 'translate3d(0,0,0) rotate(0deg)' },
          '12%': { transform: 'translate3d(-9px,0,0) rotate(-7deg)' },
          '26%': { transform: 'translate3d(9px,0,0) rotate(6.5deg)' },
          '40%': { transform: 'translate3d(-8px,0,0) rotate(-5.5deg)' },
          '54%': { transform: 'translate3d(8px,0,0) rotate(5deg)' },
          '68%': { transform: 'translate3d(-5px,0,0) rotate(-3deg)' },
          '82%': { transform: 'translate3d(4px,0,0) rotate(2deg)' },
        },
        stick: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-16px)' },
        },
        sparkle: {
          '0%': { opacity: '0', transform: 'translateY(10px) scale(0.4)' },
          '35%': { opacity: '1' },
          '100%': { opacity: '0', transform: 'translateY(-52px) scale(1.1)' },
        },
        breathe: {
          '0%, 100%': { transform: 'scale(1)', boxShadow: '0 12px 30px -8px rgba(158,35,24,0.55)' },
          '50%': { transform: 'scale(1.04)', boxShadow: '0 20px 42px -8px rgba(158,35,24,0.68)' },
        },
        drift: {
          '0%': { transform: 'translate3d(0,-12vh,0) rotate(0deg)', opacity: '0' },
          '12%': { opacity: '0.85' },
          '85%': { opacity: '0.7' },
          '100%': { transform: 'translate3d(34px,108vh,0) rotate(320deg)', opacity: '0' },
        },
        pop: {
          '0%': { opacity: '0', transform: 'scale(0.55) rotate(-10deg)' },
          '65%': { opacity: '1', transform: 'scale(1.08) rotate(3deg)' },
          '100%': { opacity: '1', transform: 'scale(1) rotate(0deg)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 420ms ease-out both',
        shake: 'shake 0.48s ease-in-out infinite',
        stick: 'stick 0.32s ease-in-out infinite',
        sparkle: 'sparkle 1.15s ease-out infinite',
        breathe: 'breathe 2.6s ease-in-out infinite',
        drift: 'drift 14s linear infinite',
        pop: 'pop 0.65s cubic-bezier(0.34,1.56,0.64,1) both',
      },
    },
  },
  plugins: [],
}
