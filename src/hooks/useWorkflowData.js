import { useState, useMemo, useCallback } from "react";
import { i18n } from "../i18n/translations"; // WICHTIG: Der Import für die Übersetzungen

export const useWorkflowData = () => {
  // *** HIER IST DIE KORREKTUR: Die Übersetzungs-Hooks sind wieder da ***
  const [lang, setLang] = useState("de");
  const t = i18n[lang];

  const [workflowData, setWorkflowData] = useState(null);
  const [activeVar, setActiveVar] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [highlightedStepId, setHighlightedStepId] = useState(null);

  const handleFileUpload = useCallback(async (file) => {
    if (!file) return;

    // Reset state before new upload
    setWorkflowData(null);
    setActiveVar(null);
    setSearchTerm("");
    setHighlightedStepId(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/parse-workflow", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      if (!response.ok || result.error) {
        throw new Error(result.error || `Serverfehler: ${response.statusText}`);
      }

      setWorkflowData(result);
    } catch (error) {
      console.error("Fehler:", error);
      alert(`Die Datei konnte nicht verarbeitet werden: ${error.message}`);
      setWorkflowData(null); // Ensure data is cleared on error
    }
  }, []);

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
  }, []);

  const resetWorkflow = useCallback(() => {
    setWorkflowData(null);
    onClear();
    setHighlightedStepId(null);
  }, [onClear]);

  const loadAnotherWorkflow = useCallback(() => {
    document.getElementById("file-input")?.click();
  }, []);

  const onNodeClick = useCallback((e, targetId) => {
    e.preventDefault();
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, []);

  // *** HIER IST DIE KORREKTUR: Der Sprachumschalter ist wieder da ***
  const toggleLang = useCallback(
    () => setLang((l) => (l === "de" ? "en" : "de")),
    [],
  );

  const visibleSteps = useMemo(() => {
    if (!workflowData || !workflowData.steps) return [];

    const filterTerm = activeVar || searchTerm;
    if (!filterTerm) return workflowData.steps;

    const termLower = filterTerm.toLowerCase();

    return workflowData.steps.filter((step) => {
      const check = activeVar
        ? (v) => v.toLowerCase() === termLower
        : (v) => v.toLowerCase().includes(termLower);

      const createsVar = step.creates?.some(check);
      const usesVar = step.uses?.some(check);

      return createsVar || usesVar;
    });
  }, [workflowData, activeVar, searchTerm]);

  // *** HIER IST DIE KORREKTUR: Der Code ist nun gegen 'undefined' abgesichert ***
  const allVars = useMemo(
    () =>
      workflowData && workflowData.globalVars
        ? Object.keys(workflowData.globalVars)
        : [],
    [workflowData],
  );

  return {
    lang,
    t, // Das `t`-Objekt wird wieder exportiert
    workflowData,
    activeVar,
    searchTerm,
    highlightedStepId,
    visibleSteps,
    handleFileUpload,
    onSelectVar,
    onClear,
    onNodeClick,
    toggleLang, // Der Sprachumschalter wird wieder exportiert
    resetWorkflow,
    loadAnotherWorkflow,
    allVars,
  };
};
