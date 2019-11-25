import React from "react";
import { mount } from "enzyme";

import { Tree, TreeProps } from "./Tree";
import { withAllProviders, asyncSetTimeout } from "../../testUtils";

const tree = {
  "root": { id: "root", value: { id: "root" }, children: ["1", "2"] },
  "1": { id: "1", value: { id: "1" }, children: ["3"] },
  "2": { id: "2", value: { id: "2" }, children: [] },
  "3": { id: "3", value: { id: "3" }, children: [] },
};

const mountTree = (partialProps?: Partial<TreeProps>) => {
  const focusHandlers: { [key: string]: () => {} } = {};

  const renderNode = jest.fn(
    (node, attachFocusHandler) => {
      focusHandlers[node.id] = jest.fn();
      attachFocusHandler(focusHandlers[node.id]);
      return <div>{node.id}</div>
    });

  const props: TreeProps = {
    tree,
    renderNode,
    onDragDrop: jest.fn(),
    ...partialProps
  };

  const wrapper = mount(
    withAllProviders(
      <Tree
        {...props}
      />));

  const getNode =
    (name: string) =>
      wrapper
        .find("li")
        .filterWhere(x => x.text().includes(name))
        .first();

  const isNodePresent =
    (id: string) =>
      wrapper.filterWhere(x =>
        x.text().includes(id)).exists();

  const toggleNode =
    (name: string) => {
      getNode(name)
        .find("svg")
        .first()
        .simulate("click");
    };

  const instance = wrapper.find(Tree).instance() as Tree;

  return {
    props,
    wrapper,
    instance,

    isNodePresent,
    toggleNode,
    focusHandlers,
    renderNode
  };
};

describe("<Tree />", () => {

  it("can render", () => {
    mountTree();
  });

  it("renders all of the top-level nodes", () => {
    const { isNodePresent } = mountTree();

    expect(isNodePresent("1")).toBeTruthy();
    expect(isNodePresent("2")).toBeTruthy();
  });

  it("allows a node to be expanded, revealing its children, then collapsed, hiding them", async () => {
    const { toggleNode, isNodePresent } = mountTree();

    expect(isNodePresent("3")).toBeFalsy();

    toggleNode("1");

    expect(isNodePresent("3")).toBeTruthy();

    toggleNode("1");

    await asyncSetTimeout(() => {

      expect(isNodePresent("3")).toBeFalsy();

    }, 500);
  });

  describe("focusNode", () => {
    it("calls the relevant node's focus handler", () => {
      const { instance, focusHandlers } = mountTree();
      
      instance.focusNode("2");

      expect(focusHandlers["2"]).toHaveBeenCalled();
    });
  });

  describe("expandNode", () => {
    it("expands the relevant node", () => {
      const { isNodePresent, instance } = mountTree();

      expect(isNodePresent("3")).toBeFalsy();

      instance.expandNode("1");

      expect(isNodePresent("3")).toBeTruthy();
    });
  });

  describe("renderNode", () => {
    it("is called to render each node", () => {
      const { renderNode } = mountTree();

      expect(renderNode).toHaveBeenNthCalledWith(1, tree["1"], expect.any(Function));
      expect(renderNode).toHaveBeenNthCalledWith(2, tree["2"], expect.any(Function));
    });
  });

});
