import React from "react";
import { mount } from "enzyme";

import { ProjectTitle, ProjectTitleProps } from "./ProjectTitle";
import { withAllProviders } from "../../testUtils";

const mountProjectTitle = () => {
  const props: ProjectTitleProps = {
    value: "Foo",

    onChange: jest.fn()
  };

  const wrapper = mount(
    withAllProviders(
      <ProjectTitle
        {...props}
      />));

  const changeText = (value: string) => {
    wrapper.find("input").simulate("input", { target: { value } });
  };

  return {
    props,
    wrapper,

    changeText
  };
};

describe("<ProjectTitle />", () => {

  it("can render", () => {
    mountProjectTitle();
  });

  it("renders the title", () => {
    const { wrapper } = mountProjectTitle();
    expect(wrapper.text()).toContain("Foo");
  });

  it("triggers onChange with the new title, when edited", () => {
    const { props, changeText } = mountProjectTitle();
    changeText("Bar");
    expect(props.onChange).toHaveBeenCalledWith("Bar");
  });

});
