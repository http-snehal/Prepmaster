import { mockQuestions, mockSubmitBehavioralAnswer } from './mock-data.js';

document.addEventListener('DOMContentLoaded', () => {
  // Get question ID from URL or default to first behavioral question
  const urlParams = new URLSearchParams(window.location.search);
  const questionId = urlParams.get('id') || 'q_101';
  
  // Find question data
  const question = mockQuestions.find(q => q.id === questionId) || mockQuestions.find(q => q.type === 'behavioral');
  
  if (!question) {
    window.location.href = 'question-bank.html';
    return;
  }
  
  // State
  let isRecording = false;
  let recognition = null;
  let timerInterval = null;
  let secondsRemaining = 120; // 2 minutes default
  let transcriptFull = '';
  
  // DOM Elements
  const titleEl = document.getElementById('question-title');
  const descEl = document.getElementById('question-desc');
  const badgeEl = document.getElementById('question-badge');
  const timerEl = document.getElementById('timer-display');
  
  const textAnswerArea = document.getElementById('text-answer');
  const recordBtn = document.getElementById('record-btn');
  const submitBtn = document.getElementById('submit-btn');
  
  const answerPanel = document.getElementById('answer-panel');
  const feedbackPanel = document.getElementById('feedback-panel');
  const loadingPanel = document.getElementById('loading-panel');
  
  // Initialize UI
  titleEl.textContent = question.title;
  descEl.textContent = question.description;
  
  // Set badge class
  badgeEl.textContent = question.difficulty;
  switch(question.difficulty.toLowerCase()) {
    case 'easy': badgeEl.className = 'badge badge-success'; break;
    case 'medium': badgeEl.className = 'badge badge-warning'; break;
    case 'hard': badgeEl.className = 'badge badge-danger'; break;
  }
  
  // Initialize Timer
  startTimer();
  
  // Initialize Speech Recognition API
  initSpeechRecognition();
  
  // Event Listeners
  recordBtn.addEventListener('click', toggleRecording);
  submitBtn.addEventListener('click', submitAnswer);
  document.getElementById('retry-btn').addEventListener('click', resetSession);
  
  // --- Functions ---
  
  function startTimer() {
    updateTimerDisplay();
    timerInterval = setInterval(() => {
      secondsRemaining--;
      updateTimerDisplay();
      
      if (secondsRemaining <= 0) {
        clearInterval(timerInterval);
        if (isRecording) toggleRecording();
        window.showToast('Time is up!', 'warning');
      }
    }, 1000);
  }
  
  function updateTimerDisplay() {
    const mins = Math.floor(secondsRemaining / 60);
    const secs = secondsRemaining % 60;
    timerEl.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    
    if (secondsRemaining <= 30) {
      timerEl.parentElement.classList.add('warning');
    }
    if (secondsRemaining <= 10) {
      timerEl.parentElement.classList.replace('warning', 'danger');
    }
  }
  
  function initSpeechRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      console.warn("Speech Recognition API not supported in this browser.");
      recordBtn.innerHTML = '<span class="icon"><i data-lucide="alert-triangle" style="width:1em;height:1em;vertical-align:middle;color:var(--color-warning)"></i></span> Browser not supported';
      recordBtn.disabled = true;
      recordBtn.title = "Voice recording requires Chrome, Edge, or Safari.";
      return;
    }
    
    recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';
    
    recognition.onresult = (event) => {
      let interimTranscript = '';
      let finalTranscript = '';
      
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript + ' ';
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }
      
      if (finalTranscript) {
        transcriptFull += finalTranscript;
        
        // Append to textarea (keep user edits if they typed manually)
        const currentVal = textAnswerArea.value;
        const needsSpace = currentVal.length > 0 && !currentVal.endsWith(' ');
        textAnswerArea.value = currentVal + (needsSpace ? ' ' : '') + finalTranscript;
      }
    };
    
    recognition.onerror = (event) => {
      console.error('Speech recognition error', event.error);
      window.showToast(`Microphone error: ${event.error}`, 'error');
      if (isRecording) toggleRecording();
    };
    
    recognition.onend = () => {
      // Auto restart if still supposed to be recording (handles silent timeouts)
      if (isRecording && secondsRemaining > 0) {
        recognition.start();
      }
    };
  }
  
  function toggleRecording() {
    if (!recognition) return;
    
    isRecording = !isRecording;
    
    if (isRecording) {
      recognition.start();
      recordBtn.classList.remove('btn-secondary');
      recordBtn.classList.add('btn-danger');
      recordBtn.innerHTML = '<div class="recording-indicator"><div class="recording-dot"></div> Recording... (Click to stop)</div>';
      textAnswerArea.placeholder = "Listening... speak clearly into your microphone.";
    } else {
      recognition.stop();
      recordBtn.classList.add('btn-secondary');
      recordBtn.classList.remove('btn-danger');
      recordBtn.innerHTML = '<span class="icon"><i data-lucide="mic" style="width:1em;height:1em;vertical-align:middle;"></i></span> Record Voice Answer';
      textAnswerArea.placeholder = "Type your answer or use voice recording...";
    }
  }
  
  async function submitAnswer() {
    const answerText = textAnswerArea.value.trim();
    
    if (answerText.length < 10) {
      window.showToast("Please provide a longer answer before submitting.", "warning");
      return;
    }
    
    // Stop recording and timer
    if (isRecording) toggleRecording();
    clearInterval(timerInterval);
    
    // UI Transitions
    answerPanel.classList.add('hidden');
    loadingPanel.classList.remove('hidden');
    
    // Call Mock API
    try {
      const result = await mockSubmitBehavioralAnswer(answerText);
      renderFeedback(result);
    } catch (error) {
      console.error(error);
      window.showToast("Failed to analyze answer. Please try again.", "error");
      loadingPanel.classList.add('hidden');
      answerPanel.classList.remove('hidden');
    }
  }
  
  function renderFeedback(result) {
    loadingPanel.classList.add('hidden');
    feedbackPanel.classList.remove('hidden');
    
    // Set score
    const scoreEl = document.getElementById('feedback-score-value');
    scoreEl.textContent = result.score;
    
    // Color score based on value
    if (result.score >= 80) scoreEl.style.color = 'var(--color-success)';
    else if (result.score >= 60) scoreEl.style.color = 'var(--color-warning)';
    else scoreEl.style.color = 'var(--color-error)';
    
    // Set metrics
    document.getElementById('metric-wpm').textContent = `${result.metrics.wpm} WPM`;
    document.getElementById('metric-clarity').textContent = `${result.metrics.clarity}%`;
    
    // Render feedback items
    const feedbackList = document.getElementById('feedback-list');
    feedbackList.innerHTML = result.feedback.map(item => {
      let icon, colorClass;
      switch (item.type) {
        case 'success': icon = '<i data-lucide="check-circle" style="width:1em;height:1em;vertical-align:middle;color:var(--color-success)"></i>'; colorClass = 'text-success'; break;
        case 'warning': icon = '<i data-lucide="alert-triangle" style="width:1em;height:1em;vertical-align:middle;color:var(--color-warning)"></i>'; colorClass = 'text-warning'; break;
        case 'error': icon = '<i data-lucide="x-circle" style="width:1em;height:1em;vertical-align:middle;color:var(--color-error)"></i>'; colorClass = 'text-error'; break;
      }
      
      return `
        <div class="feedback-item">
          <div class="feedback-icon">${icon}</div>
          <div class="feedback-text">${item.text}</div>
        </div>
      `;
    }).join('');
    
    // Smooth scroll to feedback
    feedbackPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  
  function resetSession() {
    feedbackPanel.classList.add('hidden');
    answerPanel.classList.remove('hidden');
    
    textAnswerArea.value = '';
    transcriptFull = '';
    secondsRemaining = 120;
    
    timerEl.parentElement.classList.remove('warning', 'danger');
    
    startTimer();
    
    // Scroll back to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
});
