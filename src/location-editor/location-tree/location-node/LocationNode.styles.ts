import { styled } from "../../../theme";

const showButtons = `
  button {
    visibility: visible;
  }
`;

export const Container = styled.div<{ isSelected: boolean }>`
  ${({ isSelected }) => `
    display: flex;
    align-items: center;

    button {
      visibility: hidden;
      min-width: auto;
    }

    &:hover,
    &:focus {
      ${showButtons}
    }

    ${isSelected ? showButtons : undefined}
  `}
`;

export const Separator = styled.span`
  margin: 0 0.125rem;
  line-height: normal;
`;