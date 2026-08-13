import { HAPPY_PATH_KEYWORDS } from "./ooParser.config.js";

/**
 * Extracts the direct text content of an XML node, excluding child elements.
 * @param {Node} node - The XML node.
 * @returns {string} The extracted and trimmed text.
 */
export const getDirectText = (node) => {
  if (!node) return "";
  return Array.from(node.childNodes)
    .filter((n) => n.nodeType === 3) // Node.TEXT_NODE
    .map((n) => n.nodeValue)
    .join("")
    .trim();
};

/**
 * Extracts variable names in the format `${variable}` from a string.
 * @param {string} valString - The string to search.
 * @returns {string[]} An array of found variable names (without the `${}` syntax).
 */
export const extractVariables = (valString) => {
  if (!valString || typeof valString !== "string") return [];
  const matches = valString.match(/\$\{([^}]+)\}/g) || [];
  return matches.map((m) => m.slice(2, -1).trim());
};

/**
 * Sorts workflow steps using a Depth-First Search (DFS) approach, attempting to
 * establish a logical chronological order by prioritizing the "Happy Path".
 * @param {string} startStepId - The ID of the starting step.
 * @param {Map<string, Array<{destId: string, name: string}>>} adjacencies - The adjacency list representing workflow transitions.
 * @param {Map<string, Node>} allNodesById - A map of all step nodes by their ID.
 * @returns {Array<{id: string, number: string}>} A sorted list of step objects with hierarchical numbering.
 */
export const sortStepsChronologically = (
  startStepId,
  adjacencies,
  allNodesById,
) => {
  const orderedSteps = [];
  const visited = new Map();

  function dfs(stepId, prefix) {
    if (!stepId || visited.has(stepId)) return;

    visited.set(stepId, prefix);
    orderedSteps.push({ id: stepId, number: prefix });

    const neighbors = adjacencies.get(stepId) || [];

    const successNext = neighbors.find((n) =>
      HAPPY_PATH_KEYWORDS.includes(n.name.toLowerCase()),
    )?.destId;

    // First, traverse the "side paths" (all except the happy path)
    neighbors
      .filter((n) => n.destId !== successNext)
      .forEach((branch, index) => {
        dfs(branch.destId, `${prefix}.${index + 1}`);
      });

    // Then, follow the "happy path" if it exists
    if (successNext) {
      const parts = prefix.split(".").map((n) => parseInt(n, 10));
      parts[parts.length - 1]++;
      dfs(successNext, parts.join("."));
    }
  }

  if (startStepId) {
    dfs(startStepId, "1");
  }

  // Add any remaining, unvisited nodes (e.g., isolated paths)
  allNodesById.forEach((_, key) => {
    if (!visited.has(key)) {
      orderedSteps.push({ id: key, number: "?" });
    }
  });

  return orderedSteps;
};
