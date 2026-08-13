import { XML_TAGS, DEFAULTS } from "./ooParser.config.js";
import { getDirectText, sortStepsChronologically } from "./ooParser.utils.js";
import { parseStep } from "./stepParser.js";

/**
 * Parses the global input parameters of a workflow from the XML document.
 * @param {Document} xmlDoc - The parsed XML document.
 * @returns {string[]} An array of global input variable names.
 */
const parseFlowInputs = (xmlDoc) => {
  const inputs = [];
  const inputNodes = xmlDoc.querySelectorAll(XML_TAGS.INPUT_BINDING_QUERIES);
  inputNodes.forEach((node) => {
    const symbolNode = node.querySelector(XML_TAGS.INPUT_SYMBOL);
    if (symbolNode) {
      inputs.push(getDirectText(symbolNode));
    }
  });
  return inputs;
};

/**
 * Builds the basic topology of the workflow, including nodes (steps) and edges (transitions).
 * @param {Document} xmlDoc - The parsed XML document.
 * @returns {{allNodesById: Map<string, Element>, adjacencies: Map<string, object[]>, stepNames: Map<string, string>}} An object containing maps for nodes, adjacency lists, and step names.
 */
const buildWorkflowTopology = (xmlDoc) => {
  const allNodesById = new Map();
  const adjacencies = new Map();
  const stepNames = new Map();

  /**
   * Processes a list of nodes to populate the topology maps.
   * @param {NodeListOf<Element>} nodeList - A list of XML elements (e.g., steps, returnSteps).
   * @param {string} defaultName - A default name to use if a node has no name.
   */
  const processNodes = (nodeList, defaultName) => {
    nodeList.forEach((node) => {
      const id = node.getAttribute("id");
      if (!id) return;

      const name =
        getDirectText(node.querySelector(XML_TAGS.NAME)) || defaultName;
      allNodesById.set(id, node);
      stepNames.set(id, name);

      if (node.tagName === XML_TAGS.STEP) {
        adjacencies.set(id, []);
        const transitions = node.querySelectorAll(XML_TAGS.TRANSITION);
        transitions.forEach((trans) => {
          const destRefNode = trans.querySelector(XML_TAGS.DESTINATION_REF);
          if (destRefNode) {
            adjacencies.get(id).push({
              destId: getDirectText(destRefNode),
              name:
                getDirectText(trans.querySelector(XML_TAGS.NAME)) ||
                DEFAULTS.TRANSITION_NAME,
            });
          }
        });
      }
    });
  };

  processNodes(xmlDoc.querySelectorAll(XML_TAGS.STEP), DEFAULTS.STEP_NAME);
  processNodes(
    xmlDoc.querySelectorAll(XML_TAGS.RETURN_STEP),
    DEFAULTS.RETURN_STEP_NAME,
  );

  return { allNodesById, adjacencies, stepNames };
};

/**
 * The main function to parse the entire XML workflow string. It orchestrates
 * the parsing of inputs, topology, and individual steps.
 * @param {string} xmlString - The XML content of the workflow file as a string.
 * @returns {object} A comprehensive workflow data object.
 */
export const parseXMLWorkflow = (xmlString) => {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlString, "text/xml");

  const flowInputs = parseFlowInputs(xmlDoc);
  const { allNodesById, adjacencies, stepNames } =
    buildWorkflowTopology(xmlDoc);

  const flowName =
    getDirectText(
      xmlDoc.querySelector(`${XML_TAGS.FLOW} > ${XML_TAGS.NAME}`),
    ) || DEFAULTS.UNKNOWN_WORKFLOW_NAME;
  const startStepId = getDirectText(
    xmlDoc.querySelector(`${XML_TAGS.START_STEPS} > refId`),
  );

  const orderedSteps = sortStepsChronologically(
    startStepId,
    adjacencies,
    allNodesById,
  );

  const globalVarsMap = new Map();
  flowInputs.forEach((inputVar) => {
    if (inputVar) {
      globalVarsMap.set(inputVar, {
        createdIn: [],
        usedIn: [],
        isFlowInput: true,
      });
    }
  });

  /**
   * Registers a variable access (creation or usage) in the global variable map.
   * @param {string} vName - The name of the variable.
   * @param {string} stepId - The ID of the step where the access occurred.
   * @param {'createdIn'|'usedIn'} accessType - The type of access.
   */
  const registerVariableAccess = (vName, stepId, accessType) => {
    if (!vName) return;
    if (!globalVarsMap.has(vName)) {
      globalVarsMap.set(vName, {
        createdIn: [],
        usedIn: [],
        isFlowInput: false,
      });
    }
    const varObj = globalVarsMap.get(vName);
    if (!varObj[accessType].includes(stepId)) {
      varObj[accessType].push(stepId);
    }
  };

  const stepsDetails = orderedSteps
    .map((stepInfo) => {
      const stepNode = allNodesById.get(stepInfo.id);
      return stepNode && stepNode.tagName === XML_TAGS.STEP
        ? parseStep(
            stepNode,
            stepInfo,
            stepNames,
            adjacencies,
            startStepId,
            registerVariableAccess,
          )
        : null;
    })
    .filter(Boolean);

  return {
    flowName,
    flowInputs,
    steps: stepsDetails,
    globalVars: Object.fromEntries(globalVarsMap),
    stepNames: Object.fromEntries(stepNames),
  };
};
