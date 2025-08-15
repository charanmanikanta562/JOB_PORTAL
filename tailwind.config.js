/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'media',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary-blue': '#3B82F6',
        'action-green': '#10B981',
        'alert-red': '#EF4444',
        'secondary-gray': '#6B7280',
      },
    },
  },
  plugins: [],
};