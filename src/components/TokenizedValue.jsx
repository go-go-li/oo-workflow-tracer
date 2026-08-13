import React from "react";

/**
 * A component that renders a string value, parsing and highlighting variable tokens.
 * It can identify variables in `${...}` format, pipe-separated tokens, and plain text.
 * @param {object} props - The component props.
 * @param {string | undefined} props.value - The string value to tokenize and render.
 * @param {string | undefined} props.activeVar - The currently active/searched variable to highlight.
 * @param {(varName: string) => void} props.onVariableClick - Callback function triggered when a variable token is clicked.
 * @returns {JSX.Element} The rendered component with highlighted variables.
 */
const TokenizedValue = ({ value, activeVar, onVariableClick }) => {
  if (!value || typeof value !== "string")
    return <span className="text-slate-400">-</span>;

  /**
   * Finds and wraps plain text matches of the active variable in a styled `<code>` tag.
   * @param {string} text - The text to search within.
   * @returns {(string | JSX.Element)[]} An array of strings and React elements.
   */
  const formatPlainTextMatches = (text) => {
    if (!activeVar) return [text];

    const escapedVar = activeVar.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
    const wordRegex = new RegExp(`\\b(${escapedVar})\\b`, "gi");
    const parts = [];
    let lastIdx = 0;
    let match;

    while ((match = wordRegex.exec(text)) !== null) {
      if (match.index > lastIdx) {
        parts.push(text.substring(lastIdx, match.index));
      }

      const matchedWord = match[1];
      parts.push(
        <code
          key={`var-plain-${match.index}`}
          className="font-mono text-xs font-bold px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700 cursor-pointer animate-pulse-red"
          onClick={(e) => {
            e.stopPropagation();
            if (onVariableClick) onVariableClick(matchedWord);
          }}
          title={`Click to track variable "${matchedWord}"`}
        >
          {matchedWord}
        </code>,
      );
      lastIdx = wordRegex.lastIndex;
    }

    if (lastIdx < text.length) {
      parts.push(text.substring(lastIdx));
    }

    return parts.length > 0 ? parts : [text];
  };

  /**
   * Parses text for `${...}`-style variables, wrapping them in styled `<code>` tags.
   * Also uses `formatPlainTextMatches` for non-variable text parts.
   * @param {string} text - The text to search for variables.
   * @returns {(string | JSX.Element)[]} An array of strings and React elements.
   */
  const formatVariables = (text) => {
    const braceRegex = /\$\{([^}]+)\}/g;
    const elements = [];
    let lastIdx = 0;
    let match;

    while ((match = braceRegex.exec(text)) !== null) {
      if (match.index > lastIdx) {
        const preText = text.substring(lastIdx, match.index);
        elements.push(...formatPlainTextMatches(preText));
      }

      const varName = match[1].trim();
      const fullMatch = match[0];

      const isVarActive =
        activeVar && varName.toLowerCase() === activeVar.toLowerCase();
      const pulseClass = isVarActive
        ? "animate-pulse-red border-red-500"
        : "border-amber-300 dark:border-amber-700";

      elements.push(
        <code
          key={`var-brace-${match.index}`}
          className={`font-mono text-xs font-bold px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 border ${pulseClass} cursor-pointer hover:bg-amber-200 dark:hover:bg-amber-900 transition-colors`}
          onClick={(e) => {
            e.stopPropagation();
            if (onVariableClick) onVariableClick(varName);
          }}
          title={`Click to track variable "${varName}"`}
        >
          {fullMatch}
        </code>,
      );
      lastIdx = braceRegex.lastIndex;
    }

    if (lastIdx < text.length) {
      const postText = text.substring(lastIdx);
      elements.push(...formatPlainTextMatches(postText));
    }

    return elements.length > 0 ? elements : text;
  };

  if (value.includes("|")) {
    const tokens = value.split("|");
    return (
      <>
        {tokens.map((token, idx) => {
          const trimmed = token.trim();
          const isPureVar = /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(trimmed);
          const isVarActive =
            activeVar && trimmed.toLowerCase() === activeVar.toLowerCase();
          const pulseClass = isVarActive
            ? "animate-pulse-red border-red-500"
            : "border-amber-300 dark:border-amber-700";

          return (
            <React.Fragment key={idx}>
              {idx > 0 && (
                <span className="text-slate-400 font-bold mx-1">|</span>
              )}
              {isPureVar ? (
                <code
                  key={idx}
                  className={`font-mono text-xs font-bold px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 border ${pulseClass} cursor-pointer hover:bg-amber-200 dark:hover:bg-amber-900 transition-colors`}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onVariableClick) onVariableClick(trimmed);
                  }}
                >
                  {trimmed}
                </code>
              ) : (
                formatVariables(token)
              )}
            </React.Fragment>
          );
        })}
      </>
    );
  }

  return <>{formatVariables(value)}</>;
};

export default TokenizedValue;
