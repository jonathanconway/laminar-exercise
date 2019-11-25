import styled from "styled-components"

import { ReorderPlacement } from "../../App.types";

const nodeExpandCollapseIconDiameter =  26,
      nodeExpandCollapseSpacing = 2;

export const LabelContainer = styled.div`
  position: relative;
`;

export const DragDropNodeTarget = styled.div<{ isOver: boolean, direction: ReorderPlacement }>`
  position: absolute;
  cursor: move;
  width: 100%;
  height: 25%;

  ${({ isOver, direction }) => `
    background-color: ${isOver ? "black" : "transparent"};

    ${direction === "after" ? `
      bottom: 0;
    ` : direction === "before" ? `
      top: 0;
    ` : ``}
  `}
`;

export const Empty = styled.div`
  width: ${nodeExpandCollapseIconDiameter}px;
  margin-right: ${nodeExpandCollapseSpacing}px;
  height: 1em;
`;