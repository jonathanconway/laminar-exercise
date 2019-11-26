import shortid from "shortid";

import { Location, LocationTreeModel } from "./LocationEditor.types";
import { ReorderPlacement } from "../App.types";

import dummyLocations from "./dummy-locations.json";


// Action types

export const SET_PROJECT_TITLE =        "SET_PROJECT_TITLE";

export const SET_SELECTED_LOCATION =    "SET_SELECTED_LOCATION";

export const ADD_NEW_LOCATION =         "ADD_NEW_LOCATION";
export const DELETE_LOCATION =          "DELETE_LOCATION";
export const REORDER_LOCATION =         "REORDER_LOCATION";

export const SET_LOCATION_LABEL =       "SET_LOCATION_LABEL";
export const SET_LOCATION_NAME =        "SET_LOCATION_NAME";

export const SET_LOCATION_PROPERTY =    "SET_LOCATION_PROPERTY";
export const DELETE_LOCATION_PROPERTY = "DELETE_LOCATION_PROPERTY";

export const CLEAR_MESSAGE =            "CLEAR_MESSAGE";


// Actions

export interface CreateSetProjectTitleAction {
  readonly type: typeof SET_PROJECT_TITLE;
  readonly projectTitle: string;
}

export interface SetSelectedLocationAction {
  readonly type: typeof SET_SELECTED_LOCATION;
  readonly id: string;
}

export interface AddNewLocationAction {
  readonly type: typeof ADD_NEW_LOCATION;
  readonly parentLocationId?: string;
  readonly label: string;
  readonly name: string;
  readonly id: string;
}

export interface DeleteLocationAction {
  readonly type: typeof DELETE_LOCATION;
  readonly id: string;
}

export interface ReorderLocationAction {
  readonly type: typeof REORDER_LOCATION;
  readonly locationToReorderId: string;
  readonly locationRelativeToId: string;
  readonly placement: ReorderPlacement;
}

export interface SetLocationLabelAction {
  readonly type: typeof SET_LOCATION_LABEL;
  readonly id: string;
  readonly label: string;
}

export interface SetLocationNameAction {
  readonly type: typeof SET_LOCATION_NAME;
  readonly id: string;
  readonly name: string;
}

export interface SetLocationPropertyAction {
  readonly type: typeof SET_LOCATION_PROPERTY;
  readonly id: string;
  readonly name: string;
  readonly newName: string;
  readonly newValue: string;
}

export interface DeleteLocationPropertyAction {
  readonly type: typeof DELETE_LOCATION_PROPERTY;
  readonly id: string;
  readonly name: string;
}

export interface ClearMessageAction {
  readonly type: typeof CLEAR_MESSAGE;
}


// Action type

export type Action
  = CreateSetProjectTitleAction
  | SetSelectedLocationAction
  | AddNewLocationAction
  | DeleteLocationAction
  | ReorderLocationAction
  | SetLocationLabelAction
  | SetLocationNameAction
  | SetLocationPropertyAction
  | DeleteLocationPropertyAction
  | ClearMessageAction;


// State

export interface LocationEditorState {
  readonly projectTitle: string;
  readonly locations: LocationTreeModel;
  readonly selectedLocationId?: string;
  readonly message?: string;
}


// Default initial state

const dummyProjectTitle = "Project 1";

const initialState: LocationEditorState = {
  projectTitle: dummyProjectTitle,
  locations: dummyLocations
};


// Action creators

const createSetProjectTitleAction = (projectTitle: string) => ({
  type: SET_PROJECT_TITLE,
  projectTitle
});

const createSetSelectedLocationAction = (location?: Location) => ({
  type: SET_SELECTED_LOCATION,
  id: location ? location.id : undefined
});

const createAddNewLocationAction = (parentLocation: Location, name: string, label: string) => {
  const id = shortid.generate();
  return {
    type: ADD_NEW_LOCATION,
    parentLocationId: parentLocation.id,
    id,
    name,
    label
  };
};

