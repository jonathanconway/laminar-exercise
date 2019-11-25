import React from "react";
import { mount } from "enzyme";

import { LocationEditor } from "./LocationEditor";
import { withAllProviders } from "../testUtils";
import { actionCreators, SET_PROJECT_TITLE, reducer, SET_SELECTED_LOCATION, ADD_NEW_LOCATION, AddNewLocationAction, DeleteLocationAction, ReorderLocationAction, SET_LOCATION_LABEL, SetLocationLabelAction, SetLocationNameAction, SET_LOCATION_NAME, SET_LOCATION_PROPERTY, SetLocationPropertyAction, LocationEditorState, DeleteLocationPropertyAction, DELETE_LOCATION_PROPERTY, REORDER_LOCATION, DELETE_LOCATION } from "./LocationEditor.redux";
import { ProjectTitle } from "./project-title/ProjectTitle";
import { LocationTree } from "./location-tree/LocationTree";
import { LocationProperties } from "./location-properties/LocationProperties";

describe("<LocationEditor />", () => {
  const mountLocationEditor = (state?: LocationEditorState) => {
    const wrapper = mount(withAllProviders(<LocationEditor />, state ? () => state : undefined));

    return {
      wrapper
    };
  };
  
  it("can render", () => {
    mountLocationEditor();
  });

  it("renders correct components", () => {
    const { wrapper } = mountLocationEditor();
    expect(wrapper.find(ProjectTitle).exists()).toBeTruthy();
    expect(wrapper.find(LocationTree).exists()).toBeTruthy();
    expect(wrapper.find(LocationProperties).exists()).toBeFalsy();
  });

  it("renders location properties when location is selected", () => {
    const state = {
      projectTitle: "",
      selectedLocationId: "1",
      locations: {
        "root": { id: "root", value: { id: "root", name: "root", label: "", propertiesAndValues: {} }, children: ["1"] },
        "1": { id: "1", value: { id: "1", name: "1", label: "a", propertiesAndValues: {} }, children: [] }
      }
    };
    const { wrapper } = mountLocationEditor(state);
    expect(wrapper.find(LocationProperties).exists()).toBeTruthy();
  });
});

