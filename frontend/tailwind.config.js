/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Poppins", "sans-serif"],
      },
      colors: {
        primary: "#ffff",
        secondary: "#011f4b",
        inactive :"#D8D8D8",
        accent: "#f58020",
        base: "#F0F6FF",
        blue: {
          200: "#B3CDE0",
        },
        slate: {
          400: "#6497B1",
        },
        amber: {
          200: "#FBE47E",
          400: "#FFC837",
        },
      },
    },
  },
  plugins: [],
}


