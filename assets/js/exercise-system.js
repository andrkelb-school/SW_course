/**
 * BauMax Learning Platform - Exercise System
 * 
 * Features:
 * - Interaktive Python-Übungen
 * - Auto-grading mit Test Cases
 * - Hints und Tipps
 * - Fortschritts-Tracking
 * - Feedback-System
 * - Challenge Modes
 * 
 * @version 1.0.0
 */

class ExerciseSystem {
  constructor(options = {}) {
    this.options = {
      containerId: options.containerId || 'exercise_container',
      ...options
    };

    this.container = null;
    this.currentExercise = null;
    this.solutions = {}; // Speichere Lösungen für jeden User
    this.hints = [];
    this.testsPassed = 0;
    this.totalTests = 0;

    this.init();
  }

  /**
   * Initialisierung
   */
  async init() {
    console.log('🎯 ExerciseSystem v1.0.0 initializing...');

    try {
      this.container = document.getElementById(this.options.containerId);
      if (!this.container) {
        throw new Error(`Container ${this.options.containerId} nicht gefunden`);
      }

      console.log('✅ ExerciseSystem ready!');
    } catch (error) {
      console.error('❌ ExerciseSystem init failed:', error);
    }
  }

  /**
   * Lade eine Übung
   */
  async loadExercise(exercise) {
    console.log(`📝 Lade Übung: ${exercise.id}`);

    this.currentExercise = exercise;
    this.testsPassed = 0;
    this.totalTests = exercise.testCases?.length || 0;
    this.hints = [];

    this.renderExercise();
  }

  /**
   * Rendere Übung
   */
  renderExercise() {
    if (!this.currentExercise || !this.container) return;

    const ex = this.currentExercise;

    let html = `
      <div class="exercise-container">
        <header class="exercise-header">
          <h2>${ex.id}: ${ex.title}</h2>
          <div class="difficulty">
            ${this.getDifficultyBadge(ex.difficulty)}
          </div>
        </header>

        <div class="exercise-content">
          <!-- Problem Description -->
          <section class="problem-section">
            <h3>📋 Aufgabe</h3>
            <div class="problem-description">
              ${ex.description}
            </div>

            ${ex.examples ? `
              <div class="examples">
                <h4>💡 Beispiele:</h4>
                ${this.renderExamples(ex.examples)}
              </div>
            ` : ''}

            ${ex.hints ? `
              <button class="hint-btn" onclick="window.exerciseSystem.showHint()">
                💭 Hinweis anzeigen
              </button>
              <div class="hints-container" id="hints"></div>
            ` : ''}
          </section>

          <!-- Editor -->
          <section class="editor-section">
            <h3>💻 Code Editor</h3>
            <div id="editor_container"></div>
          </section>

          <!-- Tests -->
          <section class="tests-section">
            <h3>🧪 Tests</h3>
            <div id="test_results"></div>
            <div class="test-progress">
              <div class="progress-bar">
                <div class="progress-fill" id="progress_fill" style="width: 0%"></div>
              </div>
              <p id="progress_text">0/${this.totalTests} Tests bestanden</p>
            </div>
          </section>

          <!-- Output -->
          <section class="output-section">
            <h3>📤 Ausgabe</h3>
            <div id="output_container"></div>
          </section>

          <!-- Actions -->
          <div class="exercise-actions">
            <button class="btn-run" onclick="window.exerciseSystem.runTests()">
              ▶️ Tests ausführen
            </button>
            <button class="btn-submit" onclick="window.exerciseSystem.submitSolution()" ${this.testsPassed === this.totalTests ? '' : 'disabled'}>
              ✅ Lösung einreichen
            </button>
            <button class="btn-reset" onclick="window.exerciseSystem.resetExercise()">
              🔄 Zurücksetzen
            </button>
          </div>
        </div>
      </div>
    `;

    this.container.innerHTML = html;

    // Richte Editor auf
    this.setupEditor();
  }

  /**
   * Schwierigkeitsabzeichen
   */
  getDifficultyBadge(difficulty) {
    const badges = {
      'easy': '🟢 Einfach',
      'medium': '🟡 Mittel',
      'hard': '🔴 Schwer'
    };
    return badges[difficulty] || '⚪ Unbekannt';
  }

  /**
   * Rendere Beispiele
   */
  renderExamples(examples) {
    if (!Array.isArray(examples)) return '';

    return examples.map((ex, i) => `
      <div class="example">
        <p><strong>Beispiel ${i + 1}:</strong></p>
        <p>Input: <code>${ex.input}</code></p>
        <p>Output: <code>${ex.output}</code></p>
      </div>
    `).join('');
  }

  /**
   * Richte Editor auf
   */
  setupEditor() {
    const editorContainer = document.getElementById('editor_container');
    if (!editorContainer) return;

    // Erstelle Textarea für Code
    const textarea = document.createElement('textarea');
    textarea.id = 'code_editor';
    textarea.className = 'exercise-code';
    textarea.placeholder = 'Schreibe deinen Python-Code hier...';
    textarea.value = this.currentExercise.starterCode || '';
    textarea.style.cssText = `
      width: 100%;
      height: 300px;
      padding: 1rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-family: monospace;
      font-size: 0.9em;
      line-height: 1.5;
      resize: vertical;
    `;

    editorContainer.appendChild(textarea);
  }

