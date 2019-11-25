import { FontWeightProperty } from "csstype";

import { styled } from "../../theme";

export type Sizes = "regular" | "large";

interface ContainerStyleProps {
  readonly size: Sizes;
  readonly fontWeight: FontWeightProperty;
}

const fontSizes = {
  "regular": 1,
  "large": 1.5,
} as { [key: string]: number };

const paddingBottoms = {
  "regular": 2,
  "large": 3,
} as { [key: string]: number };

const containerHeights = {
  "regular": 2,
  "large": 3,
} as { [key: string]: number };

export const Container = styled.div<ContainerStyleProps>`
  ${({ size, fontWeight }) => `
    position: relative;
    display: inline-flex;
    align-items: center;
    height: ${containerHeights[size]}rem;
    
    input,
    span {
      font-weight: ${fontWeight};
    }

    .MuiTextField-root {
      width: 100%;
      height: 100%;
      position: absolute;

      .MuiInputBase-root {
        height: 100%;
        width: 100%;
        padding-bottom: ${paddingBottoms[size]}rem;
      }
    }

    input {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      padding: 0;
      font-size: ${fontSizes[size]}rem;
    }

    span {
      margin-top: 1px;
      font-size: ${fontSizes[size]}rem;
      color: transparent;
      white-space: pre;
    }
  `}
`;