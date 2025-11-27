# 🎓 BauMax Learning Platform - Multi-Course Management System

Eine moderne, externe Kursverwaltungsplattform mit GitHub-Integration, die Moodle als reinen Rahmen nutzt. Kursinhalte werden live von GitHub geladen – flexibel, wartbar und skalierbar.

## 🎯 Ziel & Vision

**Ziel:** Verwaltung von Kursinhalten außerhalb von Moodle für bessere Wartbarkeit und Skalierbarkeit.

**Vision:**
- ✅ Ein Ort für alle Kursinhalte (GitHub)
- ✅ Moodle nur als Integrations-Rahmen
- ✅ Live-Updates ohne Moodle-Admin
- ✅ Zukünftig: PyScript für interaktive Übungen
- ✅ Mobile-optimiert für alle Geräte

---

## 📁 Repo-Struktur

```
SW_Situation_1_BauMax/
├── 📄 README.md                    # Diese Datei
├── 📄 index.html                   # Einstiegspunkt für lokale Tests
│
├── 📁 assets/                      # Zentrale Assets
│   ├── css/
│   │   └── style.css               # Globale Styles (Mobile-First)
│   ├── js/
│   │   ├── loader.js               # Fetch & Inject Engine
│   │   ├── pyscript-runner.js      # PyScript Integration
│   │   ├── code-editor.js          # Code Editor mit Syntax-Highlighting
│   │   └── exercise-system.js      # Interaktive Übungen
│   └── images/
│
├── 📁 courses/                     # Alle Kurse (Multi-Situation Support)
│   ├── situation_1/                # Situation 1 - BauMax App
│   │   ├── config.json             # Kurs-Metadaten & Kapitel
│   │   ├── moodle-snippet.html     # Moodle-Embed für Situation 1
│   │   ├── chapters/               # HTML-Kapitel
│   │   │   ├── seite1.0_baumax_app.html
│   │   │   ├── seite1.1_fliesenrechner.html
│   │   │   └── ...
│   │   └── exercises/              # Interaktive Übungen (geplant)
│   │
│   └── situation_2/                # Situation 2 - SmartHome Systems
│       ├── config.json             # Kurs-Metadaten & Kapitel
│       ├── moodle-snippet.html     # Moodle-Embed für Situation 2
│       └── chapters/               # HTML-Kapitel
│           ├── seite2.0_smarthome_systems.html
│           ├── seite2.1_logik_architekt.html
│           └── ...
│
├── 📁 coderunner/                  # CodeRunner Integration (Moodle)
│   ├── README.md                   # CodeRunner Dokumentation
│   ├── questions/                  # Python-Aufgaben
│   │   └── sum_two_numbers/        # Beispiel: A1 - Einfache Rechnung
│   │       ├── prompt.md           # Aufgabenstellung
│   │       ├── question.json       # Metadaten
│   │       ├── tests.yaml          # Testfälle
│   │       ├── model_answer.py     # Musterlösung
│   │       └── template.mustache   # Starter-Code
│   ├── scripts/
│   │   └── build_moodle_xml.py     # Generator für Moodle XML
│   └── dist/
│       ├── moodle-export.xml       # Auto-generiert (minimal)
│       └── single-question.xml     # Lauffähige Version
│
└── 📁 dev/                         # Entwicklungs-/Test-Dateien
    ├── demo-pyscript.html          # PyScript Demo
    ├── test-dashboard.html         # Test Dashboard
    ├── test-python-simple.html     # Python Tester
    └── test-runner.html            # Integration Tests
```

---

## 🚀 Implementierungs-Roadmap

### Phase 1 ✅ ABGESCHLOSSEN
**Grundstruktur & Infrastruktur**
- ✅ Ordnerstruktur (assets/, courses/, coderunner/, dev/)
- ✅ config.json für Kursmetadaten
- ✅ Zentrale CSS mit Dark Mode & Responsive Design
- ✅ index.html Landing Page
- ✅ Git-Repository mit .gitignore
- ✅ Multi-Situation Support (Situation 1 & 2)
- ✅ CodeRunner Integration für Python-Aufgaben
- ✅ Moodle-Snippets in course-spezifischen Ordnern
**Status:** Erfolgreich bereitgestellt

### Phase 2 ✅ ABGESCHLOSSEN
**Loader-System & Dynamisches Rendering**

#### 🎯 Dateien in Phase 2:

**`assets/js/loader.js`**
- CourseLoader Klasse mit config.json Support
- Dynamisches Kapitel-Laden und Rendering
- LocalStorage Caching mit TTL
- Error Handling & Fallbacks
- Browser-kompatibel

**`courses/situation_X/moodle-snippet.html`**
- Vollständig responsive Design
- Dark Mode Support
- Mobile-optimiert für alle Geräte
- Marker-basiertes Content-Extraction System
- Collapsible Table of Contents
- Situation-spezifische Konfiguration

