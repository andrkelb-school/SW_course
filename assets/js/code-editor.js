/**
 * BauMax Learning Platform - Code Editor
 * 
 * Features:
 * - Syntax Highlighting (Python)
 * - Line Numbers
 * - Auto-Indentation
 * - Code Folding
 * - Theme Support (Light/Dark)
 * - Keyboard Shortcuts
 * 
 * @version 1.0.0
 * @requires highlight.js für Syntax-Highlighting
 */

class PythonCodeEditor {
  constructor(options = {}) {
    this.options = {
      containerId: options.containerId || 'editor_container',
      theme: options.theme || 'light',
      lineNumbers: options.lineNumbers !== false,
      autoIndent: options.autoIndent !== false,
      tabSize: options.tabSize || 4,
      readOnly: options.readOnly || false,
      ...options
    };

    this.container = null;
    this.textarea = null;
    this.lineNumbersDiv = null;
    this.highlighter = null;
    this.currentTheme = this.options.theme;

    this.init();
  }

  /**
   * Initialisierung
   */
  init() {
    console.log('📝 PythonCodeEditor v1.0.0 initializing...');

    try {
      this.container = document.getElementById(this.options.containerId);
      if (!this.container) {
        throw new Error(`Container ${this.options.containerId} nicht gefunden`);
      }

      this.setupUI();
      this.loadSyntaxHighlighting();
      this.attachEventListeners();
      this.loadTheme();

      console.log('✅ PythonCodeEditor ready!');
    } catch (error) {
      console.error('❌ Editor Initialization failed:', error);
    }
  }

  /**
   * Richte UI auf
   */
  setupUI() {
    this.container.innerHTML = '';
    this.container.className = 'python-editor-wrapper';

    // Editor Container
    const editorDiv = document.createElement('div');
    editorDiv.className = 'editor-container';

    // Line Numbers
    if (this.options.lineNumbers) {
      this.lineNumbersDiv = document.createElement('div');
      this.lineNumbersDiv.className = 'line-numbers';
      editorDiv.appendChild(this.lineNumbersDiv);
    }

    // Textarea
    this.textarea = document.createElement('textarea');
    this.textarea.className = 'code-textarea';
    this.textarea.readOnly = this.options.readOnly;
    this.textarea.spellcheck = 'false';
    editorDiv.appendChild(this.textarea);

    // Highlighter (für Syntax-Highlight)
    this.highlighter = document.createElement('pre');
    this.highlighter.className = 'code-highlighter';
    this.highlighter.setAttribute('aria-hidden', 'true');
    
    const code = document.createElement('code');
    code.className = 'language-python';
    this.highlighter.appendChild(code);
    editorDiv.appendChild(this.highlighter);

    this.container.appendChild(editorDiv);

    // Toolbar
    this.setupToolbar();
  }

  /**
   * Richte Toolbar auf
   */
  setupToolbar() {
    const toolbar = document.createElement('div');
    toolbar.className = 'editor-toolbar';

    const buttons = [
      { id: 'btn-run', label: '▶️ Run (Ctrl+Enter)', title: 'Code ausführen' },
      { id: 'btn-clear', label: '🗑️ Clear', title: 'Code löschen' },
      { id: 'btn-copy', label: '📋 Copy', title: 'In Zwischenablage kopieren' },
      { id: 'btn-paste', label: '📌 Paste', title: 'Aus Zwischenablage einfügen' },
      { id: 'btn-theme', label: '🌙 Theme', title: 'Design wechseln' }
    ];

    buttons.forEach(btn => {
      const button = document.createElement('button');
      button.id = btn.id;
      button.className = 'editor-btn';
      button.title = btn.title;
      button.innerHTML = btn.label;
      button.style.cssText = `
        background: #005691;
        color: white;
        border: none;
        padding: 0.5rem 1rem;
        border-radius: 4px;
        cursor: pointer;
        margin-right: 0.5rem;
        transition: background 0.3s;
        font-size: 0.9em;
      `;
      button.onmouseover = () => button.style.background = '#003d6b';
      button.onmouseout = () => button.style.background = '#005691';
      toolbar.appendChild(button);
    });

    // Einfügen nach Container
    this.container.insertAdjacentElement('beforebegin', toolbar);

    // Event Listener für Buttons
    document.getElementById('btn-run')?.addEventListener('click', () => {
      window.dispatchEvent(new Event('editor-run'));
    });
    document.getElementById('btn-clear')?.addEventListener('click', () => this.clear());
    document.getElementById('btn-copy')?.addEventListener('click', () => this.copy());
    document.getElementById('btn-paste')?.addEventListener('click', () => this.paste());
    document.getElementById('btn-theme')?.addEventListener('click', () => this.toggleTheme());
  }

