/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#f5f5f5",
        foreground: "#1a1a1a",
        accent: "#009933",
        secondary: "#b3b3b3",
        muted: "#a8c686",
        highlight: "#f4a261",
      },
    },
  },
  plugins: [],
};
