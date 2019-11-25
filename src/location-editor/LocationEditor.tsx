import React, { useRef } from "react";
import { connect } from "react-redux";

import { LocationEditorState, actionCreators, selectedLocation } from "./LocationEditor.redux";
import { Container, Header, Split } from "./LocationEditor.styles";
import { Location, LocationTreeModel } from "./LocationEditor.types";
import { LocationProperties } from "./location-properties/LocationProperties";
import { ProjectTitle } from "./project-title/ProjectTitle";
import { LocationTree } from "./location-tree/LocationTree";
import { Notification } from "../components/notification/Notification";

type LocationEditorProps = {
  readonly selectedLocation?: Location;
  readonly projectTitle: string;
  readonly locations: LocationTreeModel;
  readonly message?: string;
} & typeof actionCreators;

const LocationEditor = ({
  selectedLocation,
  projectTitle,
  locations,
  message,
  createReorderLocationAction,
  createSetLocationLabelAction,
  createSetLocationNameAction,
  createSetLocationPropertyAction,
  createDeleteLocationPropertyAction,
  createDeleteLocationAction,
  createSetSelectedLocationAction,
  createSetProjectTitleAction,
  createAddNewLocationAction,
  createClearMessageAction
}: LocationEditorProps) => {

  const treeRef = useRef<LocationTree>(null);

  const handleLocationClickAdd = (location: Location) => {
    const newLocation = createAddNewLocationAction(location, "Name", "Label");
    
    setTimeout(() => {
      treeRef.current!.expandNode(location.id);
      treeRef.current!.focusNode(newLocation.id);
    });
  };

  return (
    <Container>
      <Header>
        <ProjectTitle
          value={projectTitle}
          onChange={createSetProjectTitleAction}
        />
      </Header>
      <Split>
        <LocationTree
          ref={treeRef}
          locations={locations}
          selectedLocation={selectedLocation}
          onLocationChangeLabel={createSetLocationLabelAction}
          onLocationChangeName={createSetLocationNameAction}
          onLocationClickAdd={handleLocationClickAdd}
          onLocationClickDelete={createDeleteLocationAction}
          onLocationEditProperties={createSetSelectedLocationAction}
          onReorderLocation={createReorderLocationAction}
        />

        {selectedLocation &&
          <LocationProperties
            location={selectedLocation}

            onChangeLocationProperty={createSetLocationPropertyAction}
            onAddLocationProperty={(location, name, value) => createSetLocationPropertyAction(location, name, name, value)}
            onDeleteLocationProperty={createDeleteLocationPropertyAction}
            onClose={() => createSetSelectedLocationAction(undefined)}
          />}
      </Split>

      <Notification
        message={message}
        onClose={createClearMessageAction}
      />
    </Container>
  );
}

const makeMapStateToProps = () => (state: LocationEditorState) => ({
  ...state,
  selectedLocation: selectedLocation(state)
});

const ConnectedLocationEditor = connect(makeMapStateToProps, { ...actionCreators })(LocationEditor);

export { ConnectedLocationEditor as LocationEditor };
