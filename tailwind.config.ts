import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#142B49',
          light: '#203B5C',
          dark: '#0E2238',
          50: '#f0f4f8',
          100: '#dae0ea',
          200: '#b5c1d5',
          300: '#90a3c0',
          400: '#6b85ab',
          500: '#466796',
          600: '#354f7a',
          700: '#2a3d5f',
          800: '#1e2c47',
          900: '#142B49',
        },
        gold: {
          DEFAULT: '#C6A36A',
          light: '#D4B87E',
          dark: '#B08F5A',
          50: '#faf6ef',
          100: '#f3e9d6',
          200: '#e7d3ad',
          300: '#dbbd84',
          400: '#C6A36A',
          500: '#b08f5a',
          600: '#9c7d4f',
          700: '#7d643f',
          800: '#5e4b2f',
          900: '#3f321f',
        },
        beige: '#F7F4EF',
        cream: '#FAF8F4',
        secondary: '#687487',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        script: ['var(--font-script)', 'cursive'],
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'slide-up': 'slideUp 0.6s ease-out forwards',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      boxShadow: {
        'card': '0 2px 8px rgba(20, 43, 73, 0.06)',
        'card-hover': '0 12px 32px rgba(20, 43, 73, 0.12)',
        'nav': '0 1px 0 rgba(20, 43, 73, 0.06)',
      },
    },
  },
  plugins: [],
};

export default config;
