import { color } from "framer-motion";

export default {
  darkMode: "class", // ✅ THIS LINE FIXES EVERYTHING
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Montserrat", "ui-sans-serif", "system-ui"],
      },
      colors: {
        gold: "#c99947",
      }
    },
  },
  plugins: [],
};
