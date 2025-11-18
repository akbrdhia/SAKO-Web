/* eslint-env node */
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        'kop-bg': '#F6F6F2',
        // brand palette
        'brand-yellow': '#eba51a',
        'brand-green': '#a3ba0f',
        'brand-teal': '#005266',
        'brand-black': '#1E1E1E',
        // white already exists but explicit alias helps readability
        'brand-white': '#ffffff',
      },
    },
  },
  plugins: [],
};
