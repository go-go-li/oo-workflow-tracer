export const i18n = {
  de: {
    // ALLGEMEIN
    title: "OO Workflow Variable Tracer",
    welcomeTitle: "Willkommen beim OO Workflow Variable Tracer!",
    welcomeDesc:
      "Dieses interaktive Werkzeug hilft Ihnen, Variablen in OpenText Operations Orchestration (OO) Workflows zu analysieren. Wählen Sie einen Workspace, um zu starten.",
    homeTooltip: "Startbildschirm (Workspace zurücksetzen)",
    themeToggleTooltip: "Theme wechseln (Hell/Dunkel)",

    // UPLOAD / HEADER-BUTTONS
    dropZoneWorkspace: "Workspace-Verzeichnis auswählen",
    loadNewWorkspace: "Neuer Workspace",
    loadNewWorkspaceTooltip: "Neuen Workspace laden",

    // WORKSPACE & DASHBOARD
    workspaceEmpty: "Keine .xml-Dateien in diesem Verzeichnis gefunden.",
    selectWorkflowPlaceholder:
      "Wählen Sie einen Workflow aus dem Explorer, um die Analyse zu starten.",
    loadingText: "Analysiere Workflow...",
    filterTreePlaceholder: "Workflows filtern...",
    clearFilterTooltip: "Filter löschen",
    filterNoResults: "Keine Workflows gefunden.",

    // NEU: TABS
    usageTab: "Usage",
    variablesTab: "Variables",

    // SUCHE
    searchTitle: "Variablensuche und -Analyse",
    searchDesc:
      "Analysieren Sie den Lebenszyklus einer Variable und verfolgen Sie ihren Fluss durch alle Schritte.",
    searchPlaceholder: "Variablenname eingeben...",

    // VERZEICHNIS (REGISTRY)
    registryTitle: "Globales Variablenverzeichnis",
    registryColVar: "Variable",
    registryColCreated: "Erstellt in",
    registryColUsed: "Verwendet in",
    variablesCount: "Variablen",

    // GLOBALE INPUTS
    flowInputsTitle: "Globale Startparameter",
    flowInputsNone: "Keine globalen Startparameter deklariert.",
    startParam: "(Startparameter)",

    // SCHRITTDETAILS
    executionStepsTitle: "Details der Ausführungsschritte",
    stepColInputs: "Eingabewerte",
    stepColAssignments: "Variablen-Zuweisungen",
    stepColTransitions: "Übergänge",
    noInputs: "Keine Eingabewerte für dieser Schritt.",
    noAssignments: "Keine Variablenzuweisungen in diesem Schritt.",
    endOfPath: "Ende des Pfads",
    unknown: "Unbekannt",
  },
  en: {
    // GENERAL
    title: "OO Workflow Variable Tracer",
    welcomeTitle: "Welcome to the OO Workflow Variable Tracer!",
    welcomeDesc:
      "This interactive tool helps you analyze variables in OpenText Operations Orchestration (OO) workflows. Select a workspace to get started.",
    homeTooltip: "Home Screen (Reset Workspace)",
    themeToggleTooltip: "Toggle Theme (Light/Dark)",

    // UPLOAD / HEADER BUTTONS
    dropZoneWorkspace: "Select Workspace Directory",
    loadNewWorkspace: "New Workspace",
    loadNewWorkspaceTooltip: "Load New Workspace",

    // WORKSPACE & DASHBOARD
    workspaceEmpty: "No .xml files found in this directory.",
    selectWorkflowPlaceholder:
      "Select a workflow from the explorer to begin analysis.",
    loadingText: "Analyzing workflow...",
    filterTreePlaceholder: "Filter workflows...",
    clearFilterTooltip: "Clear filter",
    filterNoResults: "No workflows found.",

    // NEW: TABS
    usageTab: "Usage",
    variablesTab: "Variables",

    // SEARCH
    searchTitle: "Variable Search & Analysis",
    searchDesc:
      "Analyze the lifecycle of a variable and trace its flow across all workflow steps.",
    searchPlaceholder: "Enter variable name...",

    // REGISTRY
    registryTitle: "Global Variable Directory",
    registryColVar: "Variable",
    registryColCreated: "Created In",
    registryColUsed: "Used In",
    variablesCount: "Variables",

    // GLOBAL INPUTS
    flowInputsTitle: "Global Input Parameters",
    flowInputsNone: "No global input parameters declared for this workflow.",
    startParam: "(Start parameter)",

    // STEP DETAILS
    executionStepsTitle: "Execution Step Details",
    stepColInputs: "Input Values",
    stepColAssignments: "Variable Assignments",
    stepColTransitions: "Transitions",
    noInputs: "No inputs for this step.",
    noAssignments: "No variable assignments in this step.",
    endOfPath: "End of Path",
    unknown: "Unknown",
  },
};
