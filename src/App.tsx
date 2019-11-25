import React from "react";

import { Container } from "./App.styles";
import { LocationEditor } from "./location-editor/LocationEditor";

const App = () => {
  return (
    <Container>
      <LocationEditor />
    </Container>
  );
};

export { App };