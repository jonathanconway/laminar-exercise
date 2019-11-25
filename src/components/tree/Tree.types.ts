/**
 * A node and its children within a tree.
 */
export interface TreeNodeModel<T> {
  readonly id: string;
  readonly value: T;
  readonly children: string[];
}

/**
 * A tree of nodes, stored as a map for fast access.
 */
export interface TreeModel<T> {
  /** Special node which is the root of the tree. */
  readonly root: TreeNodeModel<T>;

  readonly [id: string]: TreeNodeModel<T>;
}