**`dev/test-runner.html`** & **`dev/test-dashboard.html`**
- Unit Tests & Integration Tests
- Performance Monitoring
- Automatisierte Testausführung

#### ✅ Features in Phase 2:
- ✅ Fetch & Inject Engine
- ✅ Config-getriebene Kapitelstruktur
- ✅ Multi-Course Support (Situation 1 & 2)
- ✅ Intelligentes Caching mit Cache-Busting
- ✅ Mobile-First Design
- ✅ Dark Mode
- ✅ Marker-basierte Content-Extraction
- ✅ Fallback-Strategien für Legacy-Inhalte
- ✅ jsDelivr CDN Integration

#### 💻 Verwendung in Moodle:
Kopiere den Inhalt von `courses/situation_X/moodle-snippet.html` in eine Moodle-Seite (HTML-Modus).
Die Kapitel werden automatisch via jsDelivr CDN geladen.

### Phase 3 ✅ ABGESCHLOSSEN
**PyScript Integration & Python-Ausführung**

#### 🎯 Dateien in Phase 3:

**`assets/js/pyscript-runner.js`**
- Pyodide Integration (CPython in WebAssembly)
- Code Execution Engine mit Output-Capture
- Test Case Management & Auto-Grading
- Error Handling & Debugging
- Execution History & Statistics
- Vollständig Vanilla JS (keine Dependencies)

**`assets/js/code-editor.js`**
- Python Code Editor mit Line Numbers
- Syntax Highlighting (highlight.js)
- Auto-Indentation & Tab Support
- Theme Support (Light/Dark)
- Keyboard Shortcuts (Ctrl+Enter, Tab)
- Copy/Paste Funktionalität
- Fully Responsive Design

**`assets/js/exercise-system.js`**
- Interaktive Python-Übungen
- Auto-Grading mit Test Cases
- Hints & Tips System
- Progress Tracking & Solution Storage
- Difficulty Levels (easy/medium/hard)
- Feedback System
- LocalStorage Integration

**`dev/demo-pyscript.html`**
- Live Python Code Editor
- Exercise Showcase
- Feature Demonstrations
- Interactive Tutorials

#### ✅ Features in Phase 3:
- ✅ Python Code-Ausführung im Browser (Pyodide)
- ✅ Code-Editor mit Syntax-Highlighting
- ✅ Auto-Grading Systeme
- ✅ Test Case Management
- ✅ Hints & Feedback
- ✅ Progress Tracking
- ✅ Responsive Design
- ✅ Dark Mode Support
- ✅ Keine Server-Dependencies

### Phase 4 ✅ ABGESCHLOSSEN
**CodeRunner Integration für Moodle**

#### 🎯 Dateien in Phase 4:

**`coderunner/`** - Vollständige CodeRunner-Integration
- Python-Aufgaben mit interaktiven Tests
- Moodle XML Export für direkten Import
- YAML-basierte Testfall-Definition
- Musterlösungen und Starter-Code
- Build-Script für automatische Generierung

**Erste Beispielaufgabe:** `sum_two_numbers`
- Interaktive Python-Aufgabe (input/output)
- Multi-line Testfälle
- Lauffähige Moodle XML verfügbar

#### ✅ Features in Phase 4:
- ✅ CodeRunner-Fragestruktur in Repository
- ✅ YAML-basierte Testdefinitionen
- ✅ Moodle XML Export (manuell erstellt)
- ✅ Dokumentation mit LTI-Roadmap
- 🔮 Geplant: LTI-Integration für Live-Sync mit Moodle

### Phase 5 📱 ZUKÜNFTIG
**Advanced Features & Optimierung**
- [ ] LTI-Integration für CodeRunner (Repo ↔ Moodle Sync)
- [ ] Service Workers für Offline-Unterstützung
- [ ] Progressive Web App (PWA) Struktur
- [ ] Moodle Gradebook Integration
- [ ] Analytics & Learning Analytics
- [ ] Weitere Situations (3, 4, ...)
- [ ] Erweiterte CodeRunner-Aufgaben
- [ ] Collaboration & Code Sharing
- [x] README Dokumentation
- [x] Projekt-Reorganisation
- [ ] Caching & LocalStorage
- [ ] Mobile-First Tests

### 🔮 Phase 3: PyScript Integration
- [ ] PyScript Setup & Sandbox
- [ ] Python-Übungen im Browser
- [ ] Output-Capture & Visualisierung
- [ ] Error Handling für Python

### 📱 Phase 4: Erweiterte Features
- [ ] Offline-Support (Service Workers)
- [ ] Benutzerfortschritt-Tracking
- [ ] Code-Editor Integration
- [ ] Social Features (Sharing)

---

## 📋 Kurs-Konfiguration

