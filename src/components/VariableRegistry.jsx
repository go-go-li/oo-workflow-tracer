import React from "react";
import { useWorkflow } from "../context/WorkflowContext";

/**
 * A component that displays a table of all global variables in the workflow,
 * including where they are created and used. It now highlights Flow Inputs.
 */
const VariableRegistry = () => {
  const { workflowData, activeVar, searchTerm, onSelectVar, onNodeClick, t } =
    useWorkflow();

  if (!workflowData) {
    return null;
  }

  const { globalVars, stepNames } = workflowData;
  const varsArray = Object.entries(globalVars);
  const filteredVars = varsArray.filter(([name]) =>
    name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  /**
   * Renders a set of step tiles for either 'created' or 'used' contexts.
   * It now includes a special tile for Flow Inputs.
   * @param {string[]} stepIds - Array of step IDs.
   * @param {boolean} isFlowInput - Flag to indicate if the variable is a flow input.
   * @returns {JSX.Element} A list of styled, clickable step tiles.
   */
  const renderCreationTiles = (stepIds, isFlowInput) => {
    if ((!stepIds || stepIds.length === 0) && !isFlowInput) {
      return <span className="text-slate-400 text-xs">-</span>;
    }

    return (
      <div className="flex flex-wrap items-start gap-1.5 max-w-full">
        {/* ================================================================= */}
        {/* NEUE LOGIK: Zeigt eine spezielle Kachel für Startparameter an.     */}
        {/* ================================================================= */}
        {isFlowInput && (
          <span
            className="inline-flex items-center px-2 py-1 rounded text-[0.72rem] font-bold border border-l-4
                       bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 
                       border-sky-300 dark:border-sky-800 border-l-sky-600"
            title={t.startParam}
          >
            ▶ {t.startParam}
          </span>
        )}

        {/* Bestehende Logik zum Anzeigen der Schritt-Kacheln */}
        {stepIds.map((id) => {
          const sName = stepNames[id] || "Step";
          return (
            <span
              key={id}
              className="inline-flex items-center px-2 py-1 rounded text-[0.72rem] font-medium border cursor-pointer transition-all hover:-translate-y-0.5 
                         bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 
                         border-emerald-300 dark:border-emerald-800 border-l-4 border-l-emerald-600 
                         hover:bg-emerald-100 dark:hover:bg-emerald-900/60"
              onClick={(e) => {
                e.stopPropagation();
                onNodeClick(e, id);
              }}
              title={`Jump to step "${sName}"`}
            >
              {sName}
            </span>
          );
        })}
      </div>
    );
  };

  // Diese Funktion bleibt für die "Verwendet in"-Spalte unverändert.
  const renderUsageTiles = (stepIds) => {
    if (!stepIds || stepIds.length === 0)
      return <span className="text-slate-400 text-xs">-</span>;
    return (
      <div className="flex flex-wrap items-start gap-1.5 max-w-full">
        {stepIds.map((id) => (
          <span
            key={id}
            className="inline-flex items-center px-2 py-1 rounded text-[0.72rem] font-medium border cursor-pointer transition-all hover:-translate-y-0.5 
                        bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 
                        border-amber-300 dark:border-amber-800 border-l-4 border-l-amber-500 
                        hover:bg-amber-100 dark:hover:bg-amber-900/60"
            onClick={(e) => {
              e.stopPropagation();
              onNodeClick(e, id);
            }}
            title={`Jump to step "${stepNames[id] || "Step"}"`}
          >
            {stepNames[id] || "Step"}
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5 shadow-sm flex flex-col">
      <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-700 pb-3 mb-3">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
          {t.registryTitle}
        </h3>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-600 text-white">
          {filteredVars.length} {t.variablesCount}
        </span>
      </div>

      <div className="border border-slate-200 dark:border-slate-700 rounded-lg">
        <div className="flex bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-t-lg">
          <div className="w-1/4 p-2.5 text-left font-semibold align-top">
            {t.registryColVar}
          </div>
          <div className="w-[37.5%] p-2.5 text-left font-semibold text-emerald-600 dark:text-emerald-400 align-top">
            {t.registryColCreated}
          </div>
          <div className="w-[37.5%] p-2.5 text-left font-semibold text-amber-600 dark:text-amber-400 align-top">
            {t.registryColUsed}
          </div>
        </div>

        <div className="max-h-64 overflow-y-auto">
          <table className="w-full text-xs border-collapse table-fixed">
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {filteredVars.map(([name, info]) => (
                <tr
                  key={name}
                  className={`cursor-pointer transition-colors ${
                    activeVar === name
                      ? "bg-blue-50 dark:bg-blue-950/50"
                      : "hover:bg-slate-50 dark:hover:bg-slate-700/40"
                  }`}
                  onClick={() => onSelectVar(name, true)}
                >
                  <td className="w-1/4 p-2.5 align-top font-bold font-mono text-amber-600 dark:text-amber-400 break-words hover:underline">
                    <code>{name}</code>
                  </td>
                  <td className="w-[37.5%] p-2.5 align-top">
                    {/* ======================================================== */}
                    {/* NEUE LOGIK: Hier rufen wir die neue Funktion auf.      */}
                    {/* ======================================================== */}
                    {renderCreationTiles(info.createdIn, info.isFlowInput)}
                  </td>
                  <td className="w-[37.5%] p-2.5 align-top">
                    {renderUsageTiles(info.usedIn)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default VariableRegistry;
