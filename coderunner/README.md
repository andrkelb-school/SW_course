# CodeRunner Integration

Dieses Verzeichnis enthält CodeRunner-Fragen für Moodle mit Python-Unterstützung.

## Struktur

```
coderunner/
├── questions/          # Frage-Definitionen
│   └── sum_two_numbers/
│       ├── prompt.md           # Aufgabenstellung
│       ├── question.json       # Metadaten (Name, Typ, Einstellungen)
│       ├── tests.yaml          # Testfälle (Input/Output)
│       ├── model_answer.py     # Musterlösung
│       └── template.mustache   # Starter-Code (optional)
├── scripts/           # Build-Scripts
│   └── build_moodle_xml.py    # Generator für Moodle XML
└── dist/             # Generierte Moodle XML-Dateien
    ├── moodle-export.xml      # Automatisch generiert (minimal)
    └── single-question.xml    # Manuelle lauffähige Version
```

## Aktuelle Fragen

### A1 - Einfache Rechnung (`sum_two_numbers`)
- **Typ**: `python3_w_input` (interaktive Eingabe)
- **Aufgabe**: Zwei Zahlen einlesen, Summe berechnen und ausgeben
- **Testfälle**: 2 Tests mit multi-line Input/Output
- **Status**: ✅ Lauffähige XML verfügbar

## Verwendung

### Moodle Import (Empfohlen)

1. Importiere `dist/single-question.xml` in Moodle:
   - Kurs öffnen → Fragensammlung → Import
   - Format: **Moodle XML**
   - Datei auswählen: `single-question.xml`
   - Import durchführen

2. Frage in Quiz einbinden

### Automatische Generierung (In Entwicklung)

```bash
python scripts/build_moodle_xml.py
```

⚠️ **Hinweis**: Der Generator erzeugt aktuell nur eine minimale Version. Für produktive Nutzung die manuell erstellte `single-question.xml` verwenden.

## Neue Frage hinzufügen

1. Ordner unter `questions/` erstellen:
   ```
   questions/neue_aufgabe/
   ```

2. Dateien anlegen:
   - `prompt.md` – Aufgabenstellung in Markdown
   - `question.json` – Metadaten:
     ```json
     {
       "name": "A2 - Beschreibung",
       "defaultgrade": 30,
       "coderunnertype": "python3_w_input",
       "penaltyregime": "10, 20, ...",
       "answerboxlines": 18,
       "answerboxcolumns": 100
     }
     ```
   - `tests.yaml` – Testfälle:
     ```yaml
     - testtype: 0
       useasexample: 1
       mark: 1.0
       input_lines:
         - "10"
         - "5"
       expected: |
         Ausgabe Zeile 1
         Ausgabe Zeile 2
     ```
   - `model_answer.py` – Musterlösung

3. Für interaktive Fragen (`python3_w_input`):
   - Nutze `input()` für Benutzereingaben
   - Testfälle als multi-line Input/Output definieren
   - Expected-Output muss Prompts + Ergebnisse enthalten

## Zukünftige Erweiterungen

### 🔮 Geplant: LTI-Integration (Repo-Anbindung)

Ermöglicht Live-Synchronisation zwischen GitHub und Moodle:

- **Ziel**: Fragen in Moodle bleiben mit Repo verknüpft
- **Vorteile**:
  - Updates in GitHub → automatisch in Moodle aktiv
  - Keine Re-Imports nötig
  - Versionskontrolle für alle Fragen
  - Single Source of Truth

- **Technische Ansätze**:
  1. **Custom Prototyp** mit externem Code-Fetch (jsDelivr CDN)
  2. **Moodle Web Services API** für automatische Updates
  3. **LTI Provider** mit GitHub-Backend
  4. **Template-basiertes Laden** von Tests zur Laufzeit

- **Voraussetzungen**:
  - Zugriff auf CodeRunner-Serverkonfiguration
  - Moodle Web Services aktiviert
  - Möglichkeit für Custom Question Types

- **Status**: 📋 Vorgemerkt für zukünftige Implementierung

## Hinweise

- **CodeRunner-Typ**: Nutze `python3_w_input` für interaktive Aufgaben
- **Penalty Regime**: `10, 20, ...` bedeutet 10% Abzug pro Fehlversuch
- **Testfälle**: `useasexample: 1` zeigt den Test als Beispiel an
- **Multi-line Output**: Achte auf korrekte Zeilenumbrüche in `expected`

- `weight`: Punktgewichtung.
- `display`: Anzeigename für Beispieltests.

## Erweiterungen (optional)
- Zusätzliche Felder (z.B. `complexity`, `learning_objectives`).
- Automatisierte Validierung via CI (Model-Antwort gegen Tests ausführen).
- Unterstützung weiterer Sprachen durch neue Prototypen.

## Lizenz
Kein spezieller Lizenzheader hinzugefügt. Interner Schulgebrauch.