  /**
   * Lade Syntax-Highlighting
   */
  loadSyntaxHighlighting() {
    // Lade highlight.js
    if (document.getElementById('highlightjs-css')) {
      console.log('✓ highlight.js bereits geladen');
      return;
    }

    // CSS
    const link = document.createElement('link');
    link.id = 'highlightjs-css';
    link.rel = 'stylesheet';
    link.href = 'https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.9.0/build/styles/atom-one-dark.min.css';
    document.head.appendChild(link);

    // JS
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.9.0/build/highlight.min.js';
    script.onload = () => {
      console.log('✓ highlight.js geladen');
    };
    document.head.appendChild(script);
  }

  /**
   * Attach Event Listener
   */
  attachEventListeners() {
    if (!this.textarea) return;

    // Input Event
    this.textarea.addEventListener('input', (e) => {
      this.updateLineNumbers();
      this.updateHighlighting();
    });

    // Scroll synchronisieren
    this.textarea.addEventListener('scroll', () => {
      if (this.highlighter) {
        this.highlighter.scrollTop = this.textarea.scrollTop;
        this.highlighter.scrollLeft = this.textarea.scrollLeft;
      }
      if (this.lineNumbersDiv) {
        this.lineNumbersDiv.scrollTop = this.textarea.scrollTop;
      }
    });

    // Tab-Taste zum Indentieren
    this.textarea.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        e.preventDefault();
        const start = this.textarea.selectionStart;
        const end = this.textarea.selectionEnd;
        const value = this.textarea.value;
        
        // Indentiere
        this.textarea.value = value.substring(0, start) + 
                            '\t' + 
                            value.substring(end);
        
        this.textarea.selectionStart = this.textarea.selectionEnd = start + 1;
        this.updateHighlighting();
      }

      // Strg+Enter = Run
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        window.dispatchEvent(new Event('editor-run'));
      }
    });

    // Paste Event
    this.textarea.addEventListener('paste', () => {
      setTimeout(() => this.updateHighlighting(), 10);
    });
  }

  /**
   * Aktualisiere Line Numbers
   */
  updateLineNumbers() {
    if (!this.lineNumbersDiv) return;

    const lines = this.textarea.value.split('\n').length;
    let html = '';

    for (let i = 1; i <= lines; i++) {
      html += `<div class="line-number">${i}</div>`;
    }

    this.lineNumbersDiv.innerHTML = html;
  }

  /**
   * Aktualisiere Syntax-Highlighting
   */
  updateHighlighting() {
    if (!this.highlighter || !window.hljs) return;

    const code = this.textarea.value;
    const codeElement = this.highlighter.querySelector('code');
    
    codeElement.textContent = code;
    codeElement.classList.add('language-python');
    window.hljs.highlightElement(codeElement);
  }

  /**
   * Lade Theme
   */
  loadTheme() {
    if (this.currentTheme === 'dark') {
      document.body.classList.add('dark-mode');
      this.container.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
      this.container.classList.remove('dark-mode');
    }
  }

  /**
   * Wechsle Theme
   */
  toggleTheme() {
    this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
    this.loadTheme();
    console.log(`🎨 Theme gewechselt zu: ${this.currentTheme}`);
  }

  /**
   * Hole Code
   */
  getCode() {
    return this.textarea?.value || '';
  }

  /**
   * Setze Code
   */
  setCode(code) {
    if (this.textarea) {
      this.textarea.value = code;
      this.updateLineNumbers();
      this.updateHighlighting();
    }
  }

  /**
   * Lösche Code
   */
  clear() {
    this.setCode('');
    console.log('🗑️ Editor geleert');
  }

  /**
   * Kopiere in Zwischenablage
   */
  async copy() {
    try {
      const code = this.getCode();
      await navigator.clipboard.writeText(code);
      console.log('📋 Code in Zwischenablage kopiert');
    } catch (error) {
      console.error('Fehler beim Kopieren:', error);
    }
  }

  /**
   * Einfügen aus Zwischenablage
   */
  async paste() {
    try {
      const text = await navigator.clipboard.readText();
      this.setCode(text);
      console.log('📌 Code aus Zwischenablage eingefügt');
    } catch (error) {
      console.error('Fehler beim Einfügen:', error);
    }
  }

  /**
   * Export
   */
  static getInstance(options) {
    return new PythonCodeEditor(options);
  }
}

