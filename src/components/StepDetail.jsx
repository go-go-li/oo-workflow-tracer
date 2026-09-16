import React, { useState, useEffect } from "react";
import { useWorkflow } from "../context/WorkflowContext";
import TokenizedValue from "./TokenizedValue";

const StepDetail = ({ step }) => {
  const { activeVar, onSelectVar, highlightedId, t, onNodeClick, allVars } =
    useWorkflow();

  const isTarget = highlightedId === step.id;
  const createsVar =
    activeVar &&
    step.creates.some((v) => v.toLowerCase() === activeVar.toLowerCase());
  const usesVar =
    activeVar &&
    step.uses.some((v) => v.toLowerCase() === activeVar.toLowerCase());

  const getInitialTab = () => {
    if (step.inputs?.length > 0) return "inputs";
    if (step.assignments?.length > 0) return "assignments";
    return "transitions";
  };

  const [activeTab, setActiveTab] = useState(getInitialTab);

  useEffect(() => {
    setActiveTab(getInitialTab());
  }, [step]);

  let borderLeftColor = "border-l-slate-400 dark:border-l-slate-500";
  if (createsVar)
    borderLeftColor = "border-l-emerald-600 dark:border-l-emerald-500";
  if (usesVar) borderLeftColor = "border-l-amber-500 dark:border-l-amber-400";
  if (isTarget) borderLeftColor = "border-l-blue-600 dark:border-l-blue-500";

  return (
    <div
      id={step.id}
      className={`my-4 sm:my-6 p-4 sm:p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm border-l-4 sm:border-l-8 ${borderLeftColor} transition-all duration-200 min-w-0 w-full overflow-hidden`}
    >
      <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-700 pb-2 sm:pb-3 mb-3 sm:mb-4 min-w-0">
        <h4 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 break-all [overflow-wrap:anywhere] min-w-0">
          {step.name}
        </h4>
      </div>

      <div className="flex border-b border-slate-200 dark:border-slate-700 mb-3 sm:mb-4 gap-1 sm:gap-2 overflow-x-auto pb-0.5 no-scrollbar">
        <button
          type="button"
          className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold border-b-2 transition-colors whitespace-nowrap cursor-pointer shrink-0 ${
            activeTab === "inputs"
              ? "border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400"
              : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
          }`}
          onClick={() => setActiveTab("inputs")}
        >
          📥 {t.stepColInputs}
          <span
            className={`text-[0.7rem] sm:text-xs ${step.inputs.length > 0 ? "font-bold text-blue-600 dark:text-blue-400" : "opacity-50"}`}
          >
            ({step.inputs.length})
          </span>
        </button>

        <button
          type="button"
          className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold border-b-2 transition-colors whitespace-nowrap cursor-pointer shrink-0 ${
            activeTab === "assignments"
              ? "border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400"
              : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
          }`}
          onClick={() => setActiveTab("assignments")}
        >
          📝 {t.stepColAssignments}
          <span
            className={`text-[0.7rem] sm:text-xs ${step.assignments.length > 0 ? "font-bold text-blue-600 dark:text-blue-400" : "opacity-50"}`}
          >
            ({step.assignments.length})
          </span>
        </button>

        <button
          type="button"
          className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold border-b-2 transition-colors whitespace-nowrap cursor-pointer shrink-0 ${
            activeTab === "transitions"
              ? "border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400"
              : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
          }`}
          onClick={() => setActiveTab("transitions")}
        >
          🔀 {t.stepColTransitions}
          <span
            className={`text-[0.7rem] sm:text-xs ${step.transitions.length > 0 ? "font-bold text-blue-600 dark:text-blue-400" : "opacity-50"}`}
          >
            ({step.transitions.length})
          </span>
        </button>
      </div>

      <div className="bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-lg p-3 sm:p-4 text-xs min-w-0 w-full">
        {activeTab === "inputs" && (
          <div>
            {step.inputs.length > 0 ? (
              <ul className="space-y-2">
                {step.inputs.map((inp, idx) => (
                  <li
                    key={idx}
                    className="bg-white dark:bg-slate-800 p-2.5 sm:p-3 rounded-md border border-slate-200 dark:border-slate-700 break-all"
                  >
                    <strong className="text-slate-800 dark:text-slate-200 font-semibold">
                      {inp.symbol}
                    </strong>
                    :{" "}
                    <TokenizedValue
                      value={inp.value}
                      onVariableClick={onSelectVar}
                      allVars={allVars}
                      activeVar={activeVar}
                    />
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-slate-400 italic text-center py-2">
                {t.noInputs}
              </div>
            )}
          </div>
        )}

        {activeTab === "assignments" && (
          <div>
            {step.assignments.length > 0 ? (
              <ul className="space-y-2">
                {step.assignments.map((ass, idx) => (
                  <li
                    key={idx}
                    className="relative bg-white dark:bg-slate-800 p-3 rounded-md border border-slate-200 dark:border-slate-700 break-all flex flex-col gap-2"
                  >
                    <div className="flex flex-wrap items-center gap-1.5">
                      <TokenizedValue
                        value={ass.variable}
                        onVariableClick={onSelectVar}
                        allVars={allVars}
                        activeVar={activeVar}
                        isKey={true}
                      />
                      <span className="text-slate-400 font-bold">&larr;</span>{" "}
                      <TokenizedValue
                        value={ass.value || ass.sourceDetail}
                        onVariableClick={onSelectVar}
                        allVars={allVars}
                        activeVar={activeVar}
                      />
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-700/50 pt-2">
                      <span className="font-semibold">
                        {t[ass.sourceKey] || ass.sourceKey}
                      </span>
                      {ass.filterCount > 0 && (
                        <span
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-cyan-100 dark:bg-cyan-900/60 text-cyan-700 dark:text-cyan-300 text-[10px] font-bold"
                          title={`${ass.filterCount} ${t.filtersApplied || "Filter angewendet"}`}
                        >
                          🧪 {ass.filterCount}
                        </span>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-slate-400 italic text-center py-2">
                {t.noAssignments}
              </div>
            )}
          </div>
        )}

        {activeTab === "transitions" && (
          <div>
            {step.transitions.length > 0 ? (
              <ul className="space-y-2">
                {step.transitions.map((trans, idx) => (
                  <li
                    key={idx}
                    className="flex flex-wrap items-center gap-2 bg-white dark:bg-slate-800 p-2.5 rounded-md border border-slate-200 dark:border-slate-700 shadow-sm"
                  >
                    <span className="px-2 py-0.5 rounded text-[0.68rem] font-bold uppercase border bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 border-slate-300 dark:border-slate-600">
                      {trans.name}
                    </span>
                    <span className="text-slate-400 font-bold text-xs">
                      &rarr;
                    </span>
                    <a
                      href={`#${trans.destId}`}
                      onClick={(e) => onNodeClick(e, trans.destId)}
                      className="inline-flex items-center px-2 py-1 rounded text-[0.72rem] font-medium bg-slate-100 dark:bg-slate-700/60 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-600 border-l-4 border-l-slate-400 dark:border-l-slate-500 hover:bg-slate-200 dark:hover:bg-slate-600 transition-all hover:-translate-y-0.5 cursor-pointer break-all"
                      title={`Zum Schritt springen: "${trans.destName}"`}
                    >
                      {trans.destName}
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-slate-400 italic text-center py-2">
                {t.endOfPath}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default StepDetail;
