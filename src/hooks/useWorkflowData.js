import { useState, useMemo, useCallback } from "react";
import { i18n } from "../i18n/translations";

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
        currentNode.children.push({
          kind: "file",
          name: part,
          path: file.webkitRelativePath,
          handle: file,
        });
      } else {
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

const parseXmlForIndex = async (file) => {
  const text = await file.text();
  const idMatch = text.match(
    /<(?:(?:\w+:)?flow|(?:\w+:)?operation)\s+id="([^"]+)"/,
  );
  const id = idMatch ? idMatch[1].trim().toLowerCase() : null;
  const nameMatch = text.match(/<name>([^<]+)<\/name>/);
  const name = nameMatch ? nameMatch[1] : file.name;
  const refIdRegex = /<(?:\w+:)?refId>([^<]+)<\/(?:\w+:)?refId>/g;
  const references = [];
  let match;
  while ((match = refIdRegex.exec(text)) !== null) {
    references.push(match[1].trim().toLowerCase());
  }
  return { id, name, file, references };
};

export const useWorkflowData = () => {
  const [lang, setLang] = useState("de");
  const t = i18n[lang];

  const [workspace, setWorkspace] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [usageIndex, setUsageIndex] = useState(null);
  const [usageData, setUsageData] = useState([]);
  const [workflowData, setWorkflowData] = useState(null);
  const [activeWorkflowPath, setActiveWorkflowPath] = useState(null);
  const [activeVar, setActiveVar] = useState(null);
  const [highlightedStepId, setHighlightedStepId] = useState(null);
  const [folderToExpand, setFolderToExpand] = useState(null);

  // ZENTRALISIERUNG: Der Explorer-Filterzustand wird jetzt hier verwaltet.
  const [explorerSearchTerm, setExplorerSearchTerm] = useState("");

  const parseAndSetWorkflow = useCallback(async (file) => {
    setIsLoading(true);
    setWorkflowData(null);
    setActiveVar(null);
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
      console.error("Fehler bei der Workflow-Analyse:", error);
      alert(`Die Datei konnte nicht analysiert werden: ${error.message}`);
      setWorkflowData(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleWorkspaceUpload = useCallback(
    async (fileList) => {
      setIsLoading(true);
      setWorkspace(null);
      setWorkflowData(null);
      setUsageIndex(null);
      setUsageData([]);
      try {
        const tree = buildTreeFromFileList(fileList);
        if (!tree || tree.children.length === 0) {
          alert(t.workspaceEmpty);
          setIsLoading(false);
          return;
        }
        setWorkspace(tree);
        const files = Array.from(fileList).filter((f) =>
          f.name.endsWith(".xml"),
        );
        const parsedFiles = await Promise.all(files.map(parseXmlForIndex));
        const newIndex = new Map();
        for (const p of parsedFiles) {
          if (p.id) {
            newIndex.set(p.id, {
              name: p.name,
              file: p.file,
              references: p.references,
            });
          }
        }
        setUsageIndex(newIndex);
      } catch (error) {
        console.error("Fehler beim Erstellen des Workspace-Index:", error);
        alert("Der Workspace-Index konnte nicht erstellt werden.");
      } finally {
        setIsLoading(false);
      }
    },
    [t],
  );

  const handleWorkflowSelect = useCallback(
    async (file) => {
      if (!file) return;
      setActiveWorkflowPath(file.webkitRelativePath);
      // Setzt den zu erweiternden Ordner zurück, wenn direkt im Baum geklickt wird
      setFolderToExpand(null);
      parseAndSetWorkflow(file);

      if (usageIndex) {
        let selectedId = null;
        for (const [id, data] of usageIndex.entries()) {
          if (data.file.webkitRelativePath === file.webkitRelativePath) {
            selectedId = id;
            break;
          }
        }
        if (selectedId) {
          const usedIn = [];
          for (const [id, data] of usageIndex.entries()) {
            if (data.references.includes(selectedId)) {
              usedIn.push({ id, name: data.name, file: data.file });
            }
          }
          setUsageData(usedIn);
        } else {
          setUsageData([]);
        }
      }
    },
    [parseAndSetWorkflow, usageIndex],
  );

  const onUsageItemClick = useCallback(
    (file) => {
      // KORREKTUR: Setzt den zentralen Filterzustand direkt zurück.
      setExplorerSearchTerm("");

      handleWorkflowSelect(file);
      const pathParts = file.webkitRelativePath.split("/");
      if (pathParts.length > 1) {
        const parentFolderPath = pathParts.slice(0, -1).join("/");
        setFolderToExpand(parentFolderPath);
      }
    },
    [handleWorkflowSelect],
  );

  const onSelectVar = useCallback((varName, exact = true) => {
    if (exact) {
      setActiveVar(varName);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      setActiveVar(null);
    }
  }, []);

  const resetWorkspace = useCallback(() => {
    setWorkspace(null);
    setWorkflowData(null);
    setActiveVar(null);
    setExplorerSearchTerm("");
    setHighlightedStepId(null);
    setActiveWorkflowPath(null);
    setUsageIndex(null);
    setUsageData([]);
    setFolderToExpand(null);
  }, []);

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
    const filterTerm = activeVar;
    if (!filterTerm) return workflowData.steps;
    const termLower = filterTerm.toLowerCase();
    return workflowData.steps.filter((step) => {
      const check = (v) => v.toLowerCase() === termLower;
      return step.creates?.some(check) || step.uses?.some(check);
    });
  }, [workflowData, activeVar]);

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
    searchTerm: activeVar,
    highlightedStepId,
    visibleSteps,
    onSelectVar,
    onNodeClick,
    toggleLang,
    allVars,
    isLoading,
    workspace,
    activeWorkflowPath,
    handleWorkspaceUpload,
    handleWorkflowSelect,
    resetWorkspace,
    usageData,
    onUsageItemClick,
    folderToExpand,
    setFolderToExpand,
    // Export des zentralen Filterzustands und seines Setters
    explorerSearchTerm,
    setExplorerSearchTerm,
  };
};
