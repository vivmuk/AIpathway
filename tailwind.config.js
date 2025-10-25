/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fff5ed',
          100: '#ffe7d1',
          200: '#ffcca3',
          300: '#ffa66a',
          400: '#ff7a2f',
          500: '#F75C03',
          600: '#e84800',
          700: '#c03a00',
          800: '#9a2f08',
          900: '#7c2809',
        },
        rose: {
          50: '#fdf2f7',
          100: '#fce7f0',
          200: '#fbd0e3',
          300: '#f8a8cb',
          400: '#f372a7',
          500: '#D90368',
          600: '#c5025e',
          700: '#a5024f',
          800: '#890343',
          900: '#73053a',
        },
        byzantium: {
          50: '#f7f0f7',
          100: '#ebe0eb',
          200: '#d4bfd4',
          300: '#b595b5',
          400: '#95698f',
          500: '#820263',
          600: '#700155',
          700: '#5e0147',
          800: '#4e013c',
          900: '#420234',
        },
        jade: {
          50: '#ecfdf7',
          100: '#d1fae9',
          200: '#a7f3d7',
          300: '#6ee7bf',
          400: '#34d39e',
          500: '#04A777',
          600: '#049669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
        },
        dark: {
          50: '#f7f7f7',
          100: '#e3e3e3',
          200: '#c8c8c8',
          300: '#a4a4a4',
          400: '#717171',
          500: '#4a4a4a',
          600: '#383838',
          700: '#291720',
          800: '#1f111a',
          900: '#180d14',
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in',
        'slide-up': 'slideUp 0.5s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}

