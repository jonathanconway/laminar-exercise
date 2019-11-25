import { createGlobalStyle } from "styled-components";

import { Theme } from "./theme";

export const GlobalStyle = createGlobalStyle<{ readonly theme: Theme }>`
  html, body, #root {
    height: 100%;
  }

  body {
    margin: 0;
    font-family: "Roboto", "Helvetica Neue", sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  code {
    font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
      monospace;
  }

  #root {
    display: flex;
  }
`;