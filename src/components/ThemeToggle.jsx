import React, { useState, useEffect } from "react";

/**
 * A React component for toggling between light and dark themes.
 * It utilizes the native View Transitions API, when available, to provide smooth,
 * GPU-accelerated theme transitions, preventing DOM style recalculation lag.
 * Handles rapid state changes gracefully by catching aborted transition promises.
 *
 * @param {object} props - The component props.
 * @param {string} props.tooltip - The tooltip text for the toggle button.
 * @returns {JSX.Element} The rendered ThemeToggle component.
 */
const ThemeToggle = ({ tooltip }) => {
  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "light",
  );

  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;

    /**
     * Applies the current theme by adding or removing the 'dark' class
     * from the document's root and body elements.
     */
    const applyTheme = () => {
      if (theme === "dark") {
        root.classList.add("dark");
        body.classList.add("dark");
      } else {
        root.classList.remove("dark");
        body.classList.remove("dark");
      }
    };

    // Use the modern, GPU-accelerated View Transitions API for an instant 60fps crossfade.
    if (document.startViewTransition) {
      const transition = document.startViewTransition(() => {
        applyTheme();
      });

      // Prevent "Uncaught (in promise) AbortError: Transition was skipped"
      // by catching the promise rejections when transitions are aborted or double-triggered.
      transition.ready.catch(() => {});
      transition.finished.catch(() => {});
    } else {
      applyTheme();
    }

    localStorage.setItem("theme", theme);
  }, [theme]);

  /**
   * Toggles the theme between 'light' and 'dark'.
   */
  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      title={tooltip}
      className="h-9 w-9 rounded-lg bg-slate-100 dark:bg-slate-700/60 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-600 border border-slate-300 dark:border-slate-600 text-sm font-semibold inline-flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer shrink-0 transition-transform active:scale-95"
    >
      {theme === "light" ? "🌙" : "☀️"}
    </button>
  );
};

export default ThemeToggle;
