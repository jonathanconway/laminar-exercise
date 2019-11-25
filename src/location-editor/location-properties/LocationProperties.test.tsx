import React from "react";
import { mount } from "enzyme";

import { LocationProperties, LocationPropertiesProps } from "./LocationProperties";
import { withAllProviders } from "../../testUtils";

const mountLocationProperties = () => {
  const props: LocationPropertiesProps = {
    location: {
      id: "1",
      name: "Foo",
      propertiesAndValues: {
        "name1": "value1",
        "name2": "value2",
        "name3": "value3",
      }
    },
    onChangeLocationProperty: jest.fn(),
    onAddLocationProperty: jest.fn(),
    onDeleteLocationProperty: jest.fn(),
    onClose: jest.fn()
  };

  const wrapper = mount(
    withAllProviders(
      <LocationProperties
        {...props}
      />));

  const hasPropertiesAndValues = (propertiesAndValues: { [key: string]: string }) =>
    Object
      .entries(propertiesAndValues)
      .every(([ name, value ]) =>
        wrapper.findWhere(x => { return x.text().includes(name); }).exists() &&
        wrapper.findWhere(x => { return x.text().includes(value); }).exists());

  const getButton = (name: string) =>
    wrapper
      .find("button")
      .filterWhere(x => x.props().title === name)
      .first()
      .find("svg")
      .first();

  const getAddButton = () =>
    getButton("Add");

  const getSaveButton = () =>
    getButton("Save");

  const getRowButton = (propName: string, buttonName: string) => {
    const indexOfId = Object
      .keys(props.location.propertiesAndValues)
      .indexOf(propName);
    return wrapper
      .find("button")
      .filterWhere(x => x.props().title === buttonName)
      .at(indexOfId)
      .find("svg")
      .first();
  };

  const getEditButton = (name: string) =>
    getRowButton(name, "Edit");

  const getDeleteButton = (name: string) =>
    getRowButton(name, "Delete");

  const getCloseButton = () =>
    getButton("Close");

  const getInput = (name: string) => 
    wrapper.find(`input[placeholder='${name}']`).first();

  const getNameInput = () =>
    getInput("Name");

  const getValueInput = () =>
    getInput("Value");

  const getTitleText = () =>
    wrapper.find("h6").text();

  return {
    wrapper,
    props,

    hasPropertiesAndValues,
    getAddButton,
    getNameInput,
    getValueInput,
    getSaveButton,
    getEditButton,
    getDeleteButton,
    getCloseButton,
    getTitleText
  };
};

describe("<LocationProperties />", () => {

  it("can render", () => {
    mountLocationProperties();
  });

  it("renders all properties and values", () => {
    const { hasPropertiesAndValues } = mountLocationProperties();

    expect(
      hasPropertiesAndValues({
        "name1": "value1",
        "name2": "value2",
        "name3": "value3",
      })).toBeTruthy();
  });

  it("renders a title with the location name", () => {
    const { getTitleText } = mountLocationProperties();

    expect(getTitleText()).toContain("Edit Properties - Foo");
  });

  it("renders a close button", () => {
    const { getCloseButton } = mountLocationProperties();

    expect(getCloseButton().exists()).toBeTruthy();
  });

  it("has an add button that allows a new property to be added", () => {
    const { getAddButton, getNameInput, getValueInput, getSaveButton, props } = mountLocationProperties();

    expect(getAddButton().exists()).toBeTruthy();

    getAddButton().simulate("click");

    const nameInput = getNameInput(),
          valueInput = getValueInput();

    expect(nameInput.exists()).toBeTruthy();

    nameInput.simulate("change", { target: { value: "name4" } });
    valueInput.simulate("change", { target: { value: "value4" } });

    const saveButton = getSaveButton();
    expect(saveButton.exists()).toBeTruthy();
    saveButton.simulate("click");

    expect(props.onAddLocationProperty).toHaveBeenCalledWith(props.location, "name4", "value4");
  });

  it("has an edit button that allows an existing property to be edited", () => {
    const { getEditButton, getNameInput, getValueInput, getSaveButton, props } = mountLocationProperties();

    getEditButton("name2").simulate("click");

    const nameInput = getNameInput(),
          valueInput = getValueInput();

    expect(nameInput.exists()).toBeTruthy();

    nameInput.simulate("change", { target: { value: "name2b" } });
    valueInput.simulate("change", { target: { value: "value2b" } });

    const saveButton = getSaveButton();
    expect(saveButton.exists()).toBeTruthy();
    saveButton.simulate("click");

    expect(props.onChangeLocationProperty).toHaveBeenCalledWith(props.location, "name2", "name2b", "value2b");
  });

  it("has a delete button that allows an existing property to be deleted", () => {
    const { getDeleteButton, getSaveButton, props } = mountLocationProperties();

    getDeleteButton("name2").simulate("click");

    const saveButton = getSaveButton();
    expect(saveButton.exists()).toBeTruthy();
    saveButton.simulate("click");

    expect(props.onDeleteLocationProperty).toHaveBeenCalledWith(props.location, "name2");
  });

});
