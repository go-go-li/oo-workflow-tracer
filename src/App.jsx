import React, { useState, useEffect } from "react";
import { useWorkflow } from "./context/WorkflowContext";
import VariableSearch from "./components/VariableSearch";
import VariableRegistry from "./components/VariableRegistry";
import StepDetail from "./components/StepDetail";
import ThemeToggle from "./components/ThemeToggle";
import FileDropZone from "./components/FileDropZone";
import WorkspaceExplorer from "./components/WorkspaceExplorer";

const WelcomeScreen = () => {
  const { t } = useWorkflow();
  return (
    <div className="space-y-6">
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
};

const AppHeader = () => {
  const { t, toggleLang, lang, resetWorkspace, workspace } = useWorkflow();
  const handleLoadWorkspace = () =>
    document.getElementById("directory-input")?.click();
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 mb-6 border-b border-slate-200 dark:border-slate-700 gap-4 min-w-0 w-full">
      <h2
        onClick={workspace ? resetWorkspace : null}
        className={`text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 select-none ${
          workspace
            ? "cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            : "cursor-default"
        }`}
        title={workspace ? t.homeTooltip : ""}
      >
        {t.title}
      </h2>
      <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
        {workspace && (
          <button
            onClick={handleLoadWorkspace}
            className="h-9 px-3 rounded-lg bg-blue-50 dark:bg-blue-800/60 text-blue-700 dark:text-blue-200 hover:bg-blue-100 dark:hover:bg-blue-800 border border-blue-300 dark:border-blue-700 transition-all text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
            title={t.loadNewWorkspaceTooltip}
          >
            🗂️ <span className="hidden sm:inline">{t.loadNewWorkspace}</span>
          </button>
        )}
        <ThemeToggle tooltip={t.themeToggleTooltip} />
        <button
          onClick={toggleLang}
          className="h-9 px-3 rounded-lg bg-slate-100 dark:bg-slate-700/60 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-600 border border-slate-300 dark:border-slate-600 transition-all text-xs font-semibold"
        >
          {lang === "de" ? "EN" : "DE"}
        </button>
      </div>
    </div>
  );
};

