import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        crew: {
          bg: '#0f1117',
          sidebar: '#141721',
          panel: '#1a1e2b',
          surface: '#222838',
          border: '#2a3147',
          accent: '#6366f1',
          hover: '#2e354a',
        },
      },
    },
  },
  plugins: [],
};

export default config;
