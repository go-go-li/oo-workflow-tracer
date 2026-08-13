import { XML_TAGS, DEFAULTS } from "./ooParser.config.js";
import { getDirectText, extractVariables } from "./ooParser.utils.js";

/**
 * Parses the input bindings of a step and registers any used variables.
 * @param {Element} stepNode - The XML element for the step.
 * @param {string} stepId - The ID of the step.
 * @param {Function} registerVariableAccess - Callback to register variable usage.
 * @returns {{inputs: object[], keyNamesValue: string, myValuesValue: string, stepDelimiter: string}} An object containing parsed inputs and related values.
 */
const parseStepInputs = (stepNode, stepId, registerVariableAccess) => {
  const inputs = [];
  let keyNamesValue = "";
  let myValuesValue = "";
  let stepDelimiter = DEFAULTS.DELIMITER;

  const bindings = stepNode.querySelectorAll(XML_TAGS.BINDING_QUERIES);

  bindings.forEach((bNode) => {
    const symbol = getDirectText(bNode.querySelector(XML_TAGS.INPUT_SYMBOL));
    const value = getDirectText(bNode.querySelector(XML_TAGS.VALUE));
    if (symbol.toLowerCase() === "delimiter") {
      stepDelimiter = value || DEFAULTS.DELIMITER;
    }
  });

  bindings.forEach((bNode) => {
    const symbol = getDirectText(bNode.querySelector(XML_TAGS.INPUT_SYMBOL));
    const value = getDirectText(bNode.querySelector(XML_TAGS.VALUE));

    if (symbol) {
      inputs.push({ symbol, value });

      if (["keyname", "keynames"].includes(symbol.toLowerCase()))
        keyNamesValue = value;
      if (["myvalue", "myvalues"].includes(symbol.toLowerCase()))
        myValuesValue = value;

      extractVariables(value).forEach((v) =>
        registerVariableAccess(v, stepId, "usedIn"),
      );
    }
  });

  return { inputs, keyNamesValue, myValuesValue, stepDelimiter };
};

/**
 * Parses the `flowVariableAssignment` elements of a step to determine which variables are created.
 * @param {Element} stepNode - The XML element for the step.
 * @param {string} stepId - The ID of the step.
 * @param {object} inputData - Data parsed from the step's inputs.
 * @param {string} inputData.keyNamesValue - The value from the 'keyNames' input.
 * @param {string} inputData.myValuesValue - The value from the 'myValues' input.
 * @param {string} inputData.stepDelimiter - The delimiter used for key/value pairs.
 * @param {Function} registerVariableAccess - Callback to register variable creation.
 * @returns {object[]} A list of assignment objects.
 */
