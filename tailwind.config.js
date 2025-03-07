/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class', // Включаем поддержку темной темы через класс 'dark'
  theme: {
    extend: {
      colors: {
        accent: "#A855F7", // Акцентный цвет
      },
    },
  },
  plugins: [],
} 