import React, { useState, useEffect, useRef } from "react";
import { useWorkflow } from "../context/WorkflowContext";

/**
 * A component that provides a search input for workflow variables,
 * including auto-suggestions and a clear button.
 * @returns {JSX.Element} The rendered VariableSearch component.
 */
const VariableSearch = () => {
  const { workflowData, activeVar, onSelectVar, onClear, t } = useWorkflow();

  const variablesList = Object.keys(workflowData?.globalVars || {});
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    if (activeVar) {
      setQuery(activeVar);
    } else {
      setQuery("");
    }
  }, [activeVar]);

  useEffect(() => {
    /**
     * Closes the suggestions dropdown if a click occurs outside the component.
     * @param {MouseEvent} e - The mouse event.
     */
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /**
   * Handles changes to the search input, filtering suggestions as the user types.
   * @param {React.ChangeEvent<HTMLInputElement>} e - The input change event.
   */
  const handleInputChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    if (val.trim()) {
      const filtered = variablesList
        .filter((v) => v.toLowerCase().includes(val.toLowerCase()))
        .slice(0, 8);
      setSuggestions(filtered);
      setShowSuggestions(true);
      onSelectVar(val, false);
    } else {
      onClear();
    }
  };

  /**
   * Handles a click on a suggestion, updating the query and selecting the variable.
   * @param {string} vName - The name of the selected variable.
   */
  const handleSuggestionClick = (vName) => {
    setQuery(vName);
    onSelectVar(vName, true);
    setShowSuggestions(false);
  };

  return (
    <div
      className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 sm:p-5 shadow-sm"
      ref={containerRef}
    >
      <h3 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-slate-100 mb-1">
        {t.searchTitle}
      </h3>
      <p className="text-xs text-slate-500 dark:text-slate-400 mb-3 sm:mb-4">
        {t.searchDesc}
      </p>

      <div className="relative">
        <input
          type="text"
          className="w-full px-3.5 py-2.5 sm:px-4 sm:py-3 bg-slate-50 dark:bg-slate-900/80 border border-slate-300 dark:border-slate-600 rounded-lg text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          value={query}
          onChange={handleInputChange}
          placeholder={t.searchPlaceholder}
          onFocus={() => query && setShowSuggestions(true)}
        />
        {query && (
          <button
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-lg leading-none p-1 cursor-pointer"
            onClick={() => {
              setQuery("");
              onClear();
            }}
          >
            &times;
          </button>
        )}

        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-xl z-50 max-h-52 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-700">
            {suggestions.map((vName) => (
              <div
                key={vName}
                className="px-3.5 py-2 sm:px-4 sm:py-2.5 text-xs cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-950/40 hover:text-blue-600 dark:hover:text-blue-400 transition-colors break-all"
                onClick={() => handleSuggestionClick(vName)}
              >
                <code className="font-mono">{vName}</code>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default VariableSearch;
