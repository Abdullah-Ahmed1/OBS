import { extendTheme, theme } from "@chakra-ui/react";

const colors = {
  "main-bg": "#E8E8EA",
  "column-bg": "#16181D",
  "column-header-bg": "#1A1D23",
   "card-bg": "#FFFFFF",
  "card-border": "#2D313E"
};

const fonts = {
  heading: "Poppins",
  body: "Poppins",
};

export default extendTheme({
  ...theme,
  colors,
  fonts,
});