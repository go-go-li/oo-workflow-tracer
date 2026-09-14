import React from "react";

const TokenizedValue = ({
  value,
  onVariableClick,
  allVars = [],
  activeVar,
  isKey = false,
}) => {
  if (!value || typeof value !== "string") {
    return <span className="text-slate-400">-</span>;
  }

  if (isKey) {
    const isActive = activeVar === value;
    return (
      <code
        className={`font-mono text-xs font-bold px-1.5 py-0.5 rounded cursor-pointer ${isActive ? "animate-pulse-red bg-emerald-100 border-red-500" : "bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700"}`}
        onClick={(e) => {
          e.stopPropagation();
          onVariableClick(value, true);
        }}
        title={`Click to track variable "${value}"`}
      >
        {value}
      </code>
    );
  }

  const braceRegex = /\$\{([^}]+)\}/g;
  const elements = [];
  let lastIdx = 0;
  let match;

  while ((match = braceRegex.exec(value)) !== null) {
    if (match.index > lastIdx) {
      elements.push(value.substring(lastIdx, match.index));
    }

    const varName = match[1].trim();
    const fullMatch = match[0];
    const isActive = activeVar === varName;

    elements.push(
      <code
        key={`var-brace-${match.index}`}
        className={`font-mono text-xs font-bold px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 border ${isActive ? "animate-pulse-red border-red-500" : "border-amber-300 dark:border-amber-700"} cursor-pointer hover:bg-amber-200 dark:hover:bg-amber-900 transition-colors`}
        onClick={(e) => {
          e.stopPropagation();
          onVariableClick(varName, true);
        }}
        title={`Click to track variable "${varName}"`}
      >
        {fullMatch}
      </code>,
    );
    // ========================================================
    // HIER IST DIE KORREKTUR des Tippfehlers
    // ========================================================
    lastIdx = braceRegex.lastIndex;
  }

  if (lastIdx < value.length) {
    elements.push(value.substring(lastIdx));
  }

  return <>{elements.length > 0 ? elements : value}</>;
};

export default TokenizedValue;