const createDeleteLocationAction = (location: Location) => ({
  type: DELETE_LOCATION,
  id: location.id
});

const createReorderLocationAction = (locationToReorder: Location, locationRelativeTo: Location, placement: ReorderPlacement) => ({
  type: REORDER_LOCATION,
  locationToReorderId: locationToReorder.id,
  locationRelativeToId: locationRelativeTo.id,
  placement
});

const createSetLocationLabelAction = (location: Location, label: string) => ({
  type: SET_LOCATION_LABEL,
  id: location.id,
  label
});

const createSetLocationNameAction = (location: Location, name: string) => ({
  type: SET_LOCATION_NAME,
  id: location.id,
  name
});

const createSetLocationPropertyAction = (location: Location, name: string, newName: string, newValue: string) => ({
  type: SET_LOCATION_PROPERTY,
  id: location.id,
  name,
  newName,
  newValue
});

const createDeleteLocationPropertyAction = (location: Location, name: string) => ({
  type: DELETE_LOCATION_PROPERTY,
  id: location.id,
  name
});

const createClearMessageAction = () => ({
  type: CLEAR_MESSAGE
});

export const actionCreators = {
  createSetProjectTitleAction,
  createReorderLocationAction,
  createSetLocationLabelAction,
  createSetLocationNameAction,
  createDeleteLocationAction,
  createSetSelectedLocationAction,
  createSetLocationPropertyAction,
  createDeleteLocationPropertyAction,
  createAddNewLocationAction,
  createClearMessageAction
};


// Reducer Helpers

const reorderLocation = (state: LocationEditorState, action: ReorderLocationAction): LocationEditorState => {
  let { locations } = state;

  const { locationToReorderId, locationRelativeToId, placement } = action;

  if (locationToReorderId === locationRelativeToId) {
    return state;
  }

  // Find the node whose children array includes `locationToReorderId`
  // and remove `locationToReorderId` from the children.
  locations = Object
    .values(locations)
    .reduce((nodes, node) => ({
      ...nodes,
      [node.value.id]: {
        ...node,
        children: node.children.filter(child => child !== locationToReorderId.toString())
      }
    }), {} as LocationTreeModel);

  // Find the node whose children array includes `locationRelativeToId`.
  const parentNode = Object
    .values(locations)
    .find(location =>
      location.value.id !== locationRelativeToId &&
      location.children.includes(locationRelativeToId));
  
  if (parentNode) {
    // Insert `locationToReorderId` at the appropriate point.
    locations = {
      ...locations,
      [parentNode.value.id]: {
        ...parentNode,
        children: [
          ...parentNode.children.slice(0, parentNode.children.indexOf(locationRelativeToId)),
          ...(
            placement === "after"
              ? [
                locationRelativeToId,
                locationToReorderId,
              ]
              : [
                locationToReorderId,
                locationRelativeToId,
              ]
          ),
          ...parentNode.children.slice(parentNode.children.indexOf(locationRelativeToId) + 1),
        ]
      }
    };
  }

  return {
    ...state,
    locations,
    message: "Location re-ordered"
  };
};

const deleteLocation = (state: LocationEditorState, action: DeleteLocationAction) : LocationEditorState => {
  const removeLocationFromTreeMapAndChildren = (locations: LocationTreeModel, id: string) => {
    const location = locations[id];

    if (!location) {
      return locations;
    }
  
    // Remove the location's children first.
    if (location.children.length > 0) {
      for (const childId of location.children) {
        locations = removeLocationFromTreeMapAndChildren(locations, childId);
      }
    }
  
    // Remove specified location from the tree map and from all children.
    locations = Object
      .values(locations)
      .reduce((locations, location) => ({
        ...locations,
        ...(
          location.id !== id
            ? {
              [location.id]: {
                ...location,
                children: location.children.filter(c => c !== id)
              }
            }
            : {})
      }), {} as LocationTreeModel);
  
    return locations;
  };

  const locations = removeLocationFromTreeMapAndChildren(state.locations, action.id);

  // De-select, if selected.
  const selectedLocationId =
    state.selectedLocationId === action.id
      ? undefined
      : state.selectedLocationId;

  return {
    ...state,
    selectedLocationId,
    locations,
    message: "Location deleted"
  };
};

