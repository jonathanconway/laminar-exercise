import { TreeNodeModel } from "../components/tree";

/**
 * A Location and its children within a Location tree.
 */
export type LocationTreeNodeModel = TreeNodeModel<Location>;

/**
 * A Location tree, stored as a map for fast access.
 */
export interface LocationTreeModel {
  /** Special node which is the root of the tree. */
  readonly root: LocationTreeNodeModel;

  readonly [id: string]: LocationTreeNodeModel;
}

export interface Location {
  readonly id: string;
  readonly name?: string;
  readonly label?: string;
  readonly propertiesAndValues: {
    readonly [key: string]: string;
  };
}
