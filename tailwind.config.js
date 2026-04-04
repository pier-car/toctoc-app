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
    './App.js',
    './src/**/*.js',
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
