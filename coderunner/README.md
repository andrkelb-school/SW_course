# CodeRunner-Fragen Repository-Bereich

Dieser Bereich enthält versionierbare Programmieraufgaben für Moodle CodeRunner.

## Struktur
```
coderunner/
  questions/
    sum_two_numbers/
      prompt.md          # Markdown-Beschreibung
      question.json      # Metadaten & Einstellungen
      tests.yaml         # Testfälle
      model_answer.py    # Referenzlösung
      template.mustache  # Startercode für Studierende
  scripts/
    build_moodle_xml.py  # Generator für Moodle-XML Export
  dist/
    moodle-export.xml    # (Generiert) Importdatei für Moodle
```

## Workflow
1. Neue Frage als Unterordner in `questions/` anlegen.
2. `prompt.md` schreiben, `question.json` aus vorhandener Vorlage kopieren und anpassen.
3. Testfälle in `tests.yaml` pflegen.
4. Referenzlösung in `model_answer.py` erstellen.
5. Optional Startercode in `template.mustache` hinterlegen.
6. Export erzeugen:
   ```bash
   python coderunner/scripts/build_moodle_xml.py
   ```
7. Datei `coderunner/dist/moodle-export.xml` in Moodle importieren (Fragen-Import, Format: Moodle XML).

## question.json Felder
- `name`: Anzeigename.
- `category`: Moodle-Kategoriepfad.
- `language` / `prototype`: Ausführungsumgebung (hier python3).
- `description_md`: Fallback, falls `prompt.md` fehlt.
- `answer_template`: Startercode im Antwortfeld.
- `answer_box_size`: Zeilenhöhe des Editors.
- `grader_type`: normal oder combinator.
- `test_strategy`: all_or_nothing (einfachster Fall).
- `timeout`: Sekundenlimit.
- `tags`: Liste von Schlagworten.
- `tests_ref`: Dateiname der Testdefinition.

## tests.yaml Format
Einfaches Listenformat. Felder:
- `input`: stdin für den Test.
- `expected`: Erwartete Ausgabe (exakter Vergleich).
- `hidden`: true/false (versteckt im Moodle-UI).
- `weight`: Punktgewichtung.
- `display`: Anzeigename für Beispieltests.

## Erweiterungen (optional)
- Zusätzliche Felder (z.B. `complexity`, `learning_objectives`).
- Automatisierte Validierung via CI (Model-Antwort gegen Tests ausführen).
- Unterstützung weiterer Sprachen durch neue Prototypen.

## Lizenz
Kein spezieller Lizenzheader hinzugefügt. Interner Schulgebrauch.
