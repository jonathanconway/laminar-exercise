import baseStyled, { ThemedStyledInterface } from "styled-components";

const spacing = {
  xsmall: .25,
  small: .5,
  regular: 1,
};

const borders = {
  rounding: 0.25,
  width: {
    slim: 1
  }
};

const sizes = {
  button: {
    small: 1.5
  }
};

const typography = {
  regular: {
    fontSize: 1
  },
  large: {
    fontSize: 1.5
  },
};

const colors = {
  default: "black",

  controls: {
    border: "#555555",
    background: "#efefef"
  }
};

const theme = {
  spacing,
  borders,
  sizes,
  typography,
  colors
};

export { theme };

export type Theme = typeof theme;

export const styled = baseStyled as ThemedStyledInterface<Theme>;