  /**
   * Zeige Hinweis
   */
  showHint() {
    if (!this.currentExercise?.hints) return;

    const hintIndex = this.hints.length;
    if (hintIndex < this.currentExercise.hints.length) {
      const hint = this.currentExercise.hints[hintIndex];
      this.hints.push(hint);

      const hintsContainer = document.getElementById('hints');
      if (hintsContainer) {
        const hintDiv = document.createElement('div');
        hintDiv.className = 'hint-box';
        hintDiv.innerHTML = `
          <strong>Hinweis ${hintIndex + 1}:</strong> ${hint}
        `;
        hintDiv.style.cssText = `
          background: #fff3cd;
          border-left: 4px solid #ffc107;
          padding: 1rem;
          margin-top: 0.5rem;
          border-radius: 4px;
          color: #333;
        `;
        hintsContainer.appendChild(hintDiv);
      }

      console.log(`💭 Hinweis ${hintIndex + 1} angezeigt`);
    } else {
      alert('Keine weiteren Hinweise verfügbar');
    }
  }

  /**
   * Führe Tests aus
   */
  async runTests() {
    if (!this.currentExercise || !window.PyScriptRunner) {
      alert('PyScriptRunner nicht verfügbar');
      return;
    }

    const code = document.getElementById('code_editor')?.value;
    if (!code) {
      alert('Bitte Code eingeben');
      return;
    }

    console.log('🧪 Starte Tests...');

    try {
      // Erstelle Runner
      if (!window.runner) {
        window.runner = new window.PyScriptRunner({
          containerId: 'output_container',
          outputId: 'output_container'
        });
      }

      // Führe Code mit Tests aus
      const testCases = this.currentExercise.testCases || [];
      const results = await window.runner.runTests([
        {
          name: 'Syntax-Validierung',
          code: `
# Validiere Syntax
try:
    exec('''${code.replace(/'/g, "\\'")}''')
    print("✓ Code ist syntaktisch korrekt")
except SyntaxError as e:
    print(f"✗ Syntax-Fehler: {e}")
`
        },
        ...testCases
      ]);

      // Update UI
      this.updateTestResults(results);

    } catch (error) {
      console.error('Test-Fehler:', error);
      alert(`Fehler: ${error.message}`);
    }
  }

  /**
   * Update Test-Ergebnisse
   */
  updateTestResults(results) {
    const resultsDiv = document.getElementById('test_results');
    if (!resultsDiv) return;

    let passed = 0;
    let html = '<div class="test-results">';

    results.forEach((result, i) => {
      const isPassed = result.passed;
      if (isPassed) passed++;

      html += `
        <div class="test-item ${isPassed ? 'passed' : 'failed'}">
          <span class="test-icon">${isPassed ? '✅' : '❌'}</span>
          <span class="test-name">${result.name}</span>
          ${result.message ? `<span class="test-message">${result.message}</span>` : ''}
        </div>
      `;
    });

    html += '</div>';
    resultsDiv.innerHTML = html;

    // Update Progress
    this.testsPassed = passed;
    const percentage = (passed / results.length) * 100;
    
    const progressFill = document.getElementById('progress_fill');
    if (progressFill) {
      progressFill.style.width = percentage + '%';
    }

    const progressText = document.getElementById('progress_text');
    if (progressText) {
      progressText.textContent = `${passed}/${results.length} Tests bestanden`;
    }

    // Aktiviere Submit-Button wenn alle Tests bestanden
    const submitBtn = document.querySelector('.btn-submit');
    if (submitBtn && passed === results.length) {
      submitBtn.disabled = false;
      submitBtn.style.background = '#4caf50';
    }

    console.log(`✓ ${passed}/${results.length} Tests bestanden (${percentage.toFixed(0)}%)`);
  }

  /**
   * Reiche Lösung ein
   */
  submitSolution() {
    if (this.testsPassed !== this.totalTests) {
      alert('Bitte alle Tests bestehen bevor du die Lösung einreichst');
      return;
    }

    const code = document.getElementById('code_editor')?.value;
    const exerciseId = this.currentExercise.id;

    // Speichere Lösung
    this.solutions[exerciseId] = {
      code,
      timestamp: new Date().toISOString(),
      hints_used: this.hints.length,
      tests_passed: this.testsPassed
    };

    // Speichere in localStorage
    localStorage.setItem(`solution_${exerciseId}`, JSON.stringify(this.solutions[exerciseId]));

    // Zeige Erfolgs-Message
    const output = document.getElementById('output_container');
    if (output) {
      const successDiv = document.createElement('div');
      successDiv.style.cssText = `
        background: #d4edda;
        border: 1px solid #c3e6cb;
        color: #155724;
        padding: 1rem;
        border-radius: 4px;
        margin-top: 1rem;
        text-align: center;
      `;
      successDiv.innerHTML = `
        <h4>🎉 Glückwunsch!</h4>
        <p>Du hast die Übung erfolgreich gelöst!</p>
        <p>Hinweise verwendet: ${this.hints.length}</p>
      `;
      output.appendChild(successDiv);
    }

    console.log(`✅ Lösung für ${exerciseId} eingereicht`);
  }

