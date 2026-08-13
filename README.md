# OO Workflow Variable Tracer

Ein web-basiertes Analysewerkzeug zur Analyse und Nachverfolgung von Variablen innerhalb von XML-Workflow-Definitionen aus **OpenText Operations Orchestration (OO)**.

---

## 📌 Übersicht

Dieses mit **React**, **Vite** und **Tailwind CSS v4** entwickelte Tool vereinfacht das Verständnis und das Debugging komplexer OpenText OO-Workflows. Durch das Parsen von XML-Workflow-Definitionsdateien extrahiert die Anwendung die gesamte Topologie des Datenflusses und stellt den Lebenszyklus der Variablen strukturiert dar.

Benutzer können XML-Dateien unkompliziert per Drag-and-drop hochladen, um sofort zu sehen, in welchen Schritten Variablen initialisiert, verändert oder als Eingabeparameter ausgelesen werden.

---

## ✨ Kernfunktionen

- 📂 **XML-Workflow-Upload**: Einfaches und schnelles Laden von OO-Workflow-Definitionsdateien (`.xml`) über eine interaktive Drag-and-drop-Zone oder einen klassischen Dateiauswahldialog.

- 🔍 **Variablen-Lifecycle-Analyse**: Suchen und filtern Sie gezielt nach Variablen. Die Anwendung hebt die Erstellungs- (Zuweisungs-) und Verwendungsstellen über den gesamten Workflow-Pfad hinweg optisch hervor.

- 📋 **Globales Variablenverzeichnis**: Eine zentrale, filterbare Tabelle aller im Workflow genutzten Variablen inklusive direkter Verknüpfungen (Quick-Nav) zu den jeweiligen Schritten.

- 📖 **Detaillierte Schritt-Ansicht**: Jeder Ausführungsschritt wird in einem tabellarischen Interface detailliert analysiert:
  - **Eingabewerte**: Übersicht aller Parameter und Auflösung verschachtelter Variablen im Format `${variable}`.
  - **Variablen-Zuweisungen**: Nachverfolgung von Datenflüssen aus Rückgabewerten, Scriptlet-Ausgaben oder dynamischen Zuweisungen.
  - **Übergänge (Transitions)**: Visualisierung der Folge-Schritte inklusive Farbkodierung für Erfolgs- (Success) und Fehlerpfade (Fail/Error).

- 🌐 **Zweisprachige Oberfläche**: Volle Internationalisierung (i18n) mit nahtlosem Wechsel zwischen **Deutsch (DE)** und **Englisch (EN)** zur Laufzeit.

- 🌓 **Dark/Light-Theme**: Anpassung des visuellen Erscheinungsbildes an Ihre Arbeitsumgebung (gespeichert in der lokalen Browser-Sitzung).

---

## 🚀 Setup und Installation

### Voraussetzungen

Stellen Sie sicher, dass auf Ihrem System folgende Software installiert ist:

- [Node.js](https://nodejs.org/) (Version 20.x oder höher empfohlen)
- [npm](https://www.npmjs.com/) (wird automatisch mit Node.js installiert)

### Installationsschritte

1.  **Repository klonen**

    ```bash
    git clone <repository-url>
    cd oo-variable-tracer
    ```

2.  **Abhängigkeiten installieren**
    Installieren Sie alle benötigten Node-Module über das Terminal:

    ```bash
    npm install
    ```

3.  **Entwicklungsserver starten**
    Starten Sie die lokale Laufzeitumgebung:
    ```bash
    npm run dev
    ```
    Die Anwendung ist anschließend standardmäßig unter [http://localhost:3000](http://localhost:3000) in Ihrem Webbrowser erreichbar.

---

## 🛠️ Verfügbare Skripte

Im Projektverzeichnis können Sie folgende Befehle ausführen:

- **`npm run dev`**: Startet den Vite-Entwicklungsserver mit Hot-Module-Replacement (HMR).
- **`npm run build`**: Bündelt und optimiert die Anwendung für den Produktionseinsatz im Ordner `dist/`.
- **`npm run lint`**: Analysiert die Codebasis mithilfe von ESLint auf Stilfehler und Syntax-Warnungen.
- **`npm run preview`**: Startet einen lokalen Webserver, um das zuvor erstellte Produktions-Build (`dist/`) zu testen.

---

## 🛡️ Technologien

- **Frontend-Bibliothek**: React (Functional Components, Custom Hooks)
- **Styling-Framework**: Tailwind CSS (v4)
- **Build-Tool**: Vite
- **Code-Qualität**: ESLint & Prettier
- **Dokumentation**: JSDoc Standard