const WorkflowDashboard = () => {
  const {
    workflowData,
    visibleSteps,
    t,
    isLoading,
    usageData,
    onUsageItemClick,
  } = useWorkflow();
  const [activeTab, setActiveTab] = useState("usage");

  const TabButton = ({ tabName, currentTab, onClick, children }) => (
    <button
      type="button"
      onClick={() => onClick(tabName)}
      className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors ${
        currentTab === tabName
          ? "border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400"
          : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
      }`}
    >
      {children}
    </button>
  );

  if (isLoading && !workflowData) {
    return (
      <div className="flex items-center justify-center h-full bg-slate-50 dark:bg-slate-800/50 border-2 border-dashed rounded-xl text-slate-500 p-8 font-semibold">
        {t.loadingText}
      </div>
    );
  }

  if (!workflowData) {
    return (
      <div className="flex items-center justify-center h-full bg-slate-50 dark:bg-slate-800/50 border-2 border-dashed rounded-xl text-slate-500 p-8">
        {t.selectWorkflowPlaceholder}
      </div>
    );
  }

  return (
    <div id="result-area" className="min-w-0 w-full overflow-hidden">
      <div className="border-b border-slate-200 dark:border-slate-700 mb-6">
        <TabButton
          tabName="usage"
          currentTab={activeTab}
          onClick={setActiveTab}
        >
          {t.usageTab || "Usage"}
        </TabButton>
        <TabButton
          tabName="variables"
          currentTab={activeTab}
          onClick={setActiveTab}
        >
          {t.variablesTab || "Variables"}
        </TabButton>
      </div>

      {activeTab === "usage" && (
        <div className="space-y-4 animate-fade-in">
          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">
            {t.usageAnalysisTitle || "Verwendungsanalyse"}
          </h3>
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 sm:p-5 shadow-sm">
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
              {t.usageAnalysisDesc || `Der Workflow`}{" "}
              <code className="font-semibold text-xs bg-slate-200 dark:bg-slate-700 px-1.5 py-1 rounded">
                {workflowData.flowName}
              </code>{" "}
              {t.usageAnalysisDesc2 ||
                `wird in den folgenden Workflows verwendet:`}
            </p>
            {usageData.length > 0 ? (
              <ul className="space-y-2">
                {usageData.map((item) => (
                  <li
                    key={item.id}
                    onClick={() => onUsageItemClick(item.file)}
                    className="flex items-center gap-2 p-2.5 rounded-md cursor-pointer bg-slate-50 dark:bg-slate-900/50 hover:bg-blue-50 dark:hover:bg-blue-950/60 border border-slate-200 dark:border-slate-700 transition-colors"
                  >
                    <span className="text-slate-500">📄</span>
                    <span className="font-mono text-sm text-blue-600 dark:text-blue-400">
                      {item.name}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-center text-slate-500 italic py-4">
                {t.usageAnalysisNone ||
                  "Wird in keinem anderen Workflow in diesem Workspace verwendet."}
              </p>
            )}
          </div>
        </div>
      )}

      {activeTab === "variables" && (
        <div className="space-y-6 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <VariableSearch />
            <VariableRegistry />
          </div>
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 sm:p-5 shadow-sm space-y-4">
            <h2 className="text-base sm:text-xl font-bold text-slate-900 dark:text-slate-100 break-all">
              {workflowData.flowName}
            </h2>
            <div className="bg-slate-50 dark:bg-slate-900/50 p-3 sm:p-4 rounded-lg border border-slate-200 dark:border-slate-700">
              <h3 className="text-xs sm:text-sm font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-2">
                {t.flowInputsTitle}
              </h3>
              <ul className="space-y-1 text-xs">
                {workflowData.flowInputs.length > 0 ? (
                  workflowData.flowInputs.map((val) => (
                    <li key={val} className="flex items-center gap-2">
                      <code className="font-mono bg-slate-200 dark:bg-slate-700 px-1.5 py-0.5 rounded text-slate-800 dark:text-slate-200">
                        {val}
                      </code>
                      <span className="text-slate-400">{t.startParam}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-slate-400 italic">{t.flowInputsNone}</li>
                )}
              </ul>
            </div>
          </div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 pt-2">
            {t.executionStepsTitle}
          </h3>
          <div className="space-y-4">
            {visibleSteps.map((step) => (
              <StepDetail key={step.id} step={step} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

function App() {
  const { workspace, handleWorkspaceUpload } = useWorkflow();
  const [showScrollBtn, setShowScrollBtn] = useState(false);

  useEffect(() => {
    const handleScroll = () => setShowScrollBtn(window.scrollY > 300);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const onDirectoryUpload = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleWorkspaceUpload(e.target.files);
      e.target.value = null; // Wichtig, damit derselbe Ordner erneut ausgewählt werden kann
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-100 transition-colors duration-200 p-2.5 sm:p-6 lg:p-8">
      {/* Das Input-Feld muss auf der obersten Ebene sein, damit die Labels funktionieren */}
      <input
        type="file"
        id="directory-input"
        className="sr-only"
        webkitdirectory="true"
        directory="true"
        multiple
        onChange={onDirectoryUpload}
      />
      <div className="max-w-7xl mx-auto bg-white dark:bg-slate-800/90 rounded-2xl p-4 sm:p-8 shadow-xl border border-slate-200/80 dark:border-slate-700/80">
        <header>
          <AppHeader />
        </header>
        <main>
          {workspace ? (
            <div className="grid grid-cols-1 lg:grid-cols-[minmax(250px,25%)_1fr] gap-6 min-w-0">
              <aside className="min-w-0">
                <WorkspaceExplorer />
              </aside>
              <main className="min-w-0">
                <WorkflowDashboard />
              </main>
            </div>
          ) : (
            <WelcomeScreen />
          )}
        </main>
      </div>
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className={`fixed bottom-6 right-6 w-11 h-11 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg transition-all duration-300 cursor-pointer ${
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
