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

  // Wenn es sich um einen Schlüssel handelt, rendern wir ihn immer als klickbaren Token.
  if (isKey) {
    const isActive = activeVar === value;
    return (
      <code
        className={`font-mono text-xs font-bold px-1.5 py-0.5 rounded ${isActive ? "animate-pulse-red bg-emerald-100 border-red-500" : "bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700"} cursor-pointer`}
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

  const regex = /(\$\{[^}]+\})|(\b[a-zA-Z_][a-zA-Z0-9_.]*\b)/g;
  const elements = [];
  let lastIdx = 0;
  let match;

  while ((match = regex.exec(value)) !== null) {
    if (match.index > lastIdx) {
      elements.push(value.substring(lastIdx, match.index));
    }
    const fullMatch = match[0];
    const isBraceVar = fullMatch.startsWith("${");
    const isKnownVar = allVars.includes(fullMatch);

    if (isBraceVar || isKnownVar) {
      const varName = isBraceVar ? match[1].trim() : fullMatch;
      const isActive = activeVar === varName;
      elements.push(
        <code
          key={`${varName}-${match.index}`}
          className={`font-mono text-xs font-bold px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 border ${isActive ? "animate-pulse-red border-red-500" : "border-amber-300 dark:border-amber-700"} cursor-pointer`}
          onClick={(e) => {
            e.stopPropagation();
            onVariableClick(varName, true);
          }}
          title={`Click to track variable "${varName}"`}
        >
          {fullMatch}
        </code>,
      );
    } else {
      elements.push(fullMatch);
    }
    lastIdx = regex.lastIndex;
  }

  if (lastIdx < value.length) {
    elements.push(value.substring(lastIdx));
  }

  return <>{elements}</>;
};

export default TokenizedValue;