Die `config.json` definiert die Kursstruktur:

```json
{
  "courseId": "situation_1",
  "courseName": "Situation 1 - BauMax App",
  "chapters": [
    {
      "id": "1.0",
      "title": "Die BauMax-App",
      "type": "intro",
      "exercise": null
    },
    {
      "id": "1.1",
      "title": "Fliesenrechner",
      "type": "lesson",
      "exercise": "1.1_fliesenrechner.html"
    }
  ]
}
```

---

## 🎨 Design & UX

### Dark Mode
- Zentrale CSS-Variablen in `:root`
- Automatische Umschaltung via `body.dark-mode`
- Vollständig responsive

### Mobile-Optimierung
- Breakpoints: 768px, 480px
- Sticky Navigation (TOC)
- Flexible Layouts
- Touch-freundliche Buttons

### Accessibility
- Semantisches HTML
- Ausreichend Kontrast
- Keyboard-Navigation
- Screen-Reader unterstützung

---

## 🔧 Technologie-Stack

| Bereich | Tech | Version |
|---------|------|---------|
| **Frontend** | HTML5, CSS3, Vanilla JS | Latest |
| **CMS** | GitHub | - |
| **Hosting** | GitHub Pages / jsdelivr CDN | - |
| **LMS** | Moodle | 4.x |
| **Future** | PyScript | 2024+ |

---

## 📖 Nutzung

### Lokal testen
```bash
# Python HTTP Server (Port 8000)
python -m http.server 8000

# Öffnen in Browser
http://localhost:8000/index.html
```

### Neuen Kurs hinzufügen
1. Ordner unter `courses/[course_id]/` erstellen
2. `config.json` mit Kapiteln definieren
3. Markdown-Dateien in `chapters/` schreiben
4. HTML-Übungen in `exercises/` platzieren

### In Moodle einbinden
```html
<!-- Kopieren Sie diesen Code in ein Moodle-Textfeld -->
<iframe src="https://cdn.jsdelivr.net/gh/andrkelb-school/SW_Situation_1_BauMax@latest/dist/moodle-embed.html" 
        width="100%" 
        height="800" 
        style="border: none;"></iframe>
```

---

## 🎓 Kapitel-Übersicht (Situation 1)

| Kap. | Titel | Dauer | Typ |
|------|-------|-------|-----|
| 1.0 | Die BauMax-App | 10 min | Intro |
| 1.1 | Fliesenrechner | 30 min | Lektion |
| 1.2 | Digitaler Helfer | 30 min | Lektion |
| 1.3 | BauMax Premium | 35 min | Lektion |
| 1.4 | Vollständiges Kundenprofil | 40 min | Lektion |
| 1.5 | Checkliste für Warenversand | 30 min | Lektion |
| 1.6 | Mehrwertsteuer | 35 min | Lektion |
| 1.7 | Speicheroptimierung | 40 min | Lektion |
| 1.8 | Verpackungs-Rechner | 35 min | Lektion |
| 1.9 | Zugangs-Check | 30 min | Lektion |
| **Summe** | | **295 min** | |

---

## 🔐 Sicherheit & Best Practices

- ✅ GitHub Pages mit HTTPS
- ✅ Content Security Policy (CSP) Headers
- ✅ Keine sensiblen Daten im Repo
- ✅ PyScript in Sandbox ausgeführt
- ✅ Regelmäßige Dependency-Updates

---

## 📝 Entwickler-Notizen

### Git Workflow
```bash
# Neue Features
git checkout -b feature/feature-name

# Changes committen
git add .
git commit -m "Feature: Beschreibung"

# Zu main
git push origin feature/feature-name
# → Pull Request erstellen
```

### Debugging
- Browser DevTools → Network Tab für CDN-Requests
- Console für JavaScript Fehler
- LocalStorage Inspector für Caching

---

## 🤝 Beitragen

Neue Kurse oder Features? Gerne!

1. Fork das Repo
2. Feature-Branch erstellen
3. Änderungen committen
4. PR erstellen

---

## 📞 Support & Kontakt

- **Repository:** https://github.com/andrkelb-school/SW_Situation_1_BauMax
- **Issues:** GitHub Issues verwenden
- **Docs:** Siehe `README.md` (diese Datei)

---

## 📄 Lizenz

Diese Materialien sind für Bildungszwecke gedacht.

---

## 🔄 Changelog

### v1.0.0 (27.11.2025)
- ✅ Phase 1: Grundstruktur abgeschlossen
- ✅ 10 Kapitel mit config.json
- ✅ Responsive CSS mit Dark Mode
- ✅ Dokumentation

### v0.9.0 (vorher)
- Alte HTML-basierten Seiten

---

**Stand:** 27. November 2025 | **Status:** Phase 1 ✅ | **Nächstes:** Phase 2 (Loader-System)
