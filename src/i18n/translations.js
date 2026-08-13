/**
 * @typedef {object} TranslationKeys
 * @property {string} title
 * @property {string} dropZone
 * @property {string} themeToggleTooltip
 * @property {string} loadAnotherWorkflow
 * @property {string} searchTitle
 * @property {string} searchDesc
 * @property {string} searchPlaceholder
 * @property {string} registryTitle
 * @property {string} registryColVar
 * @property {string} registryColCreated
 * @property {string} registryColUsed
 * @property {string} variablesCount
 * @property {string} quickNavTitle
 * @property {string} flowInputsTitle
 * @property {string} flowInputsNone
 * @property {string} startParam
 * @property {string} executionStepsTitle
 * @property {string} stepColInputs
 * @property {string} stepColAssignments
 * @property {string} stepColTransitions
 * @property {string} noInputs
 * @property {string} noAssignments
 * @property {string} endOfPath
 * @property {string} unknown
 * @property {string} createdWord
 * @property {string} scriptletLabel
 * @property {string} stepScriptletLabel
 * @property {string} filtersLabel
 */

/**
 * Internationalization (i18n) object containing translation strings
 * for German ('de') and English ('en').
 *
 * @type {{ de: TranslationKeys, en: TranslationKeys }}
 */
export const i18n = {
  de: {
    // ALLGEMEIN
    title: "OO Workflow Variable Tracer",
    dropZone: "XML-Workflow-Datei hierher ziehen oder anklicken, um zu laden",
    themeToggleTooltip: "Theme wechseln (Hell/Dunkel)",
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
    noInputs: "Keine Eingabewerte für diesen Schritt.",
    noAssignments: "Keine Variablenzuweisungen in diesem Schritt.",
    endOfPath: "Ende des Pfads",
    unknown: "Unbekannt",
    createdWord: "Zuweisung",
    scriptletLabel: "Scriptlet",
    stepScriptletLabel: "Schritt-Scriptlet (nach Ausführung)",
    filtersLabel: "Filter",
  },
  en: {
    // GENERAL
    title: "OO Workflow Variable Tracer",
    dropZone: "Drag & drop XML workflow file here or click to browse",
    themeToggleTooltip: "Toggle Theme (Light/Dark)",
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
  },
};
