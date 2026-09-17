import React, { useState, useMemo, useEffect, useRef } from "react";
import { useWorkflow } from "../context/WorkflowContext";

const TreeItem = ({
  item,
  onFileSelect,
  activePath,
  onToggleFolder,
  openFolders,
}) => {
  const isDirectory = item.kind === "directory";
  const itemRef = useRef(null);

  // Präziser Pfadabgleich
  const isActive = activePath === item.path || activePath === item.name;

  // Automatisches Scrollen im Explorer-Baum zum aktiven Item
  useEffect(() => {
    if (isActive && itemRef.current) {
      itemRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [isActive]);

  if (isDirectory) {
    const isOpen = openFolders.has(item.path);
    return (
      <div className="ml-4 mt-1">
        <div
          className="flex items-center cursor-pointer rounded px-1 py-1.5 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700/60"
          onClick={() => onToggleFolder(item.path)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) =>
            (e.key === "Enter" || e.key === " ") && onToggleFolder(item.path)
          }
        >
          <span
            className={`mr-1.5 text-xs text-slate-500 transform transition-transform duration-150 flex-shrink-0 ${
              isOpen ? "rotate-90" : ""
            }`}
          >
            ▶
          </span>
          <span className="mr-1.5 flex-shrink-0">{isOpen ? "📂" : "📁"}</span>
          <span
            className="font-semibold text-sm select-none whitespace-nowrap"
            title={item.name}
          >
            {item.name}
          </span>
        </div>

        {isOpen && item.children && item.children.length > 0 && (
          <div className="border-l-2 border-slate-300 dark:border-slate-600 pl-2">
            {item.children.map((child) => (
              <TreeItem
                key={child.path}
                item={child}
                onFileSelect={onFileSelect}
                activePath={activePath}
                onToggleFolder={onToggleFolder}
                openFolders={openFolders}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  const displayName = item.name.endsWith(".xml")
    ? item.name.slice(0, -4)
    : item.name;

  return (
    <div
      ref={itemRef}
      className={`ml-4 my-0.5 pl-5 pr-2 py-1.5 rounded cursor-pointer text-sm flex items-center ${
        isActive
          ? "bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 font-semibold"
          : "text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700/60"
      }`}
      onClick={() => onFileSelect(item.handle)}
      title={item.name}
    >
      <span className="mr-1.5 text-slate-500 flex-shrink-0">📄</span>
      <span className="select-none whitespace-nowrap">{displayName}</span>
    </div>
  );
};

const WorkspaceExplorer = () => {
  const {
    workspace,
    handleWorkflowSelect,
    activeWorkflowPath,
    t,
    folderToExpand,
    setFolderToExpand,
    explorerSearchTerm,
    setExplorerSearchTerm,
  } = useWorkflow();

  const [openFolders, setOpenFolders] = useState(new Set());

  const filterTree = (nodes, term) => {
    if (!term) return nodes;
    const lowerCaseTerm = term.toLowerCase();
    const result = [];
    for (const node of nodes) {
      if (node.kind === "directory") {
        const filteredChildren = filterTree(node.children, term);
        if (filteredChildren.length > 0) {
          result.push({ ...node, children: filteredChildren });
        }
      } else {
        if (node.name.toLowerCase().includes(lowerCaseTerm)) {
          result.push(node);
        }
      }
    }
    return result;
  };

  const getAllFolderPaths = (nodes) => {
    let paths = new Set();
    for (const node of nodes) {
      if (node.kind === "directory") {
        paths.add(node.path);
        const childPaths = getAllFolderPaths(node.children);
        childPaths.forEach((path) => paths.add(path));
      }
    }
    return paths;
  };

  const filteredTree = useMemo(() => {
    if (!workspace) return [];
    return filterTree(workspace.children, explorerSearchTerm);
  }, [workspace, explorerSearchTerm]);

  const handleToggleFolder = (folderPath) => {
    setOpenFolders((prevOpenFolders) => {
      const newOpenFolders = new Set(prevOpenFolders);
      if (newOpenFolders.has(folderPath)) {
        newOpenFolders.delete(folderPath);
      } else {
        newOpenFolders.add(folderPath);
      }
      return newOpenFolders;
    });
  };

  useEffect(() => {
    if (explorerSearchTerm) {
      setOpenFolders(getAllFolderPaths(filteredTree));
    } else {
      setOpenFolders(new Set());
    }
  }, [explorerSearchTerm, filteredTree]);

  // Effekt zum automatischen Öffnen der Pfade, wenn folderToExpand sich ändert
  useEffect(() => {
    if (folderToExpand) {
      setOpenFolders((prevOpenFolders) => {
        const newOpenFolders = new Set(prevOpenFolders);
        const pathParts = folderToExpand.split("/");

        for (let i = 1; i <= pathParts.length; i++) {
          newOpenFolders.add(pathParts.slice(0, i).join("/"));
        }
        return newOpenFolders;
      });

      if (setFolderToExpand) {
        setFolderToExpand(null);
      }
    }
  }, [folderToExpand, setFolderToExpand]);

  if (!workspace) return null;

  return (
    <div
      className="bg-slate-550 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm min-w-0 flex flex-col p-4 
                   resize-y overflow-auto h-[50vh] min-h-[250px] max-h-[85vh]"
    >
      <div className="flex-shrink-0">
        <div className="flex justify-between items-center mb-2 pb-2 border-b border-slate-200 dark:border-slate-700">
          <h3
            className="text-base font-bold text-slate-800 dark:text-slate-200 truncate pr-2"
            title={workspace.name}
          >
            {workspace.name}
          </h3>
        </div>
        <div className="relative mb-3">
          <input
            type="text"
            value={explorerSearchTerm}
            onChange={(e) => setExplorerSearchTerm(e.target.value)}
            placeholder={t.filterTreePlaceholder || "Workflows filtern..."}
            className="w-full px-3 py-1.5 bg-white dark:bg-slate-900/80 border border-slate-300 dark:border-slate-600 rounded-md text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          {explorerSearchTerm && (
            <button
              onClick={() => setExplorerSearchTerm("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-base leading-none p-1 cursor-pointer"
              title={t.clearFilterTooltip || "Filter löschen"}
            >
              &times;
            </button>
          )}
        </div>
      </div>

      <div className="flex-grow space-y-1 pr-1 overflow-y-auto overflow-x-auto">
        {filteredTree.length > 0 ? (
          filteredTree.map((item) => (
            <TreeItem
              key={item.path}
              item={item}
              onFileSelect={handleWorkflowSelect}
              activePath={activeWorkflowPath}
              onToggleFolder={handleToggleFolder}
              openFolders={openFolders}
            />
          ))
        ) : (
          <p className="text-center text-xs text-slate-500 dark:text-slate-400 p-4">
            {t.filterNoResults || "Keine Workflows gefunden."}
          </p>
        )}
      </div>
    </div>
  );
};

export default WorkspaceExplorer;
