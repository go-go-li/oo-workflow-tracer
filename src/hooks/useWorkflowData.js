import { useState, useMemo, useCallback } from "react";
import { i18n } from "../i18n/translations";

/**
 * Baut eine Baumstruktur aus einer flachen Dateiliste (FileList),
 * wie sie vom <input webkitdirectory> bereitgestellt wird.
 * @param {FileList} fileList - Die Liste der Dateien aus dem Verzeichnis.
 * @returns {object|null} - Ein Objekt mit dem Workspace-Namen und der Baumstruktur oder null.
 */
const buildTreeFromFileList = (fileList) => {
  if (!fileList || fileList.length === 0) return null;

  const root = { children: [] };
  const firstPath = fileList[0]?.webkitRelativePath;
  const workspaceName = firstPath ? firstPath.split("/")[0] : "Workspace";

  for (const file of fileList) {
    if (!file.name.endsWith(".xml")) continue;

    const pathParts = file.webkitRelativePath.split("/");
    let currentNode = root;

    pathParts.forEach((part, index) => {
      if (index === pathParts.length - 1) {
        // Es ist die Datei
        currentNode.children.push({
          kind: "file",
          name: part,
          path: file.webkitRelativePath,
          handle: file, // `handle` ist jetzt das File-Objekt
        });
      } else {
        // Es ist ein Ordner
        let childNode = currentNode.children.find(
          (child) => child.name === part && child.kind === "directory",
        );
        if (!childNode) {
          childNode = {
            kind: "directory",
            name: part,
            path: pathParts.slice(0, index + 1).join("/"),
            children: [],
          };
          currentNode.children.push(childNode);
        }
        currentNode = childNode;
      }
    });
  }

  // Sortiere jede Ebene des Baums: Ordner zuerst, dann alphabetisch
  const sortTree = (node) => {
    if (!node.children) return;
    node.children.sort((a, b) => {
      if (a.kind === b.kind) return a.name.localeCompare(b.name);
      return a.kind === "directory" ? -1 : 1;
    });
    node.children.forEach((child) => {
      if (child.kind === "directory") sortTree(child);
    });
  };

  sortTree(root);
  return { name: workspaceName, children: root.children };
};

export const useWorkflowData = () => {
  const [lang, setLang] = useState("de");
  const t = i18n[lang];

  const [workspace, setWorkspace] = useState(null);
  const [activeWorkflowPath, setActiveWorkflowPath] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [workflowData, setWorkflowData] = useState(null);
  const [activeVar, setActiveVar] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [highlightedStepId, setHighlightedStepId] = useState(null);

  const handleFileUpload = useCallback(async (file) => {
    if (!file) return;
    setIsLoading(true);
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
      if (!response.ok)
        throw new Error(result.error || `Server Error: ${response.statusText}`);
      setWorkflowData(result);
    } catch (error) {
      console.error("Fehler bei der Dateiverarbeitung:", error);
      alert(`Die Datei konnte nicht verarbeitet werden: ${error.message}`);
      setWorkflowData(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleWorkspaceUpload = useCallback(
    (fileList) => {
      setIsLoading(true);
      setWorkspace(null);
      resetWorkflow();
      try {
        const tree = buildTreeFromFileList(fileList);
        if (tree && tree.children.length > 0) {
          setWorkspace(tree);
        } else {
          alert(
            t.workspaceEmpty ||
              "Keine .xml-Dateien in diesem Verzeichnis gefunden.",
          );
        }
      } catch (error) {
        console.error("Fehler beim Erstellen des Workspace-Baums:", error);
        alert("Der Workspace konnte nicht geladen werden.");
      } finally {
        setIsLoading(false);
      }
    },
    [t],
  ); // `t` als Abhängigkeit hinzufügen

  const handleWorkflowSelect = useCallback(
    async (file) => {
      if (!file) return;
      setActiveWorkflowPath(file.name);
      await handleFileUpload(file);
    },
    [handleFileUpload],
  );

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
    setActiveWorkflowPath(null);
  }, [onClear]);

  const resetWorkspace = useCallback(() => {
    setWorkspace(null);
    resetWorkflow();
  }, [resetWorkflow]);

  const onNodeClick = useCallback((e, targetId) => {
    e.preventDefault();
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, []);

  const toggleLang = useCallback(
    () => setLang((l) => (l === "de" ? "en" : "de")),
    [],
  );

  const visibleSteps = useMemo(() => {
    if (!workflowData?.steps) return [];
    const filterTerm = activeVar || searchTerm;
    if (!filterTerm) return workflowData.steps;

    const termLower = filterTerm.toLowerCase();
    return workflowData.steps.filter((step) => {
      const check = activeVar
        ? (v) => v.toLowerCase() === termLower
        : (v) => v.toLowerCase().includes(termLower);
      return step.creates?.some(check) || step.uses?.some(check);
    });
  }, [workflowData, activeVar, searchTerm]);

  const allVars = useMemo(
    () =>
      workflowData?.globalVars ? Object.keys(workflowData.globalVars) : [],
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
    allVars,
    isLoading,
    workspace,
    activeWorkflowPath,
    handleWorkspaceUpload,
    handleWorkflowSelect,
    resetWorkspace,
  };
};