  /**
   * Setze Übung zurück
   */
  resetExercise() {
    if (confirm('Bist du sicher? Alle Änderungen werden gelöscht.')) {
      this.testsPassed = 0;
      this.hints = [];
      document.getElementById('code_editor').value = this.currentExercise.starterCode || '';
      document.getElementById('test_results').innerHTML = '';
      document.getElementById('output_container').innerHTML = '';
      document.getElementById('progress_fill').style.width = '0%';
      document.getElementById('progress_text').textContent = `0/${this.totalTests} Tests bestanden`;
      
      const submitBtn = document.querySelector('.btn-submit');
      if (submitBtn) submitBtn.disabled = true;

      console.log('🔄 Übung zurückgesetzt');
    }
  }

  /**
   * Exportiere API
   */
  static getInstance(options) {
    return new ExerciseSystem(options);
  }
}

// CSS Styles
const style = document.createElement('style');
style.textContent = `
  .exercise-container {
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    padding: 2rem;
    margin-bottom: 2rem;
  }

  .exercise-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
    border-bottom: 2px solid #005691;
    padding-bottom: 1rem;
  }

  .exercise-header h2 {
    margin: 0;
    color: #005691;
    font-size: 1.8em;
  }

  .difficulty {
    font-size: 1.1em;
  }

  .exercise-content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
    margin-bottom: 2rem;
  }

  .problem-section,
  .editor-section,
  .tests-section,
  .output-section {
    background: #f9f9f9;
    padding: 1.5rem;
    border-radius: 6px;
    border-left: 4px solid #005691;
  }

  .problem-section h3,
  .editor-section h3,
  .tests-section h3,
  .output-section h3 {
    margin-top: 0;
    color: #005691;
  }

  .problem-description {
    line-height: 1.8;
    color: #333;
  }

  .examples {
    background: #fffbf0;
    padding: 1rem;
    border-radius: 4px;
    margin-top: 1rem;
  }

  .example {
    background: white;
    padding: 0.75rem;
    margin-bottom: 0.5rem;
    border-radius: 4px;
  }

  .example code {
    background: #f0f0f0;
    padding: 0.25em 0.5em;
    border-radius: 3px;
    font-family: monospace;
  }

  .hint-btn {
    background: #ffc107;
    color: #333;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    cursor: pointer;
    margin-top: 1rem;
    transition: background 0.3s;
  }

  .hint-btn:hover {
    background: #ffb300;
  }

  .exercise-code {
    font-family: 'Courier New', monospace;
    font-size: 0.9em;
  }

  .test-results {
    margin: 1rem 0;
  }

  .test-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem;
    margin-bottom: 0.5rem;
    border-radius: 4px;
    background: #f0f0f0;
  }

  .test-item.passed {
    background: #d4edda;
    color: #155724;
  }

  .test-item.failed {
    background: #f8d7da;
    color: #721c24;
  }

  .test-icon {
    font-size: 1.2em;
    min-width: 25px;
  }

  .test-progress {
    margin-top: 1rem;
  }

  .progress-bar {
    width: 100%;
    height: 20px;
    background: #e0e0e0;
    border-radius: 10px;
    overflow: hidden;
  }

  .progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #4caf50, #8bc34a);
    transition: width 0.3s ease;
  }

  #progress_text {
    margin-top: 0.5rem;
    font-size: 0.9em;
    color: #666;
  }

  .exercise-actions {
    display: flex;
    gap: 1rem;
    margin-top: 2rem;
  }

  .btn-run,
  .btn-submit,
  .btn-reset {
    flex: 1;
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 4px;
    font-size: 1em;
    cursor: pointer;
    transition: all 0.3s;
    font-weight: bold;
  }

  .btn-run {
    background: #005691;
    color: white;
  }

  .btn-run:hover {
    background: #003d6b;
  }

  .btn-submit {
    background: #ccc;
    color: #666;
    cursor: not-allowed;
  }

  .btn-submit:not(:disabled) {
    background: #4caf50;
    color: white;
    cursor: pointer;
  }

  .btn-submit:not(:disabled):hover {
    background: #45a049;
  }

  .btn-reset {
    background: #ff9800;
    color: white;
  }

  .btn-reset:hover {
    background: #e68900;
  }

  /* Responsive */
  @media (max-width: 1024px) {
    .exercise-content {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 768px) {
    .exercise-header {
      flex-direction: column;
      align-items: flex-start;
    }

    .exercise-actions {
      flex-direction: column;
    }
  }
`;
document.head.appendChild(style);

// Exportiere
window.ExerciseSystem = ExerciseSystem;
console.log('🎯 ExerciseSystem Module loaded');
