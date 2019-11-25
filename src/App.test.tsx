import React from "react";
import { mount } from "enzyme";

import { App } from "./App";
import { withAllProviders } from "./testUtils";
import { LocationEditor } from "./location-editor/LocationEditor";

const renderAndMountApp = () => mount(withAllProviders(<App />));

describe("<App />", () => {
  it("can render", () => {
    renderAndMountApp();
  });

  it("renders LocationEditor", () => {
    const wrapper = renderAndMountApp();

    wrapper.find(LocationEditor);
  });
});

