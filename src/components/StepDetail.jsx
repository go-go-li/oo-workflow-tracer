import React, { useState, useEffect } from "react";
import { useWorkflow } from "../context/WorkflowContext";
import TokenizedValue from "./TokenizedValue";

/**
 * A component to display the detailed information of a single workflow step.
 * It includes tabs for inputs, assignments, and transitions.
 * @param {object} props - The component props.
 * @param {object} props.step - The step object containing its details.
 * @returns {JSX.Element} The rendered StepDetail component.
 */
const StepDetail = ({ step }) => {
  const { searchTerm, onSelectVar, highlightedId, t, onNodeClick } =
    useWorkflow();

  const isTarget = highlightedId === step.id;
  const activeVarForHighlight = searchTerm;

  const createsVar =
    activeVarForHighlight &&
    step.creates.some(
      (v) => v.toLowerCase() === activeVarForHighlight.toLowerCase(),
    );
  const usesVar =
    activeVarForHighlight &&
    step.uses.some(
      (v) => v.toLowerCase() === activeVarForHighlight.toLowerCase(),
    );

  /**
   * Determines the initial active tab based on available data.
   * @returns {'inputs' | 'assignments' | 'transitions'} The name of the initial tab.
   */
  const getInitialTab = () => {
    if (step.inputs && step.inputs.length > 0) return "inputs";
    if (step.assignments && step.assignments.length > 0) return "assignments";
    return "transitions";
  };

  const [activeTab, setActiveTab] = useState(getInitialTab);

  useEffect(() => {
    setActiveTab(getInitialTab());
  }, [step]);

  let borderLeftColor = "border-l-slate-400 dark:border-l-slate-500";
  let bgHighlight = "bg-white dark:bg-slate-800";

  if (createsVar)
    borderLeftColor = "border-l-emerald-600 dark:border-l-emerald-500";
  if (usesVar) borderLeftColor = "border-l-amber-500 dark:border-l-amber-400";
  if (isTarget) {
    borderLeftColor = "border-l-blue-600 dark:border-l-blue-500";
    bgHighlight = "bg-blue-50/50 dark:bg-blue-950/30";
  }

  /**
   * Handles clicks on variable tokens, triggering the global variable selection.
   * @param {string} varName - The name of the clicked variable.
   */
  const handleVariableClick = (varName) => {
    onSelectVar(varName, true);
  };

  return (
    <div
      className={`my-4 sm:my-6 p-4 sm:p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm border-l-4 sm:border-l-8 ${borderLeftColor} ${bgHighlight} transition-all duration-200 min-w-0 w-full overflow-hidden`}
      id={step.id}
    >
      <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-700 pb-2 sm:pb-3 mb-3 sm:mb-4 min-w-0">
        <h4 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 break-all [overflow-wrap:anywhere] min-w-0">
          {step.name}
        </h4>
      </div>

      {/* Tabs */}
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
            className={`text-[0.7rem] sm:text-xs ${
              step.inputs.length > 0
                ? "font-bold text-blue-600 dark:text-blue-400"
                : "opacity-50"
            }`}
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
            className={`text-[0.7rem] sm:text-xs ${
              step.assignments.length > 0
                ? "font-bold text-blue-600 dark:text-blue-400"
                : "opacity-50"
            }`}
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
            className={`text-[0.7rem] sm:text-xs ${
              step.transitions.length > 0
                ? "font-bold text-blue-600 dark:text-blue-400"
                : "opacity-50"
            }`}
          >
            ({step.transitions.length})
          </span>
        </button>
      </div>

      {/* Tab Content */}
      <div className="bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-lg p-3 sm:p-4 text-xs min-w-0 w-full">
        {activeTab === "inputs" && (
          <div>
            {step.inputs.length > 0 ? (
              <ul className="space-y-2">
                {step.inputs.map((inp, idx) => {
                  const isLongVal =
                    inp.value.length > 60 || inp.value.includes("\n");
                  return (
                    <li
                      key={idx}
                      className="bg-white dark:bg-slate-800 p-2.5 sm:p-3 rounded-md border border-slate-200 dark:border-slate-700 break-all"
                    >
                      <strong className="text-slate-800 dark:text-slate-200 font-semibold">
                        {inp.symbol}
                      </strong>
                      :{" "}
                      {isLongVal ? (
                        <div className="mt-2 font-mono p-2 sm:p-2.5 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded h-20 min-h-12 max-h-96 overflow-auto resize-y whitespace-pre-wrap">
                          <TokenizedValue
                            value={inp.value}
                            activeVar={activeVarForHighlight}
                            onVariableClick={handleVariableClick}
                          />
                        </div>
                      ) : (
                        <span>
                          <TokenizedValue
                            value={inp.value}
                            activeVar={activeVarForHighlight}
                            onVariableClick={handleVariableClick}
                          />
                        </span>
                      )}
                    </li>
                  );
                })}
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
                {step.assignments.map((ass, idx) => {
                  const isAssVarActive =
                    activeVarForHighlight &&
                    ass.variable.toLowerCase() ===
                      activeVarForHighlight.toLowerCase();
                  const writeClass = isAssVarActive
                    ? "animate-pulse-red border-red-500"
                    : "border-emerald-300 dark:border-emerald-700";

                  return (
                    <li
                      key={idx}
                      className="relative bg-white dark:bg-slate-800 p-2.5 sm:p-3 rounded-md border border-slate-200 dark:border-slate-700 break-all"
                    >
                      <span className="text-slate-500">{t.createdWord}:</span>{" "}
                      <code
                        className={`font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border ${writeClass} cursor-pointer hover:bg-emerald-200 dark:hover:bg-emerald-900 transition-colors inline-block my-0.5`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleVariableClick(ass.variable);
                        }}
                        title={`Click to track variable "${ass.variable}"`}
                      >
                        {ass.variable}
                      </code>{" "}
                      &larr;{" "}
                      <TokenizedValue
                        value={ass.value}
                        activeVar={activeVarForHighlight}
                        onVariableClick={handleVariableClick}
                      />
                      {(ass.filters.length > 0 || ass.scriptlet) && (
                        <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-2 items-center">
                          {ass.filters.length > 0 && (
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[0.68rem] sm:text-[0.7rem] font-semibold bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600">
                              🔍 {ass.filters.length} Filter
                            </span>
                          )}
                          {ass.scriptlet && (
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[0.68rem] sm:text-[0.7rem] font-semibold bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                              📜 Scriptlet: {ass.scriptlet.name}
                            </span>
                          )}
                        </div>
                      )}
                      {ass.source && (
                        <span className="block mt-1 text-[0.68rem] sm:text-[0.7rem] text-slate-400 italic break-all">
                          {ass.source}
                        </span>
                      )}
                    </li>
                  );
                })}
              </ul>
            ) : (
              <div className="text-slate-400 italic text-center py-2">
                {t.noAssignments}
              </div>
            )}
          </div>
        )}

        {/* Transitions are displayed vertically with a neutral step badge. */}
        {activeTab === "transitions" && (
          <div>
            {step.transitions.length > 0 ? (
              <ul className="space-y-2">
                {step.transitions.map((trans, idx) => {
                  const transLower = trans.name.toLowerCase();

                  let badgeBadgeStyle =
                    "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 border-slate-300 dark:border-slate-600";

                  if (transLower.includes("success")) {
                    badgeBadgeStyle =
                      "bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700";
                  } else if (
                    transLower.includes("fail") ||
                    transLower.includes("err")
                  ) {
                    badgeBadgeStyle =
                      "bg-rose-100 dark:bg-rose-950/70 text-rose-800 dark:text-rose-300 border-rose-300 dark:border-rose-700";
                  } else if (transLower.includes("warn")) {
                    badgeBadgeStyle =
                      "bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-700";
                  }

                  return (
                    <li
                      key={idx}
                      className="flex flex-wrap items-center gap-2 bg-white dark:bg-slate-800 p-2.5 rounded-md border border-slate-200 dark:border-slate-700 shadow-sm"
                    >
                      {/* Transition Type Badge */}
                      <span
                        className={`px-2 py-0.5 rounded text-[0.68rem] font-bold uppercase border shrink-0 ${badgeBadgeStyle}`}
                      >
                        {trans.name}
                      </span>

                      <span className="text-slate-400 font-bold text-xs">
                        &rarr;
                      </span>

                      {/* Neutral target step as an interactive tile. */}
                      <a
                        href={`#${trans.destId}`}
                        onClick={(e) => {
                          if (onNodeClick) {
                            onNodeClick(e, trans.destId);
                          }
                        }}
                        className="inline-flex items-center px-2 py-1 rounded text-[0.72rem] font-medium bg-slate-100 dark:bg-slate-700/60 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-600 border-l-4 border-l-slate-400 dark:border-l-slate-500 hover:bg-slate-200 dark:hover:bg-slate-600 hover:border-slate-400 transition-all hover:-translate-y-0.5 cursor-pointer break-all"
                        title={`Jump to step "${trans.destName}"`}
                      >
                        {trans.destName}
                      </a>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <div className="text-slate-400 italic text-center py-2">
                {t.endOfPath}
              </div>
            )}
          </div>
        )}
      </div>

      {step.stepScriptlet && (
        <div className="mt-3 sm:mt-4 pt-2.5 sm:pt-3 border-t border-slate-200 dark:border-slate-700">
          <span className="inline-flex items-center px-2 py-1 rounded text-[0.7rem] sm:text-xs font-semibold bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600 break-all">
            📜 Step Scriptlet: {step.stepScriptlet.name}
          </span>
        </div>
      )}
    </div>
  );
};

export default StepDetail;
