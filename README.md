# Location Editor

This is a location-editing UI that features a tree-view, in-place editing of labels and values, drag-drop of nodes within the tree and a properties grid for editing name/value property pairs.

It is built with React and Redux and uses Material-UI for the visual aesthetic and controls.

![Screencast of the Location Editor in action](/docs/demo.gif?raw=true "Screencast of the Location Editor in action")

## Installing and running

You must have yarn installed.

Simply unzip/clone the solution, then run:

```
yarn
yarn start
```

## Unit tests

You can execute tests with the following command:

```
yarn test
```

## Technical nodes

### Areas of improvement

* Look and feel could definitely use more colour, shading/texture and maybe typography.
* Drag-drop is a bit clunky; needs more pleasant drop-target indicators and larger drop-target surface area.
* Interface doesn't support dragging node into a parent as a new child if that parent doesn't already have children.
* Solution is perhaps a bit over-engineered.
  * Redux might've been over-kill.
  * Some operations and algorithms could probably be simplified.
  * Maybe there wasn't a need to add a Tree component, but the Material Tree could've been consumed directly.
* Property/values could be modelled more flexibly; perhaps as a graph.
* Test code could possibly be simplified.