import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#D4A843',
          dark: '#B08D35',
          subtle: 'rgba(212, 168, 67, 0.08)',
        },
        surface: {
          DEFAULT: '#0C0C0C',
          card: '#151515',
          elevated: '#1C1C1C',
          border: '#2A2A2A',
        },
        text: {
          primary: '#E8E4DD',
          secondary: '#9B9389',
          muted: '#5C5850',
        },
        error: '#C44B4F',
        success: '#4A8C5C',
      },
      fontFamily: {
        display: ['Cormorant', 'serif'],
        body: ['Jost', 'sans-serif'],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
    },
  },
  plugins: [],
};

export default config;
