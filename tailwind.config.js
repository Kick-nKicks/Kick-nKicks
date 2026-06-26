/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#E63946',
          dark: '#C1121F',
          light: '#FF6B6B',
        },
        cream: '#FFFDF5',
        pastel: {
          rose: '#E8C4C4',
          blush: '#D4939A',
          sand: '#E8DFC8',
          lavender: '#C4B8D9',
          seafoam: '#A8D4CF',
          sage: '#B5C9B0',
        },
      },
    },
  },
  plugins: [],
};
