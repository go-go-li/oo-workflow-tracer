import React, { createContext, useContext } from "react";
import { useWorkflowData } from "../hooks/useWorkflowData";

/**
 * @typedef {import('../hooks/useWorkflowData').WorkflowDataHook} WorkflowDataHook
 */

/**
 * React context for providing workflow data and actions throughout the application.
 * @type {React.Context<WorkflowDataHook|null>}
 */
const WorkflowContext = createContext(null);

/**
 * Provider component that wraps the application and makes the workflow data
 * and actions available to all descendant components.
 *
 * @param {object} props - The component props.
 * @param {React.ReactNode} props.children - The child components to render.
 * @returns {React.ReactElement} The context provider component.
 */
export const WorkflowProvider = ({ children }) => {
  const workflowState = useWorkflowData();

  return (
    <WorkflowContext.Provider value={workflowState}>
      {children}
    </WorkflowContext.Provider>
  );
};

/**
 * Custom hook for accessing the workflow context.
 * It provides an easy way for components to get the workflow data and actions.
 *
 * @throws {Error} If used outside of a `WorkflowProvider`.
 * @returns {WorkflowDataHook} The workflow context value.
 */
export const useWorkflow = () => {
  const context = useContext(WorkflowContext);
  if (!context) {
    throw new Error("useWorkflow must be used within a WorkflowProvider");
  }
  return context;
};
