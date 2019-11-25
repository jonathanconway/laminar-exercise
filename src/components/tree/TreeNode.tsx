import React, { ReactNode, SyntheticEvent } from "react";
import TreeItem from '@material-ui/lab/TreeItem';
import { useDrag, useDrop } from "react-dnd";
import { ExpandMore, ChevronRight } from '@material-ui/icons';

import { DragDropNodeTarget, Empty, LabelContainer } from "./TreeNode.styles";
import { TreeNodeModel } from "./Tree.types";
import { ReorderPlacement } from "../../App.types";

export interface TreeNodeProps<T extends object = {}> {
  readonly model: TreeNodeModel<T>;
  readonly children: ReactNode | readonly ReactNode[];
  readonly expanded: boolean;
  
  readonly renderNode: (node: TreeNodeModel<T>) => ReactNode;
  readonly onDrop: (dragNode: TreeNodeModel<T>, dropNode: TreeNodeModel<T>, placement: ReorderPlacement) => void;
}

const NODE = "NODE";

const LabelNodeContainer = ({ children }: { children: ReactNode | readonly ReactNode[] }) => {
  const handleLabelContainerKeyDownOrClick = (e: SyntheticEvent) => {
    // Capture keystrokes / mouse-clicks.
    e.stopPropagation();
  };

  return (
    <div
      onClick={handleLabelContainerKeyDownOrClick}
      onKeyDown={handleLabelContainerKeyDownOrClick}>
      {children}
    </div>
  );
};

const TreeNode = <T extends object = {}>({
  model,
  children,
  renderNode,
  onDrop,
  expanded
}: TreeNodeProps<T>) => {
  const [, drag] = useDrag({
    item: { model, type: NODE },
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult();
      if (item && dropResult && dropResult.dragNodem !== dropResult.dropNode) {
        onDrop(dropResult.dragNode, dropResult.dropNode, dropResult.direction);
      }
    },
    collect: monitor => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [{ isOver, canDrop }, drop] = useDrop({
    accept: NODE,
    drop: (dragNode: any) => ({ dragNode: dragNode.model, dropNode: model, direction: "before" }),
    collect: mon => ({
      isOver: !!mon.isOver(),
      canDrop: !!mon.canDrop(),
    })
  });

  const [{ isOver: isOver2, canDrop: canDrop2 }, drop2] = useDrop({
    accept: NODE,
    drop: (dragNode: any) => ({ dragNode: dragNode.model, dropNode: model, direction: "after" }),
    collect: mon => ({
      isOver: !!mon.isOver(),
      canDrop: !!mon.canDrop(),
    })
  });

  const hasChildren = !!model.children && (Array.isArray(model.children) ? model.children.length > 0 : true);

  return (
    <TreeItem
      ref={drag}
      nodeId={model.id}
      icon={hasChildren ? expanded ? <ExpandMore /> : <ChevronRight /> : <Empty />}
      label={
        <LabelContainer>
          <DragDropNodeTarget
            ref={drop}
            isOver={canDrop && isOver}
            direction="before"
          />
          <LabelNodeContainer>
            {renderNode(model)}
          </LabelNodeContainer>
          <DragDropNodeTarget
            ref={drop2}
            isOver={canDrop2 && isOver2}
            direction="after"
          />
        </LabelContainer>
      }>
      {children}
    </TreeItem>
  );
};

export { TreeNode };