const addNewLocation = (state: LocationEditorState, action: AddNewLocationAction) => {
  const parentLocationId = action.parentLocationId || "root";

  return {
    ...state,
    locations: {
      ...state.locations,
      [action.id]: {
        id: action.id,
        children: [],
        value: {
          id: action.id,
          name: action.name,
          label: action.label,
          propertiesAndValues: {}
        }
      },
      [parentLocationId]: {
        ...state.locations[parentLocationId],
        children: [
          ...state.locations[parentLocationId].children,
          action.id
        ]
      }
    },
    message: "New location added"
  }
};

const setLocationProperty = (state: LocationEditorState, action: SetLocationPropertyAction) => {
  let propertiesAndValues = state.locations[action.id].value.propertiesAndValues;

  if (propertiesAndValues[action.name]) {
    propertiesAndValues =
      Object
        .entries(propertiesAndValues)
        .reduce((acc, [name, value]) => {
          if (name === action.name) {
            return {
              ...acc,
              [action.newName]: action.newValue
            };
          } else {
            return {
              ...acc,
              [name]: value
            };
          }
        }, {});
  } else {
    propertiesAndValues = {
      ...propertiesAndValues,
      [action.newName]: action.newValue
    };
  }

  return {
    ...state,
    locations: {
      ...state.locations,
      [action.id]: {
        ...state.locations[action.id],
        value: {
          ...state.locations[action.id].value,
          propertiesAndValues
        }
      }
    },
    message: "Location property set"
  };
};

const deleteLocationProperty = (state: LocationEditorState, action: DeleteLocationPropertyAction) => {
  let propertiesAndValues = state.locations[action.id].value.propertiesAndValues;

  propertiesAndValues =
    Object
      .entries(propertiesAndValues)
      .reduce((acc, [name, value]) => {
        if (name === action.name) {
          return acc;
        } else {
          return {
            ...acc,
            [name]: value
          };
        }
      }, {});

  return {
    ...state,
    locations: {
      ...state.locations,
      [action.id]: {
        ...state.locations[action.id],
        value: {
          ...state.locations[action.id].value,
          propertiesAndValues
        }
      }
    },
    message: "Location property deleted"
  };
};



// Reducer

export const reducer = (state: LocationEditorState = initialState, action: Action): LocationEditorState => {

  switch (action.type) {

    case SET_PROJECT_TITLE:
      return {
        ...state,
        projectTitle: action.projectTitle
      };


    case SET_SELECTED_LOCATION:
      return {
        ...state,
        selectedLocationId: action.id
      };


    case ADD_NEW_LOCATION:
      return addNewLocation(state, action);

  
    case DELETE_LOCATION:
      return deleteLocation(state, action);


    case REORDER_LOCATION:
      return reorderLocation(state, action);

    case SET_LOCATION_LABEL:
      return {
        ...state,
        locations: {
          ...state.locations,
          [action.id]: {
            ...state.locations[action.id],
            value: {
              ...state.locations[action.id].value,
              label: action.label
            }
          }
        }
      };


    case SET_LOCATION_NAME:
      return {
        ...state,
        locations: {
          ...state.locations,
          [action.id]: {
            ...state.locations[action.id],
            value: {
              ...state.locations[action.id].value,
              name: action.name
            }
          }
        }
      };


    case SET_LOCATION_PROPERTY:
      return setLocationProperty(state, action);


    case DELETE_LOCATION_PROPERTY:
      return deleteLocationProperty(state, action);


    case CLEAR_MESSAGE:
      return {
        ...state,
        message: undefined
      }
  }

  return state;

};


// Selectors

export const selectedLocation = (state: LocationEditorState) => {
  return state.selectedLocationId
    ? state.locations[state.selectedLocationId]
      ? state.locations[state.selectedLocationId].value
      : undefined
    : undefined;
};