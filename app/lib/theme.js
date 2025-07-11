import { createTheme } from "@mantine/core";
import { transformColors } from "./helpers";
const fontFamily = "effra-cc, Georgia, Helvetica Neue, Helvetica, sans-serif";

export const theme = createTheme({
  fontFamily,
  headings: { fontFamily },
  components: {
    Tooltip: {
      defaultProps: {
        withArrow: false,
        portalProps: {
          target: ".mantine-tooltips",
        },
      },
    },
  },
  colors: {
    primary: [
      "#E5EBF0",
      "#BECEDA",
      "#A4BBCB",
      "#8AA7BC",
      "#7D9DB5",
      "#6489A6",
      "#597E9B",
      "#4A6982",
      "#3C5468",
      "#2D3F4E",
    ],
    blue: [
      "#eef3ff",
      "#dce4f5",
      "#b9c7e2",
      "#94a8d0",
      "#748dc1",
      "#5f7cb8",
      "#5474b4",
      "#44639f",
      "#39588f",
      "#2d4b81",
    ],
    danger: [
      "#FBD5CD",
      "#FBB2AD",
      "#EA696C",
      "#D64354",
      "#bb1034",
      "#A00B39",
      "#86083A",
      "#3C5668",
      "#590336",
    ],
    warning: [
      "#FDEECD",
      "#FBD99C",
      "#F4BB6A",
      "#EA9D45",
      "#DD720D",
      "#BE5709",
      "#9F4006",
      "#802D04",
      "#6A1F02",
    ],
    gray: [
      "#f9fafa",
      "#f4f5f5",
      "#E9ECEC",
      "#DEE3E3",
      "#C8D0D0",
      "#BDC7C7",
      "#889696",
      "#738282",
      "#606C6C",
      "#4D5656",
    ],
    bluegray: [
      "#F4F5F6",
      "#E9EAEC",
      "#DDE0E3",
      "#C7CCD1",
      "#BCC2C8", // Base
      "#80858c",
      "#5f6369",
      "#4a4e54",
      "#32353b",
      "#212329",
    ],
    success: [
      "#73ab9f",
      "#66A396",
      "#5C998C",
      "#548C80",
      "#07C55D",
      "#06B153",
      "#069D4A",
      "#058A41",
      "#047638",
      "#04622E",
      "#04622E",
    ],
  },
  fontSizes: {
    xs: 11,
    sm: 14,
    md: 16,
    lg: 20,
    xl: 32,
  },
});

export const themeColors = transformColors(theme.colors);
