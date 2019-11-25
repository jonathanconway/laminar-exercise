import { styled } from "../../theme";

export const Container = styled.div`
  justify-content: space-between;

  .MuiPaper-root {
    height: 100%;
    width: 100%;
  }

  .MuiTableCell-paddingCheckbox {
    padding: 16px;
  }

  .MuiToolbar-root {
    flex: 1;
    padding-right: 0;

    & > div {
      &:nth-child(1) {
        position: relative;
        flex: 1;
        height: 2rem;
      }

      &:nth-child(2) {
        display: none;
      }
    }
  }
`;

export const Title = styled.h6`
  position: absolute;
  overflow: hidden;
  width: 100%;
  height: 100%;
  margin: 0;
  white-space: nowrap;
  line-height: 2.1rem;
  text-overflow: ellipsis;
  font-size: 1.1rem;
`;

export const ToolbarContainer = styled.div`
  display: flex;
`;

export const ToolbarExtension = styled.div`
  margin: .5rem .5rem 0 0;
`;