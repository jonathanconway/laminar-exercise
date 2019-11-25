import React, { Component, createRef, RefObject } from "react";
import { Delete, Add, List } from "@material-ui/icons";
import { IconButton, Tooltip } from "@material-ui/core";

import { Location } from "../../LocationEditor.types";
import { InlineTextField } from "../../../components/inline-text-field/InlineTextField";
import { Container, Separator } from "./LocationNode.styles";

export interface LocationNodeProps {
  readonly location: Location;
  readonly isSelected: boolean;

  readonly ref?: React.Ref<LocationNode>;

  readonly onChangeLabel: (value: string) => void;
  readonly onChangeName: (value: string) => void;
  readonly onClickDelete: () => void;
  readonly onClickEditProperties: () => void;
  readonly onClickAdd: () => void;
}

class LocationNode extends Component<LocationNodeProps> {
  private _labelFieldRef: RefObject<InlineTextField>;

  constructor(props: LocationNodeProps) {
    super(props);
    this._labelFieldRef = createRef();
  }

  focus() {
    this._labelFieldRef.current!.focus();
  }

  render() {
    const {
        location,
        onChangeLabel,
        onChangeName,
        onClickDelete,
        onClickEditProperties,
        onClickAdd,
        isSelected
      } = this.props;

    return (
      <Container isSelected={isSelected}>

        {/* Body */}
        <InlineTextField
          ref={this._labelFieldRef}
          name="label"
          value={location.label || ""}
          onChange={onChangeLabel}
          fontWeight="bold"
        />
        <Separator>:</Separator>
        <InlineTextField
          name="name"
          value={location.name || ""}
          onChange={onChangeName}
        />

        {/* Actions */}
        <Tooltip title="Delete">
          <IconButton
            name="delete"
            size="small"
            onClick={onClickDelete}>
            <Delete />
          </IconButton>
        </Tooltip>

        <Tooltip title="Edit Properties">
          <IconButton
            name="edit-properties"
            size="small"
            color={isSelected ? "primary" : "default"}
            onClick={onClickEditProperties}>
            <List />
          </IconButton>
        </Tooltip>

        <Tooltip title="Add Child">
          <IconButton
            name="add-child"
            size="small"
            onClick={onClickAdd}>
            <Add />
          </IconButton>
        </Tooltip>

      </Container>
    );
  }
};

export { LocationNode };