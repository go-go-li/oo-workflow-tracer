import React, { useState, useEffect } from "react";
import { useWorkflow } from "./context/WorkflowContext";
import VariableSearch from "./components/VariableSearch";
import VariableRegistry from "./components/VariableRegistry";
import StepDetail from "./components/StepDetail";
import ThemeToggle from "./components/ThemeToggle";
import FileDropZone from "./components/FileDropZone";

/**
 * The main dashboard for displaying workflow details.
 * If no workflow data is loaded, it shows the FileDropZone and an introductory text box.
 * Otherwise, it displays the variable search, registry, step details, and contains a hidden
 * file input for immediate workflow swapping.
 * @returns {JSX.Element} The rendered WorkflowDashboard component.
 */
const WorkflowDashboard = () => {
  const { workflowData, visibleSteps, handleFileUpload, t } = useWorkflow();

  /**
   * Handles direct file input change from the hidden file selector.
   * @param {React.ChangeEvent<HTMLInputElement>} e - The change event from file input.
   */
  const onFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      handleFileUpload(file);
    }
  };

  if (!workflowData) {
    return (
      <div className="space-y-6">
        {/* Short introduction box explaining what the tool is for */}
        <div className="bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-700 rounded-xl p-5 text-center">
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-2">
            {t.welcomeTitle}
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            {t.welcomeDesc}
          </p>
        </div>
        <FileDropZone />
      </div>
    );
  }

  return (
    <div id="result-area" className="space-y-6 min-w-0 w-full overflow-hidden">
      {/* 
        Hidden file input element used when workflow data is loaded. 
        It allows the "Anderen Workflow laden" button to instantly prompt the file explorer.
      */}
      <input
        type="file"
        id="file-input"
        className="sr-only"
        accept=".xml"
        onChange={onFileChange}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 min-w-0">
        <VariableSearch />
        <VariableRegistry />
      </div>

      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 sm:p-5 shadow-sm space-y-4 min-w-0 w-full overflow-hidden">
        <h2 className="text-base sm:text-xl font-bold text-slate-900 dark:text-slate-100 break-all [overflow-wrap:anywhere] min-w-0">
          <span className="text-slate-900 dark:text-slate-100 break-all">
            {workflowData.flowName}
          </span>
        </h2>

        <div className="bg-slate-50 dark:bg-slate-900/50 p-3 sm:p-4 rounded-lg border border-slate-200 dark:border-slate-700 min-w-0 w-full overflow-hidden">
          <h3 className="text-xs sm:text-sm font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-2">
            {t.flowInputsTitle}
          </h3>
          <ul className="space-y-1 text-xs min-w-0">
            {workflowData.flowInputs.length > 0 ? (
              workflowData.flowInputs.map((val) => (
                <li
                  key={val}
                  className="flex flex-wrap items-center gap-2 break-all [overflow-wrap:anywhere] min-w-0"
                >
                  <code className="font-mono bg-slate-200 dark:bg-slate-700 px-1.5 py-0.5 rounded text-slate-800 dark:text-slate-200 break-all">
                    {val}
                  </code>{" "}
                  <span className="text-slate-400">{t.startParam}</span>
                </li>
              ))
            ) : (
              <li className="text-slate-400 italic">{t.flowInputsNone}</li>
            )}
          </ul>
        </div>
      </div>

      <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 pt-2 min-w-0">
        {t.executionStepsTitle}
      </h3>
      <div className="space-y-4 min-w-0 w-full">
        {visibleSteps.map((step) => (
          <StepDetail key={step.id} step={step} />
        ))}
      </div>
    </div>
  );
};

/**
 * The application header component.
 * Contains the main title and action buttons like theme and language toggles.
 * Hovering and clicking the title resets the view back to the start page.
 * @returns {JSX.Element} The rendered AppHeader component.
 */
const AppHeader = () => {
  const {
    t,
    toggleLang,
    lang,
    workflowData,
    resetWorkflow,
    handleRefresh,
    loadAnotherWorkflow,
  } = useWorkflow();

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 mb-6 border-b border-slate-200 dark:border-slate-700 gap-4 min-w-0 w-full">
      {/* Clickable Title returning to home view */}
      <h2
        onClick={resetWorkflow}
        className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 break-all [overflow-wrap:anywhere] min-w-0 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors select-none"
        title={t.homeTooltip}
      >
        {t.title}
      </h2>
      <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
        {workflowData && (
          <>
            <button
              onClick={handleRefresh}
              className="h-9 w-9 rounded-lg bg-slate-100 dark:bg-slate-700/60 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-600 border border-slate-300 dark:border-slate-600 transition-all text-lg font-semibold inline-flex items-center justify-center cursor-pointer shrink-0"
              title={t.refreshWorkflow}
            >
              🔃
            </button>
            <button
              onClick={loadAnotherWorkflow}
              className="h-9 px-3 rounded-lg bg-slate-100 dark:bg-slate-700/60 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-600 border border-slate-300 dark:border-slate-600 transition-all text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer shrink-0"
              title={t.loadAnotherWorkflow}
            >
              📂{" "}
              <span className="hidden sm:inline">{t.loadAnotherWorkflow}</span>
            </button>
          </>
        )}
        <ThemeToggle tooltip={t.themeToggleTooltip} />
        <button
          onClick={toggleLang}
          className="h-9 px-3 rounded-lg bg-slate-100 dark:bg-slate-700/60 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-600 border border-slate-300 dark:border-slate-600 transition-all text-xs font-semibold inline-flex items-center justify-center cursor-pointer shrink-0"
        >
          {lang === "de" ? "EN" : "DE"}
        </button>
      </div>
    </div>
  );
};

/**
 * The main application component.
 * It sets up the main layout, header, and a scroll-to-top button.
 * @returns {JSX.Element} The rendered App component.
 */
function App() {
  const [showScrollBtn, setShowScrollBtn] = useState(false);

  useEffect(() => {
    const handleScroll = () => setShowScrollBtn(window.scrollY > 300);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    /* Outer full-screen container for the dark/light page background. */
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-100 transition-colors duration-200 p-2.5 sm:p-6 lg:p-8 min-w-0 w-full">
      {/* Inner card container. */}
      <div className="max-w-7xl mx-auto bg-white dark:bg-slate-800/90 rounded-2xl p-4 sm:p-8 shadow-xl border border-slate-200/80 dark:border-slate-700/80 backdrop-blur-sm transition-colors duration-200 min-w-0 w-full overflow-hidden">
        <header>
          <AppHeader />
        </header>
        <WorkflowDashboard />
      </div>
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className={`fixed bottom-6 right-6 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xl flex items-center justify-center shadow-lg transition-all duration-300 cursor-pointer ${
          showScrollBtn
            ? "opacity-100 scale-100"
            : "opacity-0 scale-95 pointer-events-none"
        }`}
        aria-label="Back to top"
      >
        ↑
      </button>
    </div>
  );
}

export default App;
