import React, { Component, createRef, RefObject } from "react";

import { Tree } from "../../components/tree";
import { LocationTreeModel, Location } from "../LocationEditor.types";
import { LocationNode } from "./location-node/LocationNode";
import { ReorderPlacement } from "../../App.types";

export interface LocationTreeProps {
  readonly locations: LocationTreeModel;
  readonly selectedLocation?: Location;

  readonly onLocationChangeLabel: (location: Location, value: string) => void;
  readonly onLocationChangeName: (location: Location, value: string) => void;
  readonly onLocationClickAdd: (location: Location) => void;
  readonly onLocationClickDelete: (location: Location) => void;
  readonly onLocationEditProperties: (location: Location) => void;
  readonly onReorderLocation: (locationToReorder: Location, locationRelativeTo: Location, placement: ReorderPlacement) => void;
}

class LocationTree extends Component<LocationTreeProps> {
  public treeRef: RefObject<Tree<Location>>;

  constructor(props: LocationTreeProps) {
    super(props);

    this.treeRef = createRef();
  }

  expandNode(id: string) {
    this.treeRef.current!.expandNode(id);
  }

  focusNode(id: string) {
    this.treeRef.current!.focusNode(id);
  }

  render() {
    const {
      locations,
      selectedLocation,

      onLocationChangeLabel,
      onLocationChangeName,
      onLocationClickAdd,
      onLocationClickDelete,
      onLocationEditProperties,
      onReorderLocation,
    } = this.props;

    return (
      <div>
        <Tree
          ref={this.treeRef}
          tree={locations}
          onDragDrop={(dragNode, dropNode, placement) => onReorderLocation(dragNode.value, dropNode.value, placement)}
          renderNode={(node, attachFocusHandler) => {
            const locationNodeRef: RefObject<LocationNode> = createRef();

            attachFocusHandler(() => {
              locationNodeRef.current!.focus();
            });

            return (
              <LocationNode
                ref={locationNodeRef}
                location={node.value}
                isSelected={!!selectedLocation && node.id === selectedLocation.id}
                onChangeLabel={(value) => onLocationChangeLabel(node.value, value)}
                onChangeName={(value) => onLocationChangeName(node.value, value)}
                onClickAdd={() => onLocationClickAdd(node.value)}
                onClickDelete={() => onLocationClickDelete(node.value)}
                onClickEditProperties={() => onLocationEditProperties(node.value)}
              />
            );
          }}
        />
      </div>
    );
  }
};

export { LocationTree };