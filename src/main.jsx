/**
 * This file serves as the main entry point for the React application.
 * It handles the initial rendering of the root component into the DOM.
 */

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { WorkflowProvider } from "./context/WorkflowContext";
import "./index.css";

/**
 * The root DOM element where the React application will be mounted.
 * @const {HTMLElement}
 */
const rootElement = document.getElementById("root");

/**
 * Creates the React root and renders the main application component.
 *
 * The `<App />` component is wrapped with `<WorkflowProvider>` to ensure that
 * the global workflow state (managed via React Context) is available to all
 * descendant components. `React.StrictMode` is used during development to
 * highlight potential problems in the application.
 */
ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <WorkflowProvider>
      <App />
    </WorkflowProvider>
  </React.StrictMode>,
);