const parseStepAssignments = (
  stepNode,
  stepId,
  { keyNamesValue, myValuesValue, stepDelimiter },
  registerVariableAccess,
) => {
  const assignmentsList = [];

  if (keyNamesValue) {
    const keys = keyNamesValue.split(stepDelimiter);
    const vals = myValuesValue ? myValuesValue.split(stepDelimiter) : [];
    keys.forEach((keyVal, idx) => {
      const trimmedKey = keyVal.trim();
      if (trimmedKey) {
        let assignedVal = "dyn.";
        if (vals.length === 1) assignedVal = vals[0];
        else if (vals.length > idx) assignedVal = vals[idx];

        assignmentsList.push({
          variable: trimmedKey,
          value: String(assignedVal),
          source: `Zuweisung über keyNames (Trenner: ${stepDelimiter})`,
          filters: [],
          scriptlet: null,
        });
        registerVariableAccess(trimmedKey, stepId, "createdIn");
      }
    });
  }

  const assignmentNodes = stepNode.querySelectorAll(XML_TAGS.ASSIGNMENT);
  assignmentNodes.forEach((assNode) => {
    const contextKeyNode = assNode.querySelector(XML_TAGS.CONTEXT_KEY);
    if (!contextKeyNode) return;

    const varName = getDirectText(contextKeyNode);
    let assignmentValue = "Schritt-Ergebnis";
    let assignmentSource = "Rückgabewert";
    const filtersList = [];
    let scriptlet = null;

    const expressionNode = assNode.querySelector(XML_TAGS.EXPRESSION);
    if (expressionNode) {
      const expName = getDirectText(
        expressionNode.querySelector(XML_TAGS.NAME),
      );
      const fieldName = getDirectText(
        expressionNode.querySelector(XML_TAGS.FIELD_NAME),
      );
      const sourceType = getDirectText(
        expressionNode.querySelector(XML_TAGS.SOURCE_TYPE),
      );

      assignmentValue = fieldName
        ? `[${sourceType || "Ausgabe"}]: ${fieldName}`
        : expName || "Ausgabe";
      assignmentSource = expName
        ? `Zuweisung aus "${expName}"`
        : `Return-Value (${sourceType || "Standard"})`;

      expressionNode.querySelectorAll(XML_TAGS.FILTERS).forEach((fNode) => {
        const tagName = fNode.tagName || fNode.localName;
        if (tagName === XML_TAGS.SCRIPTLET_FILTER) {
          const scriptletNode = fNode.querySelector(XML_TAGS.SCRIPTLET);
          if (scriptletNode) {
            const refNameNode = scriptletNode.querySelector(
              XML_TAGS.SCRIPT_REF,
            );
            scriptlet = {
              name: refNameNode
                ? getDirectText(refNameNode)
                : getDirectText(scriptletNode.querySelector(XML_TAGS.NAME)) ||
                  "default",
              script: getDirectText(
                scriptletNode.querySelector(XML_TAGS.SCRIPT),
              ),
            };
          }
        } else {
          filtersList.push({
            type: tagName,
            name: getDirectText(fNode.querySelector(XML_TAGS.NAME)) || tagName,
          });
        }
      });
    }

    assignmentsList.push({
      variable: varName,
      value: assignmentValue,
      source: assignmentSource,
      filters: filtersList,
      scriptlet,
    });
    registerVariableAccess(varName, stepId, "createdIn");
  });

  return assignmentsList;
};

/**
 * Parses the post-step scriptlet attached at the step level.
 * @param {Element} stepNode - The XML element for the step.
 * @returns {object|null} The parsed scriptlet object or null if not found.
 */
const parsePostStepScriptlet = (stepNode) => {
  const postStepNode = stepNode.querySelector(XML_TAGS.POST_STEP_SCRIPTLET);
  if (!postStepNode) return null;

  const scriptletNode = postStepNode.querySelector(XML_TAGS.SCRIPTLET);
  if (!scriptletNode) return null;

  const refNameNode = scriptletNode.querySelector(XML_TAGS.SCRIPT_REF);
  return {
    name: refNameNode
      ? getDirectText(refNameNode)
      : getDirectText(scriptletNode.querySelector(XML_TAGS.NAME)) || "postStep",
    script: getDirectText(scriptletNode.querySelector(XML_TAGS.SCRIPT)),
  };
};

/**
 * Orchestrates the parsing of a complete `<step>` XML node.
 * @param {Element} stepNode - The XML element for the step.
 * @param {object} stepInfo - Basic info about the step (ID, number).
 * @param {Map<string, string>} stepNames - A map of all step names by ID.
 * @param {Map<string, object[]>} adjacencies - The workflow's adjacency list.
 * @param {string} startStepId - The ID of the workflow's start step.
 * @param {Function} registerVariableAccess - Callback to register variable access.
 * @returns {object} A detailed object representing the parsed step.
 */
export const parseStep = (
  stepNode,
  stepInfo,
  stepNames,
  adjacencies,
  startStepId,
  registerVariableAccess,
) => {
  const stepId = stepNode.getAttribute("id");

  const inputsData = parseStepInputs(stepNode, stepId, registerVariableAccess);
  const assignments = parseStepAssignments(
    stepNode,
    stepId,
    inputsData,
    registerVariableAccess,
  );
  const stepScriptlet = parsePostStepScriptlet(stepNode);

  const transitions = (adjacencies.get(stepId) || []).map((trans) => ({
    name: trans.name,
    destId: trans.destId,
    destName: stepNames.get(trans.destId) || DEFAULTS.RETURN_STEP_NAME,
  }));

  const uses = inputsData.inputs.flatMap((i) => extractVariables(i.value));

  return {
    id: stepId,
    name: stepNames.get(stepId) || DEFAULTS.STEP_NAME,
    number: stepInfo.number,
    isStartStep: stepId === startStepId,
    inputs: inputsData.inputs,
    assignments,
    transitions,
    stepScriptlet,
    creates: assignments.map((a) => a.variable),
    uses,
  };
};
