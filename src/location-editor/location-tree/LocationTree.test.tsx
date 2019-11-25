import React from "react";
import { mount } from "enzyme";

import { LocationTree, LocationTreeProps } from "./LocationTree";
import { withAllProviders } from "../../testUtils";
import { Tree } from "../../components/tree";
import { Location } from "../LocationEditor.types";
import { LocationNode } from "./location-node/LocationNode";

const asyncSetTimeout = async (fn: () => void, timeout?: number) =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve(fn());
    }, timeout);
  });

const locations = {
  "root": { id: "root", value: { id: "root", name: "root", label: "", propertiesAndValues: {} }, children: ["1", "2"] },
  "1": { id: "1", value: { id: "1", name: "1", label: "a", propertiesAndValues: {} }, children: ["3"] },
  "2": { id: "2", value: { id: "2", name: "2", label: "b", propertiesAndValues: {} }, children: [] },
  "3": { id: "3", value: { id: "3", name: "3", label: "c", propertiesAndValues: {} }, children: [] },
};

const mountLocationTree = (partialProps?: Partial<LocationTreeProps>) => {  
  const props: LocationTreeProps = {
    locations,
    onLocationChangeLabel: jest.fn(),
    onLocationChangeName: jest.fn(),
    onLocationClickAdd: jest.fn(),
    onLocationClickDelete: jest.fn(),
    onLocationEditProperties: jest.fn(),
    onReorderLocation: jest.fn(),
    ...partialProps
  };

  const wrapper = mount(
    withAllProviders(
      <LocationTree
        {...props}
      />));

  const getNode =
    (name: string) =>
      wrapper
        .find("li")
        .filterWhere(x => x.text().includes(name))
        .first();

  const isNodePresent =
    (name: string, label: string) =>
      wrapper.filterWhere(x =>
        x.text().includes(name) &&
        x.text().includes(label)).exists();

  const toggleNode =
    (name: string) => {
      getNode(name)
        .find("svg")
        .first()
        .simulate("click");
    };

  const instance = (wrapper.find(LocationTree).instance() as LocationTree);

  return {
    props,
    wrapper,
    instance,

    isNodePresent,
    toggleNode
  };
};

describe("<LocationTree />", () => {

  it("can render", () => {
    mountLocationTree();
  });

  it("renders the names and labels of all the top-level nodes", () => {
    const { isNodePresent } = mountLocationTree();

    expect(isNodePresent("1", "a")).toBeTruthy();
    expect(isNodePresent("2", "b")).toBeTruthy();
  });

  it("allows a node to be expanded, revealing its children, then collapsed, hiding them", async () => {
    const { toggleNode, isNodePresent } = mountLocationTree();

    expect(isNodePresent("3", "c")).toBeFalsy();

    toggleNode("1");

    expect(isNodePresent("3", "c")).toBeTruthy();

    toggleNode("1");

    await asyncSetTimeout(() => {

      expect(isNodePresent("3", "c")).toBeFalsy();

    }, 500);
  });

  it("forwards focusNode and expandNode calls to nodes", () => {
    ([
      ["focusNode", "focusNode"],
      ["expandNode", "expandNode"]
     ] as ([keyof LocationTree, keyof Tree<Location>])[]).forEach(([sourceMethod, targetMethod])  => {
      const { instance } = mountLocationTree();
      
      jest.spyOn(instance.treeRef.current! as Tree<Location>, targetMethod as any);
      
      instance[sourceMethod]("1");

      expect(instance.treeRef.current![targetMethod]).toHaveBeenCalled();
    });
  });

  it("sets isSelected to true on node matching selectedLocation", () => {
    const selectedLocation = locations["1"].value;
    
    const { wrapper } = mountLocationTree({ selectedLocation });
    
    expect(wrapper
      .find(LocationNode)
      .filterWhere(x =>
        x.props().location === selectedLocation &&
        x.props().isSelected === true)
      .length)
        .toEqual(1);
  });

});
