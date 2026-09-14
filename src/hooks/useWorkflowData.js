import { useState, useMemo, useCallback } from "react";
import { i18n } from "../i18n/translations";

export const useWorkflowData = () => {
  const [lang, setLang] = useState("de");
  const [workflowData, setWorkflowData] = useState(null);
  const [activeVar, setActiveVar] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [highlightedStepId, setHighlightedStepId] = useState(null);

  const t = i18n[lang];

  const handleFileUpload = useCallback(async (file) => {
    if (!file) return;
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
      if (!response.ok) {
        const errorResult = await response
          .json()
          .catch(() => ({ error: `Serverfehler: ${response.statusText}` }));
        throw new Error(errorResult.error);
      }
      const result = await response.json();
      setWorkflowData(result);
    } catch (error) {
      console.error("Fehler:", error);
      alert(`Fehler: ${error.message}`);
      setWorkflowData(null);
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
    if (element)
      element.scrollIntoView({ behavior: "smooth", block: "center" });
  }, []);

  const toggleLang = useCallback(
    () => setLang((l) => (l === "de" ? "en" : "de")),
    [],
  );

  const visibleSteps = useMemo(() => {
    if (!workflowData) return [];
    if (!activeVar) return workflowData.steps;
    const termLower = activeVar.toLowerCase();
    return workflowData.steps.filter(
      (step) =>
        step.creates.some((v) => v.toLowerCase().includes(termLower)) ||
        step.uses.some((v) => v.toLowerCase().includes(termLower)),
    );
  }, [workflowData, activeVar]);

  const allVars = useMemo(
    () => (workflowData ? Object.keys(workflowData.globalVars) : []),
    [workflowData],
  );

  return {
    lang,
    t,
    workflowData,
    activeVar,
    searchTerm,
    highlightedStepId,
    visibleSteps,
    handleFileUpload,
    onSelectVar,
    onClear,
    onNodeClick,
    toggleLang,
    resetWorkflow,
    loadAnotherWorkflow,
    allVars,
  };
};
