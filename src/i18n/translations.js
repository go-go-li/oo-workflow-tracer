export const i18n = {
  de: {
    // ALLGEMEIN
    title: "OO Workflow Variable Tracer",
    welcomeTitle: "Willkommen beim OO Workflow Variable Tracer!",
    welcomeDesc:
      "Dieses interaktive Werkzeug hilft Ihnen dabei, den Lebenszyklus und Fluss von Variablen in XML-Workflow-Definitionen von OpenText Operations Orchestration (OO) zu analysieren. Laden Sie einfach Ihre XML-Datei hoch, um globale Startparameter, Ausführungsschritte und Variablen-Zuweisungen im Detail nachzuverfolgen.",
    homeTooltip: "Zurück zur Startseite",
    dropZone: "XML-Workflow-Datei hierher ziehen oder anklicken, um zu laden",
    themeToggleTooltip: "Theme wechseln (Hell/Dunkel)",
    refreshWorkflow: "Workflow neu laden",
    loadAnotherWorkflow: "Anderen Workflow laden",

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

    // NAVIGATION
    quickNavTitle: "Workflow-Navigation",

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

    // ZUWEISUNGSQUELLEN (NEU)
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
      "This interactive tool helps you analyze the lifecycle and flow of variables in XML workflow definitions from OpenText Operations Orchestration (OO). Simply upload your XML file to trace global start parameters, execution steps, and variable assignments in detail.",
    homeTooltip: "Back to home page",
    dropZone: "Drag & drop XML workflow file here or click to browse",
    themeToggleTooltip: "Toggle Theme (Light/Dark)",
    refreshWorkflow: "Refresh Workflow",
    loadAnotherWorkflow: "Load Another Workflow",

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

    // NAVIGATION
    quickNavTitle: "Workflow Navigation",

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

    // ASSIGNMENT SOURCES (NEW)
    fromScriptlet: "From Expression/Scriptlet",
    fromInput: "from Step Input",
    fromResult: "from Step Result",
    fromBroadcast: "Assignment (Broadcast)",
    fromKeyNames: "Assignment via keyNames",
    filtersApplied: "Filters applied",
  },
};