// CSS Styles
const style = document.createElement('style');
style.textContent = `
  .python-editor-wrapper {
    position: relative;
    border: 1px solid #ddd;
    border-radius: 8px;
    overflow: hidden;
    background: white;
    margin-bottom: 1rem;
  }

  .editor-container {
    display: grid;
    grid-template-columns: auto 1fr;
    position: relative;
    height: 400px;
    font-family: 'Courier New', 'Monaco', monospace;
    font-size: 14px;
    line-height: 1.5;
    background: #f8f8f8;
  }

  .line-numbers {
    background: #f0f0f0;
    border-right: 1px solid #ddd;
    padding: 0.5rem 0;
    text-align: right;
    user-select: none;
    overflow: hidden;
    min-width: 40px;
  }

  .line-number {
    padding: 0 0.5rem;
    color: #999;
    height: 21px;
    line-height: 21px;
    font-size: 0.9em;
  }

  .code-textarea {
    grid-column: 2;
    padding: 0.5rem;
    border: none;
    resize: none;
    font-family: 'Courier New', 'Monaco', monospace;
    font-size: 14px;
    line-height: 1.5;
    background: transparent;
    color: #333;
    z-index: 10;
    outline: none;
    tab-size: 4;
    background-color: white;
  }

  .code-highlighter {
    grid-column: 2;
    grid-row: 1;
    padding: 0.5rem;
    margin: 0;
    background: white;
    color: #333;
    overflow: hidden;
    pointer-events: none;
    white-space: pre;
    word-break: normal;
  }

  .editor-toolbar {
    padding: 0.75rem;
    background: #f8f8f8;
    border-bottom: 1px solid #ddd;
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
  }

  .editor-btn {
    background: #005691 !important;
    color: white !important;
    border: none !important;
    padding: 0.5rem 1rem !important;
    border-radius: 4px !important;
    cursor: pointer !important;
    font-size: 0.9em !important;
    transition: all 0.3s !important;
  }

  .editor-btn:hover {
    background: #003d6b !important;
    transform: translateY(-1px) !important;
  }

  /* Dark Mode */
  .python-editor-wrapper.dark-mode {
    background: #1e1e1e;
    border-color: #444;
  }

  .python-editor-wrapper.dark-mode .editor-container {
    background: #2d2d2d;
  }

  .python-editor-wrapper.dark-mode .line-numbers {
    background: #1e1e1e;
    border-right-color: #444;
  }

  .python-editor-wrapper.dark-mode .line-number {
    color: #666;
  }

  .python-editor-wrapper.dark-mode .code-textarea {
    background: #2d2d2d;
    color: #e0e0e0;
  }

  .python-editor-wrapper.dark-mode .code-highlighter {
    background: #2d2d2d;
    color: #e0e0e0;
  }

  .python-editor-wrapper.dark-mode .editor-toolbar {
    background: #1e1e1e;
    border-bottom-color: #444;
  }

  /* Responsive */
  @media (max-width: 768px) {
    .editor-container {
      height: 300px;
    }

    .editor-toolbar {
      flex-direction: column;
    }

    .editor-btn {
      width: 100%;
    }
  }
`;
document.head.appendChild(style);

// Exportiere für globale Nutzung
window.PythonCodeEditor = PythonCodeEditor;
console.log('📝 PythonCodeEditor Module loaded');
