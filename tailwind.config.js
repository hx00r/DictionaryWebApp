/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "main-dark": "#0F0E14",
        secondary: "#1F1F1F",
      },
    },
  },
  plugins: [],
};
