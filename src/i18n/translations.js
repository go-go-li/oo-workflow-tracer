export const i18n = {
  de: {
    // ALLGEMEIN
    title: "OO Workflow Variable Tracer",
    welcomeTitle: "Willkommen beim OO Workflow Variable Tracer!",
    welcomeDesc:
      "Dieses interaktive Werkzeug hilft Ihnen dabei, den Lebenszyklus und Fluss von Variablen in XML-Workflow-Definitionen von OpenText Operations Orchestration (OO) zu analysieren. Wählen Sie einen Workspace oder laden Sie eine einzelne XML-Datei hoch, um zu starten.",
    homeTooltip: "Startbildschirm (Workspace zurücksetzen)",
    themeToggleTooltip: "Theme wechseln (Hell/Dunkel)",

    // UPLOAD / HEADER-BUTTONS
    dropZoneWorkspace: "Workspace-Verzeichnis auswählen",
    uploadSingleFile: "eine einzelne XML-Datei hochladen",
    orText: "Oder",
    loadNewWorkspace: "Neuer Workspace",
    loadNewWorkspaceTooltip: "Neuen Workspace laden",
    loadSingleFile: "Einzelne Datei",
    loadSingleFileTooltip: "Einzelnen Workflow laden",

    // WORKSPACE & DASHBOARD
    workspaceEmpty: "Keine .xml-Dateien in diesem Verzeichnis gefunden.",
    selectWorkflowPlaceholder:
      "Wählen Sie einen Workflow aus dem Explorer, um die Analyse zu starten.",
    loadingText: "Analysiere Workflow...",

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

    // HILFSTEXTE & BADGES
    noInputs: "Keine Eingabewerte für dieser Schritt.",
    noAssignments: "Keine Variablenzuweisungen in diesem Schritt.",
    endOfPath: "Ende des Pfads",
    unknown: "Unbekannt",
    createdWord: "Zuweisung",
    scriptletLabel: "Scriptlet",
    stepScriptletLabel: "Schritt-Scriptlet (nach Ausführung)",
    filtersLabel: "Filter",

    // ZUWEISUNGSQUELLEN
    fromScriptlet: "Aus Ausdruck/Skriptlet",
    fromInput: "aus Schritt-Eingabe",
    fromResult: "aus Schritt-Ergebnis",
    fromBroadcast: "Zuweisung (Broadcast)",
    fromKeyNames: "Zuweisung via keyNames",
    filtersApplied: "Filter angewendet",
  },
  en: {
    // GENERAL
    title: "OO Workflow Variable Tracer",
    welcomeTitle: "Welcome to the OO Workflow Variable Tracer!",
    welcomeDesc:
      "This interactive tool helps you analyze the lifecycle and flow of variables in OpenText Operations Orchestration (OO) XML workflows. Select a workspace directory or upload a single XML file to get started.",
    homeTooltip: "Home Screen (Reset Workspace)",
    themeToggleTooltip: "Toggle Theme (Light/Dark)",

    // UPLOAD / HEADER BUTTONS
    dropZoneWorkspace: "Select Workspace Directory",
    uploadSingleFile: "upload a single XML file",
    orText: "Or",
    loadNewWorkspace: "New Workspace",
    loadNewWorkspaceTooltip: "Load New Workspace",
    loadSingleFile: "Single File",
    loadSingleFileTooltip: "Load Single Workflow",

    // WORKSPACE & DASHBOARD
    workspaceEmpty: "No .xml files found in this directory.",
    selectWorkflowPlaceholder:
      "Select a workflow from the explorer to begin analysis.",
    loadingText: "Analyzing workflow...",

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

    // HELPER TEXT & BADGES
    noInputs: "No inputs for this step.",
    noAssignments: "No variable assignments in this step.",
    endOfPath: "End of Path",
    unknown: "Unknown",
    createdWord: "Assignment",
    scriptletLabel: "Scriptlet",
    stepScriptletLabel: "Step-Level Scriptlet (Post-Execution)",
    filtersLabel: "Filters",

    // ASSIGNMENT SOURCES
    fromScriptlet: "From Expression/Scriptlet",
    fromInput: "from Step Input",
    fromResult: "from Step Result",
    fromBroadcast: "Assignment (Broadcast)",
    fromKeyNames: "Assignment via keyNames",
    filtersApplied: "Filters applied",
  },
};
