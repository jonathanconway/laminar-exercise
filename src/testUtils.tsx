import React, { ReactChild } from "react";
import { ThemeProvider } from "styled-components";
import HTML5Backend from "react-dnd-html5-backend";
import { createStore, Action } from "redux";
import { Provider } from "react-redux";
import { DndProvider } from "react-dnd";

import { reducer as locationEditorReducer, LocationEditorState } from "./location-editor/LocationEditor.redux";
import { theme } from "./theme";

export const withTheme = (node: ReactChild) => (
  <ThemeProvider theme={theme}>
    {node}
  </ThemeProvider>
);

const createMockStore = <TState extends object = {}, TAction extends Action<any> = Action<any>>(
  reducer: (state: TState | undefined, action: TAction) => TState
) =>
  createStore<TState, TAction, {}, {}>(reducer);

export const withMockStore = <TState extends object = {}, TAction extends Action<any> = Action<any>>(
  reducer: (state: TState | undefined, action: TAction) => TState,
  node: ReactChild,
  store = createMockStore(reducer)
) => {
  return (
    <Provider store={store}>
      {node}
    </Provider>
  );
};

export const withDndProvider = (node: ReactChild) =>
  <DndProvider backend={HTML5Backend}>
    {node}
  </DndProvider>;

export const withAllProviders = (
  node: ReactChild,
  reducer?: (state: LocationEditorState | undefined, action: Action) => LocationEditorState
) =>
  withTheme(
    withMockStore(
      reducer || locationEditorReducer,
      withDndProvider(
        node
      )
    )
  );
  

export const asyncSetTimeout = async (fn: () => void, timeout?: number) =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve(fn());
    }, timeout);
  });

