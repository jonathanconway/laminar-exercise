import React from "react";
import ReactDOM from "react-dom";
import { createStore } from "redux";
import { Provider } from "react-redux";
import { ThemeProvider } from "styled-components";
import { composeWithDevTools } from "redux-devtools-extension";
import HTML5Backend from "react-dnd-html5-backend";

import * as serviceWorker from "./serviceWorker";
import { App } from "./App";
import { GlobalStyle } from "./global.styles";
import { theme } from "./theme";
import { reducer as locationEditorReducer } from "./location-editor/LocationEditor.redux";
import { DndProvider } from "react-dnd";

const store = createStore(locationEditorReducer, composeWithDevTools());

ReactDOM.render(
  <Provider store={store}>
    <ThemeProvider theme={theme}>
      <DndProvider backend={HTML5Backend}>
        <>
          <GlobalStyle />
          <App />
        </>
      </DndProvider>
    </ThemeProvider>
  </Provider>,
  document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
