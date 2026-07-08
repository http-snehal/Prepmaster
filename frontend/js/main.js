// main.js - Shared application logic

document.addEventListener('DOMContentLoaded', () => {
  // Inject Lucide script
  const script = document.createElement('script');
  script.src = "https://unpkg.com/lucide@latest";
  script.onload = () => {
    // Initialize icons for static HTML
    if (window.lucide) {
      window.lucide.createIcons();
    }
    // Initialize shared components after icons load so they get rendered too
    initSharedComponents();
    setupNavigation();
    setupMobileMenu();
    setupScrollEffects();
  };
  document.head.appendChild(script);
  
  // Expose toast and refresh functions globally
  window.showToast = showToast;
  window.refreshIcons = () => {
    if (window.lucide) {
      window.lucide.createIcons();
    }
  };
});

function getBasePath() {
  return window.location.pathname.includes('/pages/') ? '..' : '.';
}

function isLoggedIn() {
  return !!localStorage.getItem('currentUser');
}

/**
 * Injects shared HTML components into the page placeholders
 */
function initSharedComponents() {
  const basePath = getBasePath();
  const userLoggedIn = isLoggedIn();

  // 1. Inject Header
  const headerPlaceholder = document.getElementById('header-placeholder');
  if (headerPlaceholder) {
    headerPlaceholder.outerHTML = `
      <header class="header" id="main-header">
        <div class="header-inner">
          <a href="${basePath}/index.html" class="logo">
            <div class="logo-icon"><i data-lucide="cpu" style="width: 14px; height: 14px; margin-top: -2px;"></i></div>
            PrepMaster
          </a>
          
          <nav class="nav-links" id="nav-links">
            <a href="${basePath}/index.html" class="nav-link" data-path="/index.html">Home</a>
            <a href="${basePath}/pages/dashboard.html" class="nav-link" data-path="/pages/dashboard.html">Dashboard</a>
            <a href="${basePath}/pages/question-bank.html" class="nav-link" data-path="/pages/question-bank.html">Practice</a>
            <a href="${basePath}/pages/peer-room.html" class="nav-link" data-path="/pages/peer-room.html">Peer Mock</a>
          </nav>
          
          <div class="nav-actions">
            <a href="${basePath}/pages/dashboard.html" class="btn btn-primary btn-sm">Go to Dashboard</a>
            
            <div class="mobile-menu-btn" id="mobile-menu-btn">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
      </header>
    `;
  }

  // 2. Inject Sidebar (if applicable for dashboard pages)
  const sidebarPlaceholder = document.getElementById('sidebar-placeholder');
  if (sidebarPlaceholder) {
    document.body.classList.add('has-sidebar');
    sidebarPlaceholder.outerHTML = `
      <aside class="sidebar" id="main-sidebar">
        <a href="${basePath}/index.html" class="logo" style="margin-bottom: var(--space-8);">
          <div class="logo-icon"><i data-lucide="cpu" style="width: 14px; height: 14px;"></i></div>
          PrepMaster
        </a>
        <nav class="sidebar-nav">
          <div class="sidebar-section">
            <div class="sidebar-section-title">Overview</div>
            <a href="${basePath}/pages/dashboard.html" class="sidebar-link" data-path="/pages/dashboard.html">
              <span class="icon"><i data-lucide="layout-dashboard"></i></span> Dashboard
            </a>
            <a href="${basePath}/pages/leaderboard.html" class="sidebar-link" data-path="/pages/leaderboard.html">
              <span class="icon"><i data-lucide="trophy"></i></span> Leaderboard
            </a>
          </div>
          
          <div class="sidebar-section">
            <div class="sidebar-section-title">Practice Area</div>
            <a href="${basePath}/pages/question-bank.html" class="sidebar-link" data-path="/pages/question-bank.html">
              <span class="icon"><i data-lucide="book-open"></i></span> Question Bank
            </a>
            <a href="${basePath}/pages/coding-round.html" class="sidebar-link" data-path="/pages/coding-round.html">
              <span class="icon"><i data-lucide="code"></i></span> Coding Sandbox
            </a>
            <a href="${basePath}/pages/mock-session.html" class="sidebar-link" data-path="/pages/mock-session.html">
              <span class="icon"><i data-lucide="mic"></i></span> AI Mock Interview
            </a>
            <a href="${basePath}/pages/peer-room.html" class="sidebar-link" data-path="/pages/peer-room.html">
              <span class="icon"><i data-lucide="users"></i></span> Peer Practice
            </a>
          </div>
          
          <div class="sidebar-section">
            <div class="sidebar-section-title">Career Tools</div>
            <a href="${basePath}/pages/resume-upload.html" class="sidebar-link" data-path="/pages/resume-upload.html">
              <span class="icon"><i data-lucide="file-text"></i></span> Resume Review
            </a>
          </div>
        </nav>
        
        <div style="margin-top: auto; padding-top: var(--space-6);">
          <button class="btn btn-ghost w-full justify-start text-error" onclick="window.logout()">
            <span class="icon"><i data-lucide="log-out"></i></span> Log Out
          </button>
        </div>
      </aside>
    `;
  }

  // 3. Inject Footer (if applicable for public pages)
  const footerPlaceholder = document.getElementById('footer-placeholder');
  if (footerPlaceholder) {
    footerPlaceholder.outerHTML = `
      <footer class="footer">
        <div class="container">
          <div class="footer-grid">
            <div class="footer-brand">
              <a href="${basePath}/index.html" class="logo">
                <div class="logo-icon"><i data-lucide="cpu" style="width: 14px; height: 14px; margin-top: -2px;"></i></div>
                PrepMaster
              </a>
              <p>The ultimate AI-powered platform to ace your next technical or behavioral interview.</p>
            </div>
            
            <div class="footer-column">
              <h4>Practice</h4>
              <a href="${basePath}/pages/question-bank.html">Question Bank</a>
              <a href="${basePath}/pages/mock-session.html">AI Interviews</a>
              <a href="${basePath}/pages/coding-round.html">Coding Environment</a>
            </div>
            
            <div class="footer-column">
              <h4>Resources</h4>
              <a href="#">Interview Guides</a>
              <a href="${basePath}/pages/resume-upload.html">Resume Builder</a>
              <a href="#">System Design Prep</a>
            </div>
            
            <div class="footer-column">
              <h4>Company</h4>
              <a href="#">About Us</a>
              <a href="#">Pricing</a>
              <a href="#">Contact</a>
            </div>
          </div>
          
          <div class="footer-bottom">
            <p>&copy; 2026 AI PrepMaster. Built for demonstration.</p>
            <div class="footer-social">
              <a href="#">Twitter</a>
              <a href="#">LinkedIn</a>
              <a href="#">GitHub</a>
            </div>
          </div>
        </div>
      </footer>
    `;
  }
  
  window.refreshIcons();
}

