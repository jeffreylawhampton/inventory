/** @type {import('tailwindcss').Config} */
import { nextui } from "@nextui-org/react";

const config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["indivisible", "Georgia", "Arial", "sans-serif"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  darkMode: "class",
  plugins: [
    nextui({
      themes: {
        light: {
          layout: {},

          colors: {
            background: "#FFFFFF",
            foreground: "#11181C",
            primary: {
              foreground: "#FFFFFF",
              DEFAULT: "#397893",
              100: "#DBF8F9",
              200: "#B8EEF4",
              300: "#8CD1DE",
              400: "#66A9BE",
              500: "#397893",
              600: "#295F7E",
              700: "#1C4869",
              800: "#123355",
              900: "#0A2446",
            },
            success: {
              100: "#E7FBD4",
              200: "#CAF8AA",
              300: "#A0EA7B",
              400: "#78D557",
              500: "#43BA28",
              600: "#2B9F1D",
              700: "#188514",
              800: "#0C6B10",
              900: "#075911",
            },
            info: {
              100: "#CCF1FC",
              200: "#9BDFFA",
              300: "#67C3F2",
              400: "#41A5E6",
              500: "#0A7AD6",
              600: "#075EB8",
              700: "#05469A",
              800: "#03317C",
              900: "#012366",
            },
            warning: {
              100: "#FDEECD",
              200: "#FBD99C",
              300: "#F4BB6A",
              400: "#EA9D45",
              500: "#DD720D",
              600: "#BE5709",
              700: "#9F4006",
              800: "#802D04",
              900: "#6A1F02",
            },
            danger: {
              DEFAULT: "#bb1034",
              100: "#FBD5CD",
              200: "#FBB2AD",
              300: "#EA696C",
              400: "#D64354",
              500: "#bb1034",
              600: "#A00B39",
              700: "#86083A",
              800: "#6C0538",
              900: "#590336",
            },
            gray: {
              DEFAULT: "#B3BCBC",
              100: "#f4f5f5",
              200: "#E9ECEC",
              300: "#DEE3E3",
              400: "#C8D0D0",
              500: "#BDC7C7",
              600: "#889696",
              700: "#738282",
              800: "#606C6C",
              900: "#4D5656",
            },
          },
        },
        dark: {
          layout: {},
          colors: {},
        },
      },
    }),
  ],
};

export default config;
