import React from "react";
import { mount } from "enzyme";

import { TreeNodeProps, TreeNode } from "./TreeNode";
import { withAllProviders } from "../../testUtils";

const mountTreeNode = (partialProps?: Partial<TreeNodeProps>) => {
  const renderNode = jest.fn((node) => <div>{node.id}</div>);

  const model = {
          id: "1",
          value: {
            name: "One"
          },
          children: []
        };

  const props: TreeNodeProps = {
          model,
          children: [],
          expanded: false,

          renderNode,
          onDrop: jest.fn(),

          ...partialProps
        };

  const wrapper = mount(
    withAllProviders(
      <TreeNode
        {...props}
      />));
  
  return {
    props,
    wrapper,

    renderNode,
    model
  };
};

describe("<TreeNode />", () => {

  it("can render", () => {
    mountTreeNode();
  });

  it("renders node using the renderNode function", () => {
    const { renderNode, model } = mountTreeNode();

    expect(renderNode).toHaveBeenCalledWith(model);
  });

});
