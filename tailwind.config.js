/** @type {import('tailwindcss').Config} */

const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    fontFamily: {
      sans: ['RIDIBatang', ...defaultTheme.fontFamily.sans],
    },
    extend: {},
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
