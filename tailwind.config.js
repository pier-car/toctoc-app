/**
 * tailwind.config.js
 *
 * Tailwind CSS configuration for NativeWind.
 * Points the content scanner at every JS source file so that
 * utility classes are not purged in production builds.
 */
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './App.{js,jsx,ts,tsx}',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: '#6C63FF',
      },
    },
  },
  plugins: [],
};
