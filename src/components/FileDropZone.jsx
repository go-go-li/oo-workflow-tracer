import React from "react";
import { useWorkflow } from "../context/WorkflowContext";

const FileDropZone = () => {
  const { t } = useWorkflow();

  // Da der Button jetzt ein Label ist, löst er das Klicken auf das globale,
  // versteckte Input-Feld aus. Die Logik befindet sich in App.jsx.
  return (
    <div className="w-full my-4 sm:my-6">
      <label
        htmlFor="directory-input"
        className="flex flex-col w-full items-center justify-center p-6 sm:p-10 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200 text-center text-sm sm:text-base font-semibold border-blue-500 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 hover:scale-[1.01] hover:bg-blue-100 dark:hover:bg-blue-950/60"
      >
        <span className="text-3xl sm:text-4xl mb-3">🗂️</span>
        {t.dropZoneWorkspace || "Workspace-Verzeichnis auswählen"}
      </label>
    </div>
  );
};

export default FileDropZone;
