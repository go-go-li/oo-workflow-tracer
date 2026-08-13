import React, { useState } from "react";
import { useWorkflow } from "../context/WorkflowContext";

/**
 * A React component that provides a drag-and-drop zone for file uploads.
 * It also includes a standard file input fallback.
 * @returns {JSX.Element} The rendered FileDropZone component.
 */
const FileDropZone = () => {
  const { t, handleFileUpload } = useWorkflow();
  const [isDragging, setIsDragging] = useState(false);

  /**
   * Prevents the default behavior for the drag-over event.
   * @param {React.DragEvent<HTMLDivElement>} e - The drag event.
   */
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  /**
   * Handles the drag-enter event to set the dragging state.
   * @param {React.DragEvent<HTMLDivElement>} e - The drag event.
   */
  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  /**
   * Handles the drag-leave event to reset the dragging state.
   * @param {React.DragEvent<HTMLDivElement>} e - The drag event.
   */
  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  /**
   * Handles the drop event, validates the file type, and triggers the file upload.
   * @param {React.DragEvent<HTMLDivElement>} e - The drop event.
   */
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type === "text/xml" || file.name.endsWith(".xml")) {
        handleFileUpload(file);
      } else {
        alert("Please upload only XML files.");
      }
      e.dataTransfer.clearData();
    }
  };

  /**
   * Handles file selection from the standard file input.
   * @param {React.ChangeEvent<HTMLInputElement>} e - The change event.
   */
  const onFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      handleFileUpload(file);
    }
  };

  return (
    <div
      className="w-full my-4 sm:my-6"
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <label
        htmlFor="file-input"
        className={`flex flex-col items-center justify-center p-6 sm:p-12 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200 text-center text-sm sm:text-base font-semibold ${
          isDragging
            ? "border-blue-500 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 scale-[1.01]"
            : "border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:border-blue-500 dark:hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400"
        }`}
      >
        <span className="text-2xl sm:text-3xl mb-2">📁</span>
        {t.dropZone}
      </label>
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
