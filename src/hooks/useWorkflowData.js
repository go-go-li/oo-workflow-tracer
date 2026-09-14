import { useState, useMemo, useCallback } from "react";
import { i18n } from "../i18n/translations";

export const useWorkflowData = () => {
  const [lang, setLang] = useState("de");
  const [workflowData, setWorkflowData] = useState(null);
  const [activeVar, setActiveVar] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [highlightedStepId, setHighlightedStepId] = useState(null);
  // Das "sourceFile" State wird nicht mehr benötigt und wurde entfernt.

  const t = i18n[lang];

  const handleFileUpload = useCallback(async (file) => {
    if (!file) return;

    // Das Speichern der Quelldatei ist nicht mehr nötig.
    // setSourceFile(file);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/parse-workflow", {
        method: "POST",
        body: formData,
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || `Serverfehler: ${response.statusText}`);
      }
      setWorkflowData(result);
      setActiveVar(null);
      setSearchTerm("");
      setHighlightedStepId(null);
    } catch (error) {
      console.error("Fehler beim Verarbeiten der Workflow-Datei:", error);
      alert(`Die Datei konnte nicht verarbeitet werden: ${error.message}`);
      setWorkflowData(null);
    }
  }, []);

  // Die "handleRefresh" Funktion wurde komplett entfernt.

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

  const resetWorkflow = useCallback(() => {
    setWorkflowData(null);
    // setSourceFile(null); // Nicht mehr nötig
    onClear();
  }, [onClear]);

  const loadAnotherWorkflow = useCallback(() => {
    const fileInput = document.getElementById("file-input");
    if (fileInput) fileInput.click();
  }, []);

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
    // handleRefresh, // aus dem Return-Objekt entfernt
    onSelectVar,
    onClear,
    onNodeClick,
    toggleLang,
    resetWorkflow,
    loadAnotherWorkflow,
  };
};
