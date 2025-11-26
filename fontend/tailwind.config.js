/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {colors: {
       'dark-cyan': {
          100: '#121c1c',
          200: '#243838',
          300: '#365454',
          400: '#487070',
          500: '#588b8b',
          600: '#76a7a7',
          700: '#98bdbd',
          800: '#bbd3d3',
          900: '#dde9e9',
          DEFAULT: '#588b8b'
        },
        'white': {
          100: '#333333',
          200: '#666666',
          300: '#999999',
          400: '#cccccc',
          500: '#ffffff',
          600: '#ffffff',
          700: '#ffffff',
          800: '#ffffff',
          900: '#ffffff',
          DEFAULT: '#ffffff'
        },
        'apricot': {
          100: '#5a1c00',
          200: '#b43900',
          300: '#ff5b0e',
          400: '#ff9868',
          500: '#ffd5c2',
          600: '#ffdece',
          700: '#ffe6da',
          800: '#ffeee7',
          900: '#fff7f3',
          DEFAULT: '#ffd5c2'
        },
        'tangerine': {
          100: '#391c04',
          200: '#713907',
          300: '#aa550b',
          400: '#e2710e',
          500: '#f28f3b',
          600: '#f5a662',
          700: '#f7bd89',
          800: '#fad3b0',
          900: '#fce9d8',
          DEFAULT: '#f28f3b'
        },
        'jasper': {
          100: '#29100b',
          200: '#512117',
          300: '#7a3122',
          400: '#a2412e',
          500: '#c8553d',
          600: '#d37663',
          700: '#de988a',
          800: '#e9bab1',
          900: '#f4ddd8',
          DEFAULT: '#c8553d'
        }
      }
    },
  },
  plugins: [
    require('daisyui'),
  ],
}