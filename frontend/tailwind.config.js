/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#F4F7FE', // Light gray-blue background
        surface: '#FFFFFF',
        primary: '#7C3AED', // Violet 600
        primaryLight: '#8B5CF6', // Violet 500
        secondary: '#10B981', // Emerald 500 (Green)
        danger: '#EF4444', // Red 500
        textMain: '#1E293B', // Slate 800
        textMuted: '#64748B', // Slate 500
        borderLight: '#E2E8F0', // Slate 200
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
