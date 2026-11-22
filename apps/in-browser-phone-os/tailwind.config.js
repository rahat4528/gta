/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"SF Pro Display"',
          '"SF Pro Text"',
          '"Segoe UI"',
          'Roboto',
          'Helvetica',
          'Arial',
          'sans-serif',
        ],
        mono: ['"SF Mono"', 'ui-monospace', 'monospace'],
      },
      colors: {
        ios: {
          blue: '#007AFF',
          green: '#34C759',
          indigo: '#5856D6',
          orange: '#FF9500',
          pink: '#FF2D55',
          purple: '#AF52DE',
          red: '#FF3B30',
          teal: '#5AC8FA',
          yellow: '#FFCC00',
          gray: {
            1: '#8E8E93',
            2: '#AEAEB2',
            3: '#C7C7CC',
            4: '#D1D1D6',
            5: '#E5E5EA',
            6: '#F2F2F7',
          },
          dark: {
            1: '#1C1C1E',
            2: '#2C2C2E',
            3: '#3A3A3C',
            4: '#48484A',
            5: '#636366',
            6: '#8E8E93',
          },
        },
      },
      boxShadow: {
        phone: '0 50px 100px -20px rgba(0, 0, 0, 0.45), 0 30px 60px -30px rgba(0, 0, 0, 0.6), inset 0 0 4px 2px rgba(255, 255, 255, 0.2)',
        app: '0 8px 24px -4px rgba(0, 0, 0, 0.25)',
        dock: '0 10px 30px -5px rgba(0, 0, 0, 0.3)',
        control: '0 4px 20px rgba(0, 0, 0, 0.2)',
      },
      borderRadius: {
        phone: '54px',
        screen: '46px',
        app: '22px',
        card: '18px',
      },
      backdropBlur: {
        ios: '30px',
      },
    },
  },
  plugins: [],
};
