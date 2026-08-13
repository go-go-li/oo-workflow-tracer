import { useState, useMemo, useCallback } from "react";
import { parseXMLWorkflow } from "../utils/ooParser";
import { i18n } from "../i18n/translations";

/**
 * @typedef {object} WorkflowDataHook
 * @property {string} lang - The current language ('de' or 'en').
 * @property {object} t - The translation object for the current language.
 * @property {object|null} workflowData - The parsed workflow data object.
 * @property {string|null} activeVar - The currently selected variable for detailed analysis.
 * @property {string} searchTerm - The current search term from the input field.
 * @property {string|null} highlightedStepId - The ID of the step to be highlighted.
 * @property {Array<object>} visibleSteps - The steps to be displayed, filtered by the search term.
 * @property {(file: File) => void} handleFileUpload - Function to process an uploaded file.
 * @property {() => void} handleRefresh - Function to re-process the current file.
 * @property {(varName: string, exact: boolean) => void} onSelectVar - Function to handle variable selection.
 * @property {() => void} onClear - Function to clear the current search and selection.
 * @property {(e: React.MouseEvent, targetId: string) => void} onNodeClick - Function to handle clicks on step nodes/links.
 * @property {() => void} toggleLang - Function to toggle the language.
 * @property {() => void} resetWorkflow - Function to reset the application to its initial state.
 */

/**
 * A custom hook that encapsulates all the business logic and state management
 * for the workflow analysis dashboard.
 *
 * @returns {WorkflowDataHook} An object containing the state and action dispatchers.
 */
export const useWorkflowData = () => {
  const [lang, setLang] = useState("de");
  const [workflowData, setWorkflowData] = useState(null);
  const [activeVar, setActiveVar] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [highlightedStepId, setHighlightedStepId] = useState(null);
  const [sourceFile, setSourceFile] = useState(null); // Store the uploaded file

  const t = i18n[lang];

  /**
   * Processes the text content of a workflow file.
   * @param {string} text - The XML content as a string.
   */
  const processWorkflowText = (text) => {
    try {
      const parsed = parseXMLWorkflow(text);
      setWorkflowData(parsed);
    } catch (error) {
      console.error("Fehler beim Parsen der XML-Datei:", error);
      alert(
        "Die XML-Datei konnte nicht verarbeitet werden. Bitte prüfen Sie die Konsole für Details.",
      );
    }
  };

  const handleFileUpload = useCallback((file) => {
    if (file) {
      setSourceFile(file); // Save the file object
      const reader = new FileReader();
      reader.onload = (event) => {
        processWorkflowText(event.target.result);
        // Reset state on new file upload
        setActiveVar(null);
        setSearchTerm("");
        setHighlightedStepId(null);
      };
      reader.readAsText(file);
    }
  }, []);

  const handleRefresh = useCallback(() => {
    if (sourceFile) {
      const reader = new FileReader();
      reader.onload = (event) => {
        // Only update workflow data, keep filters
        processWorkflowText(event.target.result);
      };
      reader.readAsText(sourceFile);
    }
  }, [sourceFile]);

  const onSelectVar = useCallback((varName, exact = true) => {
    setSearchTerm(varName);
    if (exact) {
      setActiveVar(varName);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      setActiveVar(null);
    }
  }, []);

  const onClear = useCallback(() => {
    setActiveVar(null);
    setSearchTerm("");
    setHighlightedStepId(null);
  }, []);

  /**
   * Resets the entire workflow state, allowing a new file to be uploaded.
   */
  const resetWorkflow = useCallback(() => {
    setWorkflowData(null);
    setSourceFile(null);
    onClear();
  }, [onClear]);

  const onNodeClick = useCallback((e, targetId) => {
    e.preventDefault();
    const element = document.getElementById(targetId);
    if (element) {
      setHighlightedStepId(targetId);
      element.scrollIntoView({ behavior: "smooth", block: "center" });
      window.history.pushState(null, null, `#${targetId}`);
    }
  }, []);

  const toggleLang = useCallback(() => {
    setLang((l) => (l === "de" ? "en" : "de"));
  }, []);

  const visibleSteps = useMemo(() => {
    if (!workflowData) return [];
    if (!searchTerm) return workflowData.steps;

    const termLower = searchTerm.toLowerCase();
    return workflowData.steps.filter((step) => {
      const createsVar = step.creates.some((v) =>
        v.toLowerCase().includes(termLower),
      );
      const usesVar = step.uses.some((v) =>
        v.toLowerCase().includes(termLower),
      );
      return createsVar || usesVar;
    });
  }, [workflowData, searchTerm]);

  return {
    lang,
    t,
    workflowData,
    activeVar,
    searchTerm,
    highlightedStepId,
    visibleSteps,
    handleFileUpload,
    handleRefresh,
    onSelectVar,
    onClear,
    onNodeClick,
    toggleLang,
    resetWorkflow,
  };
};
