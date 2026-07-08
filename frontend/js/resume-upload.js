document.addEventListener('DOMContentLoaded', () => {
  const dropzone = document.getElementById('resume-dropzone');
  const fileInput = document.getElementById('resume-file');
  const fileInfo = document.getElementById('file-info');
  const fileName = document.getElementById('file-name');
  const fileSize = document.getElementById('file-size');
  const removeFileBtn = document.getElementById('remove-file');
  const analyzeBtn = document.getElementById('analyze-btn');
  
  const uploadState = document.getElementById('upload-state');
  const loadingState = document.getElementById('loading-state');
  const resultsState = document.getElementById('results-state');
  
  let currentFile = null;
  
  // Drag and drop events
  ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    dropzone.addEventListener(eventName, preventDefaults, false);
  });
  
  function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
  }
  
  ['dragenter', 'dragover'].forEach(eventName => {
    dropzone.addEventListener(eventName, () => {
      dropzone.classList.add('border-primary');
      dropzone.style.background = 'rgba(99, 102, 241, 0.05)';
    }, false);
  });
  
  ['dragleave', 'drop'].forEach(eventName => {
    dropzone.addEventListener(eventName, () => {
      dropzone.classList.remove('border-primary');
      dropzone.style.background = '';
    }, false);
  });
  
  // Handle drop
  dropzone.addEventListener('drop', (e) => {
    const dt = e.dataTransfer;
    const files = dt.files;
    handleFiles(files);
  });
  
  // Handle click on dropzone
  dropzone.addEventListener('click', (e) => {
    // Prevent triggering if clicking the remove button
    if (e.target.closest('#file-info') && !e.target.closest('#remove-file')) return;
    if (e.target.closest('#remove-file')) return;
    
    fileInput.click();
  });
  
  // Handle file input change
  fileInput.addEventListener('change', function() {
    handleFiles(this.files);
  });
  
  function handleFiles(files) {
    if (files.length === 0) return;
    
    const file = files[0];
    
    // Validate file type
    const validTypes = ['application/pdf'];
    if (!validTypes.includes(file.type)) {
      window.showToast("Please upload a PDF file.", "error");
      return;
    }
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      window.showToast("File size must be less than 5MB.", "error");
      return;
    }
    
    currentFile = file;
    updateFileUI();
  }
  
  function updateFileUI() {
    if (currentFile) {
      fileName.textContent = currentFile.name;
      fileSize.textContent = (currentFile.size / (1024 * 1024)).toFixed(2) + ' MB';
      
      // Hide initial content, show file info
      document.querySelector('.dropzone-content').classList.add('hidden');
      fileInfo.classList.remove('hidden');
      
      analyzeBtn.disabled = false;
      dropzone.style.borderStyle = 'solid';
    } else {
      document.querySelector('.dropzone-content').classList.remove('hidden');
      fileInfo.classList.add('hidden');
      analyzeBtn.disabled = true;
      dropzone.style.borderStyle = 'dashed';
    }
  }
  
  // Remove file
  removeFileBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    currentFile = null;
    fileInput.value = '';
    updateFileUI();
  });
  
  // Analyze Resume (Mock API)
  analyzeBtn.addEventListener('click', () => {
    if (!currentFile) return;
    
    // Transitions
    uploadState.classList.add('hidden');
    loadingState.classList.remove('hidden');
    
    // Simulate API Call
    setTimeout(() => {
      loadingState.classList.add('hidden');
      resultsState.classList.remove('hidden');
      renderMockResults();
    }, 2500);
  });
  
  function renderMockResults() {
    // Generate some mock recommendations based on the file
    document.getElementById('ats-score').textContent = '82/100';
    
    const strengthsContainer = document.getElementById('resume-strengths');
    strengthsContainer.innerHTML = `
      <div class="feedback-item mb-2">
        <div class="feedback-icon"><i data-lucide="check-circle" style="width:1em;height:1em;vertical-align:middle;color:var(--color-success)"></i></div>
        <div class="feedback-text">Strong action verbs used in experience section.</div>
      </div>
      <div class="feedback-item mb-2">
        <div class="feedback-icon"><i data-lucide="check-circle" style="width:1em;height:1em;vertical-align:middle;color:var(--color-success)"></i></div>
        <div class="feedback-text">Good balance of white space and text density.</div>
      </div>
      <div class="feedback-item">
        <div class="feedback-icon"><i data-lucide="check-circle" style="width:1em;height:1em;vertical-align:middle;color:var(--color-success)"></i></div>
        <div class="feedback-text">Clear education timeline and relevant coursework.</div>
      </div>
    `;
    
    const improvementsContainer = document.getElementById('resume-improvements');
    improvementsContainer.innerHTML = `
      <div class="feedback-item mb-2">
        <div class="feedback-icon"><i data-lucide="alert-triangle" style="width:1em;height:1em;vertical-align:middle;color:var(--color-warning)"></i></div>
        <div class="feedback-text">Quantify results more often (e.g. "Improved performance by X%").</div>
      </div>
      <div class="feedback-item mb-2">
        <div class="feedback-icon"><i data-lucide="alert-triangle" style="width:1em;height:1em;vertical-align:middle;color:var(--color-warning)"></i></div>
        <div class="feedback-text">Missing a clear summary section at the top.</div>
      </div>
      <div class="feedback-item">
        <div class="feedback-icon"><i data-lucide="alert-triangle" style="width:1em;height:1em;vertical-align:middle;color:var(--color-warning)"></i></div>
        <div class="feedback-text">Skills section could be categorized better.</div>
      </div>
    `;
    
    const keywordsContainer = document.getElementById('resume-keywords');
    keywordsContainer.innerHTML = `
      <span class="tag">JavaScript</span>
      <span class="tag">React</span>
      <span class="tag">Node.js</span>
      <span class="tag">AWS</span>
      <span class="tag bg-warning text-dark opacity-50">Docker (Missing)</span>
      <span class="tag bg-warning text-dark opacity-50">CI/CD (Missing)</span>
    `;
  }
  
  // Re-upload
  document.getElementById('reupload-btn').addEventListener('click', () => {
    resultsState.classList.add('hidden');
    uploadState.classList.remove('hidden');
    currentFile = null;
    fileInput.value = '';
    updateFileUI();
  });
});
