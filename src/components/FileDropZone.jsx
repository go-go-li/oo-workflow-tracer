import React from "react";
import { useWorkflow } from "../context/WorkflowContext";

const FileDropZone = () => {
  const { t, handleFileUpload, handleWorkspaceUpload } = useWorkflow();

  const onFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileUpload(e.target.files[0]);
    }
  };

  const onDirectoryUpload = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleWorkspaceUpload(e.target.files);
    }
  };

  return (
    <div className="w-full my-4 sm:my-6 space-y-4">
      <label
        htmlFor="directory-input"
        className="flex flex-col w-full items-center justify-center p-6 sm:p-10 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200 text-center text-sm sm:text-base font-semibold border-blue-500 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 hover:scale-[1.01] hover:bg-blue-100 dark:hover:bg-blue-950/60"
      >
        <span className="text-3xl sm:text-4xl mb-3">🗂️</span>
        {t.dropZoneWorkspace || "Workspace-Verzeichnis auswählen"}
      </label>

      <input
        type="file"
        id="directory-input"
        className="sr-only"
        webkitdirectory="true"
        directory="true"
        multiple
        onChange={onDirectoryUpload}
      />

      <div className="text-center text-xs text-slate-500 dark:text-slate-400">
        {t.orText || "Oder"}{" "}
        <label
          htmlFor="file-input"
          className="cursor-pointer text-blue-600 hover:underline font-semibold"
        >
          {t.uploadSingleFile || "eine einzelne XML-Datei hochladen"}
        </label>
        .
      </div>

      <input
        type="file"
        id="file-input"
        className="sr-only"
        accept=".xml"
        onChange={onFileChange}
      />
    </div>
  );
};

export default FileDropZone;
