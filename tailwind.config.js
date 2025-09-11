/** @type {import('tailwindcss').Config} */
import { themeColors } from "./app/lib/theme";

const config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: themeColors,
      fontFamily: {
        sans: [
          "effra-cc",
          "Helvetica Neue",
          "Helvetica",
          "Arial",
          "sans-serif",
        ],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      containers: {
        "6xs": "6rem",
        "5xs": "8rem",
        "4xs": "10rem",
        "3xs": "12rem",
        "2xs": "14rem",
        "260px": "260px",
      },
      gridTemplateColumns: {
        14: "repeat(14, minmax(0, 1fr))",
        16: "repeat(16, minmax(0, 1fr))",
        18: "repeat(18, minmax(0, 1fr))",
        20: "repeat(20, minmax(0, 1fr))",
        24: "repeat(24, minmax(0, 1fr))",
      },
      screens: {
        "3xl": "2000px",
        xs: "350px",
      },
    },
  },
  darkMode: "class",
  plugins: [
    require("@tailwindcss/container-queries", "@tailwindcss/line-clamp"),
  ],
  corePlugins: {
    userSelect: true,
  },
};

export default config;
