export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  darkMode: false,  // Disable dark mode completely
  theme: {
    extend: {
      colors: {
        brand: {
          light: "#bae6fd", 
          DEFAULT: "#0ea5e9",
          dark: "#0369a1", 
        },
      },
    },
  },
  plugins: [],
}