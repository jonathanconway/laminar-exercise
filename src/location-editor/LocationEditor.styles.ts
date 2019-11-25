import { styled } from "../theme";

export const Container = styled.div`
  ${({ theme }) => `
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    padding: ${theme.spacing.regular}rem;
  `}
`;

export const Header = styled.div`
  ${({ theme }) => `
    padding-bottom: ${theme.spacing.regular}rem;
  `}
`;

export const Split = styled.div`
  ${({ theme }) => `
    display: flex;
    flex: 1;

    @media screen and (max-width: 800px) {
      flex-direction: column;
    }

    & > * {
      box-sizing: border-box;
      flex: 1;

      &:not(:last-child) {
        @media screen and (max-width: 800px) {
          padding-bottom: ${theme.spacing.regular}rem;
        }
        
        @media screen and (min-width: 801px) {
          padding-right: ${theme.spacing.regular}rem;
        }
      }
    }
  `}
`;

export const Main = styled.main`
  width: 70%;
`;