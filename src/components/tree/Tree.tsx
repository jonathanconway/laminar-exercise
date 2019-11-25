import React, { ReactNode, Component, ChangeEvent } from "react";
import TreeView from "@material-ui/lab/TreeView";

import { TreeModel, TreeNodeModel } from "./Tree.types";
import { TreeNode } from "./TreeNode";
import { ReorderPlacement } from "../../App.types";

export interface TreeProps<T extends object = {}> {
  readonly tree: TreeModel<T>;
  readonly ref?: React.Ref<Tree<T>>;
  
  readonly renderNode: (node: TreeNodeModel<T>, attachFocusHandler: (handler: () => void) => void) => ReactNode;

  readonly onDragDrop: (dragNode: TreeNodeModel<T>, dropNode: TreeNodeModel<T>, direction: ReorderPlacement) => void;
}

const renderNodeAndChildren = <T extends object = {}>(
  node: TreeNodeModel<T>,
  props: TreeProps<T>,
  expanded: string[]
) => {
  
  const { renderNode, onDragDrop } = props;

  const handleTreeNodeDrop = (dragNode: TreeNodeModel<T>, dropNode: TreeNodeModel<T>, placement: ReorderPlacement) => {
    onDragDrop(dragNode, dropNode, placement);
  };

  return (
    <TreeNode<T>
      key={node.id}
      model={node}
      expanded={expanded.includes(node.id)}
      renderNode={(node) => renderNode(node, (fn) => {
        focusHandlers[node.id] = fn;
      })}
      onDrop={handleTreeNodeDrop}>
      {node.children.map(childId => {
        return renderNodeAndChildren(props.tree[childId], props, expanded);
      })}
    </TreeNode>
  );

};

const focusHandlers: { [id: string]: () => void } = {};

/**
 * Tree control that supports drag-and-drop re-ordering of nodes.
 */
class Tree<T extends object = {}> extends Component<TreeProps<T>> {
  state = {
    expanded: []
  };

  constructor(props: TreeProps<T>) {
    super(props);
    this.handleTreeViewNodeToggle = this.handleTreeViewNodeToggle.bind(this);
  }

  expandNode(id: string) {
    this.setState({
      expanded: [...this.state.expanded, id]
    });
  }

  focusNode(id: string) {
    focusHandlers[id] && focusHandlers[id]();
  }

  handleTreeViewNodeToggle(_: ChangeEvent<{}>, nodeIds: string[]) {
    this.setState({
      expanded: nodeIds
    });
  }

  render() {
    const { tree } = this.props;

    return (
      <div>
        <TreeView
          expanded={[...this.state.expanded]}
          onNodeToggle={this.handleTreeViewNodeToggle}>

          {tree.root.children.map(childId =>
            renderNodeAndChildren(
              tree[childId],
              this.props,
              this.state.expanded))}

        </TreeView>
      </div>
    );
  }
};

export { Tree };
