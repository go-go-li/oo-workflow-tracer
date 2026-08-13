/**
 * Contains XML tag names, attributes, and selectors as constants.
 * This centralization facilitates maintenance if the XML structure changes.
 * @const {object}
 */
export const XML_TAGS = {
  FLOW: "flow",
  STEP: "step",
  RETURN_STEP: "returnStep",
  START_STEPS: "startSteps",
  TRANSITION: "transition",
  DESTINATION_REF: "destination > refId",
  NAME: "name",
  DESCRIPTION: "descriptionCdata",

  // Bindings & Inputs
  INPUT_BINDING_QUERIES: "inputs > userInputBinding, inputs > staticBinding",
  BINDING_QUERIES: "staticBinding, binding",
  INPUT_SYMBOL: "inputSymbol",
  VALUE: "value",

  // Assignments
  ASSIGNMENT: "flowVariableAssignment",
  CONTEXT_KEY: "contextKey",
  EXPRESSION: "expression",
  FIELD_NAME: "fieldName",
  SOURCE_TYPE: "sourceType",

  // Filters & Scriptlets
  FILTERS: "filters > *",
  SCRIPTLET_FILTER: "scriptletFilter",
  SCRIPTLET: "scriptlet",
  SCRIPT: "script",
  SCRIPT_REF: "scriptRef > refName",
  POST_STEP_SCRIPTLET: "postStepScriptlet",
};

/**
 * Keywords used to identify the "Happy Path" in transitions.
 * This centralizes the logic for path sorting.
 * @const {string[]}
 */
export const HAPPY_PATH_KEYWORDS = [
  "success",
  "done",
  "true",
  "lock created",
  "resolve",
  "create",
  "notnull",
];

/**
 * Default values for names and other attributes if they are missing in the XML.
 * @const {object}
 */
export const DEFAULTS = {
  STEP_NAME: "Unbenannter Schritt",
  RETURN_STEP_NAME: "Endschritt",
  TRANSITION_NAME: "success",
  UNKNOWN_WORKFLOW_NAME: "Unbekannter Workflow",
  DELIMITER: "|",
};
