import { mockQuestions, mockRunCode } from './mock-data.js';

document.addEventListener('DOMContentLoaded', () => {
  // Get question ID from URL or default to first technical question
  const urlParams = new URLSearchParams(window.location.search);
  const questionId = urlParams.get('id');
  
  let currentQuestion = mockQuestions.find(q => q.id === questionId && q.type === 'technical');
  
  if (!currentQuestion) {
    currentQuestion = mockQuestions.find(q => q.type === 'technical'); // Fallback
  }
  
  // State
  let editor;
  let currentLanguage = 'javascript';
  let isRunning = false;
  
  // DOM Elements
  const langSelect = document.getElementById('language-select');
  const runBtn = document.getElementById('run-btn');
  const submitBtn = document.getElementById('submit-btn');
  const resetBtn = document.getElementById('reset-btn');
  const testResultsContainer = document.getElementById('test-results');
  
  // Initialize Split Pane
  setupSplitPane();
  
  // Render Question Content
  renderQuestionDetails(currentQuestion);
  
  // Initialize Monaco Editor via CDN
  loadMonacoEditor();
  
  // Event Listeners
  langSelect.addEventListener('change', (e) => {
    const newLang = e.target.value;
    if (editor) {
      // Save current code to some local state if needed
      
      // Update language model
      let monacoLang = newLang;
      if (newLang === 'python') monacoLang = 'python';
      else if (newLang === 'java') monacoLang = 'java';
      else if (newLang === 'cpp') monacoLang = 'cpp';
      else monacoLang = 'javascript';
      
      monaco.editor.setModelLanguage(editor.getModel(), monacoLang);
      editor.setValue(currentQuestion.starterCode[newLang] || '// Write your code here');
      currentLanguage = newLang;
    }
  });
  
  runBtn.addEventListener('click', () => handleRunCode(false));
  submitBtn.addEventListener('click', () => handleRunCode(true));
  resetBtn.addEventListener('click', () => {
    if (editor && confirm('Are you sure you want to reset your code to the starter template?')) {
      editor.setValue(currentQuestion.starterCode[currentLanguage] || '// Write your code here');
    }
  });
  
  // Functions
  function renderQuestionDetails(q) {
    document.getElementById('question-title').textContent = q.title;
    
    const badge = document.getElementById('question-badge');
    badge.textContent = q.difficulty;
    switch(q.difficulty.toLowerCase()) {
      case 'easy': badge.className = 'badge badge-success'; break;
      case 'medium': badge.className = 'badge badge-warning'; break;
      case 'hard': badge.className = 'badge badge-danger'; break;
    }
    
    document.getElementById('question-category').textContent = q.category;
    document.getElementById('question-desc').innerHTML = marked.parse(q.description || ''); // Simple markdown parser
    
    // Render Examples
    const examplesContainer = document.getElementById('question-examples');
    examplesContainer.innerHTML = q.examples.map((ex, i) => `
      <div class="mb-4">
        <div class="font-bold mb-1">Example ${i + 1}:</div>
        <div class="bg-tertiary p-3 rounded-md font-mono text-sm">
          <div><span class="text-secondary">Input:</span> ${ex.input}</div>
          <div><span class="text-secondary">Output:</span> ${ex.output}</div>
        </div>
      </div>
    `).join('');
    
    // Render Constraints
    const constraintsContainer = document.getElementById('question-constraints');
    constraintsContainer.innerHTML = `
      <ul class="list-disc pl-5 text-sm font-mono text-secondary">
        ${q.constraints.map(c => `<li>${c}</li>`).join('')}
      </ul>
    `;
    
    // Tags
    document.getElementById('question-tags').innerHTML = q.companies.map(c => `<span class="tag">${c}</span>`).join('');
  }
  
  function loadMonacoEditor() {
    // Load Monaco Editor script from CDN
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.39.0/min/vs/loader.min.js';
    document.body.appendChild(script);
    
    script.onload = () => {
      require.config({ paths: { 'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.39.0/min/vs' }});
      require(['vs/editor/editor.main'], function() {
        // Define Custom Theme
        monaco.editor.defineTheme('custom-dark', {
          base: 'vs',
          inherit: true,
          rules: [
            { background: 'ffffff' }
          ],
          colors: {
            'editor.background': '#ffffff',
            'editor.lineHighlightBackground': '#f1f5f9',
          }
        });
        
        // Initialize Editor
        editor = monaco.editor.create(document.getElementById('monaco-editor-container'), {
          value: currentQuestion.starterCode[currentLanguage] || '// Write your code here',
          language: 'javascript',
          theme: 'custom-dark',
          automaticLayout: true,
          minimap: { enabled: false },
          fontSize: 14,
          fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
          padding: { top: 16, bottom: 16 },
          scrollBeyondLastLine: false,
          roundedSelection: false,
          scrollbar: {
            verticalScrollbarSize: 8,
            horizontalScrollbarSize: 8,
          }
        });
        
        // Handle window resize for editor
        window.addEventListener('resize', () => {
          if (editor) editor.layout();
        });
      });
    };
  }
  
  async function handleRunCode(isSubmit = false) {
    if (isRunning || !editor) return;
    
    isRunning = true;
    const code = editor.getValue();
    
    // Update UI
    runBtn.disabled = true;
    submitBtn.disabled = true;
    const originalText = isSubmit ? submitBtn.innerHTML : runBtn.innerHTML;
    
    if (isSubmit) {
      submitBtn.innerHTML = '<div class="spinner spinner-sm" style="border-top-color: white;"></div>';
    } else {
      runBtn.innerHTML = '<div class="spinner spinner-sm" style="border-top-color: white;"></div>';
    }
    
    // Clear previous results
    testResultsContainer.innerHTML = `
      <div class="flex items-center justify-center p-8 text-secondary">
        <div class="spinner spinner-sm mr-3"></div> Executing code...
      </div>
    `;
    
    try {
      const result = await mockRunCode(code, currentLanguage, currentQuestion.id);
      renderTestResults(result, isSubmit);
    } catch (err) {
      window.showToast("Execution failed. Please try again.", "error");
      testResultsContainer.innerHTML = `
        <div class="p-4 text-error bg-error-bg rounded-md border border-error">
          Failed to connect to execution server.
        </div>
      `;
    } finally {
      isRunning = false;
      runBtn.disabled = false;
      submitBtn.disabled = false;
      if (isSubmit) {
        submitBtn.innerHTML = originalText;
      } else {
        runBtn.innerHTML = originalText;
      }
    }
  }
  
  function renderTestResults(result, isSubmit) {
    const totalTests = result.testResults.length;
    const passedTests = result.testResults.filter(t => t.passed).length;
    const allPassed = passedTests === totalTests;
    
    let html = `
      <div class="flex justify-between items-center mb-4">
        <div class="font-bold ${allPassed ? 'text-success' : 'text-error'}">
          ${allPassed ? 'Accepted' : 'Wrong Answer'}
        </div>
        <div class="text-sm text-secondary flex gap-4">
          <span>Runtime: ${result.executionTime}</span>
          <span>Memory: ${result.memoryUsage}</span>
        </div>
      </div>
      
      <div class="mb-4 text-sm">
        Passed ${passedTests} / ${totalTests} test cases.
      </div>
      
      <div class="flex flex-col gap-2">
    `;
    
    result.testResults.forEach(test => {
      // Don't show hidden tests on 'Run', only on 'Submit'
      if (!isSubmit && test.name.includes('Hidden')) return;
      
      html += `
        <div class="test-case">
          <div class="status-dot ${test.passed ? 'pass' : 'fail'}"></div>
          <div class="flex-1">
            <div class="font-medium text-sm">${test.name}</div>
            ${!test.passed ? `
              <div class="mt-2 p-2 bg-tertiary rounded text-xs font-mono">
                <div class="text-secondary">Expected:</div>
                <div class="text-success mb-1">${test.expected}</div>
                <div class="text-secondary">Output:</div>
                <div class="text-error">${test.actual}</div>
              </div>
            ` : ''}
          </div>
        </div>
      `;
    });
    
    html += '</div>';
    
    if (allPassed && isSubmit) {
      html += `
        <div class="mt-6 text-center">
          <button class="btn btn-primary" onclick="window.location.href='question-bank.html'">Return to Question Bank</button>
        </div>
      `;
      
      // Also show success toast and update user stats conceptually
      window.showToast("Solution Accepted! +25 XP", "success");
    }
    
    testResultsContainer.innerHTML = html;
  }
  
  function setupSplitPane() {
    const leftPane = document.getElementById('split-left');
    const rightPane = document.getElementById('split-right');
    const divider = document.getElementById('split-divider');
    
    let isResizing = false;
    
    divider.addEventListener('mousedown', (e) => {
      isResizing = true;
      document.body.style.cursor = 'col-resize';
      // Prevent text selection while dragging
      document.body.style.userSelect = 'none';
    });
    
    window.addEventListener('mousemove', (e) => {
      if (!isResizing) return;
      
      // Get container width
      const containerWidth = leftPane.parentElement.offsetWidth;
      // Calculate new left width percentage
      let newLeftWidth = (e.clientX / containerWidth) * 100;
      
      // Constrain width
      if (newLeftWidth < 20) newLeftWidth = 20;
      if (newLeftWidth > 80) newLeftWidth = 80;
      
      leftPane.style.width = `${newLeftWidth}%`;
      rightPane.style.width = `${100 - newLeftWidth}%`;
      
      // Update editor layout
      if (editor) editor.layout();
    });
    
    window.addEventListener('mouseup', () => {
      if (isResizing) {
        isResizing = false;
        document.body.style.cursor = 'default';
        document.body.style.userSelect = 'auto';
      }
    });
  }
});

// Simple markdown parser mock for description
const marked = {
  parse: (text) => {
    if (!text) return '';
    // Basic replacements
    let html = text
      .replace(/`([^`]+)`/g, '<code class="bg-tertiary px-1 py-0.5 rounded text-sm text-accent">$1</code>')
      .replace(/\n\n/g, '</p><p>')
      .replace(/\n- /g, '<br>• ');
    return `<p>${html}</p>`;
  }
};
