/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#e9f5ff",
          100: "#d3ebff",
          500: "#2d7ff9",
          600: "#1f63d6",
          900: "#102a43"
        }
      }
    }
  },
  plugins: []
};