/**
 * Highlights the active link in the navigation based on current URL
 */
function setupNavigation() {
  const currentPath = window.location.pathname;
  
  // Top nav links
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    if (link.dataset.path && currentPath.includes(link.dataset.path) && link.dataset.path !== '/index.html') {
      link.classList.add('active');
    } else if ((currentPath === '/' || currentPath.endsWith('index.html')) && link.dataset.path === '/index.html') {
      link.classList.add('active'); // Homepage edge case
    }
  });
  
  // Sidebar links
  const sidebarLinks = document.querySelectorAll('.sidebar-link');
  sidebarLinks.forEach(link => {
    if (link.dataset.path && currentPath.includes(link.dataset.path)) {
      link.classList.add('active');
    }
  });
}

/**
 * Handles mobile hamburger menu toggle
 */
function setupMobileMenu() {
  const menuBtn = document.getElementById('mobile-menu-btn');
  const navLinks = document.getElementById('nav-links');
  
  if (menuBtn && navLinks) {
    menuBtn.addEventListener('click', () => {
      menuBtn.classList.toggle('active');
      navLinks.classList.toggle('mobile-open');
      document.body.style.overflow = navLinks.classList.contains('mobile-open') ? 'hidden' : '';
    });
  }
}

/**
 * Adds background to header on scroll
 */
function setupScrollEffects() {
  const header = document.getElementById('main-header');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 20) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  }
}

/**
 * Toast Notification System
 * @param {string} message - Toast message text
 * @param {string} type - 'success', 'error', 'warning', 'info'
 * @param {number} duration - Time in ms before auto-close
 */
function showToast(message, type = 'info', duration = 3000) {
  // Create container if it doesn't exist
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  
  // Map type to icon
  const icons = {
    success: '<i data-lucide="check-circle"></i>',
    error: '<i data-lucide="x-circle"></i>',
    warning: '<i data-lucide="alert-triangle"></i>',
    info: '<i data-lucide="info"></i>'
  };
  
  // Create toast element
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <div class="toast-icon">${icons[type]}</div>
    <div class="toast-message">${message}</div>
    <div class="toast-close" onclick="this.parentElement.remove()">✕</div>
  `;
  
  container.appendChild(toast);
  window.refreshIcons();
  
  // Auto-remove
  setTimeout(() => {
    if (document.body.contains(toast)) {
      toast.classList.add('removing');
      setTimeout(() => toast.remove(), 250); // wait for animation
    }
  }, duration);
}

/**
 * Mock Logout Function
 */
window.logout = function() {
  localStorage.removeItem('currentUser');
  showToast('Logged out successfully', 'success');
  setTimeout(() => {
    window.location.href = getBasePath() + '/index.html';
  }, 1000);
};
