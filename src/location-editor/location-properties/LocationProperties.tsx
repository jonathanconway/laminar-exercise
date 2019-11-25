import React, { forwardRef, useRef } from "react";
import MaterialTable, { MTableToolbar } from "material-table";
import { AddBox, Clear, Edit, Close, Check, Delete } from "@material-ui/icons";
import { IconButton, Tooltip } from "@material-ui/core";

import { Location } from "../LocationEditor.types";
import { Container, ToolbarContainer, ToolbarExtension, Title } from "./LocationProperties.styles";

export interface LocationPropertiesProps {
  readonly location: Location;

  readonly onChangeLocationProperty: (location: Location, name: string, newName: string, newValue: string) => void;
  readonly onAddLocationProperty: (location: Location, name: string, value: string) => void;
  readonly onDeleteLocationProperty: (location: Location, name: string) => void;
  readonly onClose: () => void;
}

interface LocationProperty {
  readonly name: string;
  readonly value: string;
}

const LocationProperties = ({
  location,
  onChangeLocationProperty,
  onAddLocationProperty,
  onDeleteLocationProperty,
  onClose
}: LocationPropertiesProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const data = Object
          .entries(location.propertiesAndValues)
          .map(([ name, value ]) => ({ name, value }));

  const title = `Edit Properties - ${location.name}`;

  const focusFirstInput = () => {
    const firstInput = containerRef.current!.querySelector("input");
    if (firstInput) {
      firstInput.focus();
    }
  };

  const handleClickAddOrEdit = () => {
    setTimeout(() => focusFirstInput());
  };

  return (
    <Container ref={containerRef}>
      <MaterialTable
        icons={{
          Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
          Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
          Delete: forwardRef((props, ref) => <Delete {...props} ref={ref} />),
          Add: forwardRef((props, ref) => (
            <AddBox
              onClick={handleClickAddOrEdit}
              {...props}
              ref={ref}
            />
          )),
          Edit: forwardRef((props, ref) => (
            <Edit
              onClick={handleClickAddOrEdit}
              {...props}
              ref={ref}
            />
          ))
        }}
        columns={[
          { title: "Name", field: "name", editable: "always" },
          { title: "Value", field: "value", editable: "always" },
        ]}
        data={data}
        editable={{
          isDeletable: () => true,
          isEditable: () => true,
          onRowUpdate: async ({ name, value }: LocationProperty, oldValue?: LocationProperty) => {
            if (oldValue) {
              onChangeLocationProperty(location, oldValue.name, name, value);
            }
          },
          onRowAdd: async ({ name, value }: LocationProperty) => {
            onAddLocationProperty(location, name, value);
          },
          onRowDelete: async({ name }: LocationProperty) => {
            onDeleteLocationProperty(location, name);
          }
        }}
        components={{
          Toolbar: ({ classes, ...props }) =>
            <ToolbarContainer>
              <MTableToolbar {...props} />
              <ToolbarExtension>
                <Tooltip title="Close">
                  <IconButton onClick={onClose}>
                    <Close />
                  </IconButton>
                </Tooltip>
              </ToolbarExtension>
            </ToolbarContainer>,
        }}
        title={
          <Tooltip title={title}>
            <Title>{title}</Title>
          </Tooltip>
        }
        options={{
          toolbar: true,
          header: true,
          search: false,
          showTitle: true,
          paging: false,
          sorting: false,
        }}
      />
    </Container>
  );
};

export { LocationProperties };