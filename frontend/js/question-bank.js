import { mockQuestions } from './mock-data.js';

document.addEventListener('DOMContentLoaded', () => {
  // Initialize state
  let currentQuestions = [...mockQuestions];
  let activeView = 'grid'; // 'grid' or 'list'
  
  // DOM Elements
  const questionsContainer = document.getElementById('questions-container');
  const searchInput = document.getElementById('search-questions');
  const viewGridBtn = document.getElementById('view-grid');
  const viewListBtn = document.getElementById('view-list');
  const filterForm = document.getElementById('filter-form');
  const clearFiltersBtn = document.getElementById('clear-filters');
  const resultsCount = document.getElementById('results-count');
  
  // Initialize view
  renderQuestions(currentQuestions, activeView);
  
  // Event Listeners: Search
  searchInput.addEventListener('input', (e) => {
    applyFilters();
  });
  
  // Event Listeners: View Toggles
  viewGridBtn.addEventListener('click', () => {
    activeView = 'grid';
    viewGridBtn.classList.add('btn-primary');
    viewGridBtn.classList.remove('btn-secondary');
    viewListBtn.classList.remove('btn-primary');
    viewListBtn.classList.add('btn-secondary');
    questionsContainer.className = 'questions-grid';
    renderQuestions(currentQuestions, activeView);
  });
  
  viewListBtn.addEventListener('click', () => {
    activeView = 'list';
    viewListBtn.classList.add('btn-primary');
    viewListBtn.classList.remove('btn-secondary');
    viewGridBtn.classList.remove('btn-primary');
    viewGridBtn.classList.add('btn-secondary');
    questionsContainer.className = 'questions-list';
    renderQuestions(currentQuestions, activeView);
  });
  
  // Event Listeners: Filters
  filterForm.addEventListener('change', () => {
    applyFilters();
  });
  
  clearFiltersBtn.addEventListener('click', () => {
    filterForm.reset();
    searchInput.value = '';
    applyFilters();
  });
  
  // Core Filter Function
  function applyFilters() {
    const searchTerm = searchInput.value.toLowerCase();
    
    // Get active filter values
    const typeFilters = Array.from(document.querySelectorAll('input[name="type"]:checked')).map(cb => cb.value);
    const difficultyFilters = Array.from(document.querySelectorAll('input[name="difficulty"]:checked')).map(cb => cb.value);
    const companyFilter = document.getElementById('filter-company').value;
    
    currentQuestions = mockQuestions.filter(q => {
      // 1. Text Search
      const matchesSearch = q.title.toLowerCase().includes(searchTerm) || 
                            q.category.toLowerCase().includes(searchTerm) ||
                            q.companies.some(c => c.toLowerCase().includes(searchTerm));
      
      // 2. Type Filter (Checkbox)
      const matchesType = typeFilters.length === 0 || typeFilters.includes(q.type);
      
      // 3. Difficulty Filter (Checkbox)
      const matchesDifficulty = difficultyFilters.length === 0 || difficultyFilters.includes(q.difficulty);
      
      // 4. Company Filter (Select)
      const matchesCompany = companyFilter === 'all' || q.companies.includes(companyFilter) || (companyFilter === 'All Companies' && q.companies.includes('All Companies'));
      
      return matchesSearch && matchesType && matchesDifficulty && matchesCompany;
    });
    
    renderQuestions(currentQuestions, activeView);
  }
  
  // Render Function
  function renderQuestions(questions, viewType) {
    resultsCount.textContent = `Showing ${questions.length} question${questions.length !== 1 ? 's' : ''}`;
    
    if (questions.length === 0) {
      questionsContainer.innerHTML = `
        <div class="empty-state" style="grid-column: 1 / -1;">
          <div class="empty-icon"><i data-lucide="search" ></i></div>
          <h3>No questions found</h3>
          <p class="text-secondary">Try adjusting your filters or search term to find what you're looking for.</p>
          <button type="button" class="btn btn-primary mt-4" onclick="document.getElementById('clear-filters').click()">Clear Filters</button>
        </div>
      `;
      return;
    }
    
    const html = questions.map(q => {
      const isTech = q.type === 'technical';
      const badgeClass = getDifficultyBadgeClass(q.difficulty);
      
      if (viewType === 'grid') {
        return `
          <div class="card question-card animate-in">
            <div class="card-body">
              <div class="question-card-title">
                ${q.title}
                <span class="badge ${badgeClass}">${q.difficulty}</span>
              </div>
              <p class="text-sm text-secondary mb-3">${q.category}</p>
              
              <div class="question-tags">
                ${q.companies.slice(0, 3).map(c => `<span class="tag">${c}</span>`).join('')}
                ${q.companies.length > 3 ? `<span class="tag">+${q.companies.length - 3}</span>` : ''}
              </div>
            </div>
            
            <div class="card-footer flex justify-between items-center mt-auto pt-4">
              <span class="text-xs text-muted ml-auto flex items-center gap-1">
                ${isTech ? '<i data-lucide="code" style="width:14px; height:14px;"></i> Coding' : '<i data-lucide="mic" style="width:14px; height:14px;"></i> Behavioral'}
              </span>
              <a href="${isTech ? 'coding-round.html' : 'mock-session.html'}?id=${q.id}" class="btn btn-outline btn-sm">
                Practice <span style="margin-left: 4px;">→</span>
              </a>
            </div>
          </div>
        `;
      } else {
        // List View
        return `
          <div class="card question-card animate-in flex-row items-center justify-between" style="flex-direction: row; padding: var(--space-4) var(--space-6);">
            <div class="flex-1">
              <div class="flex items-center gap-3 mb-1">
                <h4 style="margin: 0; font-size: var(--text-base);">${q.title}</h4>
                <span class="badge ${badgeClass}">${q.difficulty}</span>
                <span class="text-xs text-muted ml-2 flex items-center gap-1 inline-flex">${isTech ? '<i data-lucide="code" style="width:14px; height:14px;"></i> Coding' : '<i data-lucide="mic" style="width:14px; height:14px;"></i> Behavioral'}</span>
              </div>
              <div class="flex items-center gap-4 text-sm text-secondary">
                <span>${q.category}</span>
                <span style="color: var(--border-default);">|</span>
                <div class="question-tags" style="margin-top: 0;">
                  ${q.companies.map(c => `<span class="text-xs" style="margin-right: 8px;">#${c}</span>`).join('')}
                </div>
              </div>
            </div>
            <div>
              <a href="${isTech ? 'coding-round.html' : 'mock-session.html'}?id=${q.id}" class="btn btn-primary btn-sm">
                Practice
              </a>
            </div>
          </div>
        `;
      }
    }).join('');
    
    questionsContainer.innerHTML = html;
  }
  
  function getDifficultyBadgeClass(diff) {
    switch(diff.toLowerCase()) {
      case 'easy': return 'badge-success';
      case 'medium': return 'badge-warning';
      case 'hard': return 'badge-danger';
      default: return 'badge-info';
    }
  }
});
