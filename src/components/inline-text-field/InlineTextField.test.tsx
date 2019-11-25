import React from "react";
import { mount } from "enzyme";

import { InlineTextField, InlineTextFieldProps } from "./InlineTextField";
import { withAllProviders } from "../../testUtils";

const mountInlineTextField = () => {
  const props: InlineTextFieldProps = {
    name: "Name",
    value: "Value",

    onChange: jest.fn()
  };

  const wrapper = mount(
    withAllProviders(
      <InlineTextField
        {...props}
      />));

  return {
    props,
    wrapper
  };
};

describe("<InlineTextField />", () => {

  it("can render", () => {
    mountInlineTextField();
  });

});
