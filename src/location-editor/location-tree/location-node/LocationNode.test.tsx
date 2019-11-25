import React from "react";
import { mount } from "enzyme";
import { IconButton } from "@material-ui/core";

import { LocationNode, LocationNodeProps } from "./LocationNode";
import { withAllProviders } from "../../../testUtils";

const mountLocationNode = (partialProps?: Partial<LocationNodeProps>) => {
  const props: LocationNodeProps = {
    location: {
      id: "id",
      label: "Label",
      name: "Name",
      propertiesAndValues: {}
    },
    isSelected: false,
    onClickDelete: jest.fn(),
    onClickEditProperties: jest.fn(),
    onChangeLabel: jest.fn(), 
    onChangeName: jest.fn(),
    onClickAdd: jest.fn(),
    ...partialProps
  };

  const wrapper = mount(
    withAllProviders(
      <LocationNode
        {...props}
      />));

  const getInput =
    (name: string) =>
      wrapper.find(`input[name='${name}']`);

  const inputText =
    (name: string) =>
      (value: string) =>
        getInput(name)
          .simulate("input", { target: { value } });

  const isFirstInputFocussed = () =>
    document.activeElement === wrapper.find("input:focus").first().getDOMNode();
      
  const getActionButton =
    (action: string) =>
      wrapper
        .find(IconButton)
        .filterWhere(x => x.props().name === action)
        .first();

  const clickButton =
    (name: string) =>
      getActionButton(name).simulate("click");

  const isButtonSelected =
    (action: string) =>
      getActionButton(action).props().color === "primary";

  return {
    props,
    wrapper,
    getInput,
    inputText,
    isFirstInputFocussed,
    getActionButton,
    clickButton,
    isButtonSelected
  };
};

describe("<LocationNode />", () => {

  it("can render", () => {
    mountLocationNode();
  });

  it("renders label and name and allows them to be edited", () => {
    const { wrapper, getInput } = mountLocationNode();

    expect(getInput("label").exists()).toBeTruthy();
    expect(getInput("name").exists()).toBeTruthy();
    expect(wrapper.findWhere(x => x.contains("Label")).exists()).toBeTruthy();
    expect(wrapper.findWhere(x => x.contains("Name")).exists()).toBeTruthy();
  });

  it("renders action buttons", () => {
    const { getActionButton } = mountLocationNode();

    ["delete", "edit-properties", "add-child"].forEach(action => {
      expect(getActionButton(action).exists()).toBeTruthy();
    });
  });

  it("highlights edit-properties action button when selected", () => {
    const { isButtonSelected } = mountLocationNode({ isSelected: true });

    expect(isButtonSelected("edit-properties")).toBeTruthy();
  });

  it("focuses input when focus is called", () => {
    const { wrapper, isFirstInputFocussed } = mountLocationNode();

    (wrapper.find(LocationNode).instance() as LocationNode).focus();

    expect(isFirstInputFocussed).toBeTruthy();
  });

  ([
    ["label", "onChangeLabel"],
    ["name", "onChangeName"]
  ] as [string, keyof LocationNodeProps][])
    .forEach(([prop, eventProp]) => {
      it(`emits onChange with new ${prop} when ${prop} is inputted`, () => {
        const { props, inputText } = mountLocationNode();
    
        inputText(prop)("foo");

        expect(props[eventProp]).toHaveBeenCalledWith("foo");
      });
    });

  ([
    ["delete", "onClickDelete"],
    ["edit-properties", "onClickEditProperties"],
    ["add-child", "onClickAdd"],
  ] as [string, keyof LocationNodeProps][])
    .forEach(([action, event]) => {
      it(`emits ${event} when ${action} is clicks`, () => {
        const { props, clickButton } = mountLocationNode();
    
        clickButton(action);
        
        expect(props[event]).toHaveBeenCalled();
      });
    });

});
