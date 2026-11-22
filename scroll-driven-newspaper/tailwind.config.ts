import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        paper: {
          50: '#fdfbf7',
          100: '#f9f5ec',
          200: '#f0e9d8',
          300: '#e4d8be',
          400: '#c8b693',
          800: '#2c251d',
          900: '#1c1611',
          950: '#0e0b08',
        },
        ink: {
          900: '#111111',
          800: '#1f1f1f',
          700: '#2d2d2d',
          600: '#4b4b4b',
          500: '#6b6b6b',
        },
        crime: {
          red: '#c0262d',
          darkRed: '#8b0000',
        },
        accent: {
          gold: '#c29b38',
          sepia: '#704214',
          cyan: '#0ea5e9',
        }
      },
      fontFamily: {
        serif: ['Georgia', 'Cambria', '"Times New Roman"', 'Times', 'serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"Courier New"', 'Courier', 'monospace'],
        headline: ['"Playfair Display"', 'Georgia', 'serif'],
      },
      boxShadow: {
        'newsprint': '2px 2px 0px rgba(0,0,0,0.85)',
        'newsprint-lg': '4px 4px 0px rgba(0,0,0,0.9)',
      }
    },
  },
  plugins: [],
};

export default config;