describe("LocationEditor.redux", () => {
  const blankState = {
          locations: {
            root: {
              id: "root",
              value: {
                id: "root",
                propertiesAndValues: {}
              },
              children: []
            }
          },
          projectTitle: ""
        },
        stateWithOneNode = {
          ...blankState,
          "locations": {
            "1": {
              "children": [],
              "id": "1",
              "value": {
                "id": "1",
                "label": "label",
                "name": "name",
                "propertiesAndValues": {}
              }
            },
            "root": {
              "children": [
                "1"
              ],
              "id": "root",
              "value": {
                "id": "root",
                "propertiesAndValues": {}
              }
            }   
          },
        },
        stateWithTwoSiblingNodes = {
          ...blankState,
          "locations": {
            "1": {
              "children": [],
              "id": "1",
              "value": {
                "id": "1",
                "label": "label",
                "name": "name",
                "propertiesAndValues": {}
              }
            },
            "2": {
              "children": [],
              "id": "2",
              "value": {
                "id": "2",
                "label": "label",
                "name": "name",
                "propertiesAndValues": {}
              }
            },
            "root": {
              "children": [
                "1",
                "2"
              ],
              "id": "root",
              "value": {
                "id": "root",
                "propertiesAndValues": {}
              }
            }
          }
        },
        stateWithTwoSiblingAndOneNestedNode = {
          ...stateWithTwoSiblingNodes,
          "locations": {
            ...stateWithTwoSiblingNodes.locations,
            "3": {
              "children": [],
              "id": "3",
              "value": {
                "id": "3",
                "label": "label",
                "name": "name",
                "propertiesAndValues": {}
              }
            },
            "1": {
              ...stateWithTwoSiblingNodes.locations["1"],
              children: [
                "2"
              ]
            },
            "root": {
              ...stateWithTwoSiblingNodes.locations["root"],
              children: [
                "1"
              ]
            }
          },
        };
  
  describe("actionCreators", () => {
    describe("createSetProjectTitleAction", () => {
      it("creates the action correctly", () => {
        expect(actionCreators.createSetProjectTitleAction("projectTitle")).toEqual(expect.objectContaining({
          type: SET_PROJECT_TITLE,
          projectTitle: "projectTitle"
        }));
      });
    });
  });

  describe("reducer", () => {

    describe("for action SET_PROJECT_TITLE", () => {
      it("sets project title", () => {
        expect(reducer(blankState, { type: SET_PROJECT_TITLE, projectTitle: "Test" }))
          .toEqual(expect.objectContaining({
            projectTitle: "Test"
          }));
      });
    });

    describe("for action SET_SELECTED_LOCATION", () => {
      it("sets selectedLocationId", () => {
        expect(reducer(blankState, { type: SET_SELECTED_LOCATION, id: "Test" }))
          .toEqual(expect.objectContaining({
            selectedLocationId: "Test"
          }));
      });
    });

    describe("for action ADD_NEW_LOCATION", () => {
      it("sets selectedLocationId", () => {
        const action = {
          type: ADD_NEW_LOCATION,
          id: "1",
          parentLocationId: "root",
          name: "name",
          label: "label"
        } as AddNewLocationAction;

        const newState = reducer(blankState, action);

        expect(newState).toEqual(expect.objectContaining({
          "locations": {
            "1": {
              "children": [],
              "id": "1",
              "value": {
                "id": "1",
                "label": "label",
                "name": "name",
                "propertiesAndValues": {}
              }
            },
            "root": {
              "children": [
                "1"
              ],
              "id": "root",
              "value": {
                "id": "root",
                "propertiesAndValues": {}
              }
            }
          }
        }));
      });
    });

    describe("for action DELETE_LOCATIONS", () => {
      it("deletes the specified location", () => {
        const action = {
          type: DELETE_LOCATION,
          id: "1"
        } as DeleteLocationAction;

        const newState = reducer(stateWithTwoSiblingNodes, action);

        expect(newState.locations["1"]).toBeUndefined();
        expect(newState).toEqual(expect.objectContaining({
          "locations": {
            "2": {
              "children": [],
              "id": "2",
              "value": {
                "id": "2",
                "label": "label",
                "name": "name",
                "propertiesAndValues": {}
              }
            },
            "root": {
              "children": [
                "2"
              ],
              "id": "root",
              "value": {
                "id": "root",
                "propertiesAndValues": {}
              }
            }
          }
        }));
      });
    });

    describe("for action REORDER_LOCATION", () => {
      it("reorders the specified location at a peer level", () => {
        const action = {
          type: REORDER_LOCATION,
          locationToReorderId: "1",
          locationRelativeToId: "2",
          placement: "after"
        } as ReorderLocationAction;

        const newState = reducer(stateWithTwoSiblingNodes, action);

        expect(newState).toEqual(expect.objectContaining({
          "locations": expect.objectContaining({
            "root": expect.objectContaining({
              "children": [
                "2",
                "1"
              ]
            })
          })
        }));
      });

      it("reorders the specified location at parent/child levels", () => {
        const action = {
          type: REORDER_LOCATION,
          locationToReorderId: "3",
          locationRelativeToId: "2",
          placement: "after"
        } as ReorderLocationAction;

        const newState = reducer(stateWithTwoSiblingAndOneNestedNode, action);

        expect(newState).toEqual(expect.objectContaining({
          "locations": expect.objectContaining({
            "1": expect.objectContaining({
              children: [
                "2",
                "3"
              ]
            }),
            "root": expect.objectContaining({
              "children": [
                "1"
              ]
            })
          })
        }));
      });
    });

    describe("for action SET_LOCATION_LABEL", () => {
      it("sets new label on specified location", () => {
        const action = {
          type: SET_LOCATION_LABEL,
          id: "1",
          label: "label2"
        } as SetLocationLabelAction;

        const newState = reducer(stateWithOneNode, action);

        expect(newState).toEqual(expect.objectContaining({
          "locations": expect.objectContaining({
            "1": expect.objectContaining({
              "value": expect.objectContaining({
                "label": "label2",
              })
            })
          })
        }));
      });
    });

    describe("for action SET_LOCATION_NAME", () => {
      it("sets new value on secified location", () => {
        const action = {
          type: SET_LOCATION_NAME,
          id: "1",
          name: "name2"
        } as SetLocationNameAction;

        const newState = reducer(stateWithOneNode, action);

        expect(newState)
          .toEqual(expect.objectContaining({
            "locations": expect.objectContaining({
              "1": expect.objectContaining({
                "value": expect.objectContaining({
                  "name": "name2",
                })
              })
            })
          }));
      });
    });

    describe("for action SET_LOCATION_PROPERTY", () => {
      describe("when property name and value don't exist", () => {
        it("adds property name and value", () => {
          const action = {
            type: SET_LOCATION_PROPERTY,
            id: "1",
            name: "name",
            newName: "name",
            newValue: "value"
          } as SetLocationPropertyAction;

          const newState = reducer(stateWithOneNode, action);

          expect(newState)
            .toEqual(expect.objectContaining({
              "locations": expect.objectContaining({
                "1": expect.objectContaining({
                  "id": "1",
                  "value": expect.objectContaining({
                    "id": "1",
                    "propertiesAndValues": {
                      "name": "value"
                    }
                  })
                })
              })
            }));
        });
      });

      describe("when property name exists but should have a new value", () => {
        it("sets property value to newValue", () => {
          const action = {
            type: SET_LOCATION_PROPERTY,
            id: "1",
            name: "name",
            newName: "name",
            newValue: "newValue"
          } as SetLocationPropertyAction;

          const stateWithNodeWithPropertyAndValue = {
            ...stateWithOneNode,
            locations: {
              ...stateWithOneNode.locations,
              "1": {
                ...stateWithOneNode.locations["1"],
                propertiesAndValues: {
                  "name": "oldValue"
                }
              }
            }
          };

          const newState = reducer(stateWithNodeWithPropertyAndValue, action);

          expect(newState).toEqual(expect.objectContaining({
            "locations": expect.objectContaining({
              "1": expect.objectContaining({
                "id": "1",
                "value": expect.objectContaining({
                  "id": "1",
                  "propertiesAndValues": {
                    "name": "newValue"
                  }
                })
              })
            })
          }));
        });
      });

      describe("when property name exists but should have a new value name and value", () => {
        it("sets property value to newValue", () => {
          const action = {
            type: SET_LOCATION_PROPERTY,
            id: "1",
            name: "oldName",
            newName: "newName",
            newValue: "newValue"
          } as SetLocationPropertyAction;

          const stateWithNodeWithPropertyAndValue = {
            ...stateWithOneNode,
            locations: {
              ...stateWithOneNode.locations,
              "1": {
                ...stateWithOneNode.locations["1"],
                propertiesAndValues: {
                  "oldName": "oldValue"
                }
              }
            }
          };

          const newState = reducer(stateWithNodeWithPropertyAndValue, action);

          expect(newState).toEqual(expect.objectContaining({
            "locations": expect.objectContaining({
              "1": expect.objectContaining({
                "id": "1",
                "value": expect.objectContaining({
                  "id": "1",
                  "propertiesAndValues": {
                    "newName": "newValue"
                  }
                })
              })
            })
          }));
        });
      });
    });

    describe("for action DELETE_LOCATION_PROPERTY", () => {
      describe("when property name and value don't exist", () => {
        it("adds property name and value", () => {
          const action = {
            type: DELETE_LOCATION_PROPERTY,
            id: "1",
            name: "name"
          } as DeleteLocationPropertyAction;

          const stateWithNodeWithPropertyAndValue = {
            ...stateWithOneNode,
            locations: {
              ...stateWithOneNode.locations,
              "1": {
                ...stateWithOneNode.locations["1"],
                propertiesAndValues: {
                  "name": "value"
                }
              }
            }
          };

          const newState = reducer(stateWithNodeWithPropertyAndValue, action);

          expect(newState.locations["1"].value.propertiesAndValues.name).toBeUndefined();
        });
      });
    });
  });  
